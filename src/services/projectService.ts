import { requireSupabase } from "../lib/supabase";
import type { Project } from "../types";
import type { ProjectRow } from "../types/database";

const defaultThumbnail =
  "https://images.unsplash.com/photo-1492724441997-5dc865305da7?auto=format&fit=crop&w=900&q=80";

function relativeDate(date: string) {
  const seconds = Math.round((new Date(date).getTime() - Date.now()) / 1000);
  const formatter = new Intl.RelativeTimeFormat("pt-BR", { numeric: "auto" });
  if (Math.abs(seconds) < 60) return "agora mesmo";
  if (Math.abs(seconds) < 3600)
    return formatter.format(Math.round(seconds / 60), "minute");
  if (Math.abs(seconds) < 86400)
    return formatter.format(Math.round(seconds / 3600), "hour");
  return formatter.format(Math.round(seconds / 86400), "day");
}

async function signedUrl(path: string | null) {
  if (!path) return null;
  const { data, error } = await requireSupabase()
    .storage.from("project-media")
    .createSignedUrl(path, 60 * 60);
  if (error) return null;
  return data.signedUrl;
}

async function toProject(row: ProjectRow): Promise<Project> {
  const [mediaUrl, thumbnailUrl] = await Promise.all([
    signedUrl(row.storage_path),
    signedUrl(row.thumbnail_path),
  ]);
  return {
    id: row.id,
    title: row.title,
    status: row.status,
    duration: row.duration,
    ratio: row.ratio,
    thumbnail: thumbnailUrl || row.thumbnail || defaultThumbnail,
    updatedAt: relativeDate(row.updated_at),
    mediaUrl,
    sourceUrl: row.source_url,
    importStatus: row.import_status,
    importError: row.import_error,
  };
}

async function currentUserId() {
  const client = requireSupabase();
  const { data, error } = await client.auth.getUser();
  if (error || !data.user) throw error ?? new Error("Sessão não encontrada.");
  return data.user.id;
}

export const projectService = {
  async list() {
    const client = requireSupabase();
    const { data, error } = await client
      .from("projects")
      .select("*")
      .order("updated_at", { ascending: false });
    if (error) throw error;
    return Promise.all(data.map(toProject));
  },

  async get(id: string) {
    const { data, error } = await requireSupabase()
      .from("projects")
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw error;
    return toProject(data);
  },

  async create(title = "Projeto sem título") {
    const client = requireSupabase();
    const userId = await currentUserId();
    const { data, error } = await client
      .from("projects")
      .insert({
        user_id: userId,
        title,
        status: "Draft",
        duration: "00:00",
        ratio: "9:16",
        thumbnail: defaultThumbnail,
      })
      .select()
      .single();
    if (error) throw error;
    return await toProject(data);
  },

  async remove(id: string) {
    const client = requireSupabase();
    const { data: project } = await client
      .from("projects")
      .select("storage_path, thumbnail_path")
      .eq("id", id)
      .maybeSingle();
    const paths = [project?.storage_path, project?.thumbnail_path].filter(
      (path): path is string => Boolean(path),
    );
    if (paths.length) await client.storage.from("project-media").remove(paths);
    const { error } = await client
      .from("projects")
      .delete()
      .eq("id", id);
    if (error) throw error;
  },

  async duplicate(project: Project) {
    const copy = await this.create(`${project.title} - cópia`);
    const { data, error } = await requireSupabase()
      .from("projects")
      .update({
        duration: project.duration,
        ratio: project.ratio,
      })
      .eq("id", copy.id)
      .select()
      .single();
    if (error) throw error;
    return await toProject(data);
  },
};
