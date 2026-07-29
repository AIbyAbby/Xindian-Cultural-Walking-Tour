from dataclasses import dataclass
from pathlib import Path
import shutil

from PIL import Image
import qrcode
import zxingcpp


ROOT = Path(__file__).resolve().parents[1]
SOURCE_DIR = Path(r"C:\Users\abby8\Desktop\完成")
MAP_DIR = ROOT / "assets" / "images" / "maps"
QR_DIR = ROOT / "assets" / "images" / "qr"


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
    MapAsset(
        1,
        "走讀地圖1.png",
        "https://www.google.com/maps/d/u/0/viewer?mid=1D808RN4l0f3E3ezyLPhS02ll29-DD4c&ll=24.955491524705938%2C121.539346&z=16",
    ),
    MapAsset(
        2,
        "走讀地圖2.png",
        "https://www.google.com/maps/d/u/0/viewer?mid=1cqFLNuKTYBIYgFI1sw3ZBu5kgU8vkiw&ll=24.95597813920153%2C121.5348422&z=16",
    ),
    MapAsset(
        3,
        "走讀地圖3.png",
        "https://www.google.com/maps/d/u/0/viewer?mid=1yZSc8bxrrhyRNPb9doMi8bC_2xkpbC4&ll=24.954656028163647%2C121.5389225&z=16",
    ),
    MapAsset(
        4,
        "走讀地圖4_.png",
        "https://www.google.com/maps/d/u/0/viewer?mid=1ebAZN9ajYrf1Gkt78_Gw1AUYe09kxXo&ll=24.9554203%2C121.5376068&z=17",
    ),
)


def build():
    MAP_DIR.mkdir(parents=True, exist_ok=True)
    QR_DIR.mkdir(parents=True, exist_ok=True)

    for item in MAPS:
        source = SOURCE_DIR / item.source
        full = MAP_DIR / item.full_name
        preview = MAP_DIR / item.preview_name
        qr_path = QR_DIR / item.qr_name

        if not source.exists():
            raise FileNotFoundError(f"找不到正式地圖：{source}")

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
        if [result.text for result in decoded] != [item.url]:
            raise RuntimeError(f"QR 驗證失敗：{qr_path}")

        print(f"PASS map {item.number}: {full.name}, {preview.name}, {qr_path.name}")


if __name__ == "__main__":
    build()
