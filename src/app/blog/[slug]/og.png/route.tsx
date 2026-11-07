import { ImageResponse } from "next/og";
import { getBlogIndex, getBlogPost } from "@/lib/blog/posts";

// One preview card per post, rendered at build time as /blog/<slug>/og.png: the
// title and the summary, so a shared link shows what the post is about even where
// the description is hidden (LinkedIn shows only the image and the title).
// A route handler, not an opengraph-image file, because the static export writes
// those without a file extension and GitHub Pages then serves them as a download.
export const dynamic = "force-static";

const size = { width: 1200, height: 627 };

const PLACEHOLDER_SLUG = "_";

export async function generateStaticParams() {
  const result = await getBlogIndex();

  if (result.status !== "ready") {
    return [{ slug: PLACEHOLDER_SLUG }];
  }

  return result.posts.map((post) => ({ slug: post.slug }));
}

/** Shortens text to at most `max` characters at a word boundary, so a long summary can't overflow the card. */
function clip(text: string, max: number): string {
  if (text.length <= max) {
    return text;
  }

  const cut = text.slice(0, max);
  return `${cut.slice(0, cut.lastIndexOf(" "))}…`;
}

type ImageContext = {
  params: Promise<{ slug: string }>;
};

export async function GET(_request: Request, { params }: ImageContext) {
  const { slug } = await params;
  const result = await getBlogPost(slug);
  const title = result.status === "ready" ? result.post.title : "m0x6a";
  const summary = result.status === "ready" ? clip(result.post.summary, 260) : "";
  const date = result.status === "ready" ? result.post.publishedAt : "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: "#1a1b26",
          color: "#c0caf5",
          fontSize: 30,
        }}
      >
        <div style={{ display: "flex", color: "#787fa8", fontSize: 28 }}>
          <span style={{ color: "#9ece6a" }}>~/blog</span>
          <span style={{ marginLeft: 16 }}>{`${slug}.md`}</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 60, fontWeight: 700, color: "#7aa2f7", lineHeight: 1.15 }}>{title}</div>
          <div style={{ marginTop: 28, lineHeight: 1.4, color: "#c0caf5" }}>{summary}</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", color: "#787fa8", fontSize: 26 }}>
          <span>m0x6a · Mattias Jonsson</span>
          <span>{date}</span>
        </div>
      </div>
    ),
    size,
  );
}
