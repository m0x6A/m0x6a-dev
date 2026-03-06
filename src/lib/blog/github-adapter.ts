import type { BlogSourceAdapter } from "./adapter";
import { BlogSourceUnavailableError } from "./errors";
import type { BlogSourceEntry, GitHubBlogSourceConfig } from "./types";

type GitHubContentItem = {
  type: string;
  name: string;
  path: string;
};

const MARKDOWN_EXTENSIONS = [".md", ".markdown"];
const REVALIDATE_SECONDS = 300;

function isMarkdownFile(fileName: string) {
  return MARKDOWN_EXTENSIONS.some((extension) => fileName.endsWith(extension));
}

export class GitHubBlogSourceAdapter implements BlogSourceAdapter {
  constructor(private readonly config: GitHubBlogSourceConfig) {}

  async listMarkdownFiles(): Promise<BlogSourceEntry[]> {
    return listDirectory(this.config, this.config.contentPath);
  }

  async readFile(filePath: string): Promise<string> {
    const targetPath = filePath.replace(/^\/+/, "");
    const encodedPath = targetPath
      .split("/")
      .map((segment) => encodeURIComponent(segment))
      .join("/");
    const response = await fetchWithAvailability(
      `https://api.github.com/repos/${this.config.owner}/${this.config.repo}/contents/${encodedPath}?ref=${encodeURIComponent(this.config.branch)}`,
      createGitHubHeaders(this.config.token, "application/vnd.github.raw+json"),
    );

    return response.text();
  }
}

async function listDirectory(
  config: GitHubBlogSourceConfig,
  directoryPath: string,
): Promise<BlogSourceEntry[]> {
  const encodedPath = directoryPath
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");
  const response = await fetchWithAvailability(
    `https://api.github.com/repos/${config.owner}/${config.repo}/contents/${encodedPath}?ref=${encodeURIComponent(config.branch)}`,
    createGitHubHeaders(config.token, "application/vnd.github+json"),
  );
  const payload = await parseJson(response);

  if (!Array.isArray(payload)) {
    throw new BlogSourceUnavailableError(
      `GitHub directory response for "${directoryPath}" was not a list.`,
    );
  }

  const directoryEntries = await Promise.all(
    payload.map(async (item) => {
      if (!isGitHubContentItem(item)) {
        return [] as BlogSourceEntry[];
      }

      if (item.type === "dir") {
        return listDirectory(config, item.path);
      }

      if (item.type === "file" && isMarkdownFile(item.name)) {
        return [{ path: item.path, name: item.name }];
      }

      return [] as BlogSourceEntry[];
    }),
  );

  return directoryEntries.flat();
}

async function fetchWithAvailability(
  url: string,
  headers?: HeadersInit,
): Promise<Response> {
  let response: Response;

  try {
    response = await fetch(url, {
      headers,
      next: { revalidate: REVALIDATE_SECONDS },
    });
  } catch (error) {
    throw new BlogSourceUnavailableError(`Unable to reach GitHub source at ${url}.`, {
      cause: error,
    });
  }

  if (!response.ok) {
    throw new BlogSourceUnavailableError(
      `GitHub source request failed with ${response.status} ${response.statusText}.`,
    );
  }

  return response;
}

function createGitHubHeaders(
  token?: string,
  accept = "application/vnd.github+json",
): HeadersInit {
  return {
    Accept: accept,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

function isGitHubContentItem(value: unknown): value is GitHubContentItem {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return (
    typeof candidate.type === "string" &&
    typeof candidate.name === "string" &&
    typeof candidate.path === "string"
  );
}

async function parseJson(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch (error) {
    throw new BlogSourceUnavailableError(
      "GitHub source returned a response that could not be parsed as JSON.",
      { cause: error },
    );
  }
}
