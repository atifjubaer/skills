#!/usr/bin/env node
// Generates square 512x512 PNG logo for fastr-ecommerce-suite:
// marketplace/assets/fastr-ecommerce-suite-logo.png
//
// Dual-accent emerald/cyan theme representing full e-commerce ecosystem.

import zlib from 'node:zlib';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const SIZE = 512;
const SS = 4;
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

const BG = [15, 23, 42]; // slate-900
const EMERALD = [16, 185, 129]; // #10b981
const CYAN = [6, 182, 212]; // #06b6d4
const AMBER = [245, 158, 11]; // #f59e0b
const INDIGO = [99, 102, 241]; // #6366f1
const WHITE = [255, 255, 255];

function drawBundle(px, py, sample) {
  if (inRoundedBox(px, py, 12, 12, SIZE - 12, SIZE - 12, 112)) {
    paint(sample, BG);
  }

  // Dual intersecting glowing rings (FluentCart Indigo + Lemon Squeezy Amber)
  // Left ring: center (210, 256), r: 120, thickness: 16
  const d1 = Math.sqrt((px - 210) ** 2 + (py - 256) ** 2);
  if (d1 >= 104 && d1 <= 126) paint(sample, INDIGO);

  // Right ring: center (302, 256), r: 120, thickness: 16
  const d2 = Math.sqrt((px - 302) ** 2 + (py - 256) ** 2);
  if (d2 >= 104 && d2 <= 126) paint(sample, AMBER);

  // Overlap core highlight
  if (d1 >= 104 && d1 <= 126 && d2 >= 104 && d2 <= 126) {
    paint(sample, EMERALD);
  }

  // Central fast lightning / code bracket motif in white
  // '<' at (195, 256)
  if (inSegment(px, py, 215, 220, 185, 256, 10)) paint(sample, WHITE);
  if (inSegment(px, py, 185, 256, 215, 292, 10)) paint(sample, WHITE);

  // '>' at (317, 256)
  if (inSegment(px, py, 297, 220, 327, 256, 10)) paint(sample, WHITE);
  if (inSegment(px, py, 327, 256, 297, 292, 10)) paint(sample, WHITE);

  // Electric slash in cyan
  if (inSegment(px, py, 275, 210, 237, 302, 9)) paint(sample, CYAN);
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

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outPath = join(root, 'marketplace', 'assets', 'fastr-ecommerce-suite-logo.png');
const png = renderImage(drawBundle);
writeFileSync(outPath, png);
console.log(`Rendered ${outPath} (${png.length} bytes, 512x512)`);
