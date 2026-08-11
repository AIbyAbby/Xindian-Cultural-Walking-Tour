import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const storyUrl = new URL("../pages/story-195-icecream.html", import.meta.url);

test("195 綿綿冰文章呈現修正後的營業時間", async () => {
  const html = await readFile(storyUrl, "utf8");

  assert.equal(
    html.match(/早上7點開店，中午12點休息，下午4點再開到5點半/g)?.length,
    2,
  );
  assert.doesNotMatch(html, /每天下午四點準時開門/);
  assert.doesNotMatch(html, /每天固定要到下午 4 點才會開門/);
  assert.doesNotMatch(html, /專賣給下班的人潮/);
});

test("老雜貨店段落加入𥴊仔店名稱", async () => {
  const html = await readFile(storyUrl, "utf8");

  assert.match(html, /很有個性的老店「𥴊仔店」/u);
});
