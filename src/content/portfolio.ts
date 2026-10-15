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
  interests: {
    title: string;
    summary: string;
    items: Array<{
      name: string;
      detail: string;
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
      href?: string;
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
    role: "Systems developer and architect, IT consultant",
    focus: "Observability, quality systems, agentic work and digital sovereignty",
    location: "Remote-first / Sweden",
    availability: "Open to talks and enablement on agentic coding",
    summary:
      "I build .NET and TypeScript systems and the platforms around them. Right now I'm building an observability platform for a Swedish government agency, and helping development teams adopt GitHub Copilot and agentic coding.",
    highlights: [
      "Three enablement assignments on GitHub Copilot and agentic coding",
      "Talks on GitHub Copilot and spec-driven development",
      "OpenTelemetry everywhere: from libraries to Grafana dashboards",
    ],
  },
  background: {
    title: "Experience",
    summary:
      "Developer and architect roles as a consultant since 2021, after two years building and maintaining .NET systems at a software company.",
    entries: [
      {
        period: "2025–",
        title: "Platform developer, government agency",
        description:
          "Part of a team establishing a new observability capability at a government agency, evaluating tools such as Splunk and the Grafana LGTM stack to build a modern, robust observability platform.",
      },
      {
        period: "2025–",
        title: "AI and agentic coding enablement, development teams",
        description:
          "Three enablement assignments helping development teams adopt GitHub Copilot and agentic coding, including spec-driven development, plus several talks on Copilot and spec-driven development.",
      },
      {
        period: "2023–2025",
        title: "Systems developer and architect, government agency",
        description:
          "Restarted a paused microservices project (.NET and Angular) for communication between systems and users, owning its architecture, modernisation and DevOps setup.",
      },
      {
        period: "2022–2023",
        title: "Architect and systems developer, steel industry",
        description:
          "Developed and prioritised work on an existing software platform, wrote requirements for a product-data import and export tool, and mentored junior developers.",
      },
      {
        period: "2021–2023",
        title: "Systems developer, radio remote control",
        description:
          "Moved an access control system for cranes from JavaScript to TypeScript, built a software licensing system and migrated from Jenkins and Jira to Azure DevOps.",
      },
      {
        period: "2019–2021",
        title: "Systems developer, software company",
        description:
          "Maintenance, legacy integration and new development in C# and .NET, with customer contact, sprint planning and support.",
      },
    ],
  },
  interests: {
    title: "Interests",
    summary: "The things I keep coming back to, at work and in side projects.",
    items: [
      {
        name: "Observability",
        detail: "Making systems explain themselves through traces, metrics and logs.",
      },
      {
        name: "Quality systems",
        detail:
          "Tests, specifications and feedback loops that keep software trustworthy as it changes.",
      },
      {
        name: "Agentic work",
        detail:
          "AI agents as real participants in software delivery, guided by clear specifications.",
      },
      {
        name: "Digital sovereignty",
        detail:
          "Keeping control of data and infrastructure through open standards and portable, self-hostable tools.",
      },
    ],
  },
  skills: {
    title: "Skills",
    summary:
      "Mostly .NET and TypeScript, with a growing share of platform, observability and agentic tooling.",
    groups: [
      {
        name: "Application development",
        detail: "Backends, frontends and the architecture between them.",
        items: [".NET / C#", "ASP.NET Core", "TypeScript", "React", "Angular", "SQL"],
      },
      {
        name: "Architecture and messaging",
        detail: "Splitting systems so they stay understandable as they grow.",
        items: ["Microservices", "Modular monoliths", "DDD", "MassTransit", "RabbitMQ", ".NET Aspire"],
      },
      {
        name: "Platform and observability",
        detail: "Running systems and seeing what they do.",
        items: ["Kubernetes", "OpenShift", "Azure DevOps", "GitHub Actions", "OpenTelemetry", "Grafana LGTM", "Splunk"],
      },
      {
        name: "Quality and agentic development",
        detail: "Tests, specifications and agents that work from them.",
        items: ["xUnit", "Testcontainers", "Gherkin", "GitHub Copilot", "Claude Code", "Speckit"],
      },
    ],
  },
  selectedWork: {
    title: "Projects",
    summary:
      "Side projects where I try out the ideas I bring to client work: observability by default, clear domain models and agentic workflows.",
    entries: [
      {
        name: "Dekori",
        summary:
          "Attribute-driven instrumentation for .NET. Decorate classes and methods and get OpenTelemetry traces, metrics, logs and exception capture, with no ActivitySource or Meter plumbing in business code.",
        impact: "open source",
        stack: [".NET 10", "OpenTelemetry", "Castle DynamicProxy"],
        href: "https://github.com/m0x6A/dekori",
      },
      {
        name: "PantryPilot",
        summary:
          "Meal planning on microservices: tracks pantry inventory, suggests weekly menus from what is at home and current store offers, and builds shopping lists.",
        impact: "microservices",
        stack: [".NET 10", "MassTransit", "RabbitMQ", "PostgreSQL", "React", "Aspire"],
      },
      {
        name: "Sagly",
        summary:
          "Store and compare mountain-bike suspension and tyre setups per bike. A modular monolith with DDD and vertical slices, Strava sign-in and OpenTelemetry to Grafana Cloud.",
        impact: "modular monolith",
        stack: ["ASP.NET Core", "EF Core", "Azure SQL", "React", "Testcontainers"],
      },
      {
        name: "HIVE",
        summary:
          "A collective-intelligence framework for GitHub Copilot, where capabilities spawn, merge, split and dissolve as the work needs instead of fixed agent roles. Built on Speckit for spec-driven development.",
        impact: "agentic",
        stack: ["GitHub Copilot", "Custom agents", "Speckit"],
        href: "https://github.com/m0x6A/copilot-hive",
      },
    ],
  },
  contact: {
    title: "Contact",
    summary: "Get in touch about talks, enablement or anything in the interests above.",
    actions: [
      {
        label: "GitHub",
        href: "https://github.com/m0x6a",
        note: "Open-source projects, experiments and agent tooling.",
        external: true,
      },
      {
        label: "Email",
        href: "mailto:hello@m0x6a.dev",
        note: "For talks, enablement and collaboration.",
        external: true,
      },
    ],
  },
};
