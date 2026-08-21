export type ProjectRow = {
  id: string;
  user_id: string;
  title: string;
  status: "Draft" | "Processing" | "Exported";
  duration: string;
  ratio: string;
  thumbnail: string;
  source_url: string | null;
  storage_path: string | null;
  thumbnail_path: string | null;
  import_status: "idle" | "queued" | "processing" | "ready" | "failed";
  import_error: string | null;
  created_at: string;
  updated_at: string;
};

export type Database = {
  public: {
    Tables: {
      projects: {
        Row: ProjectRow;
        Insert: Omit<
          ProjectRow,
          | "id"
          | "created_at"
          | "updated_at"
          | "source_url"
          | "storage_path"
          | "thumbnail_path"
          | "import_status"
          | "import_error"
        > & {
          id?: string;
          created_at?: string;
          updated_at?: string;
          source_url?: string | null;
          storage_path?: string | null;
          thumbnail_path?: string | null;
          import_status?: ProjectRow["import_status"];
          import_error?: string | null;
        };
        Update: Partial<Omit<ProjectRow, "id" | "user_id" | "created_at">>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
