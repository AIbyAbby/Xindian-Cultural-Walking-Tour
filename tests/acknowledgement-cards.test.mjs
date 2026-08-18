import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("田調記憶內容下方依序呈現特別感謝與計畫資訊", async () => {
  const html = await readFile(new URL("index.html", root), "utf8");
  const sourcesStart = html.indexOf('<section id="sources"');
  const sourcesEnd = html.indexOf("</section>", sourcesStart);
  const sources = html.slice(sourcesStart, sourcesEnd);
  const lastMemoryCard = sources.indexOf("溪與城的踏查足跡");
  const thanksCard = sources.indexOf('class="ack-card thanks-card"');
  const projectCard = sources.indexOf('class="ack-card project-card"');

  assert.ok(lastMemoryCard >= 0);
  assert.ok(thanksCard > lastMemoryCard);
  assert.ok(projectCard > thanksCard);
  assert.match(sources, /高玉惠女士[\s\S]*翁東源先生[\s\S]*張淑芬女士[\s\S]*張豐鏡先生[\s\S]*郭儒鈞女士[\s\S]*陳啟川先生/);
  assert.match(sources, /指導單位：新北市政府文化局/);
  assert.match(sources, /團隊：<\/span><span[^>]*>王淑美、吳培珍、侯淑敏、陳玉玲/);
});

test("手機三行說明與桌面、手機標題版本均保留", async () => {
  const html = await readFile(new URL("index.html", root), "utf8");
  const css = await readFile(new URL("style.css", root), "utf8");
  const lines = [
    "感謝受訪者分享珍貴的生命故事與地方記憶",
    "並提供豐富在地知識，讓新店溪與鄰里之間",
    "的人文歷史脈絡與生活故事得以完整留存。",
  ];

  for (const line of lines) {
    assert.equal([...line].length, 19);
    assert.match(html, new RegExp(`<span class="mobile-intro-line">${line}<\\/span>`));
  }

  assert.match(html, /<span class="project-title-main">在溪與城之間<\/span><span class="project-title-separator">：<\/span><span class="project-title-sub">新店鄰里故事採集<\/span>/);
  assert.match(css, /\.acknowledgements[\s\S]*overflow-x:\s*clip/);
  assert.match(css, /@media\s*\(max-width:\s*640px\)[\s\S]*\.thanks-intro-desktop\s*\{[\s\S]*display:\s*none/);
  assert.match(css, /@media\s*\(max-width:\s*640px\)[\s\S]*\.mobile-intro-line\s*\{[\s\S]*white-space:\s*nowrap/);
  assert.match(css, /@media\s*\(max-width:\s*640px\)[\s\S]*\.project-title-separator\s*\{[\s\S]*display:\s*none/);
});
