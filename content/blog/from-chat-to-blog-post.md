---
title: "Turning my Claude chats into blog posts"
publishedAt: "2026-10-18"
summary: "I spend a lot of time thinking things through with Claude, so I set up a skill that turns a chat into a post for this blog and opens a pull request when I'm happy with it."
slug: "from-chat-to-blog-post"
---

I've been using Claude a lot lately, not only for code but to think things through. Architecture, how agents could fit into the core of a business, how to rebuild my terminal setup. Quite a lot of those chats end up with something I think is worth sharing, but I rarely get around to writing it down. Going back through a long chat and turning it into a post takes time, and by then I've usually moved on to the next thing.

So I wanted to be able to say "convert this chat to a blogpost" at the end of a chat and get something I can actually publish.

## How it works

It's a Claude skill, which is basically a set of instructions Claude loads when I ask for something it covers. When I ask for a post it reads the chat, clones this repo, looks at the post template and my latest posts, and writes a draft. I read it and ask for changes, and when I say publish it creates a branch and opens a pull request. The site builds on pull requests but only deploys from main, so merging is when the post goes live.

The pull request was important to me. I don't want anything published in my name that I haven't read first.

It also removes things that shouldn't be in a post, like names from work or private things that came up on the side, and tells me what it took out so I can check.

## The first drafts didn't sound like me

This is the first post written this way, and the first drafts were pretty bad. The content was fine, but they read like Claude wrote them. Lines like "writing was the bottleneck, not ideas", short punchy section intros and a little motto at the end. It also referred to one of my architecture decision records by its number, which means nothing to someone reading the blog.

So the skill now gets examples of how I actually write, taken from my own messages, and a list of patterns to stay away from.

## Posts that disappear

One thing I had forgotten about my own blog. Every post starts with a small block with title, date and summary, and if one of them is missing the site just skips the post instead of failing the build. I did that on purpose so one broken post can't break the whole site, but it means the build can pass and the post never shows up. So the skill builds the site before it opens the pull request and checks that the page is actually there:

```bash
npm ci && npm run lint && npm run test && npm run build
test -e "out/blog/$SLUG" || test -e "out/blog/$SLUG.html"
```

Next I'll go back through older chats and pick out the ones that should have been posts already.
