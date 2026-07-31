import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  getReaderState,
  getSwipeDirection,
} from "../assets/js/mianmian-picturebook.js";

test("reader state clamps page boundaries and exposes final-page navigation", () => {
  assert.deepEqual(getReaderState(-1, 15), {
    index: 0,
    current: 1,
    total: 15,
    progress: 100 / 15,
    previousDisabled: true,
    nextDisabled: false,
    showHomeLink: false,
  });

  assert.deepEqual(getReaderState(14, 15), {
    index: 14,
    current: 15,
    total: 15,
    progress: 100,
    previousDisabled: false,
    nextDisabled: true,
    showHomeLink: true,
  });

  assert.equal(getReaderState(99, 15).index, 14);
});

test("swipe navigation ignores short and vertical gestures", () => {
  assert.equal(getSwipeDirection(180, 80, 10, 12), 1);
  assert.equal(getSwipeDirection(80, 180, 10, 12), -1);
  assert.equal(getSwipeDirection(100, 70, 10, 12), 0);
  assert.equal(getSwipeDirection(180, 80, 10, 160), 0);
});

test("story page provides all 15 ordered pages and accessible controls", async () => {
  const html = await readFile(
    new URL("../pages/walk-into-picturebook-mianmian.html", import.meta.url),
    "utf8",
  );

  const sources = [...html.matchAll(/data-page-src="([^"]+)"/g)].map(
    ([, source]) => source,
  );
  assert.deepEqual(
    sources,
    Array.from(
      { length: 15 },
      (_, index) =>
        `../assets/images/storybook-mianmian/page-${String(index + 1).padStart(2, "0")}.webp`,
    ),
  );
  assert.match(html, /aria-label="上一頁"/);
  assert.match(html, /aria-label="下一頁"/);
  assert.match(html, /aria-live="polite"/);
  assert.match(html, /href="\.\.\/index\.html"[^>]*>回到首頁</);
});

test("home page exposes the second story and responsive reader styling", async () => {
  const [home, css] = await Promise.all([
    readFile(new URL("../index.html", import.meta.url), "utf8"),
    readFile(new URL("../style.css", import.meta.url), "utf8"),
  ]);

  assert.match(
    home,
    /href="pages\/walk-into-picturebook-mianmian\.html"[^>]*>[\s\S]*?碧潭畔的清涼往事：195綿綿冰/,
  );
  assert.match(css, /\.mianmian-reader-stage\s*\{[\s\S]*?aspect-ratio:\s*1376\s*\/\s*768/);
  assert.match(css, /\.mianmian-reader\s*\{[\s\S]*?touch-action:\s*pan-y/);
  assert.match(css, /\.mianmian-reader-button:focus-visible/);
  assert.match(css, /@media[^{]*\(max-width:\s*640px\)[\s\S]*?\.mianmian-reader-controls/);
});
