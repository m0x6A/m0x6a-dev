import assert from "node:assert/strict";
import test from "node:test";
import { absoluteUrl, linkedInShareUrl } from "../src/lib/site";

test("absoluteUrl adds the site address and the export's trailing slash", () => {
  const url = absoluteUrl("/blog/some-post");
  assert.match(url, /^https?:\/\/[^/]+.*\/blog\/some-post\/$/);
  assert.equal(absoluteUrl("/blog/some-post/"), url);
  assert.equal(absoluteUrl("blog/some-post"), url);
});

test("linkedInShareUrl encodes the page address for LinkedIn's share dialog", () => {
  assert.equal(
    linkedInShareUrl("https://example.com/blog/a-post/"),
    "https://www.linkedin.com/sharing/share-offsite/?url=https%3A%2F%2Fexample.com%2Fblog%2Fa-post%2F",
  );
});
