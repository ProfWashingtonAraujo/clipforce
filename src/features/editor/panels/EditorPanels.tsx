import { motion } from "framer-motion";
import {
  Captions,
  Check,
  Crop,
  SmilePlus,
  Scissors,
  Sparkles,
  WandSparkles,
} from "lucide-react";
import { useState } from "react";
import {
  Button,
  Card,
  Dropdown,
  Slider,
  Toggle,
  cn,
} from "../../../components/ui";
import { useEditorStore } from "../../../store/editorStore";

const Section = ({
  title,
  value,
  children,
}: {
  title: string;
  value?: string;
  children: React.ReactNode;
}) => (
  <div className="border-b border-border p-5 last:border-0">
    <div className="mb-4 flex items-center justify-between">
      <h3 className="text-xs font-semibold">{title}</h3>
      {value && <span className="text-[10px] text-textMuted">{value}</span>}
    </div>
    {children}
  </div>
);

function ReframePanel() {
  const { ratio, setRatio } = useEditorStore();
  const [focus, setFocus] = useState("Detecção automática");
  const ratios = [
    { r: "9:16", name: "TikTok / Shorts", shape: "h-14 w-8" },
    { r: "1:1", name: "Instagram", shape: "size-11" },
    { r: "4:5", name: "Feed social", shape: "h-12 w-10" },
  ];
  return (
    <>
      <Section title="Formato de destino">
        <div className="grid grid-cols-3 gap-2">
          {ratios.map(({ r, name, shape }) => (
            <button
              key={r}
              onClick={() => setRatio(r)}
              className={cn(
                "interactive rounded-xl border p-3 text-center hover:border-cyan/40",
                ratio === r
                  ? "border-cyan bg-cyan/10 shadow-glow"
                  : "border-border bg-white/[0.02]",
              )}
            >
              <span
                className={cn(
                  "mx-auto block rounded border",
                  shape,
                  ratio === r ? "border-cyan bg-cyan/10" : "border-white/20",
                )}
              />
              <strong className="mt-2 block text-[11px]">{r}</strong>
              <span className="block truncate text-[8px] text-textMuted">
                {name}
              </span>
            </button>
          ))}
        </div>
      </Section>
      <Section title="Comportamento do enquadramento">
        <p className="mb-2 text-[10px] text-textMuted">Pessoa em foco</p>
        <Dropdown
          value={focus}
          options={[
            "Detecção automática",
            "Apresentador",
            "Pessoa ativa",
            "Centralizar quadro",
          ]}
          onChange={setFocus}
        />
      </Section>
      <Section title="Prévia em vários formatos">
        <div className="grid grid-cols-3 gap-2">
          {ratios.map(({ r, shape }) => (
            <div
              key={r}
              className="grid h-24 place-items-center overflow-hidden rounded-lg bg-[url('https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=300&q=60')] bg-cover"
            >
              <div className={cn("border border-cyan shadow-glow", shape)} />
            </div>
          ))}
        </div>
        <Button variant="ghost" className="mt-3 w-full">
          <Crop size={15} />
          Ver todos os formatos
        </Button>
      </Section>
      <div className="p-5">
        <Button className="w-full">
          <WandSparkles size={16} />
          Corte inteligente
        </Button>
      </div>
    </>
  );
}

function SubtitlesPanel() {
  const { subtitles, currentTime, setCurrentTime, updateSubtitle } =
    useEditorStore();
  const [generating, setGenerating] = useState(false);
  const generate = () => {
    setGenerating(true);
    setTimeout(() => setGenerating(false), 1800);
  };
  return (
    <>
      <div className="p-5">
        <Button onClick={generate} loading={generating} className="w-full">
          <Sparkles size={16} />
          Gerar legendas com IA
        </Button>
        <p className="mt-2 text-center text-[9px] text-textMuted">
          Detecção automática de idioma · 99,4% de precisão
        </p>
      </div>
      <div className="border-t border-border px-3 pb-4">
        <div className="flex items-center justify-between px-2 py-3">
          <span className="label">Transcrição</span>
          <span className="text-[10px] text-textMuted">
            {subtitles.length} segmentos
          </span>
        </div>
        <div className="max-h-[520px] space-y-2 overflow-y-auto">
          {generating
            ? [1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="relative h-20 overflow-hidden rounded-lg bg-white/[0.04]"
                >
                  <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/[0.06] to-transparent animate-shimmer" />
                </div>
              ))
            : subtitles.map((segment) => {
                const active =
                  currentTime >= segment.start && currentTime < segment.end;
                return (
                  <button
                    key={segment.id}
                    onClick={() => setCurrentTime(segment.start)}
                    className={cn(
                      "interactive w-full rounded-lg border p-3 text-left",
                      active
                        ? "border-cyan bg-cyan/[0.07] shadow-glow"
                        : "border-transparent bg-white/[0.025] hover:border-white/10",
                    )}
                  >
                    <div className="mb-2 flex items-center gap-2">
                      <span
                        className={cn(
                          "text-[9px] font-semibold tabular-nums",
                          active ? "text-cyan" : "text-textMuted",
                        )}
                      >
                        00:{String(Math.floor(segment.start)).padStart(2, "0")}
                      </span>
                      {active && (
                        <span className="ml-auto size-1.5 animate-pulse rounded-full bg-cyan" />
                      )}
                    </div>
                    <textarea
                      aria-label={`Legenda ${segment.id}`}
                      value={segment.text}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) =>
                        updateSubtitle(segment.id, e.target.value)
                      }
                      className="w-full resize-none bg-transparent text-xs leading-5 outline-none"
                      rows={2}
                    />
                  </button>
                );
              })}
        </div>
      </div>
    </>
  );
}

