import { BufferNotice, NvimPane } from "@/components/nvim-pane";
import { TmuxShell } from "@/components/tmux-shell";

export default function BlogPostNotFound() {
  return (
    <TmuxShell activeWindow="blog" statusRight="E484">
      <NvimPane
        buffers={[{ label: "posts/", href: "/blog" }]}
        fileName="[No Name]"
        fileType="markdown"
        tone="error"
        message="E484: Can't open file: no such post"
      >
        <BufferNotice
          title="Post not found"
          description="The requested article does not exist, but the rest of the site is still available."
          actions={[
            { href: "/blog", label: "Back to blog", command: ":e posts/" },
            { href: "/", label: "Return home", command: ":q" },
          ]}
        />
      </NvimPane>
    </TmuxShell>
  );
}
