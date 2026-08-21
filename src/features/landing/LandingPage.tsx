import { motion } from "framer-motion";
import {
  ArrowRight,
  Captions,
  Check,
  Crop,
  Play,
  Scissors,
  Sparkles,
  WandSparkles,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button, Card, Logo, cn } from "../../components/ui";

const features = [
  {
    icon: Captions,
    number: "01",
    title: "Legendas automáticas com IA",
    text: "Legendas impecáveis em 48 idiomas, sincronizadas e estilizadas com um clique.",
    color: "cyan",
  },
  {
    icon: Scissors,
    number: "02",
    title: "Corte inteligente",
    text: "Encontre os ganchos, remova silêncios e vícios de linguagem. Mantenha só o que prende a atenção.",
    color: "purple",
  },
  {
    icon: Crop,
    number: "03",
    title: "Reenquadramento automático",
    text: "A pessoa permanece perfeitamente enquadrada em Shorts, Reels, TikTok e qualquer feed.",
    color: "blue",
  },
];
const plans = [
  {
    name: "Grátis",
    price: "0",
    text: "Comece a criar hoje",
    features: [
      "60 min de exportação / mês",
      "Exportações em 720p",
      "Legendas com IA",
      "3 projetos ativos",
    ],
  },
  {
    name: "Pro",
    price: "24",
    text: "Para criadores profissionais",
    features: [
      "600 min de exportação / mês",
      "Exportações em 4K",
      "Todas as ferramentas de IA",
      "Projetos ilimitados",
      "Sem marca-d'água",
    ],
    featured: true,
  },
  {
    name: "Studio",
    price: "79",
    text: "Escale sua equipe de conteúdo",
    features: [
      "2.000 min de exportação / mês",
      "8 vagas na equipe",
      "Modelos da marca",
      "Renderização prioritária",
      "Biblioteca compartilhada",
    ],
  },
];

