# Requirements: Developer portfolio

Present m0x6a's profile, work and contact details through a developer-branded portfolio.

- **Implementation:** `src/app/page.tsx`, `src/content/portfolio.ts`, `src/components/tmux-shell.tsx`, `src/components/nvim-pane.tsx`
- **Decisions:** [ADR-0002](../adr/0002-single-site-shell.md), [ADR-0003](../adr/0003-separate-content-domains.md), [ADR-0011](../adr/0011-tmux-neovim-site-interface.md)

## PORT-1: Portfolio homepage introduces the developer

The system SHALL provide a portfolio homepage for m0x6a that presents Mattias Jonsson's name, developer identity, and dedicated sections for introduction, background, skills, selected work and contact.

**Scenario: Visitor opens the portfolio homepage**
- **WHEN** a visitor loads the site root
- **THEN** the page displays m0x6a and Mattias Jonsson as the primary identity
- **AND** the page includes introduction, background, skills, selected work and contact sections

## PORT-2: Portfolio uses a CLI-inspired visual style

The system SHALL present the portfolio with a developer-focused visual language that includes CLI or terminal-inspired styling cues, while keeping contrast readable, structure semantic and the layout responsive.

**Scenario: Visitor views the homepage**
- **WHEN** the homepage is rendered on a supported viewport
- **THEN** the interface includes CLI or terminal-inspired styling elements
- **AND** the content stays readable and navigable, and the theme causes no horizontal scrolling

## PORT-3: Portfolio provides site navigation and outbound actions

The system SHALL provide primary navigation to the blog, and links for contact or external developer profiles relevant to m0x6a.

**Scenario: Visitor wants to continue exploring**
- **WHEN** a visitor uses the primary navigation or action links on the portfolio
- **THEN** the interface provides a route to the blog
- **AND** the interface provides outbound links for contact or developer profiles
