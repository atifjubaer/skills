#!/usr/bin/env node
// Draw the marketplace logo and write it to marketplace/assets/logo.png.
//
//   node scripts/make-logo.mjs
//
// MCPize's AI logo generator answers 400 from its OpenAI call, so the listing
// logo is produced here instead and uploaded through `saveLogoUrl`. Pure Node —
// no native image dependency, so it runs in CI and on a clean checkout.
//
// The mark is the product's own metaphor: two playing cards, one per SKU,
// overlapping into a suite.

import zlib from 'node:zlib';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const SIZE = 512;
const SS = 4; // supersampling factor, averaged down for anti-aliasing
const W = SIZE * SS;

const BG = [15, 23, 42]; // slate-900
const CARD_A = [99, 102, 241]; // indigo-500 — FluentCart
const CARD_B = [245, 158, 11]; // amber-500 — Lemon Squeezy

/** Rounded box spanning [x0,y0]-[x1,y1] with corner radius r. */
function inRoundedBox(px, py, x0, y0, x1, y1, r) {
  if (px < x0 || px > x1 || py < y0 || py > y1) return false;
  const cx = Math.min(Math.max(px, x0 + r), x1 - r);
  const cy = Math.min(Math.max(py, y0 + r), y1 - r);
  const dx = px - cx;
  const dy = py - cy;
  // Only the corner quadrants are constrained by the radius; the cross in the
  // middle is fully inside.
  if (dx === 0 || dy === 0) return true;
  return dx * dx + dy * dy <= r * r;
}

/** Point-in-card test after undoing the card's rotation. */
function inCard(px, py, cx, cy, w, h, r, angleDeg) {
  const a = (-angleDeg * Math.PI) / 180;
  const dx = px - cx;
  const dy = py - cy;
  const lx = dx * Math.cos(a) - dy * Math.sin(a);
  const ly = dx * Math.sin(a) + dy * Math.cos(a);
  return inRoundedBox(lx, ly, -w / 2, -h / 2, w / 2, h / 2, r);
}

/** Source-over composite of an opaque colour onto a premultiplied sample. */
function paint(sample, colour) {
  sample[0] = colour[0];
  sample[1] = colour[1];
  sample[2] = colour[2];
  sample[3] = 255;
}

const acc = new Float64Array(SIZE * SIZE * 4);

for (let sy = 0; sy < W; sy++) {
  for (let sx = 0; sx < W; sx++) {
    // Sample at the sub-pixel centre, in final-image coordinates.
    const px = (sx + 0.5) / SS;
    const py = (sy + 0.5) / SS;

    const sample = [0, 0, 0, 0];
    if (inRoundedBox(px, py, 8, 8, SIZE - 8, SIZE - 8, 112)) paint(sample, BG);
    if (inCard(px, py, SIZE / 2 - 42, SIZE / 2 + 6, 196, 268, 30, -14)) paint(sample, CARD_A);
    if (inCard(px, py, SIZE / 2 + 42, SIZE / 2 - 6, 196, 268, 30, 14)) paint(sample, CARD_B);

    const i = ((sy / SS) | 0) * SIZE * 4 + ((sx / SS) | 0) * 4;
    acc[i] += sample[0] * sample[3];
    acc[i + 1] += sample[1] * sample[3];
    acc[i + 2] += sample[2] * sample[3];
    acc[i + 3] += sample[3];
  }
}

const raw = Buffer.alloc(SIZE * (SIZE * 4 + 1));
for (let y = 0; y < SIZE; y++) {
  raw[y * (SIZE * 4 + 1)] = 0; // PNG filter: none
  for (let x = 0; x < SIZE; x++) {
    const i = (y * SIZE + x) * 4;
    const n = SS * SS;
    const alpha = acc[i + 3] / n;
    const o = y * (SIZE * 4 + 1) + 1 + x * 4;
    if (alpha <= 0) continue;
    // acc holds colour*alpha, so dividing by the alpha sum yields 0-255
    // directly; multiplying by 255 again would overflow a byte.
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
ihdr[8] = 8; // bit depth
ihdr[9] = 6; // colour type: RGBA
const png = Buffer.concat([
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  chunk('IHDR', ihdr),
  chunk('IDAT', zlib.deflateSync(raw, { level: 9 })),
  chunk('IEND', Buffer.alloc(0))
]);

const out = join(dirname(fileURLToPath(import.meta.url)), '..', 'marketplace', 'assets', 'logo.png');
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, png);
console.log(`wrote ${out} (${png.length} bytes, ${SIZE}x${SIZE})`);
