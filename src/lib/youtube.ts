export function youtubeVideoId(input: string) {
  const value = input.trim();
  if (!value) return "";

  if (/^[a-zA-Z0-9_-]{11}$/.test(value)) return value;

  try {
    const url = new URL(value);

    if (url.hostname === "youtu.be") {
      return url.pathname.split("/").filter(Boolean)[0] || value;
    }

    if (url.hostname.includes("youtube.com")) {
      const fromQuery = url.searchParams.get("v");
      if (fromQuery) return fromQuery;

      const parts = url.pathname.split("/").filter(Boolean);
      const marker = parts.findIndex((part) =>
        ["embed", "shorts", "live"].includes(part)
      );
      if (marker >= 0 && parts[marker + 1]) return parts[marker + 1];
    }
  } catch {
    // Keep the raw value as a last-resort legacy Video ID.
  }

  return value;
}
