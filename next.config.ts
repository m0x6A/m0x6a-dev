import type { NextConfig } from "next";

// GitHub Pages serves project sites under /<repo>. The Pages workflow passes the
// path from actions/configure-pages; it is empty locally and with a custom domain.
const basePath = process.env.PAGES_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
