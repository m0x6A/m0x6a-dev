import Link from "next/link";
import type { Metadata } from "next";
import {
  BufferNotice,
  KeyHints,
  NvimPane,
  Prompt,
  ShellOutput,
  ShellPane,
} from "@/components/nvim-pane";
import { TmuxShell } from "@/components/tmux-shell";
import { getBlogIndex } from "@/lib/blog/posts";
import styles from "./blog.module.css";

export const metadata: Metadata = {
  title: "Blog",
  description: "Git-backed notes and build logs from m0x6a.",
};

export default async function BlogPage() {
  const result = await getBlogIndex();
  const posts = result.status === "ready" ? result.posts : [];
  const buffers = [
    { label: "posts/", href: "/blog", active: true },
    ...posts.map((post) => ({ label: `${post.slug}.md`, href: post.route })),
  ];

  return (
    <TmuxShell activeWindow="blog" statusRight={result.sourceLabel}>
      <NvimPane
        buffers={buffers}
        fileName="posts/"
        fileType="oil"
        tone={result.status === "unavailable" ? "error" : "default"}
        message={
          result.status === "unavailable"
            ? `E484: Can't open directory posts/`
            : `"posts/" ${posts.length} ${posts.length === 1 ? "file" : "files"}`
        }
      >
        {result.status === "ready" ? (
          <>
            <header className="nv-lines">
              <p className={styles.comment}>-- ~/blog/posts, newest first</p>
              <h1>
                Git-backed notes<span className={styles.cursor} aria-hidden="true" />
              </h1>
              <p className={styles.lede}>
                Short essays and build logs sourced from Markdown, with the loading work
                kept on the server where repository concerns belong.
              </p>
            </header>

            <ol className={`nv-lines ${styles.entries}`}>
              {posts.map((post) => (
                <li key={post.slug}>
                  <article className={styles.entry}>
                    <p className={styles.entryMeta}>
                      <span className={styles.permissions} aria-hidden="true">
                        -rw-r--r--
                      </span>
                      <time dateTime={post.publishedAt}>{post.publishedAt}</time>
                      <span className={styles.fileName}>{post.slug}.md</span>
                    </p>
                    <h2 className={styles.entryTitle}>
                      <Link href={post.route}>{post.title}</Link>
                    </h2>
                    <p className={styles.entrySummary}>{post.summary}</p>
                  </article>
                </li>
              ))}
            </ol>
          </>
        ) : (
          <BufferNotice
            title={result.status === "empty" ? "No posts yet" : "Blog source unavailable"}
            description={result.message}
            actions={[
              { href: "/blog", label: "Retry blog", command: ":e posts/" },
              { href: "/", label: "Return home", command: ":q" },
            ]}
          />
        )}
      </NvimPane>

      <ShellPane label="Blog source">
        <Prompt command="blog status" />
        <ShellOutput
          rows={[
            { label: "source", value: result.sourceLabel },
            {
              label: "status",
              value: result.status.replace("_", " "),
              tone: result.status === "ready" ? "ok" : "error",
            },
            { label: "posts", value: posts.length },
          ]}
        />
        <KeyHints />
      </ShellPane>
    </TmuxShell>
  );
}
