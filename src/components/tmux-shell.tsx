import Link from "next/link";
import type { ReactNode } from "react";
import { portfolioContent } from "@/content/portfolio";
import { KeyHelp, VimMotions } from "./vim-motions";
import styles from "./tmux-shell.module.css";

type TmuxShellProps = {
  activeWindow: "home" | "blog";
  children: ReactNode;
};

const windows = [
  { key: "home", label: "home", href: "/" },
  { key: "blog", label: "blog", href: "/blog" },
] as const;

/** The tmux status bar sits at the top and is the site's only primary nav. */
export function TmuxShell({ activeWindow, children }: TmuxShellProps) {
  const profileLink = portfolioContent.contact.actions.find((action) => action.external);

  return (
    <div className={styles.tmux}>
      <a href="#buffer" className={styles.skipLink}>
        Skip to content
      </a>

      <header className={styles.statusBar}>
        <Link href="/" className={styles.session}>
          m0x6a
        </Link>
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
                <span className={styles.index} aria-hidden="true">
                  {index}:
                </span>
                {entry.label}
                {isActive ? (
                  <span className={styles.index} aria-hidden="true">
                    *
                  </span>
                ) : null}
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
              <span className={styles.index} aria-hidden="true">
                {windows.length}:
              </span>
              {profileLink.label.toLowerCase()}
              <span className={styles.external} aria-hidden="true">
                ↗
              </span>
            </a>
          ) : null}
        </nav>
        <span className={styles.host}>m0x6a.dev</span>
      </header>

      <main className={styles.panes}>{children}</main>

      <VimMotions />
      <KeyHelp />
    </div>
  );
}
