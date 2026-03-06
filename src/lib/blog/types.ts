export type BlogSourceProvider = "local" | "github";

export type LocalBlogSourceConfig = {
  provider: "local";
  rootDir: string;
  contentPath: string;
};

export type GitHubBlogSourceConfig = {
  provider: "github";
  owner: string;
  repo: string;
  branch: string;
  contentPath: string;
  token?: string;
};

export type BlogSourceConfig = LocalBlogSourceConfig | GitHubBlogSourceConfig;

export type BlogSourceEntry = {
  path: string;
  name: string;
};

export type BlogSourceConfigResult =
  | {
      ok: true;
      config: BlogSourceConfig;
      sourceLabel: string;
    }
  | {
      ok: false;
      sourceLabel: string;
      message: string;
    };

export type BlogPostSummary = {
  slug: string;
  title: string;
  summary: string;
  publishedAt: string;
  publishedLabel: string;
  route: string;
};

export type BlogPost = BlogPostSummary & {
  content: string;
};

export type BlogIndexResult =
  | {
      status: "ready";
      sourceLabel: string;
      posts: BlogPostSummary[];
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

export type BlogPostResult =
  | {
      status: "ready";
      sourceLabel: string;
      post: BlogPost;
    }
  | {
      status: "not_found";
      sourceLabel: string;
      slug: string;
      message: string;
    }
  | {
      status: "unavailable";
      sourceLabel: string;
      message: string;
    };