export function LandingPage() {
  return (
    <main>
      <section className="relative min-h-[880px] overflow-hidden pt-20">
        <div className="absolute left-1/2 top-16 h-[520px] w-[920px] -translate-x-1/2 rounded-full bg-cyan/[0.07] blur-[130px]" />
        <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.04)_1px,transparent_1px)] [background-size:64px_64px]" />
        <div className="relative mx-auto max-w-7xl px-8 pt-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto inline-flex items-center gap-2 rounded-full border border-cyan/20 bg-cyan/[0.06] px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-cyan"
          >
            <Sparkles size={13} />
            Seu estúdio de edição com IA
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mx-auto mt-7 max-w-4xl text-6xl font-semibold leading-[1.05] tracking-[-.05em]"
          >
            Do vídeo bruto a{" "}
            <span className="bg-gradient-to-r from-cyan via-sky-300 to-electric bg-clip-text text-transparent">
              cortes virais
            </span>{" "}
            em segundos
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mx-auto mt-6 max-w-2xl text-base leading-7 text-textMuted"
          >
            Encontre os momentos que merecem ser vistos. O ClipForge corta,
            legenda e reenquadra seus vídeos com IA para você criar na
            velocidade da cultura.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 flex justify-center gap-3"
          >
            <Link to="/dashboard">
              <Button className="h-12 px-6">
                Crie seu primeiro corte <ArrowRight size={17} />
              </Button>
            </Link>
            <Button variant="ghost" className="h-12 px-6">
              <Play size={16} fill="currentColor" />
              Assistir à demonstração de 60 s
            </Button>
          </motion.div>
          <p className="mt-4 text-[10px] text-textMuted">
            Sem cartão de crédito · Plano grátis para sempre · Exporte em
            minutos
          </p>
          <motion.div
            initial={{ opacity: 0, y: 50, rotateX: 8 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="relative mx-auto mt-16 max-w-5xl rounded-2xl border border-white/10 bg-midnight-900 p-2 shadow-[0_30px_100px_rgba(0,0,0,.65),0_0_60px_rgba(0,229,255,.1)]"
          >
            <div className="overflow-hidden rounded-xl border border-border">
              <div className="flex h-11 items-center gap-2 border-b border-border bg-midnight-800 px-4">
                <Logo compact />
                <span className="h-4 w-px bg-white/10" />
                <span className="text-[9px] text-textMuted">
                  Vídeo de lançamento do criador
                </span>
                <span className="ml-auto rounded bg-cyan px-2 py-1 text-[8px] font-bold text-midnight">
                  EXPORTAR
                </span>
              </div>
              <div className="grid h-[390px] grid-cols-[56px_1fr_260px]">
                <div className="space-y-2 border-r border-border p-2">
                  {[Crop, Captions, Scissors, WandSparkles].map((Icon, i) => (
                    <div
                      key={i}
                      className={cn(
                        "grid h-10 place-items-center rounded-lg",
                        i === 1 ? "bg-cyan/10 text-cyan" : "text-textMuted",
                      )}
                    >
                      <Icon size={16} />
                    </div>
                  ))}
                </div>
                <div className="flex flex-col bg-[#05070c] p-5">
                  <div className="relative min-h-0 flex-1 overflow-hidden rounded-lg">
                    <img
                      src="https://images.unsplash.com/photo-1492724441997-5dc865305da7?auto=format&fit=crop&w=1200&q=80"
                      className="h-full w-full object-cover opacity-75"
                      alt="Editor do ClipForge"
                    />
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-xl font-black uppercase">
                      CRIE <span className="text-cyan">O QUE IMPORTA</span>
                    </div>
                    <div className="absolute left-[38%] top-[15%] h-[58%] w-[25%] border border-cyan shadow-glow" />
                  </div>
                  <div className="mt-3 flex h-20 gap-1 overflow-hidden rounded-md border border-cyan/30 p-1">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <img
                        key={i}
                        src={`https://images.unsplash.com/photo-1492724441997-5dc865305da7?auto=format&fit=crop&w=${160 + i}&q=40`}
                        className="min-w-0 flex-1 object-cover"
                        alt=""
                      />
                    ))}
                  </div>
                </div>
                <div className="border-l border-border bg-midnight-800 p-4 text-left">
                  <p className="text-xs font-semibold">Legendas com IA</p>
                  <p className="mt-1 text-[8px] text-textMuted">
                    6 segmentos gerados
                  </p>
                  <Button className="mt-4 h-8 w-full text-[10px]">
                    <Sparkles size={12} />
                    Gerar legendas
                  </Button>
                  <div className="mt-4 space-y-2">
                    {[
                      "Crie o que importa",
                      "Produza com agilidade",
                      "Histórias que valem compartilhar",
                    ].map((t, i) => (
                      <div
                        key={t}
                        className={cn(
                          "rounded-lg border p-3 text-[9px]",
                          i === 1
                            ? "border-cyan bg-cyan/[.06]"
                            : "border-border bg-white/[.02]",
                        )}
                      >
                        <span className="mb-1 block text-[7px] text-cyan">
                          00:{12 + i * 4}
                        </span>
                        {t}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      <section id="creators" className="border-y border-border py-9">
        <p className="text-center text-[10px] uppercase tracking-[.25em] text-textMuted">
          Escolhido por equipes inovadoras de
        </p>
        <div className="mx-auto mt-7 flex max-w-5xl justify-between text-lg font-semibold text-white/30">
          <span>northstar</span>
          <span>STORYLAB</span>
          <span>kinetic</span>
          <span>WAVEFORM</span>
          <span>Arc Studio</span>
          <span>FRAME</span>
        </div>
      </section>
      <section id="features" className="mx-auto max-w-7xl px-8 py-28">
        <div className="max-w-2xl">
          <p className="label text-cyan">Feito para dar ritmo</p>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight">
            Um estúdio. Todas as ferramentas para{" "}
            <span className="text-textMuted">parar o scroll.</span>
          </h2>
        </div>
        <div className="mt-12 grid grid-cols-3 gap-5">
          {features.map(({ icon: Icon, number, title, text }, i) => (
            <motion.div key={title} whileHover={{ y: -6 }}>
              <Card className="relative h-full overflow-hidden p-7">
                <span className="absolute right-6 top-5 text-5xl font-bold text-white/[.025]">
                  {number}
                </span>
                <div className="grid size-12 place-items-center rounded-xl border border-cyan/20 bg-cyan/10 text-cyan">
                  <Icon size={22} />
                </div>
                <h3 className="mt-8 text-lg font-semibold">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-textMuted">{text}</p>
                <div className="mt-8 h-32 overflow-hidden rounded-lg border border-border bg-midnight p-3">
                  {i === 0 ? (
                    <div className="space-y-2">
                      {[
                        "SUA HISTÓRIA COMEÇA AQUI",
                        "UM CLIQUE. TODOS OS FORMATOS.",
                        "PRONTO PARA VIRALIZAR",
                      ].map((t, j) => (
                        <p
                          key={t}
                          className={cn(
                            "rounded p-2 text-center text-[9px] font-bold",
                            j === 1
                              ? "bg-cyan text-midnight"
                              : "bg-white/[.04]",
                          )}
                        >
                          {t}
                        </p>
                      ))}
                    </div>
                  ) : i === 1 ? (
                    <div className="relative mt-9 h-10 rounded bg-white/[.04]">
                      <div className="absolute inset-y-0 left-[15%] right-[10%] bg-purple-500/25" />
                      {[25, 43, 67].map((v) => (
                        <i
                          key={v}
                          style={{ left: `${v}%` }}
                          className="absolute inset-y-0 w-px bg-purple-400"
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="flex h-full items-center justify-center gap-3">
                      <div className="h-24 w-14 border border-cyan bg-cyan/5" />
                      <div className="size-20 border border-white/20" />
                      <div className="h-20 w-16 border border-white/20" />
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>
      <section
        id="pricing"
        className="border-y border-border bg-midnight-900/60 py-28"
      >
        <div className="mx-auto max-w-6xl px-8 text-center">
          <p className="label text-cyan">Preços simples</p>
          <h2 className="mt-4 text-4xl font-semibold">
            Crie mais. Pague menos.
          </h2>
          <p className="mt-4 text-sm text-textMuted">
            Comece grátis. Mude de plano quando seu público crescer.
          </p>
          <div className="mt-12 grid grid-cols-3 items-center gap-4 text-left">
            {plans.map((plan) => (
              <Card
                key={plan.name}
                className={cn(
                  "relative p-7",
                  plan.featured &&
                    "border-cyan bg-cyan/[.04] py-10 shadow-glowStrong",
                )}
              >
                {plan.featured && (
                  <span className="absolute right-5 top-0 -translate-y-1/2 rounded-full bg-cyan px-3 py-1 text-[9px] font-bold uppercase text-midnight">
                    Mais popular
                  </span>
                )}
                <h3 className="font-semibold">{plan.name}</h3>
                <p className="mt-2 text-xs text-textMuted">{plan.text}</p>
                <p className="mt-7">
                  <span className="text-4xl font-semibold">
                    US$ {plan.price}
                  </span>
                  <span className="text-xs text-textMuted"> / mês</span>
                </p>
                <Button
                  variant={plan.featured ? "primary" : "ghost"}
                  className="mt-6 w-full"
                >
                  {plan.name === "Grátis"
                    ? "Começar grátis"
                    : `Escolher ${plan.name}`}
                </Button>
                <div className="mt-7 space-y-3">
                  {plan.features.map((f) => (
                    <p key={f} className="flex items-center gap-2 text-xs">
                      <Check size={14} className="text-cyan" />
                      {f}
                    </p>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <footer className="mx-auto max-w-7xl px-8 pb-10 pt-20">
        <div className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-12">
          <div>
            <Logo />
            <p className="mt-5 max-w-xs text-xs leading-6 text-textMuted">
              O estúdio de edição com IA para quem prefere publicar em vez de
              passar horas cortando timelines.
            </p>
          </div>
          {[
            ["Produto", "Recursos", "Preços", "Novidades"],
            ["Empresa", "Sobre", "Carreiras", "Contato"],
            ["Aspectos legais", "Privacidade", "Termos", "Cookies"],
          ].map(([title, ...items]) => (
            <div key={title}>
              <p className="text-xs font-semibold">{title}</p>
              {items.map((i) => (
                <a
                  key={i}
                  className="mt-4 block text-xs text-textMuted hover:text-cyan"
                  href="#"
                >
                  {i}
                </a>
              ))}
            </div>
          ))}
        </div>
        <div className="mt-16 flex justify-between border-t border-border pt-7 text-[10px] text-textMuted">
          <p>© 2026 ClipForge Studio. Todos os direitos reservados.</p>
          <p>Criado para produtores de conteúdo de todos os lugares.</p>
        </div>
      </footer>
    </main>
  );
}
