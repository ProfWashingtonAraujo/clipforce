import {
  Captions,
  ChevronLeft,
  Crop,
  Download,
  Film,
  Link2,
  Scissors,
  Settings2,
  SmilePlus,
  Sparkles,
  Type,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, IconButton, Logo, cn } from "../../components/ui";
import { ExportModals } from "../export/ExportModals";
import { useEditorStore } from "../../store/editorStore";
import type { EditorPanel } from "../../types";
import { EditorPanels } from "./panels/EditorPanels";
import { VideoPlayer } from "./player/VideoPlayer";
import { Timeline } from "./timeline/Timeline";
import { useProjectStore } from "../../store/projectStore";
import { mediaService } from "../../services/mediaService";

const panelTools: { panel: EditorPanel; label: string; icon: typeof Crop }[] = [
  { panel: "reframe", label: "Formatos", icon: Crop },
  { panel: "subtitles", label: "Legendas", icon: Captions },
  { panel: "styles", label: "Estilos", icon: Type },
  { panel: "emojis", label: "Emojis", icon: SmilePlus },
  { panel: "smartcut", label: "Corte inteligente", icon: Scissors },
];

export function EditorPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { selectedPanel, setSelectedPanel } = useEditorStore();
  const [url, setUrl] = useState("");
  const [importing, setImporting] = useState(false);
  const [importError, setImportError] = useState("");
  const [exportOpen, setExportOpen] = useState(false);
  const projects = useProjectStore((state) => state.projects);
  const fetchProjects = useProjectStore((state) => state.fetchProjects);
  const refreshProject = useProjectStore((state) => state.refreshProject);
  const project = projects.find((item) => item.id === projectId);

  useEffect(() => {
    if (!project && projects.length === 0) void fetchProjects();
  }, [fetchProjects, project, projects.length]);

  useEffect(() => {
    if (!projectId || !["queued", "processing"].includes(project?.importStatus ?? "")) return;
    const timer = window.setInterval(() => void refreshProject(projectId), 3000);
    return () => window.clearInterval(timer);
  }, [project?.importStatus, projectId, refreshProject]);

  const importYoutube = async () => {
    if (!projectId || !url.trim()) {
      setImportError("Informe uma URL válida do YouTube.");
      return;
    }
    setImporting(true);
    setImportError("");
    try {
      await mediaService.importYoutube(projectId, url.trim());
      await refreshProject(projectId);
    } catch (error) {
      setImportError(
        error instanceof Error ? error.message : "Não foi possível iniciar a importação.",
      );
    } finally {
      setImporting(false);
    }
  };

  const processing = project?.importStatus === "queued" || project?.importStatus === "processing";
  const statusMessage = processing
    ? project.importStatus === "queued"
      ? "Importação na fila..."
      : "Baixando e preparando o vídeo..."
    : project?.importStatus === "failed"
      ? project.importError || "A importação falhou."
      : importError;
  return (
    <div className="flex h-screen min-h-[700px] flex-col overflow-hidden bg-midnight">
      <header className="z-30 flex h-16 shrink-0 items-center border-b border-border bg-midnight-900 px-4">
        <IconButton onClick={() => navigate("/dashboard")}>
          <ChevronLeft size={18} />
        </IconButton>
        <div className="mx-3 h-6 w-px bg-white/10" />
        <Logo />
        <div className="ml-7">
          <p className="text-xs font-medium">
            {project?.title ?? "Carregando projeto..."}
          </p>
          <p className="mt-0.5 text-[9px] text-textMuted">
            Salvo agora · 1080 × 1920
          </p>
        </div>
        <div className="mx-auto flex h-9 w-[380px] items-center gap-2 rounded-lg border border-border bg-midnight px-3 focus-within:border-cyan/40 focus-within:shadow-glow">
          <Link2 size={14} className="text-cyan" />
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Cole uma URL do YouTube"
            disabled={processing}
            className="min-w-0 flex-1 bg-transparent text-[11px] outline-none"
          />
          <button
            type="button"
            onClick={() => void importYoutube()}
            disabled={processing || importing}
            className="text-[10px] font-semibold text-cyan disabled:cursor-not-allowed disabled:opacity-50"
          >
            {processing || importing ? "Processando" : "Importar"}
          </button>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-[9px] text-emerald-300">
            Todas as alterações foram salvas
          </span>
          <Button onClick={() => setExportOpen(true)}>
            <Download size={16} />
            Exportar vídeo
          </Button>
        </div>
      </header>
      <div className="grid min-h-0 flex-1 grid-cols-[68px_minmax(0,65fr)_minmax(320px,35fr)]">
        <aside className="flex flex-col items-center gap-2 border-r border-border bg-midnight-900 py-4">
          <div className="mb-2 grid size-9 place-items-center rounded-lg bg-white/[0.03] text-textMuted">
            <Film size={18} />
          </div>
          {panelTools.map(({ panel, label, icon: Icon }) => (
            <button
              title={label}
              key={panel}
              onClick={() => setSelectedPanel(panel)}
              className={cn(
                "interactive relative flex h-12 w-14 flex-col items-center justify-center gap-1 rounded-lg text-[8px] text-textMuted hover:bg-cyan/10 hover:text-white",
                selectedPanel === panel && "bg-cyan/10 text-cyan shadow-glow",
              )}
            >
              <Icon size={17} />
              {label}
              {selectedPanel === panel && (
                <span className="absolute -left-[7px] h-7 w-0.5 rounded-r bg-cyan" />
              )}
            </button>
          ))}
          <div className="mt-auto">
            <IconButton>
              <Settings2 size={18} />
            </IconButton>
          </div>
        </aside>
        <main className="flex min-h-0 min-w-0 flex-col">
          {statusMessage && (
            <div
              className={cn(
                "border-b border-border px-4 py-2 text-center text-[11px]",
                project?.importStatus === "failed" || importError
                  ? "bg-red-500/10 text-red-300"
                  : "bg-cyan/10 text-cyan",
              )}
            >
              {statusMessage}
            </div>
          )}
          <VideoPlayer source={project?.mediaUrl ?? null} sourceUrl={project?.sourceUrl ?? null} />
          <Timeline />
        </main>
        <EditorPanels sourceUrl={project?.sourceUrl ?? null} />
      </div>
      <ExportModals open={exportOpen} onClose={() => setExportOpen(false)} />
    </div>
  );
}
