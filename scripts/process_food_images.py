#!/usr/bin/env python3
"""Build hero dish cutouts from hand-cleaned PNGs in images/."""

from __future__ import annotations

import json
import re
import sys
from collections import deque
from pathlib import Path

import numpy as np
from PIL import Image, ImageChops, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
SRC_DIR = ROOT / "images"
OUT_DIR = ROOT / "packages/shared/media/dishes"
DATA_DIR = ROOT / "packages/shared/data"
CANVAS = 1200
FILL = 0.90
ALPHA_KILL = 28
ALPHA_BOOST = 160

SKIP_NAMES = {"food_spread.png"}

# Bottom → top overlapping bands for layered drop
BANDS = [
    ("01", "base", 0.00, 0.45),
    ("02", "mid-low", 0.25, 0.60),
    ("03", "mid-high", 0.45, 0.80),
    ("04", "top", 0.60, 1.00),
]

BADGE_PAIRS = [
    ("FLAME GRILLED", "SECRET SAUCE"),
    ("PERI PERI", "HALAL FRESH"),
    ("SMASH STACK", "COVENTRY HEAT"),
    ("CRISPY WINGS", "BOLD FLAVOUR"),
    ("WRAP IT UP", "MADE FRESH"),
    ("PLATTER TIME", "SHARE SIZE"),
]


def slugify(stem: str) -> str:
    s = stem.lower().strip()
    s = re.sub(r"\s*\(\d+\)\s*$", "", s)
    s = re.sub(r"[^a-z0-9]+", "-", s).strip("-")
    return s or "dish"


def display_name(stem: str) -> str:
    s = re.sub(r"\s*\(\d+\)\s*$", "", stem).replace("_", " ").strip()
    return " ".join(w.capitalize() for w in s.split())


def pick_sources(src_dir: Path) -> list[Path]:
    """Prefer name.png over name (2).png; skip collage."""
    by_base: dict[str, list[Path]] = {}
    for p in sorted(src_dir.glob("*.png")):
        if p.name.lower() in SKIP_NAMES:
            continue
        base = re.sub(r"\s*\(\d+\)(?=\.png$)", "", p.name, flags=re.I)
        by_base.setdefault(base.lower(), []).append(p)

    chosen: list[Path] = []
    for _base, paths in sorted(by_base.items()):
        # Prefer file without (N) suffix
        plain = [p for p in paths if not re.search(r"\(\d+\)\.png$", p.name, re.I)]
        chosen.append(plain[0] if plain else paths[0])
    return chosen


def harden_alpha(arr: np.ndarray) -> np.ndarray:
    a = arr[..., 3].astype(np.int16)
    a[a < ALPHA_KILL] = 0
    mid = (a >= ALPHA_KILL) & (a < ALPHA_BOOST)
    a[mid] = ALPHA_BOOST + ((a[mid] - ALPHA_KILL) * (255 - ALPHA_BOOST)) // max(
        1, ALPHA_BOOST - ALPHA_KILL
    )
    a[a > 255] = 255
    arr[..., 3] = a.astype(np.uint8)
    return arr


def edge_bg_flood(arr: np.ndarray) -> np.ndarray:
    """Remove near-white / flat leftover bg connected to image edges."""
    h, w = arr.shape[:2]
    rgb = arr[..., :3].astype(np.int16)
    a = arr[..., 3]
    lum = rgb.mean(axis=2)
    sat = rgb.max(axis=2) - rgb.min(axis=2)

    # Candidate leftover bg: visible-ish, pale, low saturation
    is_bg = (a > 8) & (lum > 200) & (sat < 35)
    # Also treat fully transparent as visited wall
    visited = np.zeros((h, w), dtype=bool)
    q: deque[tuple[int, int]] = deque()

    def try_push(y: int, x: int) -> None:
        if y < 0 or x < 0 or y >= h or x >= w or visited[y, x]:
            return
        if not is_bg[y, x]:
            return
        visited[y, x] = True
        q.append((y, x))

    for x in range(w):
        try_push(0, x)
        try_push(h - 1, x)
    for y in range(h):
        try_push(y, 0)
        try_push(y, w - 1)

    while q:
        y, x = q.popleft()
        arr[y, x, 3] = 0
        for ny, nx in ((y - 1, x), (y + 1, x), (y, x - 1), (y, x + 1)):
            try_push(ny, nx)

    return arr


def despeckle(arr: np.ndarray, min_area: int = 120) -> np.ndarray:
    """Clear tiny isolated opaque islands via connected components."""
    from scipy import ndimage

    opaque = arr[..., 3] >= ALPHA_KILL
    labeled, n = ndimage.label(opaque)
    if n == 0:
        return arr
    counts = np.bincount(labeled.ravel())
    small = np.zeros(n + 1, dtype=bool)
    small[1:] = counts[1:] < min_area
    kill = small[labeled]
    arr[..., 3] = np.where(kill, 0, arr[..., 3])
    return arr


