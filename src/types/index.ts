export type ProjectStatus = "Draft" | "Processing" | "Exported";
export type EditorPanel =
  "reframe" | "subtitles" | "styles" | "emojis" | "smartcut";

export interface Project {
  id: string;
  title: string;
  status: ProjectStatus;
  duration: string;
  ratio: string;
  updatedAt: string;
  thumbnail: string;
}

export interface SubtitleSegment {
  id: number;
  start: number;
  end: number;
  text: string;
}

export interface TeamMember {
  id: number;
  name: string;
  email: string;
  role: "Owner" | "Editor" | "Viewer";
  status: "Active" | "Pending";
  initials: string;
  color: string;
}

export interface SubtitleStyle {
  preset: string;
  fontSize: number;
  lineHeight: number;
  shadow: number;
  color: string;
  autoHighlight: boolean;
}

export interface ExportSettings {
  resolution: string;
  format: string;
}
