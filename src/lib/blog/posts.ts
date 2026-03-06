import { cache } from "react";
import matter from "gray-matter";
import type { BlogSourceAdapter } from "./adapter";
import { BlogSourceUnavailableError } from "./errors";
import { GitHubBlogSourceAdapter } from "./github-adapter";
import { LocalBlogSourceAdapter } from "./local-adapter";
import { getBlogSourceConfig } from "./source";
import type {
  BlogIndexResult,
  BlogPost,
  BlogPostResult,
  BlogPostSummary,
  BlogSourceConfig,
} from "./types";

type BlogLoadResult =
  | {
      status: "ready";
      sourceLabel: string;
      posts: BlogPost[];
    }
  | {
      status: "empty";
      sourceLabel: string;
      message: string;
    }
  | {
      status: "unavailable";
      sourceLabel: string;
      message: string;
    };

type BlogFrontmatter = {
  title?: unknown;
  publishedAt?: unknown;
  summary?: unknown;
  slug?: unknown;
};

const dateFormatter = new Intl.DateTimeFormat("en", {
  year: "numeric",
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});

export async function getBlogIndex(): Promise<BlogIndexResult> {
  const result = await loadConfiguredBlogPosts();

  if (result.status === "ready") {
    return {
      status: "ready",
      sourceLabel: result.sourceLabel,
      posts: result.posts.map(toSummary),
    };
  }

  return result;
}

export async function getBlogPost(slug: string): Promise<BlogPostResult> {
  const result = await loadConfiguredBlogPosts();

  if (result.status !== "ready") {
    if (result.status === "unavailable") {
      return result;
    }

    return {
      status: "not_found",
      sourceLabel: result.sourceLabel,
      slug,
      message: `No blog post named "${slug}" was found.`,
    };
  }

  const post = result.posts.find((entry) => entry.slug === slug);

  if (!post) {
    return {
      status: "not_found",
      sourceLabel: result.sourceLabel,
      slug,
      message: `No blog post named "${slug}" was found.`,
    };
  }

  return {
    status: "ready",
    sourceLabel: result.sourceLabel,
    post,
  };
}

export async function loadBlogPosts(
  adapter: BlogSourceAdapter,
  sourceLabel: string,
): Promise<BlogLoadResult> {
  let files: Awaited<ReturnType<BlogSourceAdapter["listMarkdownFiles"]>>;

  try {
    files = await adapter.listMarkdownFiles();
  } catch (error) {
    return toUnavailableResult(error, sourceLabel);
  }

  let rawPosts: Array<BlogPost | null>;

  try {
    rawPosts = await Promise.all(
      files.map(async (file) =>
        normalizeBlogPost(file.path, await adapter.readFile(file.path)),
      ),
    );
  } catch (error) {
    return toUnavailableResult(error, sourceLabel);
  }

  const posts = dedupePosts(
    rawPosts.filter((post): post is BlogPost => post !== null),
  ).sort((left, right) => right.publishedAt.localeCompare(left.publishedAt));

  if (posts.length === 0) {
    return {
      status: "empty",
      sourceLabel,
      message:
        "No valid Markdown posts were found. Add a post with title, publishedAt, and summary front matter to populate the index.",
    };
  }

  return {
    status: "ready",
    sourceLabel,
    posts,
  };
}

export function normalizeBlogPost(
  filePath: string,
  rawMarkdown: string,
): BlogPost | null {
  const { data, content } = matter(rawMarkdown);
  const frontmatter = data as BlogFrontmatter;
  const title = normalizeString(frontmatter.title);
  const summary = normalizeString(frontmatter.summary);
  const publishedAt = normalizeDate(frontmatter.publishedAt);
  const slug =
    normalizeSlug(frontmatter.slug) ?? normalizeSlug(getFileNameWithoutExtension(filePath));

  if (!title || !summary || !publishedAt || !slug) {
    return null;
  }

  return {
    slug,
    title,
    summary,
    publishedAt,
    publishedLabel: dateFormatter.format(new Date(`${publishedAt}T12:00:00Z`)),
    route: `/blog/${slug}`,
    content: content.trim(),
  };
}

const loadConfiguredBlogPosts = cache(async () => {
  const source = getBlogSourceConfig();

  if (!source.ok) {
    return {
      status: "unavailable",
      sourceLabel: source.sourceLabel,
      message: source.message,
    } satisfies BlogLoadResult;
  }

  return loadBlogPosts(createBlogSourceAdapter(source.config), source.sourceLabel);
});

function createBlogSourceAdapter(config: BlogSourceConfig): BlogSourceAdapter {
  return config.provider === "github"
    ? new GitHubBlogSourceAdapter(config)
    : new LocalBlogSourceAdapter(config);
}

function toSummary(post: BlogPost): BlogPostSummary {
  return {
    slug: post.slug,
    title: post.title,
    summary: post.summary,
    publishedAt: post.publishedAt,
    publishedLabel: post.publishedLabel,
    route: post.route,
  };
}

function toUnavailableResult(error: unknown, sourceLabel: string): BlogLoadResult {
  if (error instanceof BlogSourceUnavailableError) {
    return {
      status: "unavailable",
      sourceLabel,
      message: error.message,
    };
  }

  throw error;
}

function normalizeString(value: unknown) {
  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
}

function normalizeSlug(value: unknown) {
  const normalized = normalizeString(value);

  if (!normalized) {
    return null;
  }

  const slug = normalized
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug.length > 0 ? slug : null;
}

function normalizeDate(value: unknown) {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  const dateValue = /^\d{4}-\d{2}-\d{2}$/.test(trimmed)
    ? new Date(`${trimmed}T12:00:00Z`)
    : new Date(trimmed);

  if (Number.isNaN(dateValue.getTime())) {
    return null;
  }

  return dateValue.toISOString().slice(0, 10);
}

function getFileNameWithoutExtension(filePath: string) {
  const fileName = filePath.split("/").pop() ?? filePath;
  const extensionIndex = fileName.lastIndexOf(".");
  return extensionIndex === -1 ? fileName : fileName.slice(0, extensionIndex);
}

function dedupePosts(posts: BlogPost[]) {
  const seen = new Set<string>();
  const uniquePosts: BlogPost[] = [];

  for (const post of posts) {
    if (seen.has(post.slug)) {
      continue;
    }

    seen.add(post.slug);
    uniquePosts.push(post);
  }

  return uniquePosts;
}
