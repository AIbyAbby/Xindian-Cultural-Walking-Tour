# Walking Map Cards Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a responsive homepage “走讀地圖” entry and a dedicated page containing four large walking-map cards with approved introductions, Google My Maps links, enlarged QR codes, and an accessible full-screen image viewer.

**Architecture:** Keep the feature static and isolated: `pages/walking-maps.html` owns the four cards, `assets/js/walking-maps.js` owns only the image viewer, and a dedicated section in `style.css` owns the responsive presentation. A small Python build script copies the four approved desktop PNGs, creates lightweight WebP previews, generates QR PNGs from the same canonical URL list used by the page, and verifies every generated QR before the website changes consume them.

**Tech Stack:** Semantic HTML5, existing site CSS variables, vanilla JavaScript, Node.js built-in test runner, Python 3 with Pillow/qrcode/zxingcpp for deterministic image and QR preparation.

## Global Constraints

- The only accepted source images are `C:\Users\abby8\Desktop\完成\走讀地圖1.png`, `走讀地圖2.png`, `走讀地圖3.png`, and `走讀地圖4_.png`.
- Do not alter the pixels of the four approved full-resolution PNGs.
- Card order is workshop 1, 2, 3, then 4.
- All card titles use the prefix `流域鄰里工作坊`.
- Workshop 3 uses the corrected wording `韌性防災`.
- Every card follows the order: title, introduction, map image, `開啟 Google 地圖`, enlarged QR, `掃描地圖，用腳步閱讀這座城市`.
- Do not add a download-original button.
- Google maps open in a new tab and use the verified public `viewer` URLs from the approved specification.
- QR display size is approximately 190 × 190 px on desktop and 170 × 170 px on mobile, with an intact quiet zone.
- The full-screen viewer supports close button, backdrop click, and `Escape`; closing restores the card scroll position.
- Homepage mobile actions are exactly two columns × three rows, with `田調記憶` and `走讀地圖` in the first row and all six buttons the same size.
- Preserve all unrelated working-tree changes; stage and commit only files listed by the current task.
- Design source: `docs/superpowers/specs/2026-07-29-walking-map-cards-page-design.md`.

---

## File Structure

- Create `tools/build_walking_map_gallery_assets.py`: canonical source paths and Google URLs; copies full PNGs, builds WebP previews, creates and verifies QR PNGs.
- Create `tests/verify_walking_map_gallery_assets.py`: checks full-size copies, preview dimensions, QR dimensions, and decoded URL equality.
- Create `pages/walking-maps.html`: semantic page shell and four approved cards.
- Create `assets/js/walking-maps.js`: isolated accessible lightbox behavior.
- Create `tests/walking-map-gallery.test.mjs`: static contract tests for card copy, links, QR markup, lightbox markup/script, and homepage entry.
- Modify `index.html`: insert the new homepage action next to `田調記憶` in source order.
- Modify `style.css`: desktop cards, mobile cards, lightbox, and six-button homepage grid.
- Create generated assets:
  - `assets/images/maps/walking-map-1.png`
  - `assets/images/maps/walking-map-2.png`
  - `assets/images/maps/walking-map-3.png`
  - `assets/images/maps/walking-map-4.png`
  - `assets/images/maps/walking-map-1-preview.webp`
  - `assets/images/maps/walking-map-2-preview.webp`
  - `assets/images/maps/walking-map-3-preview.webp`
  - `assets/images/maps/walking-map-4-preview.webp`
  - `assets/images/qr/walking-map-1-qr.png`
  - `assets/images/qr/walking-map-2-qr.png`
  - `assets/images/qr/walking-map-3-qr.png`
  - `assets/images/qr/walking-map-4-qr.png`

---

### Task 1: Build and verify deterministic gallery assets

**Files:**
- Create: `tools/build_walking_map_gallery_assets.py`
- Create: `tests/verify_walking_map_gallery_assets.py`
- Create: generated map and QR files listed in “File Structure”

**Interfaces:**
- Consumes: four approved desktop PNG paths and four exact Google My Maps URLs.
- Produces: `MAPS: tuple[MapAsset, ...]`, where each `MapAsset` carries `number`, `source`, `full_name`, `preview_name`, `qr_name`, and `url`; generated filenames become stable inputs to Tasks 2 and 3.

- [ ] **Step 1: Write the failing asset verification script**

Create `tests/verify_walking_map_gallery_assets.py` with exact expectations:

