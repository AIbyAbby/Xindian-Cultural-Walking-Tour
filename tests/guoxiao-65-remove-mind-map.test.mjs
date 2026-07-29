import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const page = new URL("../pages/2026-04-29-guoxiao-65-then-now.html", import.meta.url);

test("國校路65巷文章不再顯示心智圖區塊", async () => {
  const html = await readFile(page, "utf8");

  assert.doesNotMatch(html, /<h2>心智圖：<\/h2>/);
  assert.doesNotMatch(html, /25-image25\.png/);
});
