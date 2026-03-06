---
title: "Post title"
publishedAt: "YYYY-MM-DD"
summary: "One-sentence summary for the blog index."
# slug: "optional-custom-slug"
---

Start with a short opening that explains what changed, what shipped, or what you learned.

Keep the voice direct and easy to scan. Prefer short paragraphs, clear headings, and examples that show the point quickly.

## Why it matters

- Explain the motivation
- Call out the tradeoff
- Note what stays simple

## What changed

1. describe the first meaningful change
2. describe the second meaningful change
3. describe the operational or developer impact

## One small principle

Add a short principle or observation that makes the post feel grounded.

```ts
export function publish(post: string) {
  return `ship:${post}:with-clear-metadata`;
}
```

Close with one sentence that leaves the next step obvious.