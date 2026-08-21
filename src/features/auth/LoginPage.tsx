import { AlertCircle, Eye, EyeOff } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Card } from "../../components/ui";
import { supabase } from "../../lib/supabase";
import { useAuth } from "./AuthProvider";

export function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const { user, configured } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const destination =
    (location.state as { from?: string } | null)?.from ?? "/dashboard";

  useEffect(() => {
    if (user) navigate(destination, { replace: true });
  }, [destination, navigate, user]);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!supabase) return;
    setLoading(true);
    setError("");
    setMessage("");

    const result =
      mode === "login"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({
            email,
            password,
            options: { emailRedirectTo: `${window.location.origin}/dashboard` },
          });

    if (result.error) setError(result.error.message);
    else if (mode === "signup" && !result.data.session)
      setMessage("Confira seu e-mail para confirmar o cadastro.");
    setLoading(false);
  };

  const signInWithGoogle = async () => {
    if (!supabase) return;
    setError("");
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/dashboard` },
    });
    if (oauthError) setError(oauthError.message);
  };

  const resetPassword = async () => {
    if (!supabase || !email) {
      setError("Informe seu e-mail para recuperar a senha.");
      return;
    }
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      email,
      { redirectTo: `${window.location.origin}/login` },
    );
    if (resetError) setError(resetError.message);
    else setMessage("Enviamos as instruções de recuperação para seu e-mail.");
  };

  return (
    <Card className="relative z-10 w-full max-w-[430px] border-cyan/20 p-8 shadow-glowStrong">
      <div className="text-center">
        <p className="label text-cyan">
          {mode === "login"
            ? "Que bom ter você de volta"
            : "Comece gratuitamente"}
        </p>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight">
          {mode === "login"
            ? "Entre no seu espaço criativo"
            : "Crie sua conta ClipForge"}
        </h1>
        <p className="mt-2 text-xs text-textMuted">
          {mode === "login"
            ? "Continue criando conteúdos que prendem a atenção."
            : "Transforme seu primeiro vídeo em poucos minutos."}
        </p>
      </div>

      {!configured && (
        <div className="mt-6 flex gap-3 rounded-lg border border-amber-400/20 bg-amber-400/[0.08] p-3 text-left text-[11px] leading-5 text-amber-200">
          <AlertCircle className="mt-0.5 shrink-0" size={16} />
          Configure `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` no arquivo
          `.env` para habilitar o acesso.
        </div>
      )}

      <Button
        type="button"
        variant="ghost"
        className="mt-7 w-full"
        disabled={!configured}
        onClick={signInWithGoogle}
      >
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
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="voce@empresa.com"
            className="interactive h-11 w-full rounded-lg border border-border bg-midnight px-3 text-sm focus:border-cyan/50 focus:shadow-glow focus:outline-none"
          />
        </label>
        <label className="block">
          <span className="mb-2 flex justify-between text-[11px] font-medium">
            Senha
            {mode === "login" && (
              <button
                type="button"
                onClick={resetPassword}
                className="text-cyan hover:text-white"
              >
                Esqueceu a senha?
              </button>
            )}
          </span>
          <span className="relative block">
            <input
              required
              minLength={6}
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Mínimo de 6 caracteres"
              className="interactive h-11 w-full rounded-lg border border-border bg-midnight px-3 pr-10 text-sm focus:border-cyan/50 focus:shadow-glow focus:outline-none"
            />
            <button
              type="button"
              aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-textMuted hover:text-white"
            >
              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </span>
        </label>
        {error && (
          <p className="rounded-lg bg-red-500/10 p-3 text-[11px] text-red-300">
            {error}
          </p>
        )}
        {message && (
          <p className="rounded-lg bg-emerald-400/10 p-3 text-[11px] text-emerald-300">
            {message}
          </p>
        )}
        <Button
          loading={loading}
          disabled={!configured}
          className="w-full"
          type="submit"
        >
          {mode === "login" ? "Entrar no ClipForge" : "Criar conta gratuita"}
        </Button>
      </form>
      <p className="mt-6 text-center text-xs text-textMuted">
        {mode === "login" ? "Novo no ClipForge?" : "Já possui uma conta?"}{" "}
        <button
          type="button"
          onClick={() => {
            setMode(mode === "login" ? "signup" : "login");
            setError("");
            setMessage("");
          }}
          className="font-semibold text-cyan hover:text-white"
        >
          {mode === "login" ? "Cadastre-se grátis" : "Entrar"}
        </button>
      </p>
    </Card>
  );
}
