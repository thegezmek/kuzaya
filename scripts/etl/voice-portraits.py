#!/usr/bin/env python3
"""Face-centered portrait crops for voice profile photos."""

from __future__ import annotations

import os
import sys
from pathlib import Path

import cv2
import numpy as np

ROOT = Path(__file__).resolve().parents[2]
MODEL_PATH = ROOT / "scripts" / "etl" / "models" / "face_detection_yunet_2023mar.onnx"
ASSETS = Path.home() / (
    ".cursor/projects/Users-selcukdemirci-Desktop-GEZ-STUDIO-CURSOR-WEBSITEs-KUZAYA/assets"
)
OUT_DIR = ROOT / "public" / "voices"

PORTRAIT_W = 600
PORTRAIT_H = 750
ASPECT = 4 / 5
FACE_Y_RATIO = 0.36  # face center sits ~36% from top of crop (headroom above)

PORTRAITS = [
    ("arufan", "Arufan"),
    ("benedict-oduor", "Benedict_Oduor"),
    ("catherine-kunyanga", "Prof._Catherine_N._Kunyanga"),
    ("dennis-beesigamukama", "Dennis_Beesigamukama"),
    ("boaz-wasser", "Boaz_Wasser"),
    ("kelvin-kubai", "Kelvin_Kubai"),
    ("antony-mureithi", "Antony_Mureithi"),
    ("joel-rutto", "Joel_Rutto"),
    ("mary-mwendwa", "Mary_Mwendwa"),
    ("andrew-ngetich", "Andrew_Ngetich"),
    ("dennis-andayem", "Dennis_Andayem"),
    ("jan-taeke-galama", "Jan_Taeke_Galama"),
    ("avinash-mokate", "Avinash_Mokate"),
    ("ombok-mildred-judith", "Ombok_Mildred_Judith"),
    ("john-roche", "John_Roche"),
    ("blessing", "Blessing"),
    ("grace-mugo", "Grace_Mugo"),
    ("diana-anyango-ongere", "Diana_Anyango_Ongere"),
    ("vishakha-jani", "VIshakha_Jani"),
    ("anne-karuma", "Dr._Anne_Karuma"),
    ("wilson-juma-ochola", "Wilson_Juma_Ochola"),
    ("grace-kelly-muvunyi", "Grace_Kelly"),
    ("philipp-straub", "Philipp_Straub"),
    ("chrysantus-mbi-tanga", "Prof._Chrysantus_Mbi_Tanga"),
    ("emmanuel", "Emmanuel"),
    ("fred-kwizera", "Dr_Fred_Kwizera"),
    ("nelly-mbita", "Nelly_Mbita"),
    ("omoke-brian", "Omoke_Brian"),
    ("loraine-kabaka", "Loraine_Kabaka"),
    ("mercy-chelangat", "Mercy_Chelengat"),
    ("pascal", "Pascal"),
    ("noah-nasiali", "Noah_Nasiali"),
    ("junnie-wangari", "Junnie_Wangari"),
]

FACE_CASCADE = cv2.CascadeClassifier(
    cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
)
PROFILE_CASCADE = cv2.CascadeClassifier(
    cv2.data.haarcascades + "haarcascade_profileface.xml"
)
def find_source(prefix: str) -> Path:
    for name in os.listdir(ASSETS):
        if name.startswith(prefix) and name.lower().endswith((".png", ".jpg", ".jpeg")):
            return ASSETS / name
    raise FileNotFoundError(f"No asset for prefix: {prefix}")


def detect_faces_haar(gray: np.ndarray) -> list[tuple[int, int, int, int]]:
    faces: list[tuple[int, int, int, int]] = []
    for cascade, scale, neighbors in (
        (FACE_CASCADE, 1.08, 5),
        (PROFILE_CASCADE, 1.12, 4),
    ):
        found = cascade.detectMultiScale(
            gray,
            scaleFactor=scale,
            minNeighbors=neighbors,
            minSize=(48, 48),
        )
        for box in found:
            faces.append(tuple(int(v) for v in box))
    return faces


def detect_faces_yunet(img: np.ndarray) -> list[tuple[int, int, int, int]]:
    h, w = img.shape[:2]
    detector = cv2.FaceDetectorYN.create(str(MODEL_PATH), "", (w, h))
    detector.setInputSize((w, h))
    detector.setScoreThreshold(0.55)
    _, faces_raw = detector.detect(img)
    if faces_raw is None:
        return []

    faces: list[tuple[int, int, int, int]] = []
    for face in faces_raw:
        x, y, fw, fh = face[:4]
        faces.append((int(x), int(y), int(fw), int(fh)))
    return faces


def face_focal_point(img: np.ndarray) -> tuple[float, float, str]:
    h, w = img.shape[:2]
    faces = detect_faces_yunet(img)

    if not faces:
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        gray = cv2.equalizeHist(gray)
        faces = detect_faces_haar(gray)
        method = "haar" if faces else "center"
    else:
        method = "yunet"

    if not faces:
        return w / 2, h * 0.38, method

    x, y, fw, fh = max(faces, key=lambda f: f[2] * f[3])
    return x + fw / 2, y + fh / 2, method


def clamp_crop(left: int, top: int, crop_w: int, crop_h: int, w: int, h: int) -> tuple[int, int]:
    left = max(0, min(left, w - crop_w))
    top = max(0, min(top, h - crop_h))
    return left, top


def crop_portrait(img: np.ndarray) -> tuple[np.ndarray, str]:
    h, w = img.shape[:2]
    fx, fy, method = face_focal_point(img)

    if w / h > ASPECT:
        crop_h = h
        crop_w = round(h * ASPECT)
    else:
        crop_w = w
        crop_h = round(w / ASPECT)

    left = round(fx - crop_w / 2)
    top = round(fy - crop_h * FACE_Y_RATIO)
    left, top = clamp_crop(left, top, crop_w, crop_h, w, h)

    cropped = img[top : top + crop_h, left : left + crop_w]
    resized = cv2.resize(
        cropped, (PORTRAIT_W, PORTRAIT_H), interpolation=cv2.INTER_LANCZOS4
    )
    return resized, method


def main() -> int:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    ok = 0

    for voice_id, prefix in PORTRAITS:
        src = find_source(prefix)
        dest = OUT_DIR / f"{voice_id}.jpg"
        img = cv2.imread(str(src))
        if img is None:
            print(f"✗ {voice_id}: failed to read {src.name}", file=sys.stderr)
            continue

        portrait, method = crop_portrait(img)
        cv2.imwrite(str(dest), portrait, [cv2.IMWRITE_JPEG_QUALITY, 88])
        tag = "" if method == "yunet" else f" [{method} fallback]"
        print(f"✓ {dest.name} ← {src.name}{tag}")
        ok += 1

    betty_src = OUT_DIR / "betty-kibaara.jpg"
    if betty_src.exists():
        img = cv2.imread(str(betty_src))
        if img is not None:
            portrait, method = crop_portrait(img)
            cv2.imwrite(str(betty_src), portrait, [cv2.IMWRITE_JPEG_QUALITY, 88])
            tag = "" if method == "yunet" else f" [{method} fallback]"
            print(f"✓ betty-kibaara.jpg ← existing (re-cropped){tag}")
            ok += 1

    print(f"\nProcessed {ok} face-centered portraits → {OUT_DIR}")
    return 0 if ok >= len(PORTRAITS) else 1


if __name__ == "__main__":
    raise SystemExit(main())
