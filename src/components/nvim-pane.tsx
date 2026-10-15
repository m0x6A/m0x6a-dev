import Link from "next/link";
import type { ReactNode } from "react";
import { BufferPosition } from "./vim-motions";
import styles from "./nvim-pane.module.css";

export type NvimBuffer = {
  label: string;
  href: string;
  active?: boolean;
};

type NvimPaneProps = {
  buffers: NvimBuffer[];
  fileName: string;
  fileType: string;
  message: ReactNode;
  tone?: "default" | "error";
  children: ReactNode;
};

/** A Neovim window: bufferline, numbered buffer, lualine and command line. */
export function NvimPane({
  buffers,
  fileName,
  fileType,
  message,
  tone = "default",
  children,
}: NvimPaneProps) {
  return (
    <section
      key={fileName}
      className={`${styles.pane} ${styles.focused}`}
      aria-label={`Editor: ${fileName}`}
    >
      <nav className={styles.tabline} aria-label="Posts">
        {buffers.map((buffer) => (
          <Link
            key={buffer.href}
            href={buffer.href}
            className={`${styles.tab} ${buffer.active ? styles.activeTab : ""}`}
            aria-current={buffer.active ? "page" : undefined}
            data-buffer=""
          >
            {buffer.label}
          </Link>
        ))}
      </nav>

      <div id="buffer" className={styles.buffer} tabIndex={0}>
        <div className={styles.text}>{children}</div>
        <div className={styles.tildes} aria-hidden="true" />
      </div>

      <div className={styles.statusline} aria-hidden="true">
        <span className={`${styles.mode} ${tone === "error" ? styles.errorMode : ""}`}>
          {tone === "error" ? "ERROR" : "NORMAL"}
        </span>
        <span className={styles.branch}>⎇ main</span>
        <span className={styles.fileName}>
          {fileName} <span className={styles.readonly}>[RO]</span>
        </span>
        <span className={styles.meta}>{fileType}</span>
        <span className={styles.meta}>utf-8</span>
        <span className={styles.position}>
          <BufferPosition />
        </span>
      </div>

      <p className={`${styles.cmdline} ${tone === "error" ? styles.errorMessage : ""}`}>
        {message}
      </p>
    </section>
  );
}

type ShellPaneProps = {
  label: string;
  cwd?: string;
  children: ReactNode;
};

/** A narrow tmux pane running zsh next to the editor. Hidden on small screens. */
export function ShellPane({ label, cwd, children }: ShellPaneProps) {
  return (
    <aside className={`${styles.pane} ${styles.shell}`} aria-label={label}>
      <div className={styles.shellBody}>
        {children}
        <Prompt cwd={cwd} />
      </div>
    </aside>
  );
}

type PromptProps = {
  cwd?: string;
  command?: string;
};

export function Prompt({ cwd = "~/blog", command }: PromptProps) {
  return (
    <p className={styles.prompt}>
      <span className={styles.cwd}>{cwd}</span>{" "}
      <span className={styles.branchName}>main</span>{" "}
      <span className={styles.chevron}>❯</span>{" "}
      {command ? (
        <span className={styles.command}>{command}</span>
      ) : (
        <span className={styles.cursor} aria-hidden="true" />
      )}
    </p>
  );
}

type OutputRow = {
  label: string;
  value: ReactNode;
  tone?: "ok" | "error";
};

/** Two-column command output, like `key   value`. */
export function ShellOutput({ rows }: { rows: OutputRow[] }) {
  return (
    <dl className={styles.output}>
      {rows.map((row) => (
        <div key={row.label}>
          <dt>{row.label}</dt>
          <dd className={row.tone ? styles[row.tone] : undefined}>{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}

const keys = [
  { label: "j / k", value: "scroll down / up" },
  { label: "gg / G", value: "top / bottom" },
  { label: "H / L", value: "previous / next buffer" },
];

export function KeyHints({ cwd }: { cwd?: string }) {
  return (
    <>
      <Prompt cwd={cwd} command="cat keys.txt" />
      <ShellOutput rows={keys} />
    </>
  );
}

type TableOfContentsProps = {
  cwd?: string;
  fileName: string;
  headings: Array<{ id: string; text: string; depth: 2 | 3 }>;
};

/** `grep '^##'` output that links to each heading in the buffer. */
export function TableOfContents({ cwd, fileName, headings }: TableOfContentsProps) {
  return (
    <>
      <Prompt cwd={cwd} command={`grep '^##' ${fileName}`} />
      {headings.length > 0 ? (
        <nav aria-label="Table of contents">
          <ol className={styles.toc}>
            {headings.map((heading) => (
              <li
                key={heading.id}
                className={heading.depth === 3 ? styles.tocNested : undefined}
              >
                <a href={`#${heading.id}`}>{heading.text}</a>
              </li>
            ))}
          </ol>
        </nav>
      ) : (
        <p className={styles.noMatches}>(no headings)</p>
      )}
    </>
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
