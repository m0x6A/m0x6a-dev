import { BufferNotice, NvimPane } from "@/components/nvim-pane";
import { TmuxShell } from "@/components/tmux-shell";

export default function NotFoundPage() {
  return (
    <TmuxShell activeWindow="home">
      <NvimPane
        path={[{ label: "~", href: "/" }, { label: "[No Name]" }]}
        fileName="[No Name]"
        tone="error"
        message="E484: Can't open file: no such route"
      >
        <BufferNotice
          title="Route not found"
          description="That page does not exist. Jump back to the portfolio or continue into the blog."
          actions={[
            { href: "/", label: "Go home", command: ":e README.md" },
            { href: "/blog", label: "Open blog", command: ":e posts/" },
          ]}
        />
      </NvimPane>
    </TmuxShell>
  );
}
