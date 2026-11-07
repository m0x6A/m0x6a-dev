---
title: "A curated knowledge base for my talks"
publishedAt: "2026-11-07"
summary: "I hold quite a lot of talks about GitHub Copilot and agentic engineering as Lead Technologist at Sogeti, internally and at events, and since I've started reasoning through them with AI and agents, it felt natural to keep everything in an opinionated knowledge base that the talks are built from."
slug: "curated-knowledge-base-for-talks"
---

I work as Lead Technologist at Sogeti, and I've been holding quite a lot of talks about GitHub Copilot and agentic engineering, and how observability and good engineering practice fit into it. Most of them are for knowledge sharing internally and in my enablement assignments, and some are at events, like the [Rise and Shine event in Borlänge this spring](https://www.linkedin.com/posts/johanbjarneryd_riktigt-kul-att-f%C3%A5-komma-till-borl%C3%A4nge-ig%C3%A5r-ugcPost-7465391033573564416-cgjw/). For a while now I've been using AI and agents to reason through them and build them. Somewhere along the way it became obvious that the material itself was worth keeping, so I started a curated and quite opinionated knowledge base for the things I think are important, and the talks are now built from it.

## Why I keep talking about this

Most of what I talk about is old. Feedback loops, understanding what happens in production, making small changes that are safe to ship, and owning what you ship are the basics of good engineering, and they were long before agents came along. What has changed is the speed and the scale, and who or what writes the code. When agents write most of a change, all of those fundamentals get easier to skip, and skipping them costs more than it used to.

So that's the lens for everything, the fundamentals haven't changed but the conditions have. I try to start with the concrete problem, a slow request, an incident at 3 am, a change nobody dares to deploy, before getting into tools, because what I want is for people to understand why and buy into it, and the tools come after that. And when something is presented as new, I want to show what older practice it builds on and what is actually different, since a lot of what gets sold as new right now is a good old idea at a new speed.

My most recent talk was about the agentic workflows in PantryPilot, my own product, where agents watch production in Grafana, help review pull requests and write release notes, while a person still decides what actually happens. It was measured on a real codebase, and a lot of what's in the knowledge base started there.

## How a talk gets built now

I don't start a talk from a blank page anymore. I start in a Claude project that holds the knowledge base, and I reason through the topic there, what the audience needs to hear, which story opens it, which numbers I can actually stand behind.

The knowledge base is two documents for now, one on observability and observability of AI, and one on agentic development. What goes into them is things I've picked myself. Photos of slides from events I've been to, like the Grafana talks our team went to at Observability Sessions. Vendor blogs from Grafana Labs and Honeycomb. Articles I think are good, like GitHub's guide to agentic engineering, Microsoft's write-up on how nine engineers built Copilot Cowork, and Maggie Appleton's talk on planning with agents, which I especially like for how she tells the story. And my own work, PantryPilot and the generalised skills from it that I keep in [claude-skills](https://github.com/m0x6A/claude-skills), where the practices come with numbers I've measured myself.

So it's curated in the sense that I've picked everything in it, and opinionated in that everything is written through the lens above and every claim says how far you can lean on it. A vendor survey, a vendor claim, an analyst forecast and something I measured myself are marked differently, and if it's a vendor claim I say so on the slide too. It's easy to put a big number from a press release on a slide and let it sound like a fact.

## Turning it into a graph

The documents are mirrored into the repository where my talks live, and there they are broken into a graph of about 350 nodes, concepts, practices, stories, claims, quotes, hooks and outlines, with typed links between them. Every talk is a node that links to what it uses, so I can see which talks use a certain story, or which practices nothing has used yet. CI fails if a knowledge base document has changed and the graph hasn't, so the two can't drift apart without me noticing.

I asked this morning if there was a more efficient way to store it, and it turned out most of the repository was generated pages for browsing the graph, and every update rewrote dozens of them just to change a backlink. So now only the graph source is committed and the pages are built in CI. That also meant I lost browsing on GitHub, which I wasn't told clearly enough before the change went in, so I'm now deciding whether to publish the pages as a site, since a GitHub Pages site for a private repository on a personal account is public.

## What it gives me

The biggest difference is that a new talk starts from something. There are outlines in the knowledge base already, built only from what's in it, and stories and numbers I've already checked, so most of the work is choosing and shaping instead of searching. The talk itself is still a reveal.js deck with animated diagrams that I build and rehearse, the knowledge base just means I'm not doing the research again every time.

For now I'll keep adding to it as I go to events and read things I think are worth talking about, and the next talk will start from it.
