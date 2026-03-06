import { SiteShell } from "@/components/site-shell";
import { StatePanel } from "@/components/state-panel";

export default function NotFoundPage() {
  return (
    <SiteShell activeRoute="home">
      <StatePanel
        title="Route not found"
        description="That page does not exist. Jump back to the portfolio or continue into the blog."
        actions={[
          { href: "/", label: "Go home" },
          { href: "/blog", label: "Open blog" },
        ]}
      />
    </SiteShell>
  );
}
