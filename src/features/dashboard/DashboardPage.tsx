import {
  Copy,
  Edit3,
  Folder,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button, Card, IconButton, cn } from "../../components/ui";
import { useProjectStore } from "../../store/projectStore";

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
    deleteProject,
    duplicateProject,
  } = useProjectStore();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [creating, setCreating] = useState(false);
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
      <section className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold">
            Projetos recentes{" "}
            <span className="ml-2 text-xs font-normal text-textMuted">
              {projects.length} vídeos
            </span>
          </h2>
          <button className="flex items-center gap-1 text-xs text-textMuted">
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
          <div className="grid grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="h-64 animate-pulse rounded-xl border border-border bg-white/[0.035]"
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
          <div className="grid grid-cols-3 gap-5">
            {visibleProjects.map((project) => (
              <Card key={project.id} className="group overflow-hidden">
                <div className="relative aspect-video overflow-hidden bg-midnight-700">
                  <img
                    src={project.thumbnail}
                    alt=""
                    className="h-full w-full object-cover opacity-80 transition duration-500 group-hover:scale-105 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-midnight/80 to-transparent" />
                  <span className="absolute bottom-3 right-3 rounded bg-black/60 px-2 py-1 text-[10px]">
                    {project.duration}
                  </span>
                  <span className="absolute left-3 top-3 rounded bg-black/60 px-2 py-1 text-[10px]">
                    {project.ratio}
                  </span>
                  <div className="absolute inset-0 grid place-items-center opacity-0 transition group-hover:opacity-100">
                    <Button onClick={() => navigate(`/editor/${project.id}`)}>
                      <Edit3 size={15} />
                      Abrir editor
                    </Button>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-sm font-semibold">{project.title}</h3>
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
                      </div>
                    </div>
                    <div className="flex">
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