```python
from pathlib import Path
from PIL import Image
import zxingcpp

ROOT = Path(__file__).resolve().parents[1]
EXPECTED = {
    1: ((3200, 1800), "https://www.google.com/maps/d/u/0/viewer?mid=1D808RN4l0f3E3ezyLPhS02ll29-DD4c&ll=24.955491524705938%2C121.539346&z=16"),
    2: ((3200, 1800), "https://www.google.com/maps/d/u/0/viewer?mid=1cqFLNuKTYBIYgFI1sw3ZBu5kgU8vkiw&ll=24.95597813920153%2C121.5348422&z=16"),
    3: ((4269, 2400), "https://www.google.com/maps/d/u/0/viewer?mid=1yZSc8bxrrhyRNPb9doMi8bC_2xkpbC4&ll=24.954656028163647%2C121.5389225&z=16"),
    4: ((3600, 1938), "https://www.google.com/maps/d/u/0/viewer?mid=1ebAZN9ajYrf1Gkt78_Gw1AUYe09kxXo&ll=24.9554203%2C121.5376068&z=17"),
}

for number, (full_size, url) in EXPECTED.items():
    full = ROOT / f"assets/images/maps/walking-map-{number}.png"
    preview = ROOT / f"assets/images/maps/walking-map-{number}-preview.webp"
    qr = ROOT / f"assets/images/qr/walking-map-{number}-qr.png"
    assert full.exists() and preview.exists() and qr.exists()
    with Image.open(full) as image:
        assert image.size == full_size
    with Image.open(preview) as image:
        assert image.width == 1280
        assert image.height < 1280
    decoded = zxingcpp.read_barcodes(Image.open(qr))
    assert [item.text for item in decoded] == [url]

print("PASS: four full maps, four previews, and four verified QR codes")
```

- [ ] **Step 2: Run the verifier to confirm it fails before generation**

Run:

```powershell
$env:PYTHONPATH='C:\Users\abby8\OneDrive\Desktop\網站\.local_python_packages'
& 'C:\Users\abby8\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe' tests\verify_walking_map_gallery_assets.py
```

Expected: failure because at least `walking-map-1.png` does not exist.

- [ ] **Step 3: Implement the minimal deterministic asset builder**

Create `tools/build_walking_map_gallery_assets.py`:

```python
from dataclasses import dataclass
from pathlib import Path
import shutil

from PIL import Image
import qrcode
import zxingcpp

ROOT = Path(__file__).resolve().parents[1]
SOURCE_DIR = Path(r"C:\Users\abby8\Desktop\完成")
MAP_DIR = ROOT / "assets/images/maps"
QR_DIR = ROOT / "assets/images/qr"

@dataclass(frozen=True)
class MapAsset:
    number: int
    source: str
    url: str

    @property
    def full_name(self):
        return f"walking-map-{self.number}.png"

    @property
    def preview_name(self):
        return f"walking-map-{self.number}-preview.webp"

    @property
    def qr_name(self):
        return f"walking-map-{self.number}-qr.png"

MAPS = (
    MapAsset(1, "走讀地圖1.png", "https://www.google.com/maps/d/u/0/viewer?mid=1D808RN4l0f3E3ezyLPhS02ll29-DD4c&ll=24.955491524705938%2C121.539346&z=16"),
    MapAsset(2, "走讀地圖2.png", "https://www.google.com/maps/d/u/0/viewer?mid=1cqFLNuKTYBIYgFI1sw3ZBu5kgU8vkiw&ll=24.95597813920153%2C121.5348422&z=16"),
    MapAsset(3, "走讀地圖3.png", "https://www.google.com/maps/d/u/0/viewer?mid=1yZSc8bxrrhyRNPb9doMi8bC_2xkpbC4&ll=24.954656028163647%2C121.5389225&z=16"),
    MapAsset(4, "走讀地圖4_.png", "https://www.google.com/maps/d/u/0/viewer?mid=1ebAZN9ajYrf1Gkt78_Gw1AUYe09kxXo&ll=24.9554203%2C121.5376068&z=17"),
)

MAP_DIR.mkdir(parents=True, exist_ok=True)
QR_DIR.mkdir(parents=True, exist_ok=True)

for item in MAPS:
    source = SOURCE_DIR / item.source
    full = MAP_DIR / item.full_name
    preview = MAP_DIR / item.preview_name
    qr_path = QR_DIR / item.qr_name

    shutil.copy2(source, full)
    with Image.open(source) as image:
        image = image.convert("RGB")
        height = round(image.height * 1280 / image.width)
        image.resize((1280, height), Image.Resampling.LANCZOS).save(
            preview, "WEBP", quality=88, method=6
        )

    qr = qrcode.QRCode(
        version=None,
        error_correction=qrcode.constants.ERROR_CORRECT_M,
        box_size=12,
        border=4,
    )
    qr.add_data(item.url)
    qr.make(fit=True)
    qr.make_image(fill_color="black", back_color="white").save(qr_path)

    decoded = zxingcpp.read_barcodes(Image.open(qr_path))
    assert [result.text for result in decoded] == [item.url]
```

