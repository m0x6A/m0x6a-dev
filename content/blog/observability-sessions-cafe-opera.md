---
title: "Team Observe at Observability Sessions"
publishedAt: "2026-11-05"
summary: "All three of us in Team Observe went to Observability Sessions at Café Opera in Stockholm. Here's what we took away about observing AI agents, how far people trust AI to act, and telemetry cost, and why small outings like this are worth doing as a team."
slug: "observability-sessions-cafe-opera"
---

All three of us in Team Observe went to Observability Sessions at Café Opera in Stockholm. It was a set of talks from Grafana Labs about where observability is heading now that AI agents both write a lot of the code and run in production. We took quite a lot of photos of slides, and since then I've gone through them and pulled out the parts that stuck.

## Watching agents

The talk I keep coming back to was Johan Sjölin's on agent observability. The signals we're used to, metrics, logs and traces, tell you if a system is up and how fast it is, but an agent can be up and fast and still give a bad answer. Agents pick tools and decide things at runtime, so the same input can give different output, and you need the whole conversation to understand why it answered the way it did.

What they add on top of ordinary tracing is an evaluation step. Every answer gets scored for things like groundedness, toxicity or leaked personal data, either by another model acting as a judge or by simpler checks like a regex or a JSON schema. One slide said "evals are the new unit tests", which I think is a fair way to put it, even if scoring every answer with an LLM costs tokens as well, and someone has to decide how much of that is worth paying for.

I don't think the idea is completely new. It's the same thing we've always wanted from production, a feedback loop that tells you something is wrong before a user does. What changed is that wrong used to mean an error or a timeout, and now it can also mean an answer that looks fine and isn't.

## How far people trust AI to act

The keynote went the other way, AI that helps operate systems. An alert comes in, an assistant investigates, forms a few hypotheses and checks them against the telemetry, and then suggests a fix or escalates with what it found.

Another talk went through Grafana's 2026 State of Observability survey of 300 IT leaders, and one chart said more than the rest. 85% were comfortable with AI doing read-only investigation and 84% with it recommending a fix, but once it can change code or config that drops to 56%, and only 50% are comfortable with it deploying to production. It's Grafana's own survey so I'd take the exact numbers with some salt, but the shape makes sense to me. People are happy to get help reading and a lot less happy to hand over the keys, and what would raise their trust was explainability and a proven track record.

## Complexity, cost and culture

The last talk summed up cloud native observability as complexity, cost and culture. The cost part had a simple sketch I liked, a cost curve climbing steeply while the value curve barely moves, because past a point more telemetry costs more than it tells you. Grafana's answer is Adaptive Telemetry, and the demo showed trace ingest going from 975 KiB/s down to about 37 KiB/s actually stored. Those are vendor numbers from a demo, but the question behind them, which of our data actually answers questions, is worth asking whatever tool you use.

The culture slide had three overlapping groups, developers who build features, the people who run the platform, and the people who handle incidents. A platform that only one of those groups uses has failed, however good it is.

## Why we went together

The main reason we went was to meet likeminded people, others who spend their days trying to understand what their systems are actually doing. Afterwards we went over the day, what we'd heard and what we thought of it, and the most important thing we brought home was inspiration on how to do things ourselves. Having sat through the same talks also means we have the same examples to point back to when we talk about it later.

Teams often save doing things together for the big things, a conference abroad or an offsite that takes weeks to plan. Those are good, but an event in Stockholm takes almost no planning, and you still come back with new ideas and something you did together. I'd like us to do the small ones more often.

I've collected the slides and notes into a knowledge base we can build on, and next I want to turn some of it into a talk of our own.
