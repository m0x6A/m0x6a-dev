import type { Components } from "react-markdown";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import styles from "./blog-markdown.module.css";

const components: Components = {
  a({ href = "", children, ...props }) {
    const isExternal = href.startsWith("http");

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
  code({ className, children, ...props }) {
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

    return (
      <pre className={styles.pre}>
        <code className={className} {...props}>
          {value}
        </code>
      </pre>
    );
  },
};

type BlogMarkdownProps = {
  content: string;
};

export function BlogMarkdown({ content }: BlogMarkdownProps) {
  return (
    <div className={styles.content}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
