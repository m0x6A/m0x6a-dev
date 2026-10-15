import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogMarkdown } from "@/components/blog-markdown";
import {
  BufferNotice,
  KeyHints,
  NvimPane,
  ShellPane,
  TableOfContents,
} from "@/components/nvim-pane";
import { TmuxShell } from "@/components/tmux-shell";
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
  const buffers = [
    { label: "posts/", href: "/blog" },
    ...(index.status === "ready" ? index.posts : []).map((post) => ({
      label: `${post.slug}.md`,
      href: post.route,
      active: post.slug === slug,
    })),
  ];

  if (result.status === "unavailable") {
    return (
      <TmuxShell activeWindow="blog" statusRight={result.sourceLabel}>
        <NvimPane
          buffers={buffers}
          fileName={fileName}
          fileType="markdown"
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

  return (
    <TmuxShell activeWindow="blog" statusRight={`${fileName} · ${post.publishedLabel}`}>
      <NvimPane
        buffers={buffers}
        fileName={fileName}
        fileType="markdown"
        tone="preview"
        message={`"${fileName}" [preview] ${countLines(post.content)}L`}
      >
        <article className={`nv-preview ${styles.article}`}>
          <header className={`nv-lines ${styles.postHeader}`}>
            <h1>{post.title}</h1>
            <p className={styles.postMeta}>
              <time dateTime={post.publishedAt}>{post.publishedAt}</time>
              <span aria-hidden="true">·</span>
              <span>{readingMinutes(post.content)} min read</span>
            </p>
            <p className={styles.postSummary}>{post.summary}</p>
          </header>
          <BlogMarkdown content={post.content} />
        </article>
      </NvimPane>

      <ShellPane label="Table of contents">
        <TableOfContents fileName={fileName} headings={headings} />
        <KeyHints />
      </ShellPane>
    </TmuxShell>
  );
}
