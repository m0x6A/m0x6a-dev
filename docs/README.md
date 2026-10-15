# Documentation

Project documentation for the m0x6a portfolio and blog.

| Section | What lives there |
| --- | --- |
| [`architecture/`](architecture/) | How the system is built today: components, data flow, deployment. |
| [`requirements/`](requirements/) | Behavioural requirements per capability, with acceptance scenarios. |
| [`adr/`](adr/) | Architecture Decision Records: why the system looks the way it does. |

## Index

- Architecture
  - [Overview](architecture/overview.md)
- Requirements
  - [Developer portfolio](requirements/developer-portfolio.md)
  - [Git-backed blog](requirements/git-backed-blog.md)
- [Decision log](adr/README.md)

## Conventions

- **Architecture docs describe the present.** Update them in the same change that alters the code they describe.
- **Requirements describe expected behaviour**, using `SHALL` statements and `WHEN / THEN` scenarios. Each requirement links to the ADRs that shape it.
- **ADRs are append-only.** Once an ADR is `Accepted`, don't rewrite its decision. Write a new ADR that supersedes it and update the old one's status line. See [adr/README.md](adr/README.md) for the process.
