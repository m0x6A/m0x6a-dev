import Link from "next/link";
import type { ReactNode } from "react";
import { BufferPosition } from "./vim-motions";
import styles from "./nvim-pane.module.css";

export type PathSegment = {
  label: string;
  href?: string;
};

type NvimPaneProps = {
  /** Winbar breadcrumb; the last segment is the open buffer. */
  path: PathSegment[];
  fileName: string;
  message: ReactNode;
  tone?: "default" | "error" | "preview";
  /** Controls shown at the right end of the winbar. */
  actions?: ReactNode;
  children: ReactNode;
};

/** A Neovim window: winbar, numbered buffer, lualine and command line. */
export function NvimPane({
  path,
  fileName,
  message,
  tone = "default",
  actions,
  children,
}: NvimPaneProps) {
  return (
    <section key={fileName} className={styles.pane} aria-label={`Editor: ${fileName}`}>
      <div className={styles.winbar}>
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <ol>
            {path.map((segment, index) => {
              const isLast = index === path.length - 1;

              return (
                <li key={`${segment.label}-${index}`}>
                  {segment.href && !isLast ? (
                    <Link href={segment.href}>{segment.label}</Link>
                  ) : (
                    <span aria-current={isLast ? "page" : undefined}>{segment.label}</span>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>
        {actions ? <div className={styles.winbarActions}>{actions}</div> : null}
      </div>

      <div id="buffer" className={styles.buffer}>
        <div className={styles.text}>{children}</div>
        <div className={styles.tildes} aria-hidden="true" />
      </div>

      <div className={styles.statusline} aria-hidden="true">
        {tone === "preview" ? (
          <>
            <span className={`${styles.mode} ${styles.previewMode} preview-only`}>PREVIEW</span>
            <span className={`${styles.mode} source-only`}>NORMAL</span>
          </>
        ) : (
          <span className={`${styles.mode} ${tone === "error" ? styles.errorMode : ""}`}>
            {tone === "error" ? "ERROR" : "NORMAL"}
          </span>
        )}
        <span className={styles.fileName}>{fileName}</span>
        <span className={styles.position}>
          <BufferPosition />
        </span>
      </div>

      <div className={`${styles.cmdline} ${tone === "error" ? styles.errorMessage : ""}`}>
        <p className={styles.message}>{message}</p>
        <p className={styles.helpHint} aria-hidden="true">
          ? for keys
        </p>
      </div>
    </section>
  );
}

type TableOfContentsProps = {
  fileName: string;
  headings: Array<{ id: string; text: string; depth: 2 | 3 }>;
};

/** Collapsible `grep '^##'` output that links to each heading in the buffer. */
export function TableOfContents({ fileName, headings }: TableOfContentsProps) {
  if (headings.length < 3) {
    return null;
  }

  return (
    <details className={`nv-lines ${styles.tocBlock}`}>
      <summary>
        <span className={styles.tocCommand}>grep &apos;^##&apos; {fileName}</span>{" "}
        <span className={styles.tocCount}>({headings.length})</span>
      </summary>
      <nav aria-label="Table of contents">
        <ol className={styles.toc}>
          {headings.map((heading) => (
            <li key={heading.id} className={heading.depth === 3 ? styles.tocNested : undefined}>
              <a href={`#${heading.id}`}>{heading.text}</a>
            </li>
          ))}
        </ol>
      </nav>
    </details>
  );
}

type BufferNavProps = {
  prev?: { href: string; label: string };
  next?: { href: string; label: string };
};

/** `:bprev` / `:bnext` links at the end of a post. H and L click them. */
export function BufferNav({ prev, next }: BufferNavProps) {
  if (!prev && !next) {
    return null;
  }

  return (
    <nav className={`nv-lines ${styles.bufferNav}`} aria-label="Posts">
      <p>
        {prev ? (
          <Link href={prev.href} className={styles.bufferLink} data-buffer-prev="">
            <span className={styles.noticeCommand}>:bprev</span> ← {prev.label}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link href={next.href} className={styles.bufferLink} data-buffer-next="">
            {next.label} → <span className={styles.noticeCommand}>:bnext</span>
          </Link>
        ) : null}
      </p>
    </nav>
  );
}

type BufferNoticeProps = {
  title: string;
  description: string;
  actions: Array<{ href: string; label: string; command: string }>;
};

/** Error and empty states rendered as buffer text instead of a card. */
export function BufferNotice({ title, description, actions }: BufferNoticeProps) {
  return (
    <div className="nv-lines">
      <h1>{title}</h1>
      <p className={styles.noticeText}>{description}</p>
      {actions.map((action) => (
        <p key={action.href}>
          <Link href={action.href} className={styles.noticeAction}>
            <span className={styles.noticeCommand}>{action.command}</span> {action.label}
          </Link>
        </p>
      ))}
    </div>
  );
}
