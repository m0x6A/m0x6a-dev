import Link from "next/link";
import styles from "./state-panel.module.css";

type StateAction = {
  href: string;
  label: string;
  external?: boolean;
};

type StatePanelProps = {
  title: string;
  description: string;
  actions: StateAction[];
  tone?: "default" | "danger";
};

export function StatePanel({
  title,
  description,
  actions,
  tone = "default",
}: StatePanelProps) {
  return (
    <section
      className={`surface ${styles.panel} ${
        tone === "danger" ? styles.danger : ""
      }`}
    >
      <p className="eyebrow">{tone === "danger" ? "state :: unavailable" : "state"}</p>
      <h2>{title}</h2>
      <p className={styles.description}>{description}</p>
      <div className={styles.actions}>
        {actions.map((action) =>
          action.external ? (
            <a
              key={action.label}
              href={action.href}
              className="buttonSecondary"
              target="_blank"
              rel="noopener noreferrer"
            >
              {action.label}
            </a>
          ) : (
            <Link key={action.label} href={action.href} className="buttonSecondary">
              {action.label}
            </Link>
          ),
        )}
      </div>
    </section>
  );
}
