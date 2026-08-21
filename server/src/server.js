import { spawn } from "node:child_process";
import { createReadStream } from "node:fs";
import { mkdtemp, readdir, rm, stat, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { Readable } from "node:stream";
import { createClient } from "@supabase/supabase-js";
import cors from "cors";
import express from "express";

const requiredEnv = ["SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY"];
for (const name of requiredEnv) {
  if (!process.env[name]) throw new Error(`Variável obrigatória ausente: ${name}`);
}

const port = Number(process.env.PORT || 8787);
const maxDuration = Number(process.env.MAX_VIDEO_DURATION_SECONDS || 7200);
const maxSizeMb = Number(process.env.MAX_VIDEO_SIZE_MB || 500);
const maxConcurrentJobs = Number(process.env.MAX_CONCURRENT_JOBS || 2);
const allowedOrigins = (process.env.ALLOWED_ORIGINS || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false, autoRefreshToken: false } },
);
const jobs = new Set();
const app = express();

app.use(cors({ origin: allowedOrigins }));
app.use(express.json({ limit: "16kb" }));

function youtubeUrl(value) {
  try {
    const url = new URL(value);
    const host = url.hostname.replace(/^www\./, "").toLowerCase();
    if (!["youtube.com", "m.youtube.com", "youtu.be"].includes(host)) return null;
    if (host === "youtu.be") {
      return /^[\w-]{11}$/.test(url.pathname.slice(1)) ? url.toString() : null;
    }
    return url.pathname === "/watch" && /^[\w-]{11}$/.test(url.searchParams.get("v") || "")
      ? url.toString()
      : null;
  } catch {
    return null;
  }
}

function run(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: ["ignore", "pipe", "pipe"], ...options });
    let stdout = "";
    let stderr = "";
    const timer = setTimeout(() => child.kill("SIGKILL"), 30 * 60 * 1000);
    child.stdout.on("data", (chunk) => {
      stdout = (stdout + chunk).slice(-16_384);
    });
    child.stderr.on("data", (chunk) => {
      stderr = (stderr + chunk).slice(-16_384);
    });
    child.on("error", reject);
    child.on("close", (code) => {
      clearTimeout(timer);
      if (code === 0) resolve(stdout.trim());
      else reject(new Error(stderr.trim() || `${command} terminou com código ${code}`));
    });
  });
}

async function uploadFile(localPath, storagePath, contentType) {
  const size = (await stat(localPath)).size;
  const encodedPath = storagePath.split("/").map(encodeURIComponent).join("/");
  const response = await fetch(
    `${process.env.SUPABASE_URL}/storage/v1/object/project-media/${encodedPath}`,
    {
      method: "POST",
      headers: {
        apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
        authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
        "content-length": String(size),
        "content-type": contentType,
        "x-upsert": "true",
      },
      body: Readable.toWeb(createReadStream(localPath)),
      duplex: "half",
    },
  );
  if (!response.ok) throw new Error(`Falha no upload (${response.status}): ${await response.text()}`);
}

async function updateProject(projectId, userId, values) {
  const { error } = await supabase
    .from("projects")
    .update(values)
    .eq("id", projectId)
    .eq("user_id", userId);
  if (error) throw error;
}

async function processVideo({ projectId, userId, url }) {
  const directory = await mkdtemp(join(tmpdir(), "clipforge-"));
  try {
    await updateProject(projectId, userId, { import_status: "processing" });
    const args = [
      "--no-playlist",
      "--match-filter",
      `duration <= ${maxDuration}`,
      "--max-filesize",
      `${maxSizeMb}M`,
      "--format",
      "bv*[ext=mp4]+ba[ext=m4a]/b[ext=mp4]/bv*+ba/b",
      "--merge-output-format",
      "mp4",
      "--output",
      join(directory, "source.%(ext)s"),
    ];
    if (process.env.YTDLP_COOKIES_BASE64) {
      const cookiesPath = join(directory, "cookies.txt");
      await writeFile(cookiesPath, Buffer.from(process.env.YTDLP_COOKIES_BASE64, "base64"));
      args.push("--cookies", cookiesPath);
    }
    args.push(url);
    await run("yt-dlp", args);

    const videoName = (await readdir(directory)).find((name) => name.endsWith(".mp4"));
    if (!videoName) throw new Error("O download não gerou um arquivo MP4.");
    const videoPath = join(directory, videoName);
    const thumbnailPath = join(directory, "thumbnail.jpg");
    await run("ffmpeg", ["-y", "-ss", "1", "-i", videoPath, "-frames:v", "1", "-q:v", "3", thumbnailPath]);
    const durationOutput = await run("ffprobe", [
      "-v", "error", "-show_entries", "format=duration", "-of", "default=noprint_wrappers=1:nokey=1", videoPath,
    ]);
    const durationSeconds = Math.max(0, Math.round(Number(durationOutput) || 0));
    const storageBase = `${userId}/${projectId}`;
    const storagePath = `${storageBase}/source.mp4`;
    const storedThumbnailPath = `${storageBase}/thumbnail.jpg`;
    await uploadFile(videoPath, storagePath, "video/mp4");
    await uploadFile(thumbnailPath, storedThumbnailPath, "image/jpeg");
    await updateProject(projectId, userId, {
      storage_path: storagePath,
      thumbnail_path: storedThumbnailPath,
      duration: `${String(Math.floor(durationSeconds / 60)).padStart(2, "0")}:${String(durationSeconds % 60).padStart(2, "0")}`,
      import_status: "ready",
      import_error: null,
    });
  } catch (error) {
    console.error(`Importação ${projectId} falhou:`, error);
    await updateProject(projectId, userId, {
      import_status: "failed",
      import_error: error instanceof Error ? error.message.slice(0, 500) : "Falha desconhecida.",
    }).catch(console.error);
  } finally {
    jobs.delete(projectId);
    await rm(directory, { recursive: true, force: true });
  }
}

async function authenticate(request, response, next) {
  const token = request.headers.authorization?.match(/^Bearer (.+)$/)?.[1];
  if (!token) return response.status(401).json({ error: "Sessão ausente." });
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) return response.status(401).json({ error: "Sessão inválida." });
  request.user = data.user;
  next();
}

app.get("/health", (_request, response) => response.json({ ok: true }));

app.post("/api/import/youtube", authenticate, async (request, response) => {
  const { projectId, url: rawUrl } = request.body || {};
  const url = youtubeUrl(rawUrl);
  if (typeof projectId !== "string" || !url) {
    return response.status(400).json({ error: "Informe um projeto e uma URL válida do YouTube." });
  }
  if (jobs.has(projectId)) return response.status(409).json({ error: "Este projeto já está sendo processado." });
  if (jobs.size >= maxConcurrentJobs) {
    return response.status(503).json({ error: "O serviço está ocupado. Tente novamente em alguns minutos." });
  }

  const { data: project, error } = await supabase
    .from("projects")
    .select("id")
    .eq("id", projectId)
    .eq("user_id", request.user.id)
    .maybeSingle();
  if (error) return response.status(500).json({ error: "Não foi possível validar o projeto." });
  if (!project) return response.status(404).json({ error: "Projeto não encontrado." });

  jobs.add(projectId);
  await updateProject(projectId, request.user.id, {
    source_url: url,
    import_status: "queued",
    import_error: null,
  });
  void processVideo({ projectId, userId: request.user.id, url });
  return response.status(202).json({ status: "queued" });
});

app.use((error, _request, response, _next) => {
  console.error(error);
  response.status(500).json({ error: "Erro interno no serviço de mídia." });
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Serviço de mídia ouvindo na porta ${port}`);
});
