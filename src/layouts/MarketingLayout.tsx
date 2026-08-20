import { Link, Outlet } from "react-router-dom";
import { Button, Logo } from "../components/ui";

export function MarketingLayout() {
  return (
    <div className="min-h-screen overflow-hidden bg-midnight">
      <header className="fixed inset-x-0 top-0 z-40 border-b border-white/[0.04] bg-midnight/75 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-8">
          <Link to="/">
            <Logo />
          </Link>
          <nav className="flex items-center gap-8 text-sm text-textMuted">
            <a href="#features" className="interactive hover:text-white">
              Recursos
            </a>
            <a href="#pricing" className="interactive hover:text-white">
              Preços
            </a>
            <a href="#creators" className="interactive hover:text-white">
              Criadores
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost">Entrar</Button>
            </Link>
            <Link to="/dashboard">
              <Button>Começar a criar</Button>
            </Link>
          </div>
        </div>
      </header>
      <Outlet />
    </div>
  );
}
