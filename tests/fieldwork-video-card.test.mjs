import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("田調記憶最下方提供溪與城的踏查足跡影片卡片", async () => {
  const html = await readFile(new URL("index.html", root), "utf8");
  const css = await readFile(new URL("style.css", root), "utf8");
  const card = html.match(/<article class="record-link record-video-card">([\s\S]*?)<\/article>/)?.[1] ?? "";
  const previousCardIndex = html.indexOf('href="pages/story-xindian-river-and-city.html"');
  const videoCardIndex = html.indexOf('<article class="record-link record-video-card">');

  assert.ok(previousCardIndex >= 0);
  assert.ok(videoCardIndex > previousCardIndex);
  assert.equal(html.indexOf('class="record-link"', videoCardIndex), -1);
  assert.match(
    card,
    /<h3>溪與城的踏查足跡<\/h3>[\s\S]*<span>空拍影像紀實／陳翠碧<\/span>[\s\S]*youtube-nocookie\.com\/embed\/td_MB7xD1as/,
  );
  assert.match(card, /loading="lazy"/);
  assert.match(card, /allowfullscreen/);
  assert.match(card, /每一趟踏查，都是我們與溪流、城市深度對話的印記。/);
  assert.match(css, /\.record-video-frame\s*\{[\s\S]*aspect-ratio:\s*16\s*\/\s*9/);
  assert.match(css, /\.record-video-frame iframe\s*\{[\s\S]*width:\s*100%[\s\S]*height:\s*100%/);
});
