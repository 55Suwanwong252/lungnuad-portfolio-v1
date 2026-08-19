/**
 * Custom 2:3 poster artwork for portfolio films.
 *
 * Future update workflow:
 * 1) Save the supplied vertical cover to:
 *    /public/media/portfolio-posters/<category>/<videoId>.<ext>
 * 2) Add one mapping below using the SAME YouTube videoId.
 *
 * This keeps the poster permanently bound to the correct YouTube film.
 */
export const PORTFOLIO_VERTICAL_POSTERS: Record<string, string> = {
  // Example:
  // "WnMkJjR1d5Q": "/media/portfolio-posters/wedding/WnMkJjR1d5Q.jpg",
};

export function portfolioVerticalPoster(
  videoId: string,
  fallback: string
) {
  return (
    PORTFOLIO_VERTICAL_POSTERS[videoId] ||
    fallback ||
    `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
  );
}
