import {
  Expand,
  Pause,
  Play,
  RotateCcw,
  RotateCw,
  Volume2,
} from "lucide-react";
import { memo, useEffect, useRef, useState } from "react";
import { Dropdown, IconButton, Slider, Toggle } from "../../../components/ui";
import { useEditorStore } from "../../../store/editorStore";

const formatTime = (seconds: number) =>
  `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`;

export const VideoPlayer = memo(function VideoPlayer({ source }: { source: string | null }) {
  const currentTime = useEditorStore((s) => s.currentTime);
  const duration = useEditorStore((s) => s.duration);
  const isPlaying = useEditorStore((s) => s.isPlaying);
  const setPlaying = useEditorStore((s) => s.setPlaying);
  const setCurrentTime = useEditorStore((s) => s.setCurrentTime);
  const setDuration = useEditorStore((s) => s.setDuration);
  const subtitles = useEditorStore((s) => s.subtitles);
  const style = useEditorStore((s) => s.subtitleStyle);
  const [tracking, setTracking] = useState(true);
  const [mode, setMode] = useState("Dinâmico");
  const [sensitivity, setSensitivity] = useState(72);
  const [volume, setVolume] = useState(80);
  const videoRef = useRef<HTMLVideoElement>(null);
  const activeSubtitle = subtitles.find(
    (item) => currentTime >= item.start && currentTime < item.end,
  );

  useEffect(() => {
    if (!isPlaying || source) return;
    const timer = window.setInterval(() => {
      const state = useEditorStore.getState();
      if (state.currentTime >= state.duration) {
        state.setPlaying(false);
        state.setCurrentTime(0);
      } else state.setCurrentTime(state.currentTime + 0.1);
    }, 100);
    return () => window.clearInterval(timer);
  }, [isPlaying, source]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.volume = volume / 100;
  }, [volume]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (isPlaying) void video.play().catch(() => setPlaying(false));
    else video.pause();
  }, [isPlaying, setPlaying]);

  useEffect(() => {
    const video = videoRef.current;
    if (video && Math.abs(video.currentTime - currentTime) > 0.35) {
      video.currentTime = currentTime;
    }
  }, [currentTime]);

  return (
    <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden bg-[#05070c] p-7">
      <div className="relative aspect-video max-h-full w-full max-w-[900px] overflow-hidden rounded-lg bg-black shadow-2xl">
        {source ? (
          <video
            ref={videoRef}
            src={source}
            playsInline
            preload="metadata"
            className="h-full w-full object-contain"
            onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
            onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
            onEnded={() => setPlaying(false)}
          />
        ) : (
          <img
            src="https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=1600&q=85"
            className="h-full w-full object-cover opacity-75"
            alt="Prévia do vídeo"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/25" />
        {tracking && (
          <div className="absolute left-[34%] top-[16%] h-[60%] w-[31%] border border-cyan shadow-glow">
            <span className="absolute -left-px -top-6 bg-cyan px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-midnight">
              Pessoa 01 · 98%
            </span>
            {[
              "-left-1 -top-1 border-l-2 border-t-2",
              "-right-1 -top-1 border-r-2 border-t-2",
              "-bottom-1 -left-1 border-b-2 border-l-2",
              "-bottom-1 -right-1 border-b-2 border-r-2",
            ].map((position) => (
              <i
                key={position}
                className={`absolute size-3 border-cyan ${position}`}
              />
            ))}
          </div>
        )}
        {activeSubtitle && (
          <div
            className="absolute bottom-[14%] left-1/2 w-[82%] -translate-x-1/2 text-center font-bold uppercase tracking-tight"
            style={{
              fontSize: Math.max(15, style.fontSize * 0.62),
              lineHeight: style.lineHeight,
              color: style.color,
              textShadow: `0 2px ${style.shadow / 8}px rgba(0,0,0,.95)`,
            }}
          >
            {activeSubtitle.text}
          </div>
        )}
        <div className="absolute left-4 top-4 w-56 rounded-xl border border-white/10 bg-midnight/75 p-3 backdrop-blur-xl">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-[10px] font-semibold uppercase tracking-wider">
              Rastreamento por IA
            </span>
            <Toggle checked={tracking} onChange={setTracking} />
          </div>
          <div className="mb-3 grid grid-cols-[55px_1fr] items-center gap-2">
            <span className="text-[10px] text-textMuted">Modo</span>
            <Dropdown
              value={mode}
              options={["Dinâmico", "Travado", "Cinemático"]}
              onChange={setMode}
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-textMuted">Sensibilidade</span>
            <Slider value={sensitivity} onChange={setSensitivity} />
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 flex h-14 items-center gap-2 px-4 opacity-0 transition-opacity hover:opacity-100">
          <IconButton onClick={() => setCurrentTime(currentTime - 5)}>
            <RotateCcw size={17} />
          </IconButton>
          <IconButton
            onClick={() => setPlaying(!isPlaying)}
            className="bg-white text-midnight hover:bg-cyan hover:text-midnight"
          >
            {isPlaying ? (
              <Pause size={17} fill="currentColor" />
            ) : (
              <Play size={17} fill="currentColor" />
            )}
          </IconButton>
          <IconButton onClick={() => setCurrentTime(currentTime + 5)}>
            <RotateCw size={17} />
          </IconButton>
          <span className="ml-2 text-[11px] tabular-nums">
            {formatTime(currentTime)}{" "}
            <span className="text-textMuted">/ {formatTime(duration)}</span>
          </span>
          <div className="ml-auto flex w-28 items-center gap-2">
            <Volume2 size={16} />
            <Slider value={volume} onChange={setVolume} />
          </div>
          <IconButton
            onClick={() => document.documentElement.requestFullscreen?.()}
          >
            <Expand size={17} />
          </IconButton>
        </div>
      </div>
    </div>
  );
});
