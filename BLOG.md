# Writing posts for m0x6a

This file is the source of truth for how posts on this blog are written. Any tool or
agent that drafts or edits a post reads it first. Where it disagrees with a skill or a
prompt, this file wins. When Mattias corrects a draft's voice, add the correction here.

## Voice: write as Mattias

He is a developer and architect writing for other developers. He writes the way he talks
in chat, just spelled correctly.

How he writes (from his own messages):

- **Plain and conversational.** "I've been using X a lot lately", "quite a lot of",
  "for now", "basically", "pretty bad". Everyday words, no rhetoric.
- **Context first, then the point.** He opens by saying what has been going on, then
  what he wants or did. Example: "We've been discussing quite a lot of things back and
  forth, a lot of these would be suitable for a blogpost, the blog lives as a GitHub page
  for now."
- **Longer sentences joined with commas and "and"/"but"/"so"**, rather than many short
  punchy ones.
- **Thinks in business problem versus technical solution**, and questions his own ideas.
  Example: "would the introduction of graph databases be helpful or just more technical
  solutions to what's actually a business problem".
- **Hedges honestly:** "I think", "for now", "I rarely get around to".
- **Direct when something is off:** "this is too ai", "It still doesn't sound like me".
  Says what's wrong, no cushioning.
- **Few headings, short posts.** 3 to 4 plain headings that say what the section is about
  ("How it works", "Posts that disappear"). No template scaffolding like "Why it matters" /
  "What changed" / "One small principle" unless he asks for it.
- **English with a Swedish rhythm is fine**; fix spelling and grammar, keep his phrasing.

Never write these (they read as AI):

- "X, not Y" / "It's not X, it's Y" / "X was the bottleneck, not Y" contrasts.
- Labelled punchlines: "The tradeoff is control.", "What stays simple:", "The catch:",
  "Here's the thing:".
- Closing mottos and aphorisms ("Automate the boring part, keep the judgment").
- Bold lead-ins on every list item, lists of three for rhythm, every paragraph ending on
  a neat line.
- Words he doesn't use: "leverage", "seamless", "robust", "delve", "crucial",
  "game-changer", "journey", "unlock".
- Em dashes as a style device; use a comma or a new sentence.
- Meta openers like "In this post I will".

Write for a reader who has never seen the repo or the conversation behind the post:

- Explain what something does instead of naming internal documents. Never cite ADRs, file
  paths or internal names as if the reader knows them. Say what the software actually does.
- Code only when it shows something the text can't.
- End on what he's doing next, in a plain sentence.

Before handing over a draft, read it once looking only for the patterns above and rewrite
every hit.

Existing posts are a reference for format only (code blocks, tables, asset links), not for
tone or section structure.

## Content

- Only his own statements are his opinions or decisions. Anything an assistant suggested
  stays out unless he adopted it.
- Flag any sentence that states a plan or opinion he didn't say himself, so he can cut it.

## Format

Posts live in `content/blog/<slug>.md`. Front matter follows
`docs/adr/0005-markdown-front-matter-contract.md`; the first three fields are required and a
post missing one is silently skipped by the site:

```md
---
title: "..."
publishedAt: "YYYY-MM-DD"   # Europe/Stockholm date
summary: "One sentence for the blog index."
slug: "kebab-case-slug"      # lower-case, non-alphanumeric runs become -
---
```

- Only Markdown that `react-markdown` + `remark-gfm` renders: no MDX, no HTML components.
- Assets (scripts, SVG diagrams) go in `public/blog/assets/` and are linked as
  `/blog/assets/<file>`.

## Privacy

Remove anything not needed for the post, and always remove:

- credentials, tokens, hostnames, internal URLs, account names, local paths with his username
- employer, customer and colleague names or internal project names, unless he says they can
  be public
- personal life details (housing, family, finances, health, location beyond what he chooses)

## Publishing

New posts go in on a `post/<slug>` branch as a pull request to `main`; never push to `main`
directly. Before opening the PR, run `npm ci && npm run lint && npm run test && npm run build`
and check that `out/blog/<slug>/` (or `out/blog/<slug>.html`) exists. Merging the PR deploys
the post.

## Voice corrections

Corrections Mattias has made to drafts, newest first. Apply these on top of the rules above.

- (none yet)
