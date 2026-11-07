// Assembled-state (teardown 0) overlap check for a device spec: one box per part or instance; a frame counts as its four walls.
// Usage: node build/check-overlap.mjs js/devices/<slug>.js   (touching faces are fine; any shared volume is reported)
import { readFileSync } from "node:fs";
const src = readFileSync(process.argv[2], "utf8");
const spec = (await import("data:text/javascript," + encodeURIComponent(src))).default;
const EPS = 1e-6;
function boxesOf(p) {
  const [W, H, D] = p.size;
  const [px, py, pz] = p.pos;
  const out = [];
  const add = (cx, cy, cz, w, h, d, tag) => out.push({ id: p.id, tag, min: [cx - w / 2, cy - h / 2, cz - d / 2], max: [cx + w / 2, cy + h / 2, cz + d / 2] });
  if (p.shape === "frame") {
    const t = p.wall;
    add(px - W / 2 + t / 2, py, pz, t, H, D, "wallL"); add(px + W / 2 - t / 2, py, pz, t, H, D, "wallR");
    add(px, py, pz - D / 2 + t / 2, W, H, t, "wallF"); add(px, py, pz + D / 2 - t / 2, W, H, t, "wallB");
    return out;
  }
  if (p.at) { p.at.forEach((a, i) => { const r = a[3]; add(px + a[0], py + a[1], pz + a[2], r ? D : W, H, r ? W : D, i); }); return out; }
  if (p.grid) {
    const { nx = 1, nz = 1, ny = 1, gap = 0 } = p.grid;
    const cw = (W - (nx - 1) * gap) / nx, cd = (D - (nz - 1) * gap) / nz, ch = (H - (ny - 1) * gap) / ny;
    let n = 0; const max = p.count ?? nx * nz * ny;
    for (let l = 0; l < ny; l++) for (let r = 0; r < nz; r++) for (let c = 0; c < nx; c++) {
      if (n++ >= max) break;
      add(px - W / 2 + cw / 2 + c * (cw + gap), py - H / 2 + ch / 2 + l * (ch + gap), pz - D / 2 + cd / 2 + r * (cd + gap), cw, ch, cd, n - 1);
    }
    return out;
  }
  add(px, py, pz, W, H, D, 0);
  return out;
}
const overlap = (a, b) => [0, 1, 2].every((i) => a.min[i] < b.max[i] - EPS && b.min[i] < a.max[i] - EPS);
let bad = 0;
for (const L of spec.levels) {
  const all = L.parts.flatMap(boxesOf);
  for (let i = 0; i < all.length; i++) for (let j = i + 1; j < all.length; j++) {
    const a = all[i], b = all[j];
    if (a.id !== b.id && overlap(a, b)) { bad++; if (bad < 40) console.log(`${L.id}: ${a.id}[${a.tag}] x ${b.id}[${b.tag}]`); }
  }
  console.log(`${L.id}: ${all.length} boxes checked`);
}
console.log(bad ? `OVERLAPS: ${bad}` : "no overlaps at teardown 0");
process.exitCode = bad ? 1 : 0;
