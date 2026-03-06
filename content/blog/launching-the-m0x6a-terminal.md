---
title: "Launching the m0x6a terminal"
publishedAt: "2026-03-06"
summary: "Why this portfolio exists, why the interface leans on CLI cues, and how Markdown keeps publishing small."
---

Welcome to the first entry in the new home for **m0x6a**.

This site is meant to feel like a developer workspace without pretending to be a terminal emulator. The goal is simple: keep the brand recognizable, keep the information easy to scan, and keep publishing lightweight.

## Why Git-backed publishing?

- Markdown stays easy to review
- content changes travel well through version control
- there is no separate CMS to maintain

## What the first version optimizes for

1. a portfolio homepage that reads clearly on any screen
2. a small blog index that is easy to extend
3. explicit states when the blog source is empty, unavailable, or missing a post

## One small principle

If a workflow is hard to explain, it is usually hard to maintain.

```ts
export function publish(post: string) {
  return `ship:${post}:with-clear-metadata`;
}
```

There is more to add, but the base is now in place.
