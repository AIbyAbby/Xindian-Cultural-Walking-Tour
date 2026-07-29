import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";


const root = new URL("../", import.meta.url);
const pageUrl = new URL("pages/walking-maps.html", root);


test("走讀地圖頁依序呈現四張完整圖卡", async () => {
  const html = await readFile(pageUrl, "utf8");
  const titles = [
    "流域鄰里工作坊1：國校里",
    "流域鄰里工作坊2：碧潭水岸踏查",
    "流域鄰里工作坊3：碧潭水岸踏查",
    "流域鄰里工作坊4：水圳與聚落踏查",
  ];

  assert.equal((html.match(/class="walking-map-card"/g) ?? []).length, 4);
  let cursor = -1;
  for (const title of titles) {
    const next = html.indexOf(title);
    assert.ok(next > cursor, `${title} must appear in order`);
    cursor = next;
  }
  assert.match(html, /韌性防災/);
  assert.doesNotMatch(html, /靭性防災/);
});


test("每張圖卡都有預覽圖、Google 地圖、新分頁 QR 與固定標語", async () => {
  const html = await readFile(pageUrl, "utf8");

  assert.equal((html.match(/data-map-full=/g) ?? []).length, 4);
  assert.equal((html.match(/>開啟 Google 地圖</g) ?? []).length, 4);
  assert.equal((html.match(/target="_blank"/g) ?? []).length, 4);
  assert.equal((html.match(/rel="noopener noreferrer"/g) ?? []).length, 4);
  assert.equal((html.match(/walking-map-\d-qr\.png/g) ?? []).length, 4);
  assert.equal((html.match(/掃描地圖，用腳步閱讀這座城市/g) ?? []).length, 4);
  assert.doesNotMatch(html, /下載原圖/);
});


test("大圖檢視器支援點擊、遮罩與 Escape 關閉", async () => {
  const html = await readFile(pageUrl, "utf8");
  const js = await readFile(new URL("assets/js/walking-maps.js", root), "utf8");

  assert.match(html, /id="walking-map-lightbox"/);
  assert.match(js, /showModal\(\)/);
  assert.match(js, /event\.key === "Escape"/);
  assert.match(js, /event\.target === lightbox/);
  assert.match(js, /document\.body\.style\.overflow/);
});


test("圖卡與 QR 有電腦和手機響應式規則", async () => {
  const html = await readFile(pageUrl, "utf8");
  const css = await readFile(new URL("assets/css/walking-maps.css", root), "utf8");

  assert.match(html, /assets\/css\/walking-maps\.css/);
  assert.match(css, /\.walking-map-card/);
  assert.match(css, /\.walking-map-card__qr img\s*\{[\s\S]*?width:\s*190px/);
  assert.match(css, /@media\s*\(max-width:\s*768px\)[\s\S]*?\.walking-map-card__qr img\s*\{[\s\S]*?width:\s*170px/);
  assert.match(css, /\.walking-map-lightbox/);
});
