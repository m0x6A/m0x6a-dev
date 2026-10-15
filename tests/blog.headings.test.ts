import assert from "node:assert/strict";
import test from "node:test";
import {
  countLines,
  extractHeadings,
  readingMinutes,
  slugifyHeading,
} from "../src/lib/blog/headings";

test("slugifyHeading builds stable anchor ids", () => {
  assert.equal(slugifyHeading("Neovim: what replaced what"), "neovim-what-replaced-what");
  assert.equal(slugifyHeading("The shell, in four files"), "the-shell-in-four-files");
});

test("extractHeadings returns h2 and h3 outside code fences", () => {
  const headings = extractHeadings(
    [
      "# Title",
      "## Why it **matters**",
      "```sh",
      "## not a heading",
      "```",
      "### The `init.lua` file",
      "#### too deep",
    ].join("\n"),
  );

  assert.deepEqual(headings, [
    { depth: 2, text: "Why it matters", id: "why-it-matters" },
    { depth: 3, text: "The init.lua file", id: "the-initlua-file" },
  ]);
});

test("countLines counts Markdown source lines", () => {
  assert.equal(countLines(""), 0);
  assert.equal(countLines("one\ntwo"), 2);
});

test("readingMinutes skips code blocks and rounds to at least one minute", () => {
  const prose = Array.from({ length: 440 }, () => "word").join(" ");
  const code = ["```sh", ...Array.from({ length: 500 }, () => "echo ok"), "```"].join("\n");

  assert.equal(readingMinutes(`${prose}\n${code}`), 2);
  assert.equal(readingMinutes("short"), 1);
});
