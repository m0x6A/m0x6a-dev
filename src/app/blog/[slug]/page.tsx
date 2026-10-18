import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogMarkdown } from "@/components/blog-markdown";
import {
  BufferNav,
  BufferNotice,
  NvimPane,
  TableOfContents,
} from "@/components/nvim-pane";
import { TmuxShell } from "@/components/tmux-shell";
import { ViewToggle } from "@/components/view-toggle";
import { countLines, extractHeadings, readingMinutes } from "@/lib/blog/headings";
import { getBlogIndex, getBlogPost } from "@/lib/blog/posts";
import styles from "../blog.module.css";

type BlogPostPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

// Static export: every post is rendered at build time and unknown slugs fall
// through to the host's 404 page.
export const dynamicParams = false;

// `output: "export"` rejects an empty param list, so an empty or unavailable
// source still renders one placeholder route that resolves to not-found.
const PLACEHOLDER_SLUG = "_";

export async function generateStaticParams() {
  const result = await getBlogIndex();

  if (result.status !== "ready") {
    return [{ slug: PLACEHOLDER_SLUG }];
  }

  return result.posts.map((post) => ({ slug: post.slug }));
}

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
  const [result, index] = await Promise.all([getBlogPost(slug), getBlogIndex()]);

  if (result.status === "not_found") {
    notFound();
  }

  const fileName = `${slug}.md`;
  const path = [
    { label: "~", href: "/" },
    { label: "blog", href: "/blog" },
    { label: fileName },
  ];

  if (result.status === "unavailable") {
    return (
      <TmuxShell activeWindow="blog">
        <NvimPane
          path={path}
          fileName={fileName}
          tone="error"
          message={`E484: Can't open file ${fileName}`}
        >
          <BufferNotice
            title="Post unavailable"
            description={result.message}
            actions={[
              { href: "/blog", label: "Back to blog", command: ":e posts/" },
              { href: "/", label: "Return home", command: ":q" },
            ]}
          />
        </NvimPane>
      </TmuxShell>
    );
  }

  const { post } = result;
  const headings = extractHeadings(post.content);
  const lineCount = countLines(post.content);
  // The index is newest first: the previous buffer is the older post.
  const posts = index.status === "ready" ? index.posts : [];
  const position = posts.findIndex((entry) => entry.slug === slug);
  const older = position === -1 ? undefined : posts[position + 1];
  const newer = position > 0 ? posts[position - 1] : undefined;

  return (
    <TmuxShell activeWindow="blog">
      <NvimPane
        path={path}
        fileName={fileName}
        tone="preview"
        actions={<ViewToggle />}
        message={
          <>
            <span className="preview-only">{`"${fileName}" [preview] ${lineCount}L`}</span>
            <span className="source-only">{`"${fileName}" [readonly] ${lineCount}L`}</span>
          </>
        }
      >
        <article className={`nv-preview ${styles.article}`}>
          <header className={`nv-lines ${styles.postHeader} preview-only`}>
            <h1>{post.title}</h1>
            <p className={styles.postMeta}>
              <time dateTime={post.publishedAt}>{post.publishedAt}</time>
              <span aria-hidden="true">·</span>
              <span>{readingMinutes(post.content)} min read</span>
            </p>
            <p className={styles.postSummary}>{post.summary}</p>
          </header>
          <header className={`nv-lines ${styles.frontmatter} source-only`}>
            <p className={styles.fence} aria-hidden="true">
              ---
            </p>
            <p>
              <span className={styles.yamlKey}>publishedAt:</span>{" "}
              <time dateTime={post.publishedAt} className={styles.yamlValue}>
                {post.publishedAt}
              </time>
            </p>
            <p>
              <span className={styles.yamlKey}>summary:</span>{" "}
              <span className={styles.yamlString}>&quot;{post.summary}&quot;</span>
            </p>
            <p className={styles.fence} aria-hidden="true">
              ---
            </p>
            <h1>{post.title}</h1>
          </header>
          <TableOfContents fileName={fileName} headings={headings} />
          <BlogMarkdown content={post.content} />
          <BufferNav
            prev={older ? { href: older.route, label: `${older.slug}.md` } : undefined}
            next={newer ? { href: newer.route, label: `${newer.slug}.md` } : undefined}
          />
        </article>
      </NvimPane>
    </TmuxShell>
  );
}
