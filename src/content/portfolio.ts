export type PortfolioContent = {
  identity: {
    name: string;
    alias: string;
    role: string;
    focus: string;
    location: string;
    availability: string;
    summary: string;
    highlights: string[];
  };
  background: {
    title: string;
    summary: string;
    entries: Array<{
      period: string;
      title: string;
      description: string;
    }>;
  };
  skills: {
    title: string;
    summary: string;
    groups: Array<{
      name: string;
      detail: string;
      items: string[];
    }>;
  };
  selectedWork: {
    title: string;
    summary: string;
    entries: Array<{
      name: string;
      summary: string;
      impact: string;
      stack: string[];
    }>;
  };
  contact: {
    title: string;
    summary: string;
    actions: Array<{
      label: string;
      href: string;
      note: string;
      external: boolean;
    }>;
  };
};

export const portfolioContent: PortfolioContent = {
  identity: {
    name: "Mattias Jonsson",
    alias: "m0x6a",
    role: "Developer building dependable web and automation systems",
    focus: "TypeScript, product delivery, and secure-by-default workflows",
    location: "Remote-first / Sweden",
    availability: "Open to thoughtful product and platform collaborations",
    summary:
      "I build software with a bias toward clear interfaces, predictable delivery, and tooling that respects the people maintaining it.",
    highlights: [
      "CLI-inspired interfaces with accessible, content-first design",
      "Small systems that stay understandable as they grow",
      "Git-native publishing and automation workflows",
    ],
  },
  background: {
    title: "Background",
    summary:
      "The work is a mix of product delivery, developer experience, and the glue that makes systems easier to ship and support.",
    entries: [
      {
        period: "now",
        title: "Building developer-centric experiences",
        description:
          "Designing products and internal tools that reduce friction, surface meaningful status, and stay readable under change.",
      },
      {
        period: "ongoing",
        title: "Automation-first delivery mindset",
        description:
          "Preferring reliable scripts, explicit contracts, and small operational feedback loops over brittle handoffs.",
      },
      {
        period: "always",
        title: "Security and maintainability by default",
        description:
          "Keeping interfaces narrow, states explicit, and dependencies honest so failure modes are easier to reason about.",
      },
    ],
  },
  skills: {
    title: "Skills",
    summary:
      "A practical toolkit centered on modern TypeScript delivery, backend integrations, and developer-friendly systems thinking.",
    groups: [
      {
        name: "Application delivery",
        detail: "Building polished product surfaces that feel fast, clear, and dependable.",
        items: ["Next.js", "TypeScript", "React", "Design systems"],
      },
      {
        name: "Platform and automation",
        detail: "Reducing operational drag with composable workflows and repeatable interfaces.",
        items: ["GitHub Actions", "CLI tooling", "API integrations", "Release flows"],
      },
      {
        name: "Engineering habits",
        detail: "Keeping architecture small enough to understand and resilient enough to extend.",
        items: ["Testing", "Observability", "Documentation", "Secure defaults"],
      },
    ],
  },
  selectedWork: {
    title: "Selected work",
    summary:
      "A few representative themes that show up repeatedly in how I build and shape software.",
    entries: [
      {
        name: "Content-driven developer sites",
        summary:
          "Pairing lightweight publishing workflows with distinctive interfaces so the content stays easy to ship.",
        impact: "brand + publishing",
        stack: ["Markdown", "Routing", "Structured content"],
      },
      {
        name: "Automation surfaces for teams",
        summary:
          "Turning repeated delivery steps into scripts and adapters that are easier to trust, review, and improve.",
        impact: "ops + velocity",
        stack: ["CI/CD", "Shell", "Integrations"],
      },
      {
        name: "Readable app architecture",
        summary:
          "Splitting domain logic, rendering, and content loading so feature work can move without tangling the whole app.",
        impact: "maintainability",
        stack: ["Type safety", "Modular services", "Testing"],
      },
      {
        name: "Error states that stay humane",
        summary:
          "Making failure modes visible without collapsing the rest of the experience or masking real problems.",
        impact: "resilience",
        stack: ["Fallback UI", "State modeling", "Recovery paths"],
      },
    ],
  },
  contact: {
    title: "Contact",
    summary:
      "The starter profile uses direct links that are easy to replace with preferred real-world contact endpoints.",
    actions: [
      {
        label: "GitHub",
        href: "https://github.com/m0x6a",
        note: "Follow experiments, repositories, and ongoing build work.",
        external: true,
      },
      {
        label: "Email",
        href: "mailto:hello@m0x6a.dev",
        note: "Seed contact address for project intros, collaboration notes, and async follow-up.",
        external: true,
      },
    ],
  },
};
