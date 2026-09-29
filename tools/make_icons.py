#!/usr/bin/env python3
"""אייקוני האפליקציה: סהר על רקע כחול כהה. מייצר 180, 192, 512 ו-512 מסכה (maskable) לתיקיית public.
הרצה:  python3 tools/make_icons.py   (דורש Pillow)"""
from pathlib import Path
from PIL import Image, ImageDraw

OUT = Path(__file__).resolve().parent.parent / "public"
BG = (14, 20, 36)
FG = (142, 162, 255)
STAR = (233, 236, 246)


def icon(size, radius_ratio):
    s = size * 4                       # דגימת יתר לקצוות חלקים
    img = Image.new("RGB", (s, s), BG)
    c = s / 2
    r = s * radius_ratio
    mask = Image.new("L", (s, s), 0)
    d = ImageDraw.Draw(mask)
    d.ellipse((c - r, c - r, c + r, c + r), fill=255)                  # הסהר: עיגול גדול פחות עיגול מוזז
    d.ellipse((c - r + r * 0.62, c - r - r * 0.10, c + r + r * 0.62, c + r - r * 0.10), fill=0)
    img.paste(Image.new("RGB", (s, s), FG), (0, 0), mask)
    sd = ImageDraw.Draw(img)
    for dx, dy, rr in ((0.30, -0.42, 0.030), (0.52, -0.10, 0.022), (0.10, -0.62, 0.018)):
        x, y, q = c + r * dx * 1.4, c + r * dy * 1.2, s * rr
        sd.ellipse((x - q, y - q, x + q, y + q), fill=STAR)
    return img.resize((size, size), Image.LANCZOS)


for name, size, ratio in (("icon-180.png", 180, 0.30), ("icon-192.png", 192, 0.30), ("icon-512.png", 512, 0.30), ("icon-maskable-512.png", 512, 0.24)):
    icon(size, ratio).save(OUT / name, optimize=True)
    print("נוצר", name)
