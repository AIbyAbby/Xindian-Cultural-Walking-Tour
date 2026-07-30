import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("首頁在電腦與手機版提供走讀地圖入口", async () => {
  const html = await readFile(new URL("index.html", root), "utf8");
  const actions = html.match(/<div class="hero-actions">([\s\S]*?)<\/div>/)?.[1] ?? "";

  assert.equal((actions.match(/<a class="button ghost/g) ?? []).length, 6);
  assert.match(
    actions,
    /btn-sources[^>]*>田調記憶<\/a>[\s\S]*btn-walking-maps[^>]*href="pages\/walking-maps\.html"[^>]*>走讀地圖<\/a>/,
  );
  assert.match(html, /assets\/css\/walking-maps-home\.css/);
  const css = await readFile(new URL("assets/css/walking-maps-home.css", root), "utf8");
  assert.match(
    css,
    /@media\s*\(max-width:\s*768px\)[\s\S]*?grid-template-columns:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\)/,
  );
});
