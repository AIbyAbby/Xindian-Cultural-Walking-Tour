import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("地圖行旅呈現四條散步路線且第 2 條連到碧潭詳細頁", async () => {
  const html = await readFile(new URL("index.html", root), "utf8");
  const section = html.match(/<section id="students"[\s\S]*?<\/section>/)?.[0] ?? "";

  assert.match(section, /<h2>四條散步路線<\/h2>/);
  assert.equal((section.match(/<(?:article|a) class="walk-route-card/g) ?? []).length, 4);
  assert.match(section, /href="pages\/walking-map-bitan\.html"/);
  assert.match(section, /<span class="route-number">02<\/span>/);
  assert.match(section, /碧潭水岸/);
  assert.equal((section.match(/class="walk-route-card is-coming-soon"/g) ?? []).length, 3);
});

test("碧潭詳細頁提供離線總圖、Q 版總圖與互動導覽", async () => {
  const html = await readFile(new URL("pages/walking-map-bitan.html", root), "utf8");

  assert.match(html, /data-map-mode="offline"/);
  assert.match(html, /data-map-mode="q"/);
  assert.match(html, /data-map-mode="interactive"/);
  assert.match(html, /001/);
  assert.match(html, /015/);
  assert.match(html, /播放語音/);
  assert.match(html, /Google Maps/);
});
