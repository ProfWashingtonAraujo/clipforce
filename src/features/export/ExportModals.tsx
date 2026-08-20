import { motion } from "framer-motion";
import {
  Aperture,
  Check,
  CheckCircle2,
  Copy,
  Download,
  Music2,
  PlaySquare,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Button, Modal } from "../../components/ui";
import { useEditorStore } from "../../store/editorStore";

export function ExportModals({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const progress = useEditorStore((s) => s.exportProgress);
  const setProgress = useEditorStore((s) => s.setExportProgress);
  const reset = useEditorStore((s) => s.resetExport);
  const settings = useEditorStore((s) => s.exportSettings);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!open || progress >= 100) return;
    const interval = window.setInterval(
      () =>
        setProgress(
          Math.min(
            100,
            useEditorStore.getState().exportProgress +
              Math.ceil(Math.random() * 4),
          ),
        ),
      340,
    );
    return () => window.clearInterval(interval);
  }, [open, progress, setProgress]);

  const close = () => {
    onClose();
    window.setTimeout(reset, 250);
  };
  const status =
    progress < 25
      ? "Preparando a mídia e analisando os quadros..."
      : progress < 60
        ? "Renderizando legendas e aplicando transições..."
        : progress < 90
          ? "Otimizando o vídeo para as redes sociais..."
          : "Finalizando sua obra-prima...";
  const circumference = 2 * Math.PI * 52;
  return (
    <Modal open={open} onClose={close} className="max-w-[600px]">
      {progress < 100 ? (
        <div className="text-center">
          <p className="label text-cyan">Motor de exportação com IA</p>
          <h2 className="mt-3 text-2xl font-semibold">
            Exportando sua obra-prima
          </h2>
          <p className="mt-2 text-sm text-textMuted">
            Mantenha esta janela aberta enquanto preparamos seu vídeo.
          </p>
          <div className="relative mx-auto my-8 size-36">
            <svg className="size-full -rotate-90">
              <circle
                cx="72"
                cy="72"
                r="52"
                fill="none"
                stroke="rgba(255,255,255,.06)"
                strokeWidth="7"
              />
              <motion.circle
                cx="72"
                cy="72"
                r="52"
                fill="none"
                stroke="#00E5FF"
                strokeWidth="7"
                strokeLinecap="round"
                strokeDasharray={circumference}
                animate={{
                  strokeDashoffset: circumference * (1 - progress / 100),
                }}
                className="drop-shadow-[0_0_8px_rgba(0,229,255,.7)]"
              />
            </svg>
            <span className="absolute inset-0 grid place-items-center text-3xl font-semibold tabular-nums">
              {progress}
              <small className="text-sm text-cyan">%</small>
            </span>
          </div>
          <p className="h-5 text-xs text-slate-300">{status}</p>
          <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
            <motion.div
              animate={{ width: `${progress}%` }}
              className="h-full rounded-full bg-gradient-to-r from-electric to-cyan shadow-glow"
            />
          </div>
          <div className="mt-6 grid grid-cols-3 divide-x divide-border rounded-xl border border-border bg-white/[0.02] py-4">
            <div>
              <span className="label">Resolução</span>
              <p className="mt-1 text-xs">{settings.resolution}</p>
            </div>
            <div>
              <span className="label">Formato</span>
              <p className="mt-1 text-xs">{settings.format} · H.264</p>
            </div>
            <div>
              <span className="label">Tempo restante</span>
              <p className="mt-1 text-xs">
                ~{Math.max(1, Math.ceil((100 - progress) / 12))} min
              </p>
            </div>
          </div>
          <Button variant="danger" onClick={close} className="mt-6">
            Cancelar exportação
          </Button>
        </div>
      ) : (
        <div className="text-center">
          <motion.div
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", delay: 0.1 }}
            className="mx-auto grid size-16 place-items-center rounded-full bg-emerald-400/15 text-emerald-300 ring-1 ring-emerald-300/30"
          >
            <CheckCircle2 size={34} />
          </motion.div>
          <h2 className="mt-5 text-2xl font-semibold">Seu vídeo está pronto</h2>
          <p className="mt-2 text-sm text-textMuted">
            Verão na cidade · 1080 × 1920
          </p>
          <div className="relative mx-auto mt-6 aspect-video max-w-md overflow-hidden rounded-xl border border-white/10">
            <img
              src="https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=900&q=75"
              className="h-full w-full object-cover opacity-80"
              alt="Prévia da exportação"
            />
            <div className="absolute inset-0 grid place-items-center">
              <div className="grid size-12 place-items-center rounded-full bg-white text-midnight">
                ▶
              </div>
            </div>
          </div>
          <p className="label mt-6">Compartilhar diretamente</p>
          <div className="mt-3 grid grid-cols-3 gap-2">
            <Button
              variant="ghost"
              className="border-red-500/20 hover:text-red-300"
            >
              <PlaySquare size={17} />
              YouTube
            </Button>
            <Button variant="ghost" className="hover:text-pink-300">
              <Music2 size={17} />
              TikTok
            </Button>
            <Button
              variant="ghost"
              className="border-purple-500/20 hover:text-purple-300"
            >
              <Aperture size={17} />
              Reels
            </Button>
          </div>
          <div className="mt-4 flex rounded-lg border border-border bg-midnight p-1.5 pl-3">
            <input
              readOnly
              value="clipforge.studio/v/82fxa7"
              className="min-w-0 flex-1 bg-transparent text-xs text-textMuted outline-none"
            />
            <Button
              variant="ghost"
              onClick={() => {
                navigator.clipboard?.writeText(
                  "https://clipforge.studio/v/82fxa7",
                );
                setCopied(true);
              }}
              className="h-8"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}{" "}
              {copied ? "Copiado" : "Copiar link"}
            </Button>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <Button variant="ghost" onClick={close}>
              Voltar ao editor
            </Button>
            <Button>
              <Download size={16} />
              Baixar vídeo (MP4)
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
