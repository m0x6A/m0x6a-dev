/**
 * The site's public address, used for absolute links that leave the site:
 * Open Graph tags and share links, which other sites read without our basePath.
 *
 * The Pages workflow sets `SITE_URL` from `actions/configure-pages` (it already
 * includes the basePath for a project site). Locally it falls back to the dev server.
 */
export const SITE_URL = (process.env.SITE_URL || "http://localhost:3000").replace(/\/+$/, "");

/** An absolute URL for a site route such as `/blog/my-post`, with the trailing slash the static export uses. */
export function absoluteUrl(route: string): string {
  const path = route.startsWith("/") ? route : `/${route}`;
  return `${SITE_URL}${path.endsWith("/") ? path : `${path}/`}`;
}

/** LinkedIn's share dialog for a page; LinkedIn reads the page's Open Graph tags for the preview. */
export function linkedInShareUrl(pageUrl: string): string {
  return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl)}`;
}
