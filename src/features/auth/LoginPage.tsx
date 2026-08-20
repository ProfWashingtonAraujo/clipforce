import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Card } from "../../components/ui";

export function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setTimeout(() => navigate("/dashboard"), 700);
  };
  return (
    <Card className="relative z-10 w-full max-w-[430px] border-cyan/20 p-8 shadow-glowStrong">
      <div className="text-center">
        <p className="label text-cyan">Que bom ter você de volta</p>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight">
          Entre no seu espaço criativo
        </h1>
        <p className="mt-2 text-xs text-textMuted">
          Continue criando conteúdos que prendem a atenção.
        </p>
      </div>
      <Button variant="ghost" className="mt-7 w-full">
        <span className="grid size-5 place-items-center rounded-full bg-white font-bold text-[#4285F4]">
          G
        </span>
        Continuar com o Google
      </Button>
      <div className="my-6 flex items-center gap-3">
        <span className="h-px flex-1 bg-white/[.07]" />
        <span className="text-[9px] uppercase tracking-wider text-textMuted">
          ou continue com seu e-mail
        </span>
        <span className="h-px flex-1 bg-white/[.07]" />
      </div>
      <form onSubmit={submit} className="space-y-4">
        <label className="block">
          <span className="mb-2 block text-[11px] font-medium">E-mail</span>
          <input
            required
            type="email"
            defaultValue="alex@northstar.studio"
            className="interactive h-11 w-full rounded-lg border border-border bg-midnight px-3 text-sm focus:border-cyan/50 focus:shadow-glow focus:outline-none"
          />
        </label>
        <label className="block">
          <span className="mb-2 flex justify-between text-[11px] font-medium">
            Senha{" "}
            <a href="#" className="text-cyan">
              Esqueceu a senha?
            </a>
          </span>
          <span className="relative block">
            <input
              required
              type={showPassword ? "text" : "password"}
              defaultValue="creator123"
              className="interactive h-11 w-full rounded-lg border border-border bg-midnight px-3 pr-10 text-sm focus:border-cyan/50 focus:shadow-glow focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-textMuted hover:text-white"
            >
              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </span>
        </label>
        <label className="flex items-center gap-2 text-[10px] text-textMuted">
          <input type="checkbox" defaultChecked className="accent-cyan" />
          Manter conectado
        </label>
        <Button loading={loading} className="w-full" type="submit">
          Entrar no ClipForge
        </Button>
      </form>
      <p className="mt-6 text-center text-xs text-textMuted">
        Novo no ClipForge?{" "}
        <Link
          to="/dashboard"
          className="font-semibold text-cyan hover:text-white"
        >
          Cadastre-se grátis
        </Link>
      </p>
    </Card>
  );
}
