// Groq LPU (GroqChip 1): built from details/groq-lpu.md under build/MODEL-RULES.md and the photos build/ref/groq-card.png
// and build/ref/groq3-vs-rubin-package.png. All sizes and positions in mm. pos is the centre of the part's box. y is up.
// The card lies flat: PCIe fingers toward +z (south), the three link connectors on the -z (north) edge, east is +x.
// Level 1: the orange card. Level 2: the die floor plan. Level 3: one superlane. Only the unit order is published;
// every width, the package and the board layout are schematic. Counts and hierarchy are real where published.

/* ---------- Level 1: the GroqCard as in the photo ---------- */
const PCB = { w: 254, d: 111, top: 1.6 }; // 3/4-length full-height PCIe outline
const PKG = { x: -35, sub: 47, subH: 1.2, rim: 42, rimWall: 6, lidH: 2 };
const SUB_TOP = PCB.top + PKG.subH;
const DIE_H = 0.8;
const DIE_TOP1 = SUB_TOP + DIE_H;
const IND = { x: 20, n: 9, pitch: 9.5, z0: 3.5 };
const indZ = Array.from({ length: IND.n }, (_, i) => (i - (IND.n - 1) / 2) * IND.pitch);
const stageAt = indZ.map((z) => [0, 0, z]);
const indAt = indZ.map((z) => [0, 0, z]);
const BIG_IC = { x: 72, z: 14, s: 12 };
const icAt = [];
{
  let seed = 7;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  for (let iz = 0; iz < 9; iz++) for (let ix = 0; ix < 8; ix++) {
    const x = 48 + ix * 10, z = -40 + iz * 10;
    const keep = rnd() > 0.45, jx = (rnd() - 0.5) * 3, jz = (rnd() - 0.5) * 3;
    if (!keep || Math.abs(x - BIG_IC.x) < 12 && Math.abs(z - BIG_IC.z) < 12) continue;
    icAt.push([x + jx - 48, 0, z + jz]);
  }
}

/* ---------- Level 2: the die floor plan (25 x 29 mm, east-west across 29 mm, schematic widths) ---------- */
const SUB_H = 1.2;
const DIE = { w: 29, d: 25, top: SUB_H + 0.8 };
const ROW = { n: 20, pitch: 1.1, d: 1.0 }; // 20 superlanes, north to south
const rowZ = Array.from({ length: ROW.n }, (_, r) => (r - (ROW.n - 1) / 2) * ROW.pitch);
const UNIT_GAP = 0.1;
// West to east: MXM, SXM, MEM, VXM, MEM, SXM, MXM (S6 slide 19)
const WIDTHS = { mxmW: 4.6, sxmW: 1.2, memW: 7.4, vxm: 1.6, memE: 7.4, sxmE: 1.2, mxmE: 4.6 };
const X = {};
{
  const total = Object.values(WIDTHS).reduce((a, b) => a + b, 0) + UNIT_GAP * 6;
  let x = -total / 2;
  for (const [k, w] of Object.entries(WIDTHS)) { X[k] = x + w / 2; x += w + UNIT_GAP; }
}
const SPAN = Object.values(WIDTHS).reduce((a, b) => a + b, 0) + UNIT_GAP * 6; // 28.6 mm
const ROWS_Y = DIE.top + 0.02; // superlane strips, 0.04 thick
const TILE = { h: 0.1, y: DIE.top + 0.04 + 0.05 };
const MEM = { n: 44, gap: 0.03 };
MEM.w = (WIDTHS.memW - (MEM.n - 1) * MEM.gap) / MEM.n;
const PLANE = { w: (WIDTHS.mxmW - UNIT_GAP) / 2 };
const memRows = () => {
  const at = [];
  for (const z of rowZ) for (let i = 0; i < MEM.n; i++) at.push([-WIDTHS.memW / 2 + MEM.w / 2 + i * (MEM.w + MEM.gap), 0, z]);
  return at;
};
const planeRows = () => {
  const at = [];
  for (const z of rowZ) for (const dx of [-(PLANE.w + UNIT_GAP) / 2, (PLANE.w + UNIT_GAP) / 2]) at.push([dx, 0, z]);
  return at;
};
const oneRow = rowZ.map((z) => [0, 0, z]);
const EDGE = { d: 0.9, z: DIE.d / 2 - 0.45 - 0.3 }; // ICU strip south, C2C strip north