function StylesPanel() {
  const { subtitleStyle: style, setSubtitleStyle } = useEditorStore();
  const styles = [
    { name: "Estilo Hormozi", class: "font-black uppercase text-yellow-300" },
    { name: "Minimalista Moderno", class: "font-medium text-white" },
    {
      name: "Neon Cibernético",
      class: "font-bold uppercase text-cyan drop-shadow-[0_0_5px_#00E5FF]",
    },
    { name: "Legenda Limpa", class: "font-semibold text-white" },
  ];
  return (
    <>
      <Section title="Modelos de legenda">
        <div className="grid grid-cols-2 gap-2">
          {styles.map((item) => (
            <button
              key={item.name}
              onClick={() => setSubtitleStyle({ preset: item.name })}
              className={cn(
                "interactive overflow-hidden rounded-lg border text-left",
                style.preset === item.name
                  ? "border-cyan shadow-glow"
                  : "border-border hover:border-cyan/30",
              )}
            >
              <div className="grid h-20 place-items-center bg-gradient-to-br from-slate-700 to-slate-900 p-2 text-center">
                <span className={`text-[11px] ${item.class}`}>
                  CRIE CONTEÚDO
                  <br />
                  QUE PRENDE
                </span>
              </div>
              <p className="p-2 text-[9px]">{item.name}</p>
            </button>
          ))}
        </div>
      </Section>
      <Section title="Tipografia">
        <div className="space-y-4">
          {[
            {
              label: "Tamanho da fonte",
              key: "fontSize",
              value: style.fontSize,
              min: 20,
              max: 64,
              suffix: "px",
            },
            {
              label: "Altura da linha",
              key: "lineHeight",
              value: style.lineHeight,
              min: 0.8,
              max: 2,
              step: 0.1,
              suffix: "",
            },
            {
              label: "Intensidade da sombra",
              key: "shadow",
              value: style.shadow,
              min: 0,
              max: 100,
              suffix: "%",
            },
          ].map((item) => (
            <div key={item.key}>
              <div className="mb-2 flex justify-between text-[10px]">
                <span className="text-textMuted">{item.label}</span>
                <span>
                  {item.value}
                  {item.suffix}
                </span>
              </div>
              <Slider
                value={item.value}
                min={item.min}
                max={item.max}
                step={item.step}
                onChange={(value) => setSubtitleStyle({ [item.key]: value })}
              />
            </div>
          ))}
        </div>
      </Section>
      <Section title="Cor da legenda">
        <div className="flex gap-3">
          {["#FFFFFF", "#00E5FF", "#FFE145", "#FF4D8D", "#8B5CF6"].map(
            (color) => (
              <button
                aria-label={color}
                key={color}
                onClick={() => setSubtitleStyle({ color })}
                style={{ backgroundColor: color }}
                className={cn(
                  "interactive size-8 rounded-full border-2",
                  style.color === color
                    ? "scale-110 border-white shadow-glow"
                    : "border-transparent",
                )}
              />
            ),
          )}
        </div>
      </Section>
      <div className="p-5">
        <Toggle
          label="Destacar palavras-chave automaticamente"
          checked={style.autoHighlight}
          onChange={(autoHighlight) => setSubtitleStyle({ autoHighlight })}
        />
      </div>
    </>
  );
}

function EmojisPanel() {
  const [smart, setSmart] = useState(true);
  const [selected, setSelected] = useState("🔥");
  const suggestions = [
    ["incrível", "🔥"],
    ["ideia", "💡"],
    ["crescimento", "📈"],
    ["lançamento", "🚀"],
  ];
  return (
    <>
      <Section title="Sugestões inteligentes com IA">
        <div className="flex items-center justify-between rounded-lg bg-cyan/[0.06] p-3">
          <div>
            <p className="text-xs">Sugerir com base na transcrição</p>
            <p className="mt-1 text-[9px] text-textMuted">
              Identificar o contexto automaticamente
            </p>
          </div>
          <Toggle checked={smart} onChange={setSmart} />
        </div>
      </Section>
      <Section title="Emojis rápidos">
        <div className="grid grid-cols-6 gap-2">
          {[
            "🔥",
            "💡",
            "🚀",
            "✨",
            "😂",
            "❤️",
            "👀",
            "💯",
            "🎯",
            "⚡",
            "👏",
            "🤯",
            "✅",
            "📈",
            "🎉",
            "👇",
            "🤔",
            "💪",
          ].map((emoji) => (
            <button
              key={emoji}
              onClick={() => setSelected(emoji)}
              className={cn(
                "interactive grid aspect-square place-items-center rounded-lg bg-white/[0.035] text-xl hover:bg-cyan/10",
                selected === emoji && "ring-1 ring-cyan bg-cyan/10 shadow-glow",
              )}
            >
              {emoji}
            </button>
          ))}
        </div>
      </Section>
      <Section title="Correspondências na transcrição">
        <div className="space-y-2">
          {suggestions.map(([word, emoji]) => (
            <button
              onClick={() => setSelected(emoji)}
              key={word}
              className="interactive flex w-full items-center justify-between rounded-lg border border-border bg-white/[0.02] p-3 text-xs hover:border-cyan/30"
            >
              <span>
                “{word}”{" "}
                <span className="ml-2 text-[9px] text-textMuted">
                  3 ocorrências
                </span>
              </span>
              <span className="text-xl">{emoji}</span>
            </button>
          ))}
        </div>
      </Section>
    </>
  );
}

