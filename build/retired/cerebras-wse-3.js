// Cerebras WSE-3 in its engine block: built from details/cerebras-wse-3.md and the owner photos (build/ref/cerebras-wse3-*.png).
// All sizes and positions in mm. pos is the centre of the part's box. y is up. Three levels: engine block with wafer, wafer, one core patch.

/* ---------- Level 1: the wafer in its metal engine block (fixture photo) ---------- */
const SQ = 215; // active square, 46,225 mm2
const W_T = 1.2; // drawn thickness; real wafer is 0.775 mm
const PLINTH = { y0: 0, y1: 8, w: 340 };
const BLOCK = { y0: PLINTH.y1, y1: PLINTH.y1 + 18, w: 300 };
const WAF = { y0: BLOCK.y1, y1: BLOCK.y1 + W_T };
const CONN_Z = SQ / 2 + 7; // connector strip centre, 2 mm clear of the wafer edge
const RAIL_X = SQ / 2 + 8;
const POST_XZ = 135;
const connAt = [-80, -40, 0, 40, 80].map((x) => [x, 0, 0]);

/* ---------- Level 2: the wafer (215 x 215 mm square, 7 x 12 dies schematic, holes on the scribe lines) ---------- */
const NX = 7;
const NZ = 12;
const DIE_GAP = 1; // drawn scribe gap; real scribe lines are narrower
const CW = (SQ - (NX - 1) * DIE_GAP) / NX;
const CD = (SQ - (NZ - 1) * DIE_GAP) / NZ;
const dieX = (c) => -SQ / 2 + CW / 2 + c * (CW + DIE_GAP);
const dieZ = (r) => -SQ / 2 + CD / 2 + r * (CD + DIE_GAP);
const gapX = (c) => -SQ / 2 + (c + 1) * CW + c * DIE_GAP + DIE_GAP / 2;
const gapZ = (r) => -SQ / 2 + (r + 1) * CD + r * DIE_GAP + DIE_GAP / 2;
const HOLE_D = 3.2;
const HOLE_COLS = 10;
const HOLE_ROWS = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const holeX = Array.from({ length: HOLE_COLS }, (_, i) => -SQ / 2 + (SQ * (i + 0.5)) / HOLE_COLS);
const holes = [];
for (const r of HOLE_ROWS) for (const x of holeX) holes.push([x, gapZ(r), HOLE_D]);
const EDGE = SQ / 2 - 3.5;
for (let c = 0; c < NX; c++) holes.push([dieX(c), -EDGE, HOLE_D], [dieX(c), EDGE, HOLE_D]);
for (let r = 0; r < NZ; r++) holes.push([-EDGE, dieZ(r), HOLE_D], [EDGE, dieZ(r), HOLE_D]);
const LINE = { w: 0.8, h: 0.06 };
const lineXAt = [];
for (let r = 0; r < NZ; r++) for (let c = 0; c < NX - 1; c++) lineXAt.push([gapX(c), 0, dieZ(r)]);
const HOLE_PITCH = SQ / HOLE_COLS;
const SEG = HOLE_PITCH - HOLE_D; // line piece between two holes
const END_SEG = HOLE_PITCH / 2 - HOLE_D / 2; // line piece from a wafer edge to the first hole
const lineMidAt = [];
const lineEndAt = [];
const lineFullAt = [];
for (let r = 0; r < NZ - 1; r++) {
  if (!HOLE_ROWS.includes(r + 1)) {
    lineFullAt.push([0, 0, gapZ(r)]);
    continue;
  }
  for (let i = 0; i < HOLE_COLS - 1; i++) lineMidAt.push([(holeX[i] + holeX[i + 1]) / 2, 0, gapZ(r)]);
  lineEndAt.push([-SQ / 2 + END_SEG / 2, 0, gapZ(r)], [SQ / 2 - END_SEG / 2, 0, gapZ(r)]);
}
const DIE_Y = W_T;
const HILITE = { c: 3, r: 5, inset: 4 };