/* ---------- Level 3: one superlane (16 lanes, drawn 4x deeper north-south so the lanes read) ---------- */
const SL = { d: 3.4, base: 0.03, lane: 0.02, tile: 0.06 };
const SL_LANE_Y = SL.base + SL.lane / 2;
const SL_TILE_Y = SL.base + SL.lane + SL.tile / 2;
const memTilesAt = [];
for (const cx of [X.memW, X.memE]) for (let i = 0; i < MEM.n; i++) memTilesAt.push([cx - WIDTHS.memW / 2 + MEM.w / 2 + i * (MEM.w + MEM.gap), 0, 0]);
const CELL = { n: 16, gap: 0.02 };
CELL.w = (PLANE.w - (CELL.n - 1) * CELL.gap) / CELL.n;
CELL.d = (SL.d - (CELL.n - 1) * CELL.gap) / CELL.n;
const macAt = [];
for (const cx of [X.mxmW, X.mxmE]) {
  for (const px of [cx - (PLANE.w + UNIT_GAP) / 2, cx + (PLANE.w + UNIT_GAP) / 2]) {
    for (let r = 0; r < CELL.n; r++) for (let c = 0; c < CELL.n; c++) {
      macAt.push([px - PLANE.w / 2 + CELL.w / 2 + c * (CELL.w + CELL.gap), 0, -SL.d / 2 + CELL.d / 2 + r * (CELL.d + CELL.gap)]);
    }
  }
}
const STREAM = { n: 32, band: 0.4, h: 0.012 };
STREAM.pitch = STREAM.band / STREAM.n;
const streamAt = [];
for (const zc of [-(SL.d / 2 + 0.05 + STREAM.band / 2), SL.d / 2 + 0.05 + STREAM.band / 2]) {
  for (let i = 0; i < STREAM.n; i++) streamAt.push([0, 0, zc - STREAM.band / 2 + STREAM.pitch / 2 + i * STREAM.pitch]);
}
const SL_ICU = { d: 0.25, z: SL.d / 2 + 0.05 + STREAM.band + 0.05 + 0.125 };
const SL_BASE = { z0: -(SL.d / 2 + 0.05 + STREAM.band + 0.05), z1: SL_ICU.z + 0.125 + 0.05 };

