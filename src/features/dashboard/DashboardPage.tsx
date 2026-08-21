import {
  Check,
  Copy,
  Edit3,
  Folder,
  MoreHorizontal,
  Play,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button, Card, IconButton, cn } from "../../components/ui";
import { useProjectStore } from "../../store/projectStore";
import { getYouTubeThumbnail } from "../../lib/youtube";

const statusStyle = {
  Draft: "bg-white/10 text-slate-300",
  Processing: "bg-amber-400/10 text-amber-300",
  Exported: "bg-emerald-400/10 text-emerald-300",
};
const statusLabel = {
  Draft: "Rascunho",
  Processing: "Processando",
  Exported: "Exportado",
};

export function DashboardPage() {
  const {
    projects,
    loading,
    error,
    fetchProjects,
    createProject,
    renameProject,
    deleteProject,
    duplicateProject,
  } = useProjectStore();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [titleDraft, setTitleDraft] = useState("");
  const [savingTitle, setSavingTitle] = useState(false);
  const visibleProjects = projects.filter((project) =>
    project.title
      .toLocaleLowerCase("pt-BR")
      .includes(search.toLocaleLowerCase("pt-BR")),
  );

  useEffect(() => {
    void fetchProjects();
  }, [fetchProjects]);

  const newProject = async () => {
    setCreating(true);
    const project = await createProject();
    setCreating(false);
    if (project) navigate(`/editor/${project.id}`);
  };
  const startRenaming = (id: string, title: string) => {
    setEditingId(id);
    setTitleDraft(title);
  };
  const cancelRenaming = () => {
    setEditingId(null);
    setTitleDraft("");
  };
  const saveTitle = async () => {
    if (!editingId || !titleDraft.trim() || savingTitle) return;
    setSavingTitle(true);
    const renamed = await renameProject(editingId, titleDraft);
    setSavingTitle(false);
    if (renamed) cancelRenaming();
  };
  return (
    <div className="mx-auto max-w-[1500px] p-8">
      <div className="flex items-end justify-between">
        <div>
          <p className="label mb-2">Seu espaço de trabalho</p>
          <h1 className="text-3xl font-semibold tracking-tight">Projetos</h1>
          <p className="mt-2 text-sm text-textMuted">
            Continue de onde parou ou crie algo novo.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-64 items-center gap-2 rounded-lg border border-border bg-white/[0.03] px-3 focus-within:border-cyan/40 focus-within:shadow-glow">
            <Search size={16} className="text-textMuted" />
            <input
              placeholder="Buscar projetos..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full bg-transparent text-sm outline-none placeholder:text-textMuted"
            />
          </div>
          <Button onClick={newProject} loading={creating}>
            <Plus size={17} />
            Novo projeto
          </Button>
        </div>
      </div>
      <section className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold">Pastas</h2>
          <button className="text-xs text-cyan">Ver todas</button>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <Card className="flex items-center gap-4 p-5">
            <div className="grid size-11 place-items-center rounded-xl bg-cyan/10 text-cyan">
              <Folder size={22} fill="currentColor" fillOpacity={0.2} />
            </div>
            <div>
              <p className="text-sm font-semibold">Campanhas sociais</p>
              <p className="mt-1 text-xs text-textMuted">12 projetos</p>
            </div>
          </Card>
          <Card className="flex items-center gap-4 p-5">
            <div className="grid size-11 place-items-center rounded-xl bg-purple-500/10 text-purple-400">
              <Folder size={22} fill="currentColor" fillOpacity={0.2} />
            </div>
            <div>
              <p className="text-sm font-semibold">Cortes de podcast</p>
              <p className="mt-1 text-xs text-textMuted">8 projetos</p>
            </div>
          </Card>
          <Card className="flex items-center gap-4 border-dashed p-5 text-textMuted hover:text-cyan">
            <div className="grid size-11 place-items-center rounded-xl bg-white/[0.03]">
              <Plus size={20} />
            </div>
            <p className="text-sm font-medium">Criar pasta</p>
          </Card>
        </div>
      </section>
      <section className="relative mt-10 overflow-hidden rounded-2xl border border-white/[0.07] bg-gradient-to-br from-white/[0.045] via-midnight-800/70 to-cyan/[0.035] p-5 shadow-2xl shadow-black/20 sm:p-6">
        <div className="pointer-events-none absolute -right-24 -top-32 size-80 rounded-full bg-cyan/[0.07] blur-3xl" />
        <div className="relative mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="label mb-2 text-cyan/80">Sua biblioteca</p>
            <div className="flex items-baseline gap-3">
              <h2 className="text-xl font-semibold tracking-tight">
                Projetos recentes
              </h2>
              <span className="text-xs text-textMuted">
                {projects.length} {projects.length === 1 ? "vídeo" : "vídeos"}
              </span>
            </div>
          </div>
          <button className="interactive flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs text-textMuted hover:bg-white/5 hover:text-white">
            Última modificação <MoreHorizontal size={15} />
          </button>
        </div>
        {error && (
          <div className="mb-5 rounded-xl border border-red-500/20 bg-red-500/[0.08] p-4 text-xs text-red-300">
            {error}{" "}
            <button
              onClick={() => void fetchProjects()}
              className="ml-2 font-semibold underline"
            >
              Tentar novamente
            </button>
          </div>
        )}
        {loading ? (
          <div className="relative grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="aspect-[4/3] animate-pulse rounded-2xl border border-border bg-white/[0.035]"
              />
            ))}
          </div>
        ) : visibleProjects.length === 0 ? (
          <Card className="grid min-h-56 place-items-center border-dashed p-8 text-center">
            <div>
              <p className="font-semibold">
                {search
                  ? "Nenhum projeto encontrado"
                  : "Seu primeiro projeto começa aqui"}
              </p>
              <p className="mt-2 text-xs text-textMuted">
                {search
                  ? "Tente buscar por outro título."
                  : "Crie um projeto para importar e transformar seu primeiro vídeo."}
              </p>
              {!search && (
                <Button
                  onClick={newProject}
                  loading={creating}
                  className="mt-5"
                >
                  <Plus size={16} />
                  Criar projeto
                </Button>
              )}
            </div>
          </Card>
        ) : (
          <div className="relative grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {visibleProjects.map((project) => (
              <Card
                key={project.id}
                className="group overflow-hidden border-white/[0.08] bg-midnight-900/80 hover:-translate-y-1 hover:border-cyan/25 hover:shadow-[0_18px_45px_rgba(0,0,0,0.35)]"
              >
                <button
                  type="button"
                  onClick={() => navigate(`/editor/${project.id}`)}
                  className="interactive relative block aspect-video w-full overflow-hidden bg-midnight-700 text-left"
                  aria-label={`Abrir ${project.title}`}
                >
                  <img
                    src={project.thumbnail}
                    alt={`Thumbnail de ${project.title}`}
                    onError={(event) => {
                      const fallback = getYouTubeThumbnail(
                        project.sourceUrl,
                        "hqdefault",
                      );
                      if (fallback && event.currentTarget.src !== fallback) {
                        event.currentTarget.src = fallback;
                      }
                    }}
                    className="h-full w-full object-cover opacity-85 transition duration-500 group-hover:scale-[1.04] group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-midnight-900 via-transparent to-black/20" />
                  <span className="absolute bottom-3 right-3 rounded-md border border-white/10 bg-black/70 px-2 py-1 text-[10px] font-medium backdrop-blur">
                    {project.duration}
                  </span>
                  {project.sourceUrl && (
                    <span className="absolute left-3 top-3 flex items-center gap-1.5 rounded-md border border-white/10 bg-black/65 px-2 py-1 text-[10px] font-medium backdrop-blur">
                      <span className="grid h-3.5 w-5 place-items-center rounded bg-red-500 text-[7px] text-white">
                        <Play size={8} fill="currentColor" />
                      </span>
                      YouTube
                    </span>
                  )}
                  <div className="absolute inset-0 grid place-items-center bg-black/10 opacity-0 transition duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                    <span className="grid size-12 place-items-center rounded-full border border-white/20 bg-white/90 text-midnight shadow-xl transition group-hover:scale-105">
                      <Play size={18} fill="currentColor" className="ml-0.5" />
                    </span>
                  </div>
                </button>
                <div className="p-4 pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      {editingId === project.id ? (
                        <input
                          autoFocus
                          value={titleDraft}
                          onChange={(event) => setTitleDraft(event.target.value)}
                          onKeyDown={(event) => {
                            if (event.key === "Enter") void saveTitle();
                            if (event.key === "Escape") cancelRenaming();
                          }}
                          maxLength={120}
                          aria-label="Nome do projeto"
                          className="h-8 w-full rounded-md border border-cyan/40 bg-midnight px-2 text-sm font-semibold outline-none shadow-glow"
                        />
                      ) : (
                        <h3
                          className="truncate text-sm font-semibold tracking-tight"
                          title={project.title}
                        >
                          {project.title}
                        </h3>
                      )}
                      <div className="mt-2 flex items-center gap-2">
                        <span
                          className={cn(
                            "rounded-full px-2 py-1 text-[10px] font-medium",
                            statusStyle[project.status],
                          )}
                        >
                          {statusLabel[project.status]}
                        </span>
                        <span className="text-[11px] text-textMuted">
                          {project.updatedAt}
                        </span>
                        <span className="text-white/15">•</span>
                        <span className="text-[11px] text-textMuted">
                          {project.ratio}
                        </span>
                      </div>
                    </div>
                    <div className="flex shrink-0">
                      {editingId === project.id ? (
                        <>
                          <IconButton
                            title="Salvar nome"
                            disabled={savingTitle || !titleDraft.trim()}
                            onClick={() => void saveTitle()}
                            className="text-cyan disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            <Check size={16} />
                          </IconButton>
                          <IconButton
                            title="Cancelar"
                            disabled={savingTitle}
                            onClick={cancelRenaming}
                          >
                            <X size={16} />
                          </IconButton>
                        </>
                      ) : (
                        <>
                          <IconButton
                            title="Renomear"
                            onClick={() =>
                              startRenaming(project.id, project.title)
                            }
                          >
                            <Edit3 size={15} />
                          </IconButton>
                          <IconButton
                            title="Duplicar"
                            onClick={() => void duplicateProject(project.id)}
                          >
                            <Copy size={15} />
                          </IconButton>
                          <IconButton
                            title="Excluir"
                            onClick={() => {
                              if (window.confirm(`Excluir “${project.title}”?`))
                                void deleteProject(project.id);
                            }}
                            className="hover:bg-red-500/10 hover:text-red-300"
                          >
                            <Trash2 size={15} />
                          </IconButton>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