function SmartCutPanel() {
  const [silence, setSilence] = useState(true),
    [filler, setFiller] = useState(true),
    [jumps, setJumps] = useState(false),
    [threshold, setThreshold] = useState(-32),
    [applied, setApplied] = useState(false);
  return (
    <>
      <Section title="Configurações de detecção">
        <div className="space-y-5">
          <div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs">Remover silêncios</p>
                <p className="mt-1 text-[9px] text-textMuted">
                  Cortar trechos silenciosos automaticamente
                </p>
              </div>
              <Toggle checked={silence} onChange={setSilence} />
            </div>
            {silence && (
              <div className="mt-3 rounded-lg bg-white/[0.025] p-3">
                <div className="mb-2 flex justify-between text-[9px] text-textMuted">
                  <span>Limite em dB</span>
                  <span>{threshold} dB</span>
                </div>
                <Slider
                  min={-60}
                  max={-10}
                  value={threshold}
                  onChange={setThreshold}
                />
              </div>
            )}
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs">Remover vícios de linguagem</p>
              <p className="mt-1 text-[9px] text-textMuted">
                Hum, ah, tipo, sabe
              </p>
            </div>
            <Toggle checked={filler} onChange={setFiller} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs">Transições com jump cut</p>
              <p className="mt-1 text-[9px] text-textMuted">
                Adicionar aproximações suaves
              </p>
            </div>
            <Toggle checked={jumps} onChange={setJumps} />
          </div>
        </div>
      </Section>
      <div className="p-5">
        <Card className="border-cyan/15 bg-gradient-to-br from-cyan/[0.08] to-transparent p-4">
          <Scissors size={20} className="mb-4 text-cyan" />
          <p className="text-2xl font-semibold">7,4 s</p>
          <p className="mt-1 text-[10px] text-textMuted">
            economia de tempo estimada
          </p>
          <div className="my-4 h-px bg-white/10" />
          <div className="flex justify-between text-[10px]">
            <span>6 silêncios encontrados</span>
            <span>3 vícios de linguagem</span>
          </div>
        </Card>
        <Button onClick={() => setApplied(true)} className="mt-4 w-full">
          {applied ? <Check size={16} /> : <Sparkles size={16} />}{" "}
          {applied
            ? "Cortes inteligentes aplicados"
            : "Aplicar cortes inteligentes"}
        </Button>
      </div>
    </>
  );
}

export function EditorPanels() {
  const panel = useEditorStore((s) => s.selectedPanel);
  const labels = {
    reframe: [
      "Reenquadramento automático",
      "Adapte o vídeo para cada plataforma",
    ],
    subtitles: ["Legendas com IA", "Edite e sincronize sua transcrição"],
    styles: [
      "Estilos de legenda",
      "Deixe cada palavra com a cara da sua marca",
    ],
    emojis: [
      "Emojis inteligentes",
      "Adicione energia visual nos momentos certos",
    ],
    smartcut: ["Corte inteligente", "Remova as partes que ninguém assiste"],
  };
  return (
    <aside className="flex min-h-0 flex-col border-l border-border bg-midnight-900">
      <div className="shrink-0 border-b border-border p-5">
        <div className="flex items-center gap-2">
          {panel === "reframe" ? (
            <Crop size={18} className="text-cyan" />
          ) : panel === "subtitles" ? (
            <Captions size={18} className="text-cyan" />
          ) : panel === "emojis" ? (
            <SmilePlus size={18} className="text-cyan" />
          ) : (
            <Sparkles size={18} className="text-cyan" />
          )}
          <h2 className="font-semibold">{labels[panel][0]}</h2>
        </div>
        <p className="mt-1.5 text-[10px] text-textMuted">{labels[panel][1]}</p>
      </div>
      <motion.div
        key={panel}
        initial={{ opacity: 0, x: 14 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2 }}
        className="min-h-0 flex-1 overflow-y-auto"
      >
        {panel === "reframe" && <ReframePanel />}
        {panel === "subtitles" && <SubtitlesPanel />}
        {panel === "styles" && <StylesPanel />}
        {panel === "emojis" && <EmojisPanel />}
        {panel === "smartcut" && <SmartCutPanel />}
      </motion.div>
    </aside>
  );
}
