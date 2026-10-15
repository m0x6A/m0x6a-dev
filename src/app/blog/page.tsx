import Link from "next/link";
import type { Metadata } from "next";
import { SiteShell } from "@/components/site-shell";
import { StatePanel } from "@/components/state-panel";
import { getBlogIndex } from "@/lib/blog/posts";
import styles from "./blog.module.css";

export const metadata: Metadata = {
  title: "Blog",
  description: "Git-backed notes and build logs from m0x6a.",
};

export default async function BlogPage() {
  const result = await getBlogIndex();

  return (
    <SiteShell activeRoute="blog">
      <section className={`surface ${styles.hero}`}>
        <div>
          <p className="eyebrow">ls ./posts</p>
          <h1 className={styles.title}>Git-backed notes</h1>
          <p className={styles.lede}>
            Short essays and build logs sourced from Markdown, with the loading work kept
            on the server where repository concerns belong.
          </p>
        </div>
        <dl className={`surface ${styles.sourcePanel}`}>
          <div>
            <dt className={styles.metaLabel}>source</dt>
            <dd>{result.sourceLabel}</dd>
          </div>
          <div>
            <dt className={styles.metaLabel}>status</dt>
            <dd>{result.status.replace("_", " ")}</dd>
          </div>
        </dl>
      </section>

      {result.status === "ready" ? (
        <ol className={styles.postList}>
          {result.posts.map((post) => (
            <li key={post.slug}>
              <article className={`surface ${styles.postCard}`}>
                <p className={styles.postMeta}>{post.publishedLabel}</p>
                <h2>{post.title}</h2>
                <p className={styles.postSummary}>{post.summary}</p>
                <Link href={post.route} className={styles.postLink}>
                  Read article
                </Link>
              </article>
            </li>
          ))}
        </ol>
      ) : (
        <StatePanel
          title={result.status === "empty" ? "No posts yet" : "Blog source unavailable"}
          description={result.message}
          actions={[
            { href: "/", label: "Return home" },
            { href: "/blog", label: "Retry blog" },
          ]}
          tone={result.status === "unavailable" ? "danger" : "default"}
        />
      )}
    </SiteShell>
  );
}