- [ ] **Step 4: Generate assets and run the verifier**

Run:

```powershell
$env:PYTHONPATH='C:\Users\abby8\OneDrive\Desktop\網站\.local_python_packages'
& 'C:\Users\abby8\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe' tools\build_walking_map_gallery_assets.py
& 'C:\Users\abby8\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe' tests\verify_walking_map_gallery_assets.py
```

Expected: `PASS: four full maps, four previews, and four verified QR codes`.

- [ ] **Step 5: Commit only the builder, verifier, and generated assets**

```powershell
git add -- tools/build_walking_map_gallery_assets.py tests/verify_walking_map_gallery_assets.py assets/images/maps/walking-map-*.png assets/images/maps/walking-map-*-preview.webp assets/images/qr/walking-map-*-qr.png
git commit -m "feat: prepare walking map gallery assets"
```

---

### Task 2: Add the four-card walking maps page

**Files:**
- Create: `pages/walking-maps.html`
- Create: `tests/walking-map-gallery.test.mjs`

**Interfaces:**
- Consumes: generated preview/full/QR filenames from Task 1 and the four canonical Google URLs.
- Produces: `.walking-map-gallery`, four `.walking-map-card` elements, `[data-map-full]` image triggers, and `#walking-map-lightbox` markup consumed by Tasks 3 and 4.

- [ ] **Step 1: Write failing static-contract tests for approved content**

Create `tests/walking-map-gallery.test.mjs`:

```javascript
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
```

- [ ] **Step 2: Run the page tests and confirm failure**

Run:

```powershell
& 'C:\Users\abby8\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --test tests\walking-map-gallery.test.mjs
```

Expected: failure with `ENOENT` for `pages/walking-maps.html`.

- [ ] **Step 3: Create semantic HTML with exact approved copy**

Create `pages/walking-maps.html` with this repeatable card shape:

```html
<article class="walking-map-card">
  <header class="walking-map-card__intro">
    <p class="eyebrow">走讀地圖 1</p>
    <h2>流域鄰里工作坊1：國校里</h2>
    <p>走訪國校里聚落，認識明治煤礦遺址、台車道及國校路舊宿舍群；學習社區資源盤點與口述歷史訪談。</p>
  </header>
  <button class="walking-map-card__image" type="button"
    data-map-full="../assets/images/maps/walking-map-1.png"
    data-map-alt="流域鄰里工作坊1：國校里走讀地圖完整圖">
    <img src="../assets/images/maps/walking-map-1-preview.webp"
      alt="流域鄰里工作坊1：國校里走讀地圖預覽"
      width="1280" height="720" loading="lazy" decoding="async">
    <span>點擊放大地圖</span>
  </button>
  <div class="walking-map-card__actions">
    <a class="button primary"
      href="https://www.google.com/maps/d/u/0/viewer?mid=1D808RN4l0f3E3ezyLPhS02ll29-DD4c&amp;ll=24.955491524705938%2C121.539346&amp;z=16"
      target="_blank" rel="noopener noreferrer">開啟 Google 地圖</a>
    <figure class="walking-map-card__qr">
      <img src="../assets/images/qr/walking-map-1-qr.png"
        alt="流域鄰里工作坊1 Google 地圖 QR Code"
        width="190" height="190" loading="lazy">
      <figcaption>掃描地圖，用腳步閱讀這座城市</figcaption>
    </figure>
  </div>
</article>
```

Repeat the same structure for maps 2–4 with the exact approved introductions and canonical URLs from the specification. Include one shared lightbox after the cards:

```html
<dialog id="walking-map-lightbox" class="walking-map-lightbox" aria-label="走讀地圖大圖">
  <button class="walking-map-lightbox__close" type="button" aria-label="關閉大圖">×</button>
  <div class="walking-map-lightbox__viewport">
    <img src="" alt="">
  </div>
</dialog>
<script src="../assets/js/walking-maps.js"></script>
```

- [ ] **Step 4: Run the static-contract tests**

Run:

```powershell
& 'C:\Users\abby8\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --test tests\walking-map-gallery.test.mjs
```

Expected: both tests pass.

- [ ] **Step 5: Commit the page and its contract tests**

