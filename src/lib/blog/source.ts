import path from "node:path";
import type { BlogSourceConfigResult } from "./types";

const DEFAULT_CONTENT_PATH = "content/blog";
const DEFAULT_BRANCH = "main";

function normalizeContentPath(contentPath: string) {
  return contentPath.replace(/^\/+/, "").replace(/\/+$/, "");
}

export function getBlogSourceConfig(): BlogSourceConfigResult {
  const provider = process.env.BLOG_SOURCE_PROVIDER ?? "local";
  const contentPath = normalizeContentPath(
    process.env.BLOG_SOURCE_PATH ?? DEFAULT_CONTENT_PATH,
  );

  if (provider === "local") {
    return {
      ok: true,
      config: {
        provider: "local",
        rootDir: process.cwd(),
        contentPath,
      },
      sourceLabel: `local :: ${contentPath}`,
    };
  }

  if (provider === "github") {
    const owner = process.env.BLOG_SOURCE_OWNER;
    const repo = process.env.BLOG_SOURCE_REPO;
    const branch = process.env.BLOG_SOURCE_BRANCH ?? DEFAULT_BRANCH;

    if (!owner || !repo) {
      return {
        ok: false,
        sourceLabel: `github :: ${contentPath}`,
        message:
          "GitHub blog mode requires BLOG_SOURCE_OWNER and BLOG_SOURCE_REPO to be configured.",
      };
    }

    return {
      ok: true,
      config: {
        provider: "github",
        owner,
        repo,
        branch,
        contentPath,
        token: process.env.BLOG_SOURCE_TOKEN,
      },
      sourceLabel: `github :: ${owner}/${repo}@${branch}:${contentPath}`,
    };
  }

  return {
    ok: false,
    sourceLabel: `unknown :: ${provider}`,
    message: `Unsupported blog source provider "${provider}".`,
  };
}

export function resolveLocalContentDirectory(rootDir: string, contentPath: string) {
  return path.join(rootDir, contentPath);
}
