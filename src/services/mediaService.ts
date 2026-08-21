import { requireSupabase } from "../lib/supabase";

const mediaApiUrl = (import.meta.env.VITE_MEDIA_API_URL || "http://localhost:8787").replace(
  /\/$/,
  "",
);

export const mediaService = {
  async importYoutube(projectId: string, url: string) {
    const client = requireSupabase();
    const { data } = await client.auth.getSession();
    if (!data.session) throw new Error("Sessão não encontrada.");

    const response = await fetch(`${mediaApiUrl}/api/import/youtube`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${data.session.access_token}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({ projectId, url }),
    });
    const body = (await response.json().catch(() => null)) as { error?: string } | null;
    if (!response.ok) {
      throw new Error(body?.error || "Não foi possível iniciar a importação.");
    }
  },
};
