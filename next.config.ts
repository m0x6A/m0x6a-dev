import type { NextConfig } from "next";

// GitHub Pages serves project sites under /<repo>. The Pages workflow passes the
// path from actions/configure-pages; it is empty locally and with a custom domain.
const basePath = process.env.PAGES_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  trailingSlash: true,
  // Exposed so plain <a> links to static files (which next/link can't route) get the basePath too.
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