export default {
  id: "groq-lpu",
  name: "GroqChip 1 (LPU)",
  maker: "Groq",
  year: "2022",
  order: 8,
  oneLine: "All-SRAM, deterministic.",
  hero: [
    "230 MB of on-die SRAM, no external memory",
    "Groq claims up to 80 TB/s on-die bandwidth",
    "576 chips linked to serve one Mixtral deployment",
  ],
  scale: { unit: "mm", stage: 30 },
  levels: [
    {
      id: "card",
      title: "GroqCard",
      parentPart: null,
      parts: [
        {
          id: "board", label: "GroqCard board", line: "Orange PCIe card; Groq prints no board layout, so this is schematic.",
          role: "structure", tone: "pcb-orange", shape: "slab", size: [PCB.w, PCB.top, PCB.d], pos: [0, PCB.top / 2, 0],
          holes: [[-67, -32, 4], [-3, -32, 4], [-67, 32, 4], [-3, 32, 4]], schematic: true,
          explode: { dir: [0, -1, 0], dist: 14, at: [0.5, 0.95] },
        },
        {
          id: "edge-tongue", label: "Card edge tongue", line: "Board tongue that plugs into the PCIe slot.",
          role: "structure", tone: "pcb-orange", shape: "slab", size: [89.6, PCB.top, 8], pos: [-52.5, PCB.top / 2, PCB.d / 2 + 4],
          follow: "board", schematic: true,
        },
        {
          id: "fingers", label: "PCIe Gen4 x16 edge", line: "Gold fingers on the front edge; Groq prints up to 31.5 GB/s.",
          role: "io", tone: "gold", shape: "box", size: [70.7, 0.15, 6.6], pos: [-43.85, PCB.top + 0.075, PCB.d / 2 + 4.2],
          grid: { nx: 71, nz: 1, gap: 0.3 }, follow: "board",
        },
        {
          id: "fingers-short", label: "PCIe edge, short side", line: "The 11 fingers before the slot key notch.",
          role: "io", tone: "gold", shape: "box", size: [10.7, 0.15, 6.6], pos: [-91.15, PCB.top + 0.075, PCB.d / 2 + 4.2],
          grid: { nx: 11, nz: 1, gap: 0.3 }, follow: "board", schematic: true,
        },
        {
          id: "bracket", label: "Card bracket", line: "Full-height steel bracket on the end of the card; schematic.",
          role: "structure", tone: "nickel", shape: "box", size: [1.2, 21, 120], pos: [-PCB.w / 2 - 0.6, 9.5, 4],
          schematic: true, explode: { dir: [-1, 0, 0], dist: 30, at: [0.5, 0.95] },
        },
        {
          id: "mount-rings", label: "Mounting pads", line: "Plated rings round the four package mounting holes.",
          role: "io", tone: "gold", shape: "frame", wall: 1.1, size: [7, 0.08, 7], pos: [-67, PCB.top + 0.04, -32],
          at: [[0, 0, 0], [64, 0, 0], [0, 0, 64], [64, 0, 64]], follow: "board", schematic: true,
        },
        {
          id: "decoupling-ns", label: "Decoupling capacitors", line: "Tan ceramic capacitors in rows beside the package.",
          role: "power", tone: "champagne", shape: "box", size: [1.1, 0.7, 1.8], pos: [PKG.x, PCB.top + 0.35, 0],
          at: Array.from({ length: 80 }, (_, i) => [((i % 40) - 19.5) * 1.15, 0, (i < 40 ? -1 : 1) * (24.5 + (Math.floor((i % 40) / 20) ? 3 : 0))]), follow: "board", schematic: true,
        },
        {
          id: "decoupling-ew", label: "Package-side capacitors", line: "More ceramic capacitors on the east and west sides.",
          role: "power", tone: "champagne", shape: "box", size: [0.9, 0.7, 1.8], pos: [-61.5, PCB.top + 0.35, 0],
          at: Array.from({ length: 40 }, (_, i) => [(i % 2) * 1.5 + (i >= 20 ? 51 : 0), 0, (Math.floor((i % 20) / 2) - 4.5) * 4.6]),
          follow: "board", schematic: true,
        },
        {
          id: "substrate", label: "Gold substrate", line: "Package base under the lid; size is schematic.",
          role: "io", tone: "gold", shape: "slab", size: [PKG.sub, PKG.subH, PKG.sub], pos: [PKG.x, PCB.top + PKG.subH / 2, 0],
          schematic: true, follow: "board",
          explode: { dir: [0, 1, 0], dist: 6, at: [0.4, 0.9] },
        },
        {
          id: "die", label: "GroqChip die", line: "25 x 29 mm die under the lid; 230 MB of SRAM, no DRAM.",
          role: "compute", tone: "die-colour", shape: "slab", size: [29, DIE_H, 25], pos: [PKG.x, SUB_TOP + DIE_H / 2, 0],
          glow: true, enter: "die", follow: "board",
          explode: { dir: [0, 1, 0], dist: 22, at: [0.3, 0.8] },
        },
        {
          id: "lid-rim", label: "Lid rim", line: "Silver feet of the lid around the die; schematic.",
          role: "structure", tone: "nickel", shape: "frame", wall: PKG.rimWall, size: [PKG.rim, DIE_H, PKG.rim],
          pos: [PKG.x, SUB_TOP + DIE_H / 2, 0], schematic: true, xray: true,
          explode: { dir: [0, 1, 0], dist: 36, at: [0.15, 0.7] },
        },
        {
          id: "lid", label: "Silver package lid", line: "Lid over the GroqChip; the die is 25 x 29 mm.",
          role: "structure", tone: "nickel", shape: "slab", size: [PKG.rim, PKG.lidH, PKG.rim],
          pos: [PKG.x, DIE_TOP1 + PKG.lidH / 2, 0], schematic: true, xray: true, enter: "die",
          explode: { dir: [0, 1, 0], dist: 52, at: [0.05, 0.6] },
        },
        {
          id: "lid-mark", label: "Lid corner mark", line: "Pin-1 dot on the lid corner; schematic.",
          role: "structure", tone: "matte", shape: "cyl", size: [1.6, 0.15, 1.6], pos: [PKG.x + 17, DIE_TOP1 + PKG.lidH + 0.075, -17],
          schematic: true, explode: { dir: [0, 1, 0], dist: 52, at: [0.05, 0.6] },
        },
        {
          id: "connectors", label: "Chip-to-chip connectors", line: "Three shown on this card; the SKUs list 11, 9 or 0.",
          role: "interconnect", tone: "matte", shape: "box", size: [11, 9, 7], pos: [-22, PCB.top + 4.5, -51.5],
          at: [[-16, 0, 0], [0, 0, 0], [16, 0, 0]], count: 3, follow: "board",
          explode: { dir: [0, 0.4, -1], dist: 20, at: [0.4, 0.9] },
        },
        {
          id: "connector-shells", label: "Connector shields", line: "Metal shells over the three link connectors.",
          role: "structure", tone: "silver", shape: "box", size: [10.6, 0.6, 6.6], pos: [-22, PCB.top + 9.3, -51.5],
          at: [[-16, 0, 0], [0, 0, 0], [16, 0, 0]], count: 3, follow: "board", schematic: true,
          explode: { dir: [0, 0.4, -1], dist: 20, at: [0.4, 0.9] },
        },
        {
          id: "inductors", label: "Power inductors", line: "Row of nine inductors beside the package.",
          role: "power", tone: "graphite", shape: "box", size: [9, 6, 8], pos: [IND.x, PCB.top + 3, IND.z0], at: indAt, count: 9,
          follow: "board", explode: { dir: [0, 1, 0], dist: 14, at: [0.3, 0.8] },
        },
        {
          id: "stages", label: "Power stages", line: "Small black chips next to each inductor.",
          role: "power", tone: "pcb-black", shape: "box", size: [4, 1.2, 4], pos: [IND.x + 10, PCB.top + 0.6, IND.z0], at: stageAt, count: 9,
          schematic: true, follow: "board", explode: { dir: [0, 1, 0], dist: 9, at: [0.3, 0.8] },
        },
        {
          id: "stage-caps", label: "Stage capacitors", line: "Ceramic capacitors in two columns by the inductor row.",
          role: "power", tone: "champagne", shape: "box", size: [2, 0.8, 3], pos: [26.25, PCB.top + 0.4, IND.z0],
          at: [...indZ.map((z) => [0, 0, z]), ...indZ.map((z) => [10, 0, z])], follow: "board", schematic: true,
          explode: { dir: [0, 1, 0], dist: 9, at: [0.3, 0.8] },
        },
        {
          id: "bulk-caps", label: "Bulk capacitors", line: "Black polymer capacitors along the front edge.",
          role: "power", tone: "pcb-black", shape: "box", size: [34, 3.4, 5.5], pos: [23, PCB.top + 1.7, 49],
          grid: { nx: 6, nz: 1, gap: 1 }, follow: "board", schematic: true,
          explode: { dir: [0, 1, 0], dist: 12, at: [0.3, 0.8] },
        },
        {
          id: "label", label: "Barcode label", line: "Silver sticker near the edge fingers; schematic.",
          role: "structure", tone: "silver", shape: "box", size: [18, 0.12, 5], pos: [-60, PCB.top + 0.06, 47], follow: "board", schematic: true,
        },
        {
          id: "corner-inductors", label: "Corner inductors", line: "Two more inductors near the left edge.",
          role: "power", tone: "graphite", shape: "box", size: [9, 6, 8], pos: [-88, PCB.top + 3, -33], at: [[0, 0, 0], [-8, 0, 29]], count: 2,
          schematic: true, follow: "board", explode: { dir: [0, 1, 0], dist: 14, at: [0.3, 0.8] },
        },
        {
          id: "link-header", label: "Header", line: "Black pin header near the inductor row.",
          role: "io", tone: "matte", shape: "box", size: [14, 5, 6], pos: [32, PCB.top + 2.5, -47], schematic: true, follow: "board",
          explode: { dir: [0, 1, 0], dist: 12, at: [0.3, 0.8] },
        },
        {
          id: "soc-ic", label: "Large control chip", line: "Biggest black chip on the right half; role not published.",
          role: "power", tone: "pcb-black", shape: "box", size: [BIG_IC.s, 1.6, BIG_IC.s], pos: [BIG_IC.x, PCB.top + 0.8, BIG_IC.z],
          schematic: true, follow: "board", explode: { dir: [0, 1, 0], dist: 10, at: [0.3, 0.8] },
        },
        {
          id: "small-ics", label: "Small chips", line: "Black chips and parts on the right half; count is schematic.",
          role: "power", tone: "pcb-black", shape: "box", size: [5, 1.4, 5], pos: [48, PCB.top + 0.7, 0], at: icAt, schematic: true,
          follow: "board", explode: { dir: [0, 1, 0], dist: 10, at: [0.3, 0.8] },
        },
        {
          id: "left-ic", label: "Small IC", line: "Small chip by the left edge; part not named.",
          role: "power", tone: "pcb-black", shape: "box", size: [8, 1.4, 6], pos: [-95, PCB.top + 0.7, 14], schematic: true, follow: "board",
          explode: { dir: [0, 1, 0], dist: 10, at: [0.3, 0.8] },
        },
      ],
      flows: [
        { from: "fingers", to: "die", label: "up to 31.5 GB/s over PCIe Gen4 x16 (compressed)", speed: 0.3 },
        { from: "die", to: "connectors", label: "480 GB/s chip total: 16 links x 4 lanes x 30 Gbps, both ways", speed: 1 },
      ],
      callouts: [
        { part: "die", title: "One chip", text: "One GroqChip on the card; its die is 25 x 29 mm." },
        { part: "connectors", title: "Direct links", text: "Chip-to-chip ports need no network switch; SKUs list up to 11." },
        { part: "fingers", title: "Host link", text: "PCIe Gen4 x16 connects the card to its server." },
        { part: "board", title: "No DRAM", text: "No external memory chips: all 230 MB sits on the die." },
        { part: "inductors", title: "Card power", text: "The card draws 240 W typical." },
      ],
    },
    {
      id: "die",
      title: "GroqChip die",
      parentPart: "lid",
      parts: [
        {
          id: "substrate", label: "Gold substrate", line: "Package base under the die; size and pad rows are schematic.",
          role: "io", tone: "gold", shape: "slab", size: [PKG.sub, SUB_H, PKG.sub], pos: [0, SUB_H / 2, 0], schematic: true,
        },
        {
          id: "pads-n", label: "Pad row north", line: "Solder pads around the die; count is schematic.",
          role: "io", tone: "gold", shape: "box", size: [38, 0.2, 6], pos: [0, SUB_H + 0.1, -18], grid: { nx: 38, nz: 6, gap: 0.3 }, schematic: true,
        },
        {
          id: "pads-s", label: "Pad row south", line: "Solder pads around the die; count is schematic.",
          role: "io", tone: "gold", shape: "box", size: [38, 0.2, 6], pos: [0, SUB_H + 0.1, 18], grid: { nx: 38, nz: 6, gap: 0.3 }, schematic: true,
        },
        {
          id: "pads-w", label: "Pad column west", line: "Solder pads around the die; count is schematic.",
          role: "io", tone: "gold", shape: "box", size: [6, 0.2, 24], pos: [-19, SUB_H + 0.1, 0], grid: { nx: 6, nz: 24, gap: 0.3 }, schematic: true,
        },
        {
          id: "pads-e", label: "Pad column east", line: "Solder pads around the die; count is schematic.",
          role: "io", tone: "gold", shape: "box", size: [6, 0.2, 24], pos: [19, SUB_H + 0.1, 0], grid: { nx: 6, nz: 24, gap: 0.3 }, schematic: true,
        },
        {
          id: "die-base", label: "GroqChip die", line: "25 x 29 mm, 14 nm; unit widths are schematic.",
          role: "compute", tone: "die-colour", shape: "slab", size: [DIE.w, 0.8, DIE.d], pos: [0, SUB_H + 0.4, 0], schematic: true,
        },
        {
          id: "superlanes", label: "Superlanes", line: "20 rows of 16 lanes cut east-west through every slice.",
          role: "structure", shape: "slab", size: [SPAN, 0.04, ROW.d], pos: [0, ROWS_Y, 0], at: oneRow, count: 20,
          enter: "superlane",
        },
        {
          id: "mxm_west", label: "MXM west", line: "Two 320 x 320 matrix planes; one supercell per superlane.",
          role: "compute", shape: "box", size: [PLANE.w, TILE.h, ROW.d], pos: [X.mxmW, TILE.y, 0], at: planeRows(), count: 40,
          glow: true, enter: "superlane",
          explode: { dir: [-1, 0.1, 0], dist: 9, at: [0.1, 0.55] },
        },
        {
          id: "sxm_west", label: "SXM west", line: "Switch unit that shifts, permutes and transposes data.",
          role: "interconnect", shape: "box", size: [WIDTHS.sxmW, TILE.h, ROW.d], pos: [X.sxmW, TILE.y, 0], at: oneRow, count: 20,
          enter: "superlane",
          explode: { dir: [-1, 0.1, 0], dist: 6, at: [0.25, 0.7] },
        },
        {
          id: "mem_west", label: "MEM west", line: "44 SRAM slices of 2.5 MiB, one tile per superlane.",
          role: "memory", shape: "box", size: [MEM.w, TILE.h, ROW.d], pos: [X.memW, TILE.y, 0], at: memRows(), count: 880,
          enter: "superlane",
          explode: { dir: [-1, 0.1, 0], dist: 3, at: [0.4, 0.85] },
        },
        {
          id: "vxm", label: "VXM vector strip", line: "5,120 vector ALUs in the centre, 16 per lane.",
          role: "compute", shape: "box", size: [WIDTHS.vxm, TILE.h, ROW.d], pos: [X.vxm, TILE.y, 0], at: oneRow, count: 20,
          glow: true, enter: "superlane",
        },
        {
          id: "mem_east", label: "MEM east", line: "Mirror of the west half: 44 SRAM slices.",
          role: "memory", shape: "box", size: [MEM.w, TILE.h, ROW.d], pos: [X.memE, TILE.y, 0], at: memRows(), count: 880,
          enter: "superlane",
          explode: { dir: [1, 0.1, 0], dist: 3, at: [0.4, 0.85] },
        },
        {
          id: "sxm_east", label: "SXM east", line: "Second switch unit, between east memory and matrix.",
          role: "interconnect", shape: "box", size: [WIDTHS.sxmE, TILE.h, ROW.d], pos: [X.sxmE, TILE.y, 0], at: oneRow, count: 20,
          enter: "superlane",
          explode: { dir: [1, 0.1, 0], dist: 6, at: [0.25, 0.7] },
        },
        {
          id: "mxm_east", label: "MXM east", line: "Two more 320 x 320 planes on the east edge.",
          role: "compute", shape: "box", size: [PLANE.w, TILE.h, ROW.d], pos: [X.mxmE, TILE.y, 0], at: planeRows(), count: 40,
          glow: true, enter: "superlane",
          explode: { dir: [1, 0.1, 0], dist: 9, at: [0.1, 0.55] },
        },
        {
          id: "icu", label: "Instruction control", line: "144 instruction queues; split across slices not published.",
          role: "structure", shape: "slab", size: [SPAN, TILE.h, EDGE.d], pos: [0, DIE.top + TILE.h / 2, EDGE.z], schematic: true,
          explode: { dir: [0, 0, 1], dist: 2.5, at: [0.2, 0.7] },
        },
        {
          id: "c2c_io", label: "C2C serdes", line: "16 links of 4 lanes at 30 Gbps; position not published.",
          role: "io", shape: "box", size: [16, TILE.h, EDGE.d], pos: [0, DIE.top + TILE.h / 2, -EDGE.z],
          grid: { nx: 16, nz: 1, gap: 0.15 }, count: 16, schematic: true,
          explode: { dir: [0, 0, -1], dist: 2.5, at: [0.2, 0.7] },
        },
      ],
      flows: [
        { from: "mem_west", to: "sxm_west", label: "On-die SRAM: Groq claims 80 TB/s; derivation not published (paper: 55 TiB/s at 1 GHz)", speed: 1 },
        { from: "mem_west", to: "vxm", label: "20 TiB/s of east and west stream bandwidth at 1 GHz (paper)", speed: 0.5 },
        { from: "mem_east", to: "mxm_east", label: "All 409,600 weights installed in under 40 cycles", speed: 0.7 },
      ],
      callouts: [
        { part: "mem_west", title: "SRAM slices", text: "88 slices in two halves hold 220 MiB in total." },
        { part: "mxm_west", title: "Matrix units", text: "Four 320 x 320 planes hold 409,600 weights." },
        { part: "vxm", title: "Vector strip", text: "5,120 vector ALUs sit in the centre of the die." },
        { part: "sxm_west", title: "Switch units", text: "Two units reshape and move data, one per half." },
        { part: "icu", title: "Instruction queues", text: "144 queues feed the slices from a software schedule." },
        { part: "die-base", title: "Fixed timing", text: "No caches, no arbiters: every run takes the same time." },
      ],
    },
    {
      id: "superlane",
      title: "One superlane",
      parentPart: "superlanes",
      parts: [
        {
          id: "superlane", label: "One superlane", line: "One of 20 rows; drawn 4x deeper than real.",
          role: "structure", shape: "slab", size: [SPAN, SL.base, SL_BASE.z1 - SL_BASE.z0],
          pos: [0, SL.base / 2, (SL_BASE.z0 + SL_BASE.z1) / 2], schematic: true,
        },
        {
          id: "sl_lanes", label: "16 lanes", line: "Each lane is one byte wide; 320 lanes cross the chip.",
          role: "structure", shape: "box", size: [SPAN, SL.lane, SL.d], pos: [0, SL_LANE_Y, 0],
          grid: { nx: 1, nz: 16, gap: 0.02 }, count: 16,
        },
        {
          id: "sl_mem_tile", label: "Memory tiles", line: "88 SRAM tiles, about 128 KiB each (derived).",
          role: "memory", shape: "box", size: [MEM.w, SL.tile, SL.d], pos: [0, SL_TILE_Y, 0], at: memTilesAt, count: 88,
          explode: { dir: [0, 1, 0], dist: 2, at: [0.3, 0.85] },
        },
        {
          id: "sl_sxm_tile", label: "Switch tiles", line: "Lane shifter and permuter, one per half.",
          role: "interconnect", shape: "box", size: [WIDTHS.sxmW, SL.tile, SL.d], pos: [0, SL_TILE_Y, 0],
          at: [[X.sxmW, 0, 0], [X.sxmE, 0, 0]], count: 2,
          explode: { dir: [0, 1, 0], dist: 3, at: [0.25, 0.8] },
        },
        {
          id: "sl_vxm_tile", label: "Vector ALUs", line: "16 lanes x 16 ALUs: 256 ALUs in this row.",
          role: "compute", shape: "box", size: [WIDTHS.vxm, SL.tile, SL.d], pos: [X.vxm, SL_TILE_Y, 0],
          grid: { nx: 16, nz: 16, gap: 0.02 }, count: 256, glow: true,
          explode: { dir: [0, 1, 0], dist: 4, at: [0.2, 0.75] },
        },
        {
          id: "sl_mxm_cell", label: "MAC supercells", line: "One 16 x 16 cell from each 320 x 320 plane.",
          role: "compute", shape: "box", size: [CELL.w, SL.tile, CELL.d], pos: [0, SL_TILE_Y, 0], at: macAt, count: 1024,
          glow: true,
          explode: { dir: [0, 1, 0], dist: 5, at: [0.15, 0.7] },
        },
        {
          id: "sl_streams", label: "Stream registers", line: "32 east and 32 west streams; one hop per cycle.",
          role: "interconnect", shape: "box", size: [SPAN, STREAM.h, STREAM.pitch * 0.6], pos: [0, SL.base + STREAM.h / 2, 0],
          at: streamAt, count: 64,
          explode: { dir: [0, 1, 0], dist: 0.3, spread: 0.6, at: [0.3, 0.85] },
        },
        {
          id: "sl_icu", label: "Instruction control tile", line: "Issues each instruction north: 20 tiles in 20 cycles.",
          role: "structure", shape: "box", size: [SPAN, SL.tile, SL_ICU.d], pos: [0, SL.base + SL.tile / 2, SL_ICU.z],
          schematic: true,
          explode: { dir: [0, 0, 1], dist: 2, at: [0.2, 0.7] },
        },
      ],
      flows: [
        { from: "sl_icu", to: "sl_mem_tile", label: "One instruction visits all 20 tiles of a slice in 20 cycles", speed: 0.4 },
        { from: "sl_mem_tile", to: "sl_mxm_cell", label: "16 streams x 16 bytes install 256 weights per cell per cycle", speed: 1 },
        { from: "sl_streams", to: "sl_vxm_tile", label: "32 B per lane per direction, one hop each cycle", speed: 0.7 },
      ],
      callouts: [
        { part: "superlane", title: "Superlane", text: "20 superlanes, each 16 lanes wide, make 320 lanes." },
        { part: "sl_mem_tile", title: "Memory tiles", text: "Each row has 88 SRAM tiles of 128 KiB." },
        { part: "sl_mxm_cell", title: "MAC cells", text: "Each row holds four 16 x 16 cells, 1,024 MACs." },
        { part: "sl_vxm_tile", title: "Vector mesh", text: "Each lane has a 4 x 4 mesh: 16 ALUs." },
        { part: "sl_streams", title: "Stream registers", text: "32 east and 32 west streams carry all data." },
      ],
    },
  ],
  glossary: [
    ["LPU", "Language Processing Unit, Groq's marketing name for its chip."],
    ["TSP", "Tensor Streaming Processor, the architecture name in Groq's papers."],
    ["GroqChip", "the first product chip built on the TSP design."],
    ["GroqCard", "one GroqChip on a PCIe card."],
    ["SRAM", "fast memory on the same die as the logic; small but quick."],
    ["DRAM", "memory in separate chips; bigger and slower than SRAM."],
    ["HBM", "stacks of DRAM next to a GPU die: high bandwidth, large capacity."],
    ["Deterministic", "the same program takes exactly the same number of cycles every time."],
    ["Compiler-scheduled", "the compiler fixes when each instruction and data move happens, before the run."],
    ["Slice", "a column of identical tiles that does one job, such as memory or matrix math."],
    ["Tile", "one small block of a slice, 16 lanes wide."],
    ["Lane", "one byte-wide data path that runs across the chip; there are 320."],
    ["Superlane", "a row of 16 lanes through every slice; the smallest unit of work."],
    ["Stream", "a vector of data that moves east or west one hop per cycle."],
    ["ICU", "instruction control unit: fetches instructions and sends them north into a slice."],
    ["MEM", "memory slice: SRAM that reads and writes vectors on streams."],
    ["VXM", "vector execution module: ALUs for per-element math such as add and ReLU."],
    ["MXM", "matrix execution module: arrays of multiply-accumulate cells."],
    ["SXM", "switch execution module: shift, permute and transpose data on the chip."],
    ["Supercell", "a 16 x 16 block of MAC units, one per superlane in each MXM plane."],
    ["C2C link", "a direct wire link between two chips; Groq brands it RealScale."],
    ["PCIe Gen4 x16", "the standard host connection for a card in a server."],
  ],
  notPublished: [
    "Floor plan geometry: only the unit order is published; every width here is schematic.",
    "Which of 25 and 29 mm runs east-west is not published.",
    "Where the C2C and PCIe blocks sit on the die.",
    "How the 144 instruction queues split across MEM, VXM, MXM and SXM slices.",
    "The 80 TB/s derivation; the paper gives 55 TiB/s at 1 GHz, about 51 TB/s at 900 MHz.",
    "The gap between derived 737 TOPS and Groq's claimed 750 TOPS.",
    "Package type, die thickness, heatsink and PCB layer details; only the card form factor is published.",
    "Where the C2C ports sit on the card; the model puts them on the far end.",
    "Split of power between chip (215 W TDP) and card (240 W typical).",
    "Groq has not published a per-model chip count; 576 comes from SemiAnalysis and Next Platform.",
    "Level 3 is drawn 4x deeper north-south than its real height of about 1.1 mm.",
    "220 MiB (paper) and 230 MB (product brief) are the same capacity in two unit systems.",
    "Shapes, colours and layout are design choices; counts and hierarchy are real.",
  ],
  sourcesPath: "details/groq-lpu.md",
};
