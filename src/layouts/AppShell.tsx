import {
  Bell,
  ChevronLeft,
  ChevronRight,
  FileVideo2,
  FolderKanban,
  LayoutTemplate,
  Plus,
  Shapes,
  Users,
} from "lucide-react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Button, IconButton, Logo, cn } from "../components/ui";
import { useUIStore } from "../store/uiStore";

const links = [
  { to: "/dashboard", label: "Projetos", icon: FolderKanban },
  { to: "/dashboard?view=templates", label: "Modelos", icon: LayoutTemplate },
  { to: "/dashboard?view=assets", label: "Arquivos", icon: Shapes },
  { to: "/team", label: "Equipe", icon: Users },
];

export function AppShell() {
  const { sidebarCollapsed, toggleSidebar } = useUIStore();
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-midnight">
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 flex flex-col border-r border-border bg-midnight-900 transition-all duration-200",
          sidebarCollapsed ? "w-[76px]" : "w-60",
        )}
      >
        <div className="flex h-20 items-center justify-between px-5">
          <Logo compact={sidebarCollapsed} />
          {!sidebarCollapsed && (
            <IconButton onClick={toggleSidebar}>
              <ChevronLeft size={17} />
            </IconButton>
          )}
        </div>
        {sidebarCollapsed && (
          <IconButton onClick={toggleSidebar} className="mx-auto mb-4">
            <ChevronRight size={17} />
          </IconButton>
        )}
        <div className="px-3">
          <Button
            onClick={() => navigate("/editor/new")}
            className={cn("w-full", sidebarCollapsed && "px-0")}
          >
            <Plus size={17} />
            {!sidebarCollapsed && "Novo projeto"}
          </Button>
        </div>
        <nav className="mt-8 space-y-1 px-3">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={label}
              to={to}
              className={({ isActive }) =>
                cn(
                  "interactive flex h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium text-textMuted hover:bg-white/[0.04] hover:text-white",
                  isActive && !to.includes("?") && "bg-cyan/10 text-cyan",
                  sidebarCollapsed && "justify-center px-0",
                )
              }
            >
              <Icon size={19} />
              {!sidebarCollapsed && label}
            </NavLink>
          ))}
        </nav>
        <div className="mx-4 mt-auto mb-5 rounded-xl border border-cyan/15 bg-gradient-to-br from-cyan/10 to-electric/5 p-4">
          {sidebarCollapsed ? (
            <FileVideo2 className="mx-auto text-cyan" size={20} />
          ) : (
            <>
              <p className="text-xs font-semibold">24 min restantes</p>
              <div className="my-3 h-1.5 overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-[68%] rounded-full bg-cyan shadow-glow" />
              </div>
              <p className="text-[10px] text-textMuted">
                Tempo mensal de processamento
              </p>
            </>
          )}
        </div>
      </aside>
      <main
        className={cn(
          "transition-all duration-200",
          sidebarCollapsed ? "ml-[76px]" : "ml-60",
        )}
      >
        <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-border bg-midnight/85 px-8 backdrop-blur-xl">
          <div>
            <p className="text-xs text-textMuted">Espaço de trabalho</p>
            <p className="text-sm font-semibold">Northstar Studio</p>
          </div>
          <div className="flex items-center gap-3">
            <IconButton>
              <Bell size={18} />
            </IconButton>
            <div className="h-7 w-px bg-white/10" />
            <div className="grid size-9 place-items-center rounded-full bg-gradient-to-br from-electric to-purple-500 text-xs font-bold">
              AM
            </div>
          </div>
        </header>
        <Outlet />
      </main>
    </div>
  );
}
