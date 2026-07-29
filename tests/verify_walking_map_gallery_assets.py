from pathlib import Path

from PIL import Image
import zxingcpp


ROOT = Path(__file__).resolve().parents[1]
EXPECTED = {
    1: (
        (3200, 1800),
        "https://www.google.com/maps/d/u/0/viewer?mid=1D808RN4l0f3E3ezyLPhS02ll29-DD4c&ll=24.955491524705938%2C121.539346&z=16",
    ),
    2: (
        (3200, 1800),
        "https://www.google.com/maps/d/u/0/viewer?mid=1cqFLNuKTYBIYgFI1sw3ZBu5kgU8vkiw&ll=24.95597813920153%2C121.5348422&z=16",
    ),
    3: (
        (4269, 2400),
        "https://www.google.com/maps/d/u/0/viewer?mid=1yZSc8bxrrhyRNPb9doMi8bC_2xkpbC4&ll=24.954656028163647%2C121.5389225&z=16",
    ),
    4: (
        (3600, 1938),
        "https://www.google.com/maps/d/u/0/viewer?mid=1ebAZN9ajYrf1Gkt78_Gw1AUYe09kxXo&ll=24.9554203%2C121.5376068&z=17",
    ),
}


for number, (full_size, url) in EXPECTED.items():
    full = ROOT / f"assets/images/maps/walking-map-{number}.png"
    preview = ROOT / f"assets/images/maps/walking-map-{number}-preview.webp"
    qr = ROOT / f"assets/images/qr/walking-map-{number}-qr.png"
    assert full.exists() and preview.exists() and qr.exists()

    with Image.open(full) as image:
        assert image.size == full_size
        assert image.info.get("dpi", (0, 0))[0] > 299

    with Image.open(preview) as image:
        assert image.width == 1280
        assert image.height < 1280

    decoded = zxingcpp.read_barcodes(Image.open(qr))
    assert [item.text for item in decoded] == [url]

print("PASS: four full maps, four previews, and four verified QR codes")