def cleanup(img: Image.Image) -> Image.Image:
    arr = np.array(img.convert("RGBA"))
    arr = harden_alpha(arr)
    arr = edge_bg_flood(arr)
    # Re-harden after flood
    arr = harden_alpha(arr)
    arr = despeckle(arr, min_area=120)
    return Image.fromarray(arr, "RGBA")


def fit_center(img: Image.Image, size: int = CANVAS, fill: float = FILL) -> Image.Image:
    img = img.convert("RGBA")
    bbox = img.getbbox()
    if not bbox:
        return Image.new("RGBA", (size, size), (0, 0, 0, 0))
    img = img.crop(bbox)
    w, h = img.size
    scale = min((size * fill) / w, (size * fill) / h)
    nw, nh = max(1, int(round(w * scale))), max(1, int(round(h * scale)))
    img = img.resize((nw, nh), Image.Resampling.LANCZOS)
    canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    canvas.paste(img, ((size - nw) // 2, (size - nh) // 2), img)
    return canvas


def band_mask(size: int, y0: float, y1: float, feather: int = 36) -> Image.Image:
    a0, a1 = int(y0 * size), int(y1 * size)
    ys = np.arange(size, dtype=np.float32)
    inside = (ys >= a0) & (ys < a1)
    dist_in = np.minimum(ys - a0, (a1 - 1) - ys)
    v = np.zeros(size, dtype=np.float32)
    v[inside] = 255.0
    soft = inside & (dist_in < feather)
    v[soft] = 255.0 * (dist_in[soft] + 1) / (feather + 1)
    col = v.astype(np.uint8).reshape(size, 1)
    arr = np.repeat(col, size, axis=1)
    mask = Image.fromarray(arr, mode="L")
    return mask.filter(ImageFilter.GaussianBlur(radius=max(1, feather // 3)))


def make_layers(full: Image.Image) -> list[tuple[str, str, Image.Image]]:
    r, g, b, a = full.split()
    out: list[tuple[str, str, Image.Image]] = []
    for order, part, y0, y1 in BANDS:
        mask = band_mask(full.size[0], y0, y1)
        combined = ImageChops.multiply(a, mask)
        layer = Image.merge("RGBA", (r, g, b, combined))
        out.append((order, part, layer))
    return out


def process_one(path: Path, index: int) -> dict:
    slug = slugify(path.stem)
    name = display_name(path.stem)
    badges = list(BADGE_PAIRS[(index - 1) % len(BADGE_PAIRS)])
    print(f"[{index:02d}] {path.name} → {slug}", flush=True)

    dish_dir = OUT_DIR / slug
    dish_dir.mkdir(parents=True, exist_ok=True)

    # Reuse existing cleaned full.png when present to skip expensive cleanup
    full_path = dish_dir / "full.png"
    if full_path.exists():
        full = Image.open(full_path).convert("RGBA")
    else:
        cleaned = cleanup(Image.open(path))
        full = fit_center(cleaned)
        full.save(full_path, "PNG", optimize=True)

    # Clear old band files (keep full.png)
    for old in dish_dir.glob("0*-*.png"):
        old.unlink()

    layers_meta = []
    for order, part, layer in make_layers(full):
        fname = f"{order}-{part}.png"
        layer.save(dish_dir / fname, "PNG", optimize=True)
        layers_meta.append(
            {
                "order": order,
                "part": part,
                "src": f"/media/dishes/{slug}/{fname}",
            }
        )

    return {
        "id": slug,
        "index": index,
        "name": name,
        "source": path.name,
        "badges": badges,
        "layers": layers_meta,
    }


def main() -> int:
    if not SRC_DIR.is_dir():
        print(f"Missing source dir: {SRC_DIR}", file=sys.stderr)
        return 1

    sources = pick_sources(SRC_DIR)
    if not sources:
        print("No PNGs found in images/", file=sys.stderr)
        return 1

    # Remove stale dish-* folders from previous FB pipeline
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    keep_slugs = {slugify(p.stem) for p in sources}
    for d in OUT_DIR.iterdir():
        if d.is_dir() and d.name not in keep_slugs:
            for f in d.glob("*"):
                f.unlink()
            d.rmdir()
            print(f"removed stale {d.name}", flush=True)

    DATA_DIR.mkdir(parents=True, exist_ok=True)
    dishes = [process_one(p, i) for i, p in enumerate(sources, start=1)]
    dishes.sort(key=lambda d: d["index"])

    out_json = DATA_DIR / "dishes.json"
    out_json.write_text(json.dumps({"dishes": dishes}, indent=2) + "\n")
    print(f"Wrote {out_json} ({len(dishes)} dishes)", flush=True)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
