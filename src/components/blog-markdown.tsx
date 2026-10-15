/* eslint-disable @typescript-eslint/no-unused-vars -- react-markdown passes a hast `node` prop that must not reach the DOM. */
import Link from "next/link";
import type { ReactNode } from "react";
import { Children, isValidElement } from "react";
import type { Components } from "react-markdown";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { slugifyHeading } from "@/lib/blog/headings";
import styles from "./blog-markdown.module.css";

function textOf(node: ReactNode): string {
  return Children.toArray(node)
    .map((child) => {
      if (typeof child === "string" || typeof child === "number") {
        return String(child);
      }

      if (isValidElement<{ children?: ReactNode }>(child)) {
        return textOf(child.props.children);
      }

      return "";
    })
    .join("");
}

function isStaticFile(href: string) {
  const path = href.split(/[?#]/)[0];
  return /\.[a-z0-9]+$/i.test(path.split("/").pop() ?? "");
}

const components: Components = {
  h2({ children, node: _node, ...props }) {
    return (
      <h2 id={slugifyHeading(textOf(children))} {...props}>
        {children}
      </h2>
    );
  },
  h3({ children, node: _node, ...props }) {
    return (
      <h3 id={slugifyHeading(textOf(children))} {...props}>
        {children}
      </h3>
    );
  },
  a({ href = "", children, node: _node, ...props }) {
    const isExternal = href.startsWith("http");

    const isRootRelative = href.startsWith("/") && !href.startsWith("//");

    // Root-relative files (e.g. /blog/assets/install-deps.sh) aren't routes, so
    // next/link can't handle them; add the basePath and let the browser download.
    if (isRootRelative && isStaticFile(href)) {
      return (
        <a
          href={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${href}`}
          className={styles.link}
          download
        >
          {children}
        </a>
      );
    }

    // Route root-relative links through next/link so they pick up the basePath.
    if (isRootRelative) {
      return (
        <Link href={href} className={styles.link}>
          {children}
        </Link>
      );
    }

    return (
      <a
        href={href}
        className={styles.link}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
        {...props}
      >
        {children}
      </a>
    );
  },
  // react-markdown wraps block code in <pre>; the code renderer owns that element.
  pre({ children }) {
    return <>{children}</>;
  },
  code({ className, children, node: _node, ...props }) {
    const value = String(children).replace(/\n$/, "");
    const isBlock =
      Boolean(className?.startsWith("language-")) || value.includes("\n");

    if (!isBlock) {
      return (
        <code className={styles.inlineCode} {...props}>
          {children}
        </code>
      );
    }

    const language = className?.replace("language-", "");

    // The outer div is the numbered line; a scrolling element would clip its number.
    return (
      <div>
        <pre className={styles.pre} data-language={language}>
          <code className={className} {...props}>
            {value}
          </code>
        </pre>
      </div>
    );
  },
  table({ children, node: _node, ...props }) {
    return (
      <div>
        <div className={styles.tableScroll}>
          <table {...props}>{children}</table>
        </div>
      </div>
    );
  },
};

type BlogMarkdownProps = {
  content: string;
};

export function BlogMarkdown({ content }: BlogMarkdownProps) {
  return (
    <div className={`nv-lines ${styles.content}`}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