```powershell
git add -- pages/walking-maps.html tests/walking-map-gallery.test.mjs
git commit -m "feat: add walking map cards page"
```

---

### Task 3: Add responsive cards and accessible full-screen viewing

**Files:**
- Create: `assets/js/walking-maps.js`
- Modify: `style.css`
- Modify: `tests/walking-map-gallery.test.mjs`

**Interfaces:**
- Consumes: `[data-map-full]`, `data-map-alt`, and `#walking-map-lightbox` from Task 2.
- Produces: lightbox open/close behavior and CSS contracts `.walking-map-gallery`, `.walking-map-card`, `.walking-map-lightbox`, and mobile QR sizing.

- [ ] **Step 1: Add failing tests for the lightbox and responsive CSS**

Append to `tests/walking-map-gallery.test.mjs`:

```javascript
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
  const css = await readFile(new URL("style.css", root), "utf8");
  assert.match(css, /\.walking-map-card/);
  assert.match(css, /\.walking-map-card__qr img[\s\S]*width:\s*190px/);
  assert.match(css, /@media\s*\(max-width:\s*768px\)[\s\S]*\.walking-map-card__qr img[\s\S]*width:\s*170px/);
  assert.match(css, /\.walking-map-lightbox/);
});
```

- [ ] **Step 2: Run the tests and verify failure**

Run:

```powershell
& 'C:\Users\abby8\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --test tests\walking-map-gallery.test.mjs
```

Expected: failure because `assets/js/walking-maps.js` and the CSS contracts do not exist.

- [ ] **Step 3: Implement isolated lightbox behavior**

Create `assets/js/walking-maps.js`:

```javascript
const lightbox = document.querySelector("#walking-map-lightbox");
const lightboxImage = lightbox?.querySelector("img");
const closeButton = lightbox?.querySelector(".walking-map-lightbox__close");
let returnFocus = null;

function closeLightbox() {
  if (!lightbox?.open) return;
  lightbox.close();
  document.body.style.overflow = "";
  lightboxImage.removeAttribute("src");
  returnFocus?.focus();
}

document.querySelectorAll("[data-map-full]").forEach((trigger) => {
  trigger.addEventListener("click", () => {
    if (!lightbox || !lightboxImage) return;
    returnFocus = trigger;
    lightboxImage.src = trigger.dataset.mapFull;
    lightboxImage.alt = trigger.dataset.mapAlt || "走讀地圖完整圖";
    document.body.style.overflow = "hidden";
    lightbox.showModal();
    closeButton?.focus();
  });
});

closeButton?.addEventListener("click", closeLightbox);
lightbox?.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeLightbox();
});
```

- [ ] **Step 4: Add focused gallery, mobile, and lightbox CSS**

Append a clearly labelled `Walking map gallery page` section to `style.css`. It must:

- constrain the page to the existing `--content` width;
- keep each card visually separate with the existing paper/river palette;
- render the preview at `width: 100%; height: auto; object-fit: contain`;
- make the map-image button visually neutral and keyboard-focusable;
- keep QR images at 190 px desktop and 170 px mobile;
- use a single-column card flow at `max-width: 768px`;
- make the lightbox fill the viewport and allow image panning/scrolling without cropping.

The exact QR rules must include:

```css
.walking-map-card__qr img {
  width: 190px;
  height: 190px;
  padding: 10px;
  background: #fff;
  image-rendering: pixelated;
}

@media (max-width: 768px) {
  .walking-map-card__qr img {
    width: 170px;
    height: 170px;
  }
}
```

- [ ] **Step 5: Run all Node tests**

Run:

```powershell
& 'C:\Users\abby8\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --test tests\*.test.mjs
```

Expected: all existing walking-map tests and all new gallery tests pass.

- [ ] **Step 6: Commit the responsive viewer**

```powershell
git add -- assets/js/walking-maps.js style.css tests/walking-map-gallery.test.mjs
git commit -m "feat: add responsive walking map viewer"
```

---

### Task 4: Add the homepage entry and six-button mobile grid

**Files:**
- Modify: `index.html`
- Modify: `style.css`
- Modify: `tests/walking-map-gallery.test.mjs`

**Interfaces:**
- Consumes: `pages/walking-maps.html` from Task 2.
- Produces: `.btn-walking-maps` homepage action and the mobile two-column × three-row hero action contract.

- [ ] **Step 1: Add failing homepage-entry tests**

Append:

