import Link from "next/link";
import type { ReactNode } from "react";
import { portfolioContent } from "@/content/portfolio";
import { VimMotions } from "./vim-motions";
import styles from "./tmux-shell.module.css";

type TmuxShellProps = {
  activeWindow: "home" | "blog";
  statusRight: string;
  children: ReactNode;
};

const windows = [
  { key: "home", label: "home", href: "/" },
  { key: "blog", label: "blog", href: "/blog" },
] as const;

export function TmuxShell({ activeWindow, statusRight, children }: TmuxShellProps) {
  const profileLink = portfolioContent.contact.actions.find((action) => action.external);

  return (
    <div className={styles.tmux}>
      <a href="#buffer" className={styles.skipLink}>
        Skip to content
      </a>

      <main className={styles.panes}>{children}</main>

      <footer className={styles.statusBar}>
        <span className={styles.session}>m0x6a</span>
        <nav className={styles.windows} aria-label="Primary">
          {windows.map((entry, index) => {
            const isActive = entry.key === activeWindow;

            return (
              <Link
                key={entry.key}
                href={entry.href}
                className={`${styles.window} ${isActive ? styles.activeWindow : ""}`}
                aria-current={isActive ? "page" : undefined}
              >
                {index}:{entry.label}
                {isActive ? "*" : ""}
              </Link>
            );
          })}
          {profileLink ? (
            <a
              href={profileLink.href}
              className={styles.window}
              target="_blank"
              rel="noopener noreferrer"
            >
              {windows.length}:{profileLink.label.toLowerCase()}
            </a>
          ) : null}
        </nav>
        <span className={styles.statusRight}>{statusRight}</span>
        <span className={styles.host}>m0x6a.dev</span>
      </footer>

      <VimMotions />
    </div>
  );
}
