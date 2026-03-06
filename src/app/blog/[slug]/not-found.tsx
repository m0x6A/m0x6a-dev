import { SiteShell } from "@/components/site-shell";
import { StatePanel } from "@/components/state-panel";

export default function BlogPostNotFound() {
  return (
    <SiteShell activeRoute="blog">
      <StatePanel
        title="Post not found"
        description="The requested article does not exist, but the rest of the site is still available."
        actions={[
          { href: "/blog", label: "Back to blog" },
          { href: "/", label: "Return home" },
        ]}
      />
    </SiteShell>
  );
}
