import Link from "next/link";
import type { ReactNode } from "react";
import { portfolioContent } from "@/content/portfolio";
import styles from "./site-shell.module.css";

type SiteShellProps = {
  activeRoute: "home" | "blog";
  children: ReactNode;
};

export function SiteShell({ activeRoute, children }: SiteShellProps) {
  const profileLink = portfolioContent.contact.actions.find((action) => action.external);

  return (
    <div className={styles.shell}>
      <div className={styles.inner}>
        <header className={`surface ${styles.header}`}>
          <div className={styles.headerBar}>
            <div className={styles.brandBlock}>
              <p className="eyebrow">m0x6a@portfolio:~</p>
              <div>
                <h2 className={styles.brandName}>Mattias Jonsson / m0x6a</h2>
                <p className={styles.brandMeta}>
                  Developer-focused portfolio, notes, and Git-backed writing.
                </p>
              </div>
            </div>
            <div className={styles.headerActions}>
              <nav className={styles.nav} aria-label="Primary">
                <Link
                  href="/"
                  className={`${styles.navLink} ${
                    activeRoute === "home" ? styles.active : ""
                  }`}
                >
                  Home
                </Link>
                <Link
                  href="/blog"
                  className={`${styles.navLink} ${
                    activeRoute === "blog" ? styles.active : ""
                  }`}
                >
                  Blog
                </Link>
                {profileLink ? (
                  <a
                    href={profileLink.href}
                    className={styles.navLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {profileLink.label}
                  </a>
                ) : null}
              </nav>
              <div className={styles.statusPill}>
                <span className={styles.statusDot} />
                CLI-first, content-driven
              </div>
            </div>
          </div>
        </header>

        <main className={styles.main}>{children}</main>

        <footer className={styles.footer}>
          <p className={styles.footerCopy}>
            Built with Next.js, TypeScript, and Markdown-first publishing.
          </p>
          <Link href="/blog" className={styles.footerLink}>
            tail -f /blog
          </Link>
        </footer>
      </div>
    </div>
  );
}
