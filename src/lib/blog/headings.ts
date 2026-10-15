export type BlogHeading = {
  depth: 2 | 3;
  text: string;
  id: string;
};

export function slugifyHeading(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export function extractHeadings(markdown: string): BlogHeading[] {
  const headings: BlogHeading[] = [];
  let inFence = false;

  for (const line of markdown.split("\n")) {
    if (/^\s*(```|~~~)/.test(line)) {
      inFence = !inFence;
      continue;
    }

    const match = inFence ? null : /^(##|###)\s+(.+?)\s*#*\s*$/.exec(line);

    if (!match) {
      continue;
    }

    const text = stripInlineMarkdown(match[2]);
    headings.push({
      depth: match[1].length as 2 | 3,
      text,
      id: slugifyHeading(text),
    });
  }

  return headings;
}

export function countLines(markdown: string) {
  return markdown.length === 0 ? 0 : markdown.split("\n").length;
}

function stripInlineMarkdown(text: string) {
  return text
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[`*]/g, "")
    .trim();
}
