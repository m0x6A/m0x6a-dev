import Link from "next/link";
import { portfolioContent } from "@/content/portfolio";
import { SiteShell } from "@/components/site-shell";
import styles from "./page.module.css";

export default function Home() {
  const { identity, background, skills, selectedWork, contact } = portfolioContent;
  const [primaryContact] = contact.actions;

  return (
    <SiteShell activeRoute="home">
      <section className={`surface ${styles.hero}`}>
        <div className={styles.heroCopy}>
          <p className={`eyebrow ${styles.prompt}`}>whoami</p>
          <h1 className={styles.title}>
            {identity.alias} / {identity.name}
          </h1>
          <p className={styles.lede}>{identity.summary}</p>
          <div className={styles.actionRow}>
            <Link href="/blog" className="button">
              Open blog
            </Link>
            <a
              className="buttonSecondary"
              href={primaryContact.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {primaryContact.label}
            </a>
          </div>
        </div>
        <aside className={`surface ${styles.heroPanel}`}>
          <p className={`eyebrow ${styles.prompt}`}>status</p>
          <dl className={styles.statusGrid}>
            <div>
              <dt className={styles.statusLabel}>role</dt>
              <dd>{identity.role}</dd>
            </div>
            <div>
              <dt className={styles.statusLabel}>focus</dt>
              <dd>{identity.focus}</dd>
            </div>
            <div>
              <dt className={styles.statusLabel}>location</dt>
              <dd>{identity.location}</dd>
            </div>
            <div>
              <dt className={styles.statusLabel}>availability</dt>
              <dd>{identity.availability}</dd>
            </div>
          </dl>
          <ul className={styles.highlightList}>
            {identity.highlights.map((highlight) => (
              <li key={highlight}>{highlight}</li>
            ))}
          </ul>
        </aside>
      </section>

      <section id="background" className={`surface ${styles.section}`}>
        <div className={styles.sectionHeader}>
          <p className="eyebrow">cat background.md</p>
          <h2>{background.title}</h2>
          <p>{background.summary}</p>
        </div>
        <div className={styles.timeline}>
          {background.entries.map((entry) => (
            <article key={entry.title} className={`surface ${styles.timelineCard}`}>
              <p className={styles.timelinePeriod}>{entry.period}</p>
              <h3>{entry.title}</h3>
              <p>{entry.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="skills" className={`surface ${styles.section}`}>
        <div className={styles.sectionHeader}>
          <p className="eyebrow">ls skills/</p>
          <h2>{skills.title}</h2>
          <p>{skills.summary}</p>
        </div>
        <div className={styles.skillGrid}>
          {skills.groups.map((group) => (
            <article key={group.name} className={`surface ${styles.skillCard}`}>
              <h3>{group.name}</h3>
              <p>{group.detail}</p>
              <ul className={styles.chipList}>
                {group.items.map((item) => (
                  <li key={item} className={styles.chip}>
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section id="work" className={`surface ${styles.section}`}>
        <div className={styles.sectionHeader}>
          <p className="eyebrow">tree ./selected-work</p>
          <h2>{selectedWork.title}</h2>
          <p>{selectedWork.summary}</p>
        </div>
        <div className={styles.workGrid}>
          {selectedWork.entries.map((entry) => (
            <article key={entry.name} className={`surface ${styles.workCard}`}>
              <div className={styles.workHeading}>
                <h3>{entry.name}</h3>
                <span className={styles.impact}>{entry.impact}</span>
              </div>
              <p>{entry.summary}</p>
              <ul className={styles.chipList}>
                {entry.stack.map((item) => (
                  <li key={item} className={styles.chip}>
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section id="contact" className={`surface ${styles.section}`}>
        <div className={styles.sectionHeader}>
          <p className="eyebrow">echo $CONTACT</p>
          <h2>{contact.title}</h2>
          <p>{contact.summary}</p>
        </div>
        <div className={styles.contactGrid}>
          {contact.actions.map((action) => (
            <article key={action.label} className={`surface ${styles.contactCard}`}>
              <div>
                <h3>{action.label}</h3>
                <p>{action.note}</p>
              </div>
              <a
                className={styles.contactLink}
                href={action.href}
                target={action.external ? "_blank" : undefined}
                rel={action.external ? "noopener noreferrer" : undefined}
              >
                {action.href.replace("mailto:", "")}
              </a>
            </article>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
