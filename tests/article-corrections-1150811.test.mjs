import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("新店路及其周邊環境統一使用哥德式教堂與哥德式禮拜堂", async () => {
  const index = await readFile(new URL("index.html", root), "utf8");
  const article = await readFile(
    new URL("pages/story-xindian-park-church.html", root),
    "utf8",
  );

  assert.match(index, /馬偕博士哥德式教堂的興毀與重建/);
  assert.match(article, /馬偕博士興建哥德式教堂的興毀與重建/);
  assert.match(article, /興建了一座美麗哥德式教堂/);
  assert.match(article, /沖毀了這座巍峨的哥德式禮拜堂/);
  assert.doesNotMatch(index, /(?<!哥)德式(?:教堂|禮拜堂)/);
  assert.doesNotMatch(article, /(?<!哥)德式(?:教堂|禮拜堂)/);
});

test("新店國小百年校史依修改稿3修呈現五階段校名沿革", async () => {
  const index = await readFile(new URL("index.html", root), "utf8");
  const article = await readFile(
    new URL("pages/story-xindian-school.html", root),
    "utf8",
  );

  assert.match(article, /新店國小的百年校史，發展脈絡歷經了五個重要階段：/);
  assert.match(
    article,
    /臺北國語傳習所新店分教場 → 新店公學校 → 新店南國民學校 →\s*<br\s*\/?>\s*新店國民學校→ 新店國民小學/,
  );
  const stageParagraphStyle = article.match(
    /<p style="([^"]*)">\s*臺北國語傳習所新店分教場/,
  )?.[1];
  assert.match(stageParagraphStyle ?? "", /(?:^|;\s*)text-align:\s*left(?:;|$)/);
  assert.doesNotMatch(stageParagraphStyle ?? "", /text-align:\s*center/);
  assert.match(
    article,
    /在此背景下，新店公學校與小學校合併，更名為「新店南國民學校」。/,
  );
  assert.match(
    article,
    /民國34年（1945）國民政府來台，學校正式定名為「台北縣新店鎮新店國民學校」；民國57年（1968）更名為「台北縣新店鎮新店國民小學」，持續培育代代英才。/,
  );
  assert.doesNotMatch(article, /四個(?:關鍵|重要)的發展脈絡|四個重要階段|四階段/);
  assert.doesNotMatch(index, /新店國小百年校史[\s\S]{0,180}四階段興學歷程/);
  assert.match(index, /新店國小百年校史[\s\S]{0,180}五階段興學歷程/);
});
