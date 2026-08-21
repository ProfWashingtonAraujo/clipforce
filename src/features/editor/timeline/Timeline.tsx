import {
  Copy,
  Expand,
  Gauge,
  Redo2,
  Scissors,
  Trash2,
  Undo2,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { memo, useEffect, useRef, useState } from "react";
import { IconButton, Slider, cn } from "../../../components/ui";
import { useEditorStore } from "../../../store/editorStore";
import { getYouTubeThumbnail } from "../../../lib/youtube";

export const Timeline = memo(function Timeline({ sourceUrl }: { sourceUrl?: string | null }) {
  const { currentTime, duration, trimRange, setCurrentTime, setTrimRange, emojis, subtitles } =
    useEditorStore();
  const trackRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<"start" | "end" | null>(null);
  const [zoom, setZoom] = useState(65);
  const [speed, setSpeed] = useState(1);

  useEffect(() => {
    const move = (event: MouseEvent) => {
      if (!dragRef.current || !trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      const time = Math.max(
        0,
        Math.min(
          duration,
          ((event.clientX - rect.left) / rect.width) * duration,
        ),
      );
      if (dragRef.current === "start")
        setTrimRange([Math.min(time, trimRange[1] - 1), trimRange[1]]);
      else setTrimRange([trimRange[0], Math.max(time, trimRange[0] + 1)]);
    };
    const up = () => {
      dragRef.current = null;
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };
  }, [duration, setTrimRange, trimRange]);

  const seek = (event: React.MouseEvent) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    setCurrentTime(((event.clientX - rect.left) / rect.width) * duration);
  };
  
  const bgImage = getYouTubeThumbnail(sourceUrl) || "https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=300&q=60";

  return (
    <div className="shrink-0 border-t border-border bg-midnight-900">
      <div className="flex h-11 items-center border-b border-border px-4">
        <div className="flex items-center gap-1">
          <IconButton>
            <Undo2 size={15} />
          </IconButton>
          <IconButton>
            <Redo2 size={15} />
          </IconButton>
          <span className="mx-2 h-5 w-px bg-white/10" />
          <IconButton>
            <Scissors size={15} />
          </IconButton>
          <IconButton>
            <Copy size={15} />
          </IconButton>
          <IconButton className="hover:text-red-300">
            <Trash2 size={15} />
          </IconButton>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <Gauge size={14} className="text-textMuted" />
          <span className="text-[10px] text-textMuted">
            {speed.toFixed(1)}x
          </span>
          <Slider
            min={0.5}
            max={2}
            step={0.25}
            value={speed}
            onChange={setSpeed}
            className="w-20"
          />
          <span className="mx-2 h-5 w-px bg-white/10" />
          <ZoomOut size={14} className="text-textMuted" />
          <Slider value={zoom} min={25} onChange={setZoom} className="w-20" />
          <ZoomIn size={14} className="text-textMuted" />
          <IconButton>
            <Expand size={15} />
          </IconButton>
        </div>
      </div>
      <div className="h-[190px] overflow-x-auto px-4 py-3">
        <div
          style={{ width: `${Math.max(100, zoom * 1.6)}%` }}
          className="relative min-w-full"
        >
          <div className="relative ml-24 h-6 border-b border-white/10">
            {[0, 5, 10, 15, 20, 25, 30, 35, 40].map((time) => (
              <span
                key={time}
                style={{ left: `${(time / duration) * 100}%` }}
                className="absolute bottom-1 -translate-x-1/2 text-[9px] text-textMuted"
              >
                <i className="absolute -bottom-[5px] left-1/2 h-1.5 w-px bg-white/20" />
                00:{String(time).padStart(2, "0")}
              </span>
            ))}
          </div>
          <div className="mt-2 grid grid-cols-[80px_1fr] gap-4">
            <div className="flex h-[72px] flex-col justify-center">
              <span className="text-[10px] font-semibold">VÍDEO PRINCIPAL</span>
              <span className="mt-1 text-[9px] text-textMuted">
                V1 · Original
              </span>
            </div>
            <div
              ref={trackRef}
              onMouseDown={seek}
              className="relative h-[72px] cursor-crosshair overflow-hidden rounded-md border border-white/10 bg-midnight-700"
            >
              <div className="absolute inset-0 flex">
                {Array.from({ length: 8 }).map((_, index) => (
                  <img
                    key={index}
                    src={bgImage}
                    className="min-w-0 flex-1 object-cover opacity-60"
                    alt=""
                  />
                ))}
              </div>
              <div
                style={{ width: `${(trimRange[0] / duration) * 100}%` }}
                className="absolute inset-y-0 left-0 bg-midnight/75"
              />
              <div
                style={{
                  width: `${((duration - trimRange[1]) / duration) * 100}%`,
                }}
                className="absolute inset-y-0 right-0 bg-midnight/75"
              />
              <button
                onMouseDown={(e) => {
                  e.stopPropagation();
                  dragRef.current = "start";
                }}
                style={{ left: `${(trimRange[0] / duration) * 100}%` }}
                className="absolute inset-y-0 z-10 w-2 -translate-x-1/2 cursor-ew-resize rounded-l border-x-2 border-cyan bg-cyan/30 shadow-glow"
              />
              <button
                onMouseDown={(e) => {
                  e.stopPropagation();
                  dragRef.current = "end";
                }}
                style={{ left: `${(trimRange[1] / duration) * 100}%` }}
                className="absolute inset-y-0 z-10 w-2 -translate-x-1/2 cursor-ew-resize rounded-r border-x-2 border-cyan bg-cyan/30 shadow-glow"
              />
              {emojis.map(({ time, emoji, id }) => (
                <span
                  key={id}
                  style={{ left: `${(time / duration) * 100}%` }}
                  className="absolute top-1 z-10 -translate-x-1/2 rounded bg-midnight px-1 text-sm shadow-glow cursor-pointer"
                >
                  {emoji}
                </span>
              ))}
              <div
                style={{ left: `${(currentTime / duration) * 100}%` }}
                className="pointer-events-none absolute -top-2 bottom-0 z-20 w-px bg-cyan shadow-glow"
              >
                <span className="absolute -left-1.5 -top-1 size-3 rotate-45 bg-cyan" />
              </div>
            </div>
          </div>
          <div className="mt-2 grid grid-cols-[80px_1fr] gap-4">
            <div className="py-1 text-[10px] text-textMuted">LEGENDAS</div>
            <div className="relative h-7 w-full overflow-hidden rounded bg-cyan/[0.06]">
              {subtitles.map((segment) => {
                const active = currentTime >= segment.start && currentTime < segment.end;
                return (
                  <span
                    key={segment.id}
                    onClick={() => setCurrentTime(segment.start)}
                    style={{
                      left: `${(segment.start / duration) * 100}%`,
                      width: `${((segment.end - segment.start) / duration) * 100}%`
                    }}
                    className={cn(
                      "absolute top-0 bottom-0 flex items-center cursor-pointer truncate rounded border px-2 py-1 text-[8px] transition-colors",
                      active ? "border-cyan bg-cyan/20 text-cyan shadow-glow" : "border-cyan/20 bg-cyan/10 text-cyan/70 hover:border-cyan/50 hover:text-cyan"
                    )}
                  >
                    {segment.text}
                  </span>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