/* ---------- Level 3: one core among its neighbours (core about 0.05 mm2; floor plan schematic) ---------- */
const P = 0.224; // core pitch, sqrt(0.05 mm2)
const T = 0.21; // core tile, leaving a 0.014 mm lane
const HALF = 2; // a 5 x 5 patch of cores
const SUB = 0.02; // die substrate under the patch
const CORE_TOP = SUB + 0.008;
const neighbourAt = [];
const spareAt = [];
for (let j = -HALF; j <= HALF; j++) {
  for (let i = -HALF; i <= HALF; i++) {
    if (i === 0 && j === 0) continue;
    (Math.abs(i) === HALF && i === -j ? spareAt : neighbourAt).push([i * P, 0, j * P]);
  }
}
const RT = { x0: 0.045, x1: 0.1, c: 0.0725 }; // router square in the core's +x +z corner
const LINK = { len: P - (RT.x1 - RT.x0), w: 0.012, h: 0.003 }; // router edge to the neighbour's router edge
const linkAt = [
  [RT.x1 + LINK.len / 2, 0, RT.c],
  [RT.x0 - LINK.len / 2, 0, RT.c],
  [RT.c, 0, RT.x1 + LINK.len / 2, Math.PI / 2],
];

export default {
  id: "cerebras-wse-3",
  name: "Wafer-Scale Engine 3",
  maker: "Cerebras",
  year: "2024",
  order: 7,
  oneLine: "The wafer is the chip.",
  hero: [
    "46,225 mm2 of silicon in one chip",
    "4 trillion transistors, 900,000 AI cores, TSMC 5 nm",
    "44 GB on-chip SRAM at 21 PB/s",
  ],
  scale: { unit: "mm", stage: 60 },
  levels: [
    {
      id: "engine",
      title: "Engine block",
      parentPart: null,
      parts: [
        {
          id: "plinth", label: "Mounting plate", line: "Flat plate under the engine block; size is schematic.",
          role: "structure", tone: "nickel", shape: "slab", size: [PLINTH.w, PLINTH.y1 - PLINTH.y0, PLINTH.w],
          pos: [0, (PLINTH.y0 + PLINTH.y1) / 2, 0], schematic: true,
          explode: { dir: [0, -1, 0], dist: 40, at: [0.1, 0.6] },
        },
        {
          id: "block", label: "Engine block", line: "Machined metal block that holds the wafer flat.",
          role: "structure", tone: "nickel", shape: "slab", size: [BLOCK.w, BLOCK.y1 - BLOCK.y0, BLOCK.w],
          pos: [0, (BLOCK.y0 + BLOCK.y1) / 2, 0], schematic: true,
        },
        {
          id: "wafer", label: "WSE-3 wafer", line: "One chip, 215 x 215 mm, with a grid of round holes.",
          role: "compute", tone: "gold", shape: "slab", size: [SQ, W_T, SQ], pos: [0, (WAF.y0 + WAF.y1) / 2, 0],
          holes, enter: "wafer",
          explode: { dir: [0, 1, 0], dist: 90, at: [0.3, 0.8] },
        },
        {
          id: "conn-north", label: "Connector strip", line: "Gold pin strips on the north edge; 12 x 100 GbE in all.",
          role: "io", tone: "gold", shape: "box", size: [36, 7, 10], pos: [0, WAF.y0 + 3.5, -CONN_Z],
          count: 5, at: connAt, schematic: true,
          explode: { dir: [0, 0, -1], dist: 70, at: [0.2, 0.7] },
        },
        {
          id: "conn-south", label: "Connector strip", line: "Same pin strips on the south edge, under the NORTH tag.",
          role: "io", tone: "gold", shape: "box", size: [36, 7, 10], pos: [0, WAF.y0 + 3.5, CONN_Z],
          count: 5, at: connAt, schematic: true,
          explode: { dir: [0, 0, 1], dist: 70, at: [0.2, 0.7] },
        },
        {
          id: "rails", label: "Clamp rails", line: "Metal rails on the east and west edges hold the wafer.",
          role: "structure", tone: "nickel", shape: "box", size: [12, 14, 240], pos: [0, BLOCK.y1 + 7, 0],
          count: 2, at: [[-RAIL_X - 2, 0, 0], [RAIL_X + 2, 0, 0]], schematic: true,
          explode: { dir: [0, 1, 0], dist: 30, spread: 0.5, at: [0.2, 0.7] },
        },
        {
          id: "posts", label: "Posts", line: "Four posts, one at each corner of the block.",
          role: "structure", tone: "nickel", shape: "cyl", size: [22, 70, 22], pos: [0, BLOCK.y1 + 35, 0],
          count: 4, at: [[-POST_XZ, 0, -POST_XZ], [POST_XZ, 0, -POST_XZ], [-POST_XZ, 0, POST_XZ], [POST_XZ, 0, POST_XZ]],
          schematic: true,
          explode: { dir: [0, 1, 0], dist: 50, spread: 0.3, at: [0.1, 0.6] },
        },
        {
          id: "north-tag", label: "NORTH tag", line: "White tag on the block marks the north side.",
          role: "structure", tone: "silver", shape: "slab", size: [40, 0.6, 12], pos: [0, BLOCK.y1 + 0.3, POST_XZ],
          schematic: true,
        },
      ],
      flows: [
        { from: "conn-north", to: "wafer", label: "1.2 Tb/s in and out over 12 x 100 GbE", speed: 0.15 },
        { from: "conn-south", to: "wafer", label: "power and signals pass through the edge strips", speed: 0.3 },
      ],
      callouts: [
        { part: "wafer", title: "One chip", text: "The chip is one 46,225 mm2 square of silicon." },
        { part: "block", title: "Engine block", text: "The wafer sits in a machined metal block." },
        { part: "conn-north", title: "Wired out", text: "12 ports of 100 GbE link the wafer to the world." },
        { part: "posts", title: "Four posts", text: "Four posts stand at the corners of the block." },
      ],
    },
    {
      id: "wafer",
      title: "WSE-3 wafer",
      parentPart: "wafer",
      parts: [
        {
          id: "wafer-slab", label: "Gold wafer", line: "Cerebras claims 125 PFLOPS FP16, sparse; dense not published.",
          role: "compute", tone: "gold", shape: "slab", size: [SQ, W_T, SQ], pos: [0, W_T / 2, 0], holes,
        },
        {
          id: "wafer-edge", label: "Edge ring", line: "Dark border around the active square.",
          role: "structure", tone: "graphite", shape: "frame", wall: 3, size: [SQ + 6, W_T, SQ + 6], pos: [0, W_T / 2, 0],
          schematic: true,
          explode: { dir: [0, 0, 0], dist: 0, spread: 0.1 },
        },
        {
          id: "die-one", label: "One die", line: "About 84 dies tile the wafer; count is schematic.",
          role: "compute", tone: "gold", shape: "slab", size: [CW - HILITE.inset, 0.1, CD - HILITE.inset],
          pos: [dieX(HILITE.c), DIE_Y + 0.05, dieZ(HILITE.r)], schematic: true, glow: true, enter: "core",
          explode: { dir: [0, 1, 0], dist: 10, at: [0.2, 0.8] },
        },
        {
          id: "lines-x", label: "Die grid lines", line: "Wires cross the scribe lines that are normally sawn.",
          role: "interconnect", tone: "graphite", shape: "slab", size: [LINE.w, LINE.h, CD], pos: [0, DIE_Y + LINE.h / 2, 0],
          at: lineXAt, schematic: true,
          explode: { dir: [0, 1, 0], dist: 4, at: [0.2, 0.8] },
        },
        {
          id: "lines-z", label: "Die grid lines", line: "Same lines the other way; 214 Pb/s fabric in total.",
          role: "interconnect", tone: "graphite", shape: "slab", size: [SEG, LINE.h, LINE.w], pos: [0, DIE_Y + LINE.h / 2, 0],
          at: lineMidAt, schematic: true,
          explode: { dir: [0, 1, 0], dist: 4, at: [0.2, 0.8] },
        },
        {
          id: "lines-z-ends", label: "Die grid lines", line: "Line pieces from the wafer edge to the first hole.",
          role: "interconnect", tone: "graphite", shape: "slab", size: [END_SEG, LINE.h, LINE.w], pos: [0, DIE_Y + LINE.h / 2, 0],
          at: lineEndAt, schematic: true,
          explode: { dir: [0, 1, 0], dist: 4, at: [0.2, 0.8] },
        },
        {
          id: "lines-z-full", label: "Die grid lines", line: "Full-width lines where the wafer has no holes.",
          role: "interconnect", tone: "graphite", shape: "slab", size: [SQ, LINE.h, LINE.w], pos: [0, DIE_Y + LINE.h / 2, 0],
          at: lineFullAt, schematic: true,
          explode: { dir: [0, 1, 0], dist: 4, at: [0.2, 0.8] },
        },
      ],
      flows: [
        { from: "lines-z", to: "die-one", label: "214 Pb/s fabric bandwidth across the wafer; no per-link figure", speed: 1 },
      ],
      callouts: [
        { part: "die-one", title: "Tiled wafer", text: "About 84 dies sit side by side on the wafer." },
        { part: "lines-x", title: "Wired scribe lines", text: "Wires cross the lines that are normally cut." },
        { part: "wafer-slab", title: "Core count", text: "900,000 AI cores work together on one fabric." },
        { part: "wafer-slab", title: "Fast memory", text: "44 GB of SRAM reads at 21 PB/s." },
        { part: "wafer-slab", title: "Round holes", text: "A regular grid of round holes pierces the wafer." },
      ],
    },
    {
      id: "core",
      title: "One core",
      parentPart: "die-one",
      parts: [
        {
          id: "die-substrate", label: "Die silicon", line: "Part of one die; this patch shows 25 cores.",
          role: "structure", shape: "slab", size: [(2 * HALF + 1) * P + 0.03, SUB, (2 * HALF + 1) * P + 0.03],
          pos: [0, SUB / 2, 0], schematic: true,
        },
        {
          id: "neighbours", label: "Neighbour cores", line: "About 10,700 cores per die; this patch is schematic.",
          role: "compute", shape: "rbox", size: [T, CORE_TOP - SUB, T], pos: [0, (SUB + CORE_TOP) / 2, 0],
          at: neighbourAt, schematic: true, glow: true,
          explode: { dir: [0, 1, 0], dist: 0.01, spread: 0.35, at: [0.1, 0.6] },
        },
        {
          id: "spare-cores", label: "Spare cores", line: "About 70,000 spares wafer-wide cover defects; placement schematic.",
          role: "compute", shape: "rbox", size: [T, CORE_TOP - SUB, T], pos: [0, (SUB + CORE_TOP) / 2, 0],
          at: spareAt, schematic: true,
          explode: { dir: [0, 1, 0], dist: 0.01, spread: 0.35, at: [0.1, 0.6] },
        },
        {
          id: "core-one", label: "One core", line: "One of 900,000 cores; about 0.05 mm2 each.",
          role: "compute", shape: "slab", size: [T, CORE_TOP - SUB, T], pos: [0, (SUB + CORE_TOP) / 2, 0], glow: true,
        },
        {
          id: "sram", label: "SRAM slice", line: "48 KiB of local memory, most of the core.",
          role: "memory", shape: "box", size: [0.145, 0.012, 0.145], pos: [-0.0275, CORE_TOP + 0.006, -0.0275],
          schematic: true,
          explode: { dir: [0, 1, 0], dist: 0.08, at: [0.3, 0.8] },
        },
        {
          id: "datapath", label: "FP16 SIMD datapath", line: "Does 8 FP16 operations per step.",
          role: "compute", shape: "box", size: [0.14, 0.01, 0.016], pos: [-0.03, CORE_TOP + 0.005, 0.092],
          count: 8, grid: { nx: 8, nz: 1, gap: 0.002 }, schematic: true, glow: true,
          explode: { dir: [0, 1, 0], dist: 0.15, at: [0.35, 0.85] },
        },
        {
          id: "router", label: "Mesh router", line: "Passes messages to 4 neighbouring cores on the 2D mesh.",
          role: "interconnect", shape: "box", size: [RT.x1 - RT.x0, 0.016, RT.x1 - RT.x0],
          pos: [RT.c, CORE_TOP + 0.008, RT.c], schematic: true,
          explode: { dir: [0, 1, 0], dist: 0.22, at: [0.4, 0.9] },
        },
        {
          id: "mesh-links", label: "Mesh links", line: "One link to each of 4 neighbours; width not published.",
          role: "interconnect", shape: "slab", size: [LINK.len, LINK.h, LINK.w], pos: [0, CORE_TOP + LINK.h / 2, 0],
          at: linkAt, schematic: true, follow: "router",
        },
      ],
      flows: [
        { from: "sram", to: "datapath", label: "operands from 48 KiB SRAM; 21 PB/s summed over the wafer", speed: 1 },
      ],
      callouts: [
        { part: "core-one", title: "Tiny core", text: "Each core covers only about 0.05 mm2." },
        { part: "sram", title: "Local memory", text: "Each core owns 48 KiB of SRAM." },
        { part: "datapath", title: "Wide math", text: "Each core does 8 FP16 operations per step." },
        { part: "router", title: "Mesh router", text: "Each router talks to 4 neighbouring cores." },
        { part: "spare-cores", title: "Built-in spares", text: "About 70,000 extra cores exist to cover defects." },
      ],
    },
  ],
  glossary: [
    ["Wafer", "a thin round slice of silicon; many chips are normally cut from it."],
    ["Die", "one rectangular chip area on a wafer."],
    ["Scribe line", "the gap between dies where a saw normally cuts; Cerebras puts wires there."],
    ["Reticle", "the area a chip tool can print in one shot; it limits normal die size."],
    ["Core", "a small compute unit with its own memory."],
    ["SRAM", "fast memory built from transistors on the same chip as the cores."],
    ["Memory bandwidth", "how much data the memory can read or write each second."],
    ["Fabric", "the network that joins the cores."],
    ["Router", "a small switch in each core that passes messages between cores."],
    ["2D mesh", "a grid network where each node links to its neighbours."],
    ["SIMD", "one instruction works on several numbers at once."],
    ["FP16", "a 16-bit floating point number format used in AI."],
    ["Sparse", "counting only non-zero values; sparse peak numbers are higher than dense."],
    ["PFLOPS", "10^15 floating point operations per second."],
    ["Redundancy", "spare parts that take over when a part has a defect."],
    ["Cold plate", "a metal plate with water channels that carries heat away."],
    ["Vertical power delivery", "power enters the chip face from a board behind it, not from its edges."],
    ["VRM", "voltage regulator module; turns incoming power into the chip voltage."],
    ["TSMC 5 nm", "the chip factory process used to make the WSE-3."],
    ["GbE", "gigabit Ethernet, a network link speed."],
  ],
  notPublished: [
    "125 PFLOPS FP16 is a sparse peak; a dense figure is not published.",
    "Die count (about 84) and about 10,700 cores per die come from one secondary source.",
    "About 970,000 physical cores (so about 70,000 spares) is from one secondary source.",
    "Measured yield is not published.",
    "Wafer power alone is not a spec; about 20 kW of heat and 23 kW per CS-3 come from one paper.",
    "Router ports, mesh link width and latency are not verified from a primary source.",
    "48 KiB SRAM, 8-way FP16 SIMD and 0.05 mm2 per core are not from a Cerebras page.",
    "Chassis layout, pump count, fan count and connector parts are not published.",
    "The 15U height is from a secondary source.",
    "This page covers the 2024 WSE-3, not the later WSE-3 Turbo.",
    "Shapes, colours, the core floor plan and part layout are design choices; counts and hierarchy follow the sources.",
  ],
  sourcesPath: "details/cerebras-wse-3.md",
};
