import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const imagePath = "assets/images/ai-history/xindian-dormitory-7-9-renewal.png";

test("地圖行旅的日式宿舍卡片使用新版無缺角圖", async () => {
  const html = await readFile(new URL("index.html", root), "utf8");
  const studentsSection =
    html.match(/<section id="students"[\s\S]*?<\/section>/)?.[0] ?? "";

  assert.match(
    studentsSection,
    new RegExp(
      `<img src="${imagePath}" alt="新店國小百年日式宿舍活化再生歷史建築導覽資訊圖">`,
    ),
  );

  const imageUrl = new URL(imagePath, root);
  await access(imageUrl);
  const image = await readFile(imageUrl);
  assert.deepEqual([...image.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10]);
});
