#!/usr/bin/env node
// Generates square 512x512 PNG logos for Agensi skill listings:
// 1. marketplace/assets/fluentcart-developer-logo.png
// 2. marketplace/assets/lemonsqueezy-developer-logo.png
//
// Pure Node with built-in zlib — no native image dependencies.

import zlib from 'node:zlib';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const SIZE = 512;
const SS = 4; // 4x supersampling for smooth antialiasing
const W = SIZE * SS;

function inRoundedBox(px, py, x0, y0, x1, y1, r) {
  if (px < x0 || px > x1 || py < y0 || py > y1) return false;
  const cx = Math.min(Math.max(px, x0 + r), x1 - r);
  const cy = Math.min(Math.max(py, y0 + r), y1 - r);
  const dx = px - cx;
  const dy = py - cy;
  if (dx === 0 || dy === 0) return true;
  return dx * dx + dy * dy <= r * r;
}

function inCircle(px, py, cx, cy, r) {
  const dx = px - cx;
  const dy = py - cy;
  return dx * dx + dy * dy <= r * r;
}

function inSegment(px, py, x0, y0, x1, y1, thickness) {
  const dx = x1 - x0;
  const dy = y1 - y0;
  const lenSq = dx * dx + dy * dy;
  if (lenSq === 0) return inCircle(px, py, x0, y0, thickness);
  let t = ((px - x0) * dx + (py - y0) * dy) / lenSq;
  t = Math.max(0, Math.min(1, t));
  const projX = x0 + t * dx;
  const projY = y0 + t * dy;
  const distSq = (px - projX) * (px - projX) + (py - projY) * (py - projY);
  return distSq <= (thickness * thickness);
}

function paint(sample, colour) {
  sample[0] = colour[0];
  sample[1] = colour[1];
  sample[2] = colour[2];
  sample[3] = 255;
}

function renderImage(drawFn) {
  const acc = new Float64Array(SIZE * SIZE * 4);

  for (let sy = 0; sy < W; sy++) {
    for (let sx = 0; sx < W; sx++) {
      const px = (sx + 0.5) / SS;
      const py = (sy + 0.5) / SS;
      const sample = [0, 0, 0, 0];
      drawFn(px, py, sample);

      const i = ((sy / SS) | 0) * SIZE * 4 + ((sx / SS) | 0) * 4;
      acc[i] += sample[0] * sample[3];
      acc[i + 1] += sample[1] * sample[3];
      acc[i + 2] += sample[2] * sample[3];
      acc[i + 3] += sample[3];
    }
  }

  const raw = Buffer.alloc(SIZE * (SIZE * 4 + 1));
  for (let y = 0; y < SIZE; y++) {
    raw[y * (SIZE * 4 + 1)] = 0;
    for (let x = 0; x < SIZE; x++) {
      const i = (y * SIZE + x) * 4;
      const n = SS * SS;
      const alpha = acc[i + 3] / n;
      const o = y * (SIZE * 4 + 1) + 1 + x * 4;
      if (alpha <= 0) continue;
      raw[o] = Math.round(acc[i] / acc[i + 3]);
      raw[o + 1] = Math.round(acc[i + 1] / acc[i + 3]);
      raw[o + 2] = Math.round(acc[i + 2] / acc[i + 3]);
      raw[o + 3] = Math.round(alpha);
    }
  }

  function chunk(type, data) {
    const length = Buffer.alloc(4);
    length.writeUInt32BE(data.length);
    const body = Buffer.concat([Buffer.from(type, 'ascii'), data]);
    const crc = Buffer.alloc(4);
    crc.writeUInt32BE(zlib.crc32(body) >>> 0);
    return Buffer.concat([length, body, crc]);
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(SIZE, 0);
  ihdr.writeUInt32BE(SIZE, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;

  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', zlib.deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0))
  ]);
}

// ------------------------------------------------------------- 1. FluentCart Logo
// Indigo/Violet theme with a clean shopping cart geometry + code brackets inside
const BG = [15, 23, 42]; // slate-900
const INDIGO_PRIMARY = [99, 102, 241]; // #6366f1
const INDIGO_LIGHT = [165, 180, 252]; // #a5b4fc
const WHITE = [255, 255, 255];

