import assert from "node:assert/strict";
import test from "node:test";
import type { BlogSourceAdapter } from "../src/lib/blog/adapter";
import { BlogSourceUnavailableError } from "../src/lib/blog/errors";
import { loadBlogPosts, normalizeBlogPost } from "../src/lib/blog/posts";

class MemoryBlogSourceAdapter implements BlogSourceAdapter {
  constructor(private readonly files: Record<string, string>) {}

  async listMarkdownFiles() {
    return Object.keys(this.files).map((filePath) => ({
      path: filePath,
      name: filePath.split("/").pop() ?? filePath,
    }));
  }

  async readFile(filePath: string) {
    const entry = this.files[filePath];

    if (!entry) {
      throw new BlogSourceUnavailableError(`Missing fixture for ${filePath}`);
    }

    return entry;
  }
}

test("normalizeBlogPost builds summary data from valid Markdown", () => {
  const post = normalizeBlogPost(
    "notes/hello-terminal.md",
    `---
title: "Hello terminal"
publishedAt: "2026-03-06"
summary: "A short note."
---

Body copy`,
  );

  assert.ok(post);
  assert.equal(post.slug, "hello-terminal");
  assert.equal(post.route, "/blog/hello-terminal");
  assert.equal(post.publishedLabel, "Mar 6, 2026");
});

test("loadBlogPosts orders valid entries newest first and ignores invalid files", async () => {
  const adapter = new MemoryBlogSourceAdapter({
    "posts/newer.md": `---
title: "Newer"
publishedAt: "2026-03-06"
summary: "Newest post."
---

Latest`,
    "posts/older.md": `---
title: "Older"
publishedAt: "2026-02-14"
summary: "Older post."
---

Earlier`,
    "posts/invalid.md": `---
title: "Invalid"
---

Missing fields`,
  });

  const result = await loadBlogPosts(adapter, "memory");

  assert.equal(result.status, "ready");
  assert.deepEqual(
    result.posts.map((post) => post.slug),
    ["newer", "older"],
  );
});

test("loadBlogPosts returns empty when no valid posts are available", async () => {
  const adapter = new MemoryBlogSourceAdapter({
    "posts/invalid.md": `---
title: "Invalid"
---

Missing required metadata`,
  });

  const result = await loadBlogPosts(adapter, "memory");

  assert.equal(result.status, "empty");
});

test("loadBlogPosts returns unavailable when the source cannot be listed", async () => {
  const adapter: BlogSourceAdapter = {
    async listMarkdownFiles() {
      throw new BlogSourceUnavailableError("Repository is unavailable");
    },
    async readFile() {
      throw new Error("readFile should not run");
    },
  };

  const result = await loadBlogPosts(adapter, "memory");

  assert.equal(result.status, "unavailable");
  assert.match(result.message, /Repository is unavailable/);
});
