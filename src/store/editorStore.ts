import { create } from "zustand";
import subtitlesData from "../mocks/subtitles.json";
import type {
  EditorPanel,
  ExportSettings,
  SubtitleSegment,
  SubtitleStyle,
} from "../types";

interface EditorState {
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  trimRange: [number, number];
  subtitles: SubtitleSegment[];
  selectedPanel: EditorPanel;
  subtitleStyle: SubtitleStyle;
  exportSettings: ExportSettings;
  exportProgress: number;
  ratio: string;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setPlaying: (playing: boolean) => void;
  setTrimRange: (range: [number, number]) => void;
  setSelectedPanel: (panel: EditorPanel) => void;
  updateSubtitle: (id: number, text: string) => void;
  setSubtitleStyle: (style: Partial<SubtitleStyle>) => void;
  setExportProgress: (progress: number) => void;
  resetExport: () => void;
  setRatio: (ratio: string) => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  currentTime: 14.6,
  duration: 40,
  isPlaying: false,
  trimRange: [2, 37],
  subtitles: subtitlesData as SubtitleSegment[],
  selectedPanel: "reframe",
  subtitleStyle: {
    preset: "Minimalista Moderno",
    fontSize: 36,
    lineHeight: 1.2,
    shadow: 45,
    color: "#FFFFFF",
    autoHighlight: true,
  },
  exportSettings: { resolution: "1080p", format: "MP4" },
  exportProgress: 0,
  ratio: "9:16",
  setCurrentTime: (time) =>
    set((state) => ({
      currentTime: Math.min(state.duration, Math.max(0, time)),
    })),
  setDuration: (duration) => set({ duration, currentTime: 0, trimRange: [0, duration] }),
  setPlaying: (isPlaying) => set({ isPlaying }),
  setTrimRange: (trimRange) => set({ trimRange }),
  setSelectedPanel: (selectedPanel) => set({ selectedPanel }),
  updateSubtitle: (id, text) =>
    set((state) => ({
      subtitles: state.subtitles.map((item) =>
        item.id === id ? { ...item, text } : item,
      ),
    })),
  setSubtitleStyle: (style) =>
    set((state) => ({ subtitleStyle: { ...state.subtitleStyle, ...style } })),
  setExportProgress: (exportProgress) => set({ exportProgress }),
  resetExport: () => set({ exportProgress: 0 }),
  setRatio: (ratio) => set({ ratio }),
}));