```javascript
test("首頁提供走讀地圖入口且手機版六個按鈕同尺寸排列", async () => {
  const html = await readFile(new URL("index.html", root), "utf8");
  const css = await readFile(new URL("style.css", root), "utf8");
  const actions = html.match(/<div class="hero-actions">([\s\S]*?)<\/div>/)?.[1] ?? "";
  assert.equal((actions.match(/<a class="button ghost/g) ?? []).length, 6);
  assert.match(actions, /btn-records[^>]*>田調記憶<\/a>[\s\S]*btn-walking-maps[^>]*href="pages\/walking-maps\.html"[^>]*>走讀地圖<\/a>/);
  assert.match(css, /\.button\.ghost\.btn-walking-maps/);
  assert.match(css, /@media\s*\(max-width:\s*768px\)[\s\S]*\.hero-actions[\s\S]*grid-template-columns:\s*repeat\(2,\s*1fr\)/);
  assert.doesNotMatch(css, /\.hero-actions \.button\.btn-sources[\s\S]*grid-column:\s*span 2/);
});
```

- [ ] **Step 2: Run the test and verify failure**

Run:

```powershell
& 'C:\Users\abby8\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --test tests\walking-map-gallery.test.mjs
```

Expected: failure because there are five actions and no `.btn-walking-maps`.

- [ ] **Step 3: Insert the homepage button directly after `田調記憶`**

In `index.html`, make the first two hero actions:

```html
<a class="button ghost btn-records" href="#records">田調記憶</a>
<a class="button ghost btn-walking-maps" href="pages/walking-maps.html">走讀地圖</a>
```

Leave the other four actions in their existing relative order.

- [ ] **Step 4: Normalize all six mobile buttons**

In `style.css`:

- include `.btn-walking-maps` in the shared ghost-button selector and hover/focus selector;
- retain `grid-template-columns: repeat(2, 1fr)` at `max-width: 768px`;
- remove the rule that makes `.btn-sources` span both columns;
- ensure all six buttons inherit identical width, height, padding, border radius, and font size.

- [ ] **Step 5: Run all Node tests**

Run:

```powershell
& 'C:\Users\abby8\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --test tests\*.test.mjs
```

Expected: all tests pass.

- [ ] **Step 6: Commit the homepage integration**

```powershell
git add -- index.html style.css tests/walking-map-gallery.test.mjs
git commit -m "feat: add walking maps homepage entry"
```

---

### Task 5: Browser verification at desktop and mobile widths

**Files:**
- Modify only if verification discovers a defect: `pages/walking-maps.html`, `assets/js/walking-maps.js`, `style.css`, `index.html`, or `tests/walking-map-gallery.test.mjs`

**Interfaces:**
- Consumes: the complete implementation from Tasks 1–4.
- Produces: evidence that the feature meets the desktop, mobile, interaction, and QR acceptance criteria.

- [ ] **Step 1: Start a local static server**

Run from the repository root:

```powershell
& 'C:\Users\abby8\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe' -m http.server 8000
```

Open `http://localhost:8000/index.html` and `http://localhost:8000/pages/walking-maps.html`.

- [ ] **Step 2: Verify desktop at 1440 × 900**

Check:

- homepage has six inline actions;
- `田調記憶` is immediately followed by `走讀地圖`;
- each card shows approved title, introduction, full uncropped preview, Google button, 190 px QR, and caption;
- cards are visually separated;
- clicking each preview opens the corresponding full-resolution image;
- close button, backdrop click, and `Escape` each close the viewer and return focus.

- [ ] **Step 3: Verify mobile at 390 × 844**

Check:

- homepage actions are two columns × three rows;
- `田調記憶` and `走讀地圖` form the first row;
- all six action buttons have the same dimensions;
- each card becomes one column in the approved content order;
- no horizontal overflow occurs;
- map previews remain uncropped;
- Google buttons have comfortable touch targets;
- QR images render at 170 px with unobstructed quiet zones.

- [ ] **Step 4: Re-run QR and regression verification**

Run:

```powershell
$env:PYTHONPATH='C:\Users\abby8\OneDrive\Desktop\網站\.local_python_packages'
& 'C:\Users\abby8\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe' tests\verify_walking_map_gallery_assets.py
& 'C:\Users\abby8\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --test tests\*.test.mjs
```

Expected: asset verifier prints `PASS` and all Node tests pass.

- [ ] **Step 5: Commit only verification-driven fixes, if any**

If no defects were found, do not create an empty commit. If fixes were needed:

```powershell
git add -- pages/walking-maps.html assets/js/walking-maps.js style.css index.html tests/walking-map-gallery.test.mjs
git commit -m "fix: polish walking map gallery responsiveness"
```
