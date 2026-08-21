const youtubeIdPattern = /^[\w-]{11}$/;

export function getYouTubeVideoId(value: string | null | undefined) {
  if (!value) return null;

  try {
    const url = new URL(value);
    const host = url.hostname.replace(/^www\./, "").toLowerCase();

    if (host === "youtu.be") {
      const id = url.pathname.split("/").filter(Boolean)[0];
      return id && youtubeIdPattern.test(id) ? id : null;
    }

    if (!["youtube.com", "m.youtube.com"].includes(host)) return null;
    const id =
      url.pathname === "/watch"
        ? url.searchParams.get("v")
        : url.pathname.match(/^\/(?:shorts|embed)\/([\w-]{11})/)?.[1];
    return id && youtubeIdPattern.test(id) ? id : null;
  } catch {
    return null;
  }
}

export function getYouTubeThumbnail(
  value: string | null | undefined,
  quality: "maxresdefault" | "hqdefault" = "maxresdefault",
) {
  const id = getYouTubeVideoId(value);
  return id ? `https://img.youtube.com/vi/${id}/${quality}.jpg` : null;
}