function drawFluentCart(px, py, sample) {
  // Tile background
  if (inRoundedBox(px, py, 12, 12, SIZE - 12, SIZE - 12, 112)) {
    paint(sample, BG);
  }

  // Cart handle & basket outline
  // Handle: from (120, 160) to (160, 160) down to (190, 290) to (370, 290)
  const t = 14;
  if (inSegment(px, py, 115, 150, 165, 150, t)) paint(sample, INDIGO_PRIMARY);
  if (inSegment(px, py, 165, 150, 195, 295, t)) paint(sample, INDIGO_PRIMARY);
  if (inSegment(px, py, 195, 295, 385, 295, t)) paint(sample, INDIGO_PRIMARY);
  if (inSegment(px, py, 385, 295, 415, 185, t)) paint(sample, INDIGO_PRIMARY);
  if (inSegment(px, py, 175, 185, 415, 185, t)) paint(sample, INDIGO_PRIMARY);

  // Cart wheels
  if (inCircle(px, py, 235, 360, 32)) paint(sample, INDIGO_LIGHT);
  if (inCircle(px, py, 235, 360, 14)) paint(sample, BG);
  if (inCircle(px, py, 345, 360, 32)) paint(sample, INDIGO_LIGHT);
  if (inCircle(px, py, 345, 360, 14)) paint(sample, BG);

  // Code bracket '<' inside cart
  if (inSegment(px, py, 275, 215, 250, 240, 7)) paint(sample, WHITE);
  if (inSegment(px, py, 250, 240, 275, 265, 7)) paint(sample, WHITE);

  // Code bracket '>' inside cart
  if (inSegment(px, py, 305, 215, 330, 240, 7)) paint(sample, WHITE);
  if (inSegment(px, py, 330, 240, 305, 265, 7)) paint(sample, WHITE);

  // Slash '/'
  if (inSegment(px, py, 295, 212, 285, 268, 6)) paint(sample, INDIGO_LIGHT);
}

// ------------------------------------------------------------- 2. Lemon Squeezy Logo
// Amber/Yellow theme with citrus geometry + code brackets
const AMBER_PRIMARY = [245, 158, 11]; // #f59e0b
const AMBER_LIGHT = [252, 211, 77]; // #fcd34d

function drawLemonSqueezy(px, py, sample) {
  // Tile background
  if (inRoundedBox(px, py, 12, 12, SIZE - 12, SIZE - 12, 112)) {
    paint(sample, BG);
  }

  // Outer lemon body: circle with pointy tips
  if (inCircle(px, py, SIZE / 2, SIZE / 2, 145)) {
    paint(sample, AMBER_PRIMARY);
  }
  // Left and right lemon tips
  if (inRoundedBox(px, py, 80, 236, 130, 276, 20)) paint(sample, AMBER_PRIMARY);
  if (inRoundedBox(px, py, 382, 236, 432, 276, 20)) paint(sample, AMBER_PRIMARY);

  // Inner lemon slice background (lighter yellow)
  if (inCircle(px, py, SIZE / 2, SIZE / 2, 120)) {
    paint(sample, AMBER_LIGHT);
  }

  // Inner center dark core
  if (inCircle(px, py, SIZE / 2, SIZE / 2, 95)) {
    paint(sample, BG);
  }

  // Code bracket '<' inside lemon
  if (inSegment(px, py, 235, 220, 205, 256, 9)) paint(sample, WHITE);
  if (inSegment(px, py, 205, 256, 235, 292, 9)) paint(sample, WHITE);

  // Code bracket '>' inside lemon
  if (inSegment(px, py, 277, 220, 307, 256, 9)) paint(sample, WHITE);
  if (inSegment(px, py, 307, 256, 277, 292, 9)) paint(sample, WHITE);

  // Slash '/'
  if (inSegment(px, py, 264, 215, 248, 297, 8)) paint(sample, AMBER_PRIMARY);
}

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const assetsDir = join(root, 'marketplace', 'assets');
mkdirSync(assetsDir, { recursive: true });

console.log('Rendering FluentCart Developer Logo...');
const fcPng = renderImage(drawFluentCart);
const fcPath = join(assetsDir, 'fluentcart-developer-logo.png');
writeFileSync(fcPath, fcPng);
console.log(`wrote ${fcPath} (${fcPng.length} bytes, 512x512)`);

console.log('Rendering Lemon Squeezy Developer Logo...');
const lsPng = renderImage(drawLemonSqueezy);
const lsPath = join(assetsDir, 'lemonsqueezy-developer-logo.png');
writeFileSync(lsPath, lsPng);
console.log(`wrote ${lsPath} (${lsPng.length} bytes, 512x512)`);
