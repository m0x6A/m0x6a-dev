import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogMarkdown } from "@/components/blog-markdown";
import { SiteShell } from "@/components/site-shell";
import { StatePanel } from "@/components/state-panel";
import { getBlogPost } from "@/lib/blog/posts";
import styles from "../blog.module.css";

type BlogPostPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const revalidate = 300;

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const result = await getBlogPost(slug);

  if (result.status !== "ready") {
    return {
      title: result.status === "not_found" ? "Post not found" : "Blog unavailable",
    };
  }

  return {
    title: result.post.title,
    description: result.post.summary,
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const result = await getBlogPost(slug);

  if (result.status === "not_found") {
    notFound();
  }

  return (
    <SiteShell activeRoute="blog">
      {result.status === "unavailable" ? (
        <StatePanel
          title="Post unavailable"
          description={result.message}
          actions={[
            { href: "/blog", label: "Back to blog" },
            { href: "/", label: "Return home" },
          ]}
          tone="danger"
        />
      ) : (
        <article className={`surface ${styles.article}`}>
          <header className={styles.articleHeader}>
            <p className="eyebrow">cat ./{result.post.slug}.md</p>
            <h1 className={styles.articleTitle}>{result.post.title}</h1>
            <div className={styles.articleMeta}>
              <span>{result.post.publishedLabel}</span>
              <span>{result.sourceLabel}</span>
            </div>
            <p className={styles.articleSummary}>{result.post.summary}</p>
          </header>
          <BlogMarkdown content={result.post.content} />
        </article>
      )}
    </SiteShell>
  );
}
