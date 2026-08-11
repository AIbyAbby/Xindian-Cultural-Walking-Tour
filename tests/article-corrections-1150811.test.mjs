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

test("新店國小百年校史統一使用新店國民學校", async () => {
  const article = await readFile(
    new URL("pages/story-xindian-school.html", root),
    "utf8",
  );

  assert.doesNotMatch(article, /新店南國民學校|南國民學校/);
  assert.equal(article.match(/新店國民學校/g)?.length, 3);
});
