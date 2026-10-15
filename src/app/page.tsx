import Link from "next/link";
import { portfolioContent } from "@/content/portfolio";
import {
  KeyHints,
  NvimPane,
  Prompt,
  ShellOutput,
  ShellPane,
  TableOfContents,
} from "@/components/nvim-pane";
import { TmuxShell } from "@/components/tmux-shell";
import styles from "./page.module.css";

const fileName = "README.md";

export default function Home() {
  const { identity, background, skills, selectedWork, contact } = portfolioContent;
  const [primaryContact] = contact.actions;
  const sections = [
    { id: "background", text: background.title, depth: 2 as const },
    { id: "skills", text: skills.title, depth: 2 as const },
    { id: "work", text: selectedWork.title, depth: 2 as const },
    { id: "contact", text: contact.title, depth: 2 as const },
  ];

  return (
    <TmuxShell activeWindow="home" statusRight={`${identity.alias} · ${identity.location}`}>
      <NvimPane
        buffers={[{ label: fileName, href: "/", active: true }]}
        fileName={fileName}
        fileType="markdown"
        message={`"${fileName}" [readonly] ${identity.alias}@portfolio`}
      >
        <header className={`nv-lines ${styles.frontmatter}`}>
          <p className={styles.fence} aria-hidden="true">
            ---
          </p>
          {[
            ["role", identity.role],
            ["focus", identity.focus],
            ["location", identity.location],
            ["availability", identity.availability],
          ].map(([key, value]) => (
            <p key={key}>
              <span className={styles.yamlKey}>{key}:</span>{" "}
              <span className={styles.yamlString}>&quot;{value}&quot;</span>
            </p>
          ))}
          <p className={styles.fence} aria-hidden="true">
            ---
          </p>
          <h1>
            {identity.alias} / {identity.name}
            <span className={styles.cursor} aria-hidden="true" />
          </h1>
          <p className={styles.lede}>{identity.summary}</p>
          <ul className={styles.highlights}>
            {identity.highlights.map((highlight) => (
              <li key={highlight}>{highlight}</li>
            ))}
          </ul>
          <p className={styles.actions}>
            <Link href="/blog" className={styles.link}>
              :e ~/blog/posts/
            </Link>
            <a
              className={styles.link}
              href={primaryContact.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              :!open {primaryContact.label.toLowerCase()}
            </a>
          </p>
        </header>

        <section id="background" className="nv-lines" aria-labelledby="background-title">
          <h2 id="background-title">{background.title}</h2>
          <p className={styles.lede}>{background.summary}</p>
          {background.entries.map((entry) => (
            <article key={entry.title} className={styles.entry}>
              <p className={styles.period}>[{entry.period}]</p>
              <h3>{entry.title}</h3>
              <p className={styles.body}>{entry.description}</p>
            </article>
          ))}
        </section>

        <section id="skills" className="nv-lines" aria-labelledby="skills-title">
          <h2 id="skills-title">{skills.title}</h2>
          <p className={styles.lede}>{skills.summary}</p>
          {skills.groups.map((group) => (
            <article key={group.name} className={styles.entry}>
              <h3>{group.name}</h3>
              <p className={styles.body}>{group.detail}</p>
              <ul className={styles.chips}>
                {group.items.map((item) => (
                  <li key={item}>
                    <code>{item}</code>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </section>

        <section id="work" className="nv-lines" aria-labelledby="work-title">
          <h2 id="work-title">{selectedWork.title}</h2>
          <p className={styles.lede}>{selectedWork.summary}</p>
          {selectedWork.entries.map((entry) => (
            <article key={entry.name} className={styles.entry}>
              <h3>
                {entry.name} <span className={styles.impact}>-- {entry.impact}</span>
              </h3>
              <p className={styles.body}>{entry.summary}</p>
              <ul className={styles.chips}>
                {entry.stack.map((item) => (
                  <li key={item}>
                    <code>{item}</code>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </section>

        <section id="contact" className="nv-lines" aria-labelledby="contact-title">
          <h2 id="contact-title">{contact.title}</h2>
          <p className={styles.lede}>{contact.summary}</p>
          {contact.actions.map((action) => (
            <article key={action.label} className={styles.entry}>
              <h3>{action.label}</h3>
              <p className={styles.body}>{action.note}</p>
              <p>
                <a
                  className={styles.link}
                  href={action.href}
                  target={action.external ? "_blank" : undefined}
                  rel={action.external ? "noopener noreferrer" : undefined}
                >
                  {action.href.replace("mailto:", "")}
                </a>
              </p>
            </article>
          ))}
        </section>
      </NvimPane>

      <ShellPane label="About" cwd="~">
        <Prompt cwd="~" command="whoami" />
        <ShellOutput
          rows={[
            { label: "name", value: identity.name },
            { label: "alias", value: identity.alias },
            { label: "where", value: identity.location },
          ]}
        />
        <TableOfContents cwd="~" fileName={fileName} headings={sections} />
        <KeyHints cwd="~" />
      </ShellPane>
    </TmuxShell>
  );
}
