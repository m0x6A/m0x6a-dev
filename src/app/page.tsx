import Link from "next/link";
import { portfolioContent } from "@/content/portfolio";
import { NvimPane } from "@/components/nvim-pane";
import { TmuxShell } from "@/components/tmux-shell";
import styles from "./page.module.css";

const fileName = "README.md";

export default function Home() {
  const { identity, background, interests, skills, selectedWork, contact } = portfolioContent;
  const [primaryContact] = contact.actions;

  return (
    <TmuxShell activeWindow="home">
      <NvimPane
        path={[{ label: "~", href: "/" }, { label: fileName }]}
        fileName={fileName}
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

        <section id="experience" className="nv-lines" aria-labelledby="experience-title">
          <h2 id="experience-title">{background.title}</h2>
          <p className={styles.lede}>{background.summary}</p>
          {background.entries.map((entry) => (
            <article key={entry.title} className={styles.entry}>
              <p className={styles.period}>[{entry.period}]</p>
              <h3>{entry.title}</h3>
              <p className={styles.body}>{entry.description}</p>
            </article>
          ))}
        </section>

        <section id="interests" className="nv-lines" aria-labelledby="interests-title">
          <h2 id="interests-title">{interests.title}</h2>
          <p className={styles.lede}>{interests.summary}</p>
          {interests.items.map((item) => (
            <article key={item.name} className={styles.entry}>
              <h3>{item.name}</h3>
              <p className={styles.body}>{item.detail}</p>
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
                {entry.href ? (
                  <a
                    className={styles.link}
                    href={entry.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {entry.name}
                  </a>
                ) : (
                  entry.name
                )}{" "}
                <span className={styles.impact}>-- {entry.impact}</span>
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
    </TmuxShell>
  );
}
