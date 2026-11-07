// Tenstorrent Blackhole p150a: rebuilt from build/ref/tenstorrent-blackhole.png (card) and -board.png (bare board)
// under build/MODEL-RULES.md; facts from details/tenstorrent-blackhole.md. All sizes and positions in mm.
// y is up; the card lies flat, shroud up, PCIe fingers toward +z, rear bracket and QSFP-DD cages at -x,
// power plug and blower fan at +x. Part positions on the board are read off the board photo.
// Three levels: the p150a card, the die floor plan, one Tensix core.

/* ---------- Level 1: the p150a card (dual slot, 270 x 111 x 42 mm) ---------- */
const PCB = { w: 270, d: 111, top: 1.6 };
// board photo (1420 x 1760 px) to mm: photo up = +x, photo right = +z; board is 1197 px long and 460 px wide
const KX = PCB.w / 1197;
const KZ = PCB.d / 460;
const V_MID = 413 * 2;
const px = (u, v) => [(V_MID - v) * KX, (u - 680) * KZ];

const PKG = { x: 2.5, sub: 50, subH: 1.2, dieH: 0.8, lid: 53, lidH: 1.2, plate: 43, plateH: 0.5 };
const SUB_TOP = PCB.top + PKG.subH;
const DIE_TOP = SUB_TOP + PKG.dieH;
const LID_TOP = DIE_TOP + PKG.lidH;
const SH = { x0: -137, x1: 137, y0: 2, top: 42, wall: 2.5, topH: 2.5, d: 117 };
const FAN = { x: 89, d: 62, y0: 31, y1: 39 };
const HS = { x0: -78, x1: 52, y0: 6, y1: 38, z: 96 };

// 8 GDDR6 chips in two columns of four, as on the board photo; count is inferred from the 256-bit bus
const GDDR = { w: 13.5, h: 1.3, d: 16.5 };
const gddrAt = [];
for (const dx of [-22.2, -7.4, 7.4, 22.2]) for (const z of [-39.4, 39.9]) gddrAt.push([dx, 0, z]);

// 12 inductors in one row above the package (board photo, top third)
const INDUCTOR = { x: 74, size: [8, 4, 6.2] };
const inductorAt = Array.from({ length: 12 }, (_, i) => [0, 0, (i - 5.5) * 6.75 + 0.9]);

const smallAt = [[530, 425], [560, 425], [555, 600], [760, 600], [818, 600], [480, 980], [480, 1035], [685, 1150]].map(([u, v]) => {
  const [x, z] = px(u, v);
  return [x, 0, z];
});
const [PLUG_X, PLUG_Z] = px(500, 275);
const [HDR_X, HDR_Z] = px(872, 300);

// dark chevron stripes on the shroud top: 3 columns of nested V arms (schematic pattern)
const chevronAt = [];
for (const cx of [-101, -39, 23]) for (let r = 0; r < 21; r++) {
  const z = (r - 10) * 4;
  chevronAt.push([cx - 15.5, 0, z, 0.5], [cx + 15.5, 0, z, -0.5]);
}

/* ---------- Level 2: the die floor plan (size not published; drawn 29.5 x 24.1 mm) ---------- */
const DIE = { w: 29.5, d: 24.1, top: 0.8 };
const TILE = { s: 1.5, gap: 0.3, h: 0.12, nx: 14, nz: 10 };
TILE.w = TILE.nx * TILE.s + (TILE.nx - 1) * TILE.gap; // 24.9
TILE.d = TILE.nz * TILE.s + (TILE.nz - 1) * TILE.gap; // 17.7
const GRID_Z = -DIE.d / 2 + 0.4 + 1.2 + 0.4 + TILE.d / 2; // below the Ethernet row
const DIE_Y = DIE.top + TILE.h / 2;
// 20 of 140 off on the p150a: which ones is not published; drawn as two whole columns
const TENSIX_OFF = [];
for (let r = 0; r < TILE.nz; r++) for (const c of [12, 13]) TENSIX_OFF.push(r * TILE.nx + c);
const nocVAt = [];
for (let c = 0; c < TILE.nx - 1; c++) nocVAt.push([-TILE.w / 2 + TILE.s + TILE.gap / 2 + c * (TILE.s + TILE.gap), 0, 0]);
const nocHAt = [];
for (let r = 0; r < TILE.nz - 1; r++) nocHAt.push([0, 0, -TILE.d / 2 + TILE.s + TILE.gap / 2 + r * (TILE.s + TILE.gap)]);
const ETH = { n: 10, w: 1.8, d: 1.2, z: -DIE.d / 2 + 0.4 + 0.6 };
const ethAt = Array.from({ length: ETH.n }, (_, i) => [(i - (ETH.n - 1) / 2) * 2.4, 0, 0]);
const DRAM = { w: 1.5, d: 4.0, x: DIE.w / 2 - 0.4 - 0.75 }; // 4 per side, schematic
const dramAt = [];
for (const x of [-DRAM.x, DRAM.x]) for (let i = 0; i < 4; i++) dramAt.push([x, 0, GRID_Z - TILE.d / 2 + 2.15 + i * 4.47]);
// 16 X280 cores in 4 clusters of 4 along the south edge; PCIe sits between clusters 2 and 3
const BOT = { z0: GRID_Z + TILE.d / 2 + 0.4 };
const CLUSTER_X = [-10.2, -4.6, 4.6, 10.2];
const CPU = { s: 1.0, gap: 0.2 };
const cpuAt = [];
const l2At = [];
CLUSTER_X.forEach((cx) => {
  for (const dz of [0, 1]) for (const dx of [-0.6, 0.6]) {
    cpuAt.push([cx + dx, 0, BOT.z0 + 0.5 + dz * 1.65]);
    l2At.push([cx + dx, 0, BOT.z0 + 1.15 + dz * 1.65]);
  }
});
const l3At = CLUSTER_X.map((cx) => [cx, 0, 0]);

/* ---------- Level 3: one Tensix core (schematic floor plan, real counts) ---------- */
const TX = { s: 1.5, base: 0.04 };
const TOP = TX.base;
const riscvAt = [-0.44, -0.22, 0, 0.22, 0.44].map((x) => [x, 0, 0]);
const MATH = { z: -0.22, d: 0.58, h: 0.01 };
const MM = { w: 0.74, x: -0.31 };


export default {
  id: "tenstorrent-blackhole",
  name: "Blackhole p150a",
  maker: "Tenstorrent",
  year: "2024",
  order: 11,
  oneLine: "Open RISC-V AI chip; same engineers as Taalas.",
  hero: [
    "140 Tensix cores on die; 120 enabled on p150a",
    "Tenstorrent claims 664 TFLOPS Block FP8 at 300 W",
    "32 GB GDDR6 on a 256-bit bus: 512 GB/s",
  ],
  scale: { unit: "mm", stage: 30 },
  levels: [
    {
      id: "card",
      title: "p150a card",
      parentPart: null,
      parts: [
        {
          id: "bh-card", label: "Circuit board", line: "Black board, 270 x 111 mm; part placement follows the product photo.",
          role: "structure", tone: "pcb-black", shape: "slab", size: [PCB.w, PCB.top, PCB.d], pos: [0, PCB.top / 2, 0],
          explode: { dir: [0, -1, 0], dist: 30, at: [0.5, 0.95] },
        },
        {
          id: "pcie-edge", label: "PCIe 5.0 x16 edge", line: "Gold fingers to the host: 64 GB/s.",
          role: "io", tone: "champagne", shape: "slab", size: [89, PCB.top, 8], pos: [-56, PCB.top / 2, PCB.d / 2 + 4], follow: "bh-card",
          explode: { dir: [0, 0, 1], dist: 16, at: [0.5, 0.95] },
        },
        {
          id: "bracket", label: "Rear bracket", line: "Metal slot bracket with honeycomb vents; holds the network cages.",
          role: "structure", tone: "graphite", shape: "slab", size: [2, 42, 120], pos: [-138.5, 21, 4],
          explode: { dir: [-1, 0, 0], dist: 34, at: [0.3, 0.8] },
        },
        {
          id: "qsfp-dd-ports", label: "QSFP-DD 800G cages", line: "Four 800G ports in two stacked cages link cards directly.",
          role: "interconnect", tone: "matte", shape: "box", size: [40, 19, 40], pos: [-113.8, PCB.top + 9.5, 0],
          at: [[0, 0, -25], [0, 0, 25]], count: 2, follow: "bh-card",
          explode: { dir: [-1, 0, 0], dist: 20, at: [0.35, 0.85] },
        },
        {
          id: "power-connector", label: "12V-2x6 power plug", line: "One connector feeds 300 W total board power.",
          role: "power", tone: "matte", shape: "box", size: [14, 8, 20], pos: [PLUG_X, PCB.top + 4, PLUG_Z], follow: "bh-card",
          explode: { dir: [1, 0, 0], dist: 18, at: [0.4, 0.9] },
        },
        {
          id: "sideband-header", label: "Sideband header", line: "Small four-pin header at the top edge; role not published.",
          role: "io", tone: "matte", shape: "box", size: [10, 6, 8], pos: [HDR_X, PCB.top + 3, HDR_Z], schematic: true, follow: "bh-card",
          explode: { dir: [1, 0, 0], dist: 18, at: [0.4, 0.9] },
        },
        {
          id: "inductors", label: "Power inductors", line: "A row of 12 black inductors beside the power modules.",
          role: "power", tone: "matte", shape: "box", size: INDUCTOR.size, pos: [INDUCTOR.x, PCB.top + INDUCTOR.size[1] / 2, 0],
          at: inductorAt, count: 12, follow: "bh-card",
          explode: { dir: [0, 1, 0], dist: 6, spread: 0.1, at: [0.45, 0.95] },
        },
        {
          id: "power-modules", label: "Power modules", line: "Two large white power modules; count from the photo.",
          role: "power", tone: "silver", shape: "box", size: [8, 2.2, 32], pos: [65, PCB.top + 1.1, 7], at: [[0, 0, -18.1], [0, 0, 17.9]],
          count: 2, follow: "bh-card",
          explode: { dir: [0, 1, 0], dist: 6, at: [0.45, 0.95] },
        },
        {
          id: "small-modules", label: "Small power parts", line: "Eight small white parts around the package; function not published.",
          role: "power", tone: "silver", shape: "box", size: [5, 2.2, 5], pos: [0, PCB.top + 1.1, 0], at: smallAt, count: 8,
          schematic: true, follow: "bh-card",
          explode: { dir: [0, 1, 0], dist: 6, at: [0.45, 0.95] },
        },
        {
          id: "gddr6-chips", label: "GDDR6 memory", line: "32 GB in total; 8 chips drawn, count not published.",
          role: "memory", shape: "box", size: [GDDR.w, GDDR.h, GDDR.d], pos: [PKG.x, PCB.top + GDDR.h / 2, 0], at: gddrAt, count: 8,
          follow: "bh-card",
          explode: { dir: [0, 1, 0], dist: 8, spread: 0.3, at: [0.45, 0.95] },
        },
        {
          id: "bh-substrate", label: "Package substrate", line: "Base under the die; package size is schematic.",
          role: "structure", tone: "graphite", shape: "slab", size: [PKG.sub, PKG.subH, PKG.sub], pos: [PKG.x, PCB.top + PKG.subH / 2, 0],
          schematic: true, follow: "bh-card",
        },
        {
          id: "bh-die", label: "Blackhole die", line: "One 6 nm die under the lid; area not published.",
          role: "compute", tone: "die-colour", shape: "slab", size: [30, PKG.dieH, 30], pos: [PKG.x, SUB_TOP + PKG.dieH / 2, 0],
          schematic: true, follow: "bh-card",
          explode: { dir: [0, 1, 0], dist: 4, at: [0.55, 0.95] },
        },
        {
          id: "bh-package", label: "Blackhole package lid", line: "Silver lid over the die; lifts off to show the silicon.",
          role: "structure", tone: "silver", shape: "slab", size: [PKG.lid, PKG.lidH, PKG.lid], pos: [PKG.x, DIE_TOP + PKG.lidH / 2, 0],
          xray: true, enter: "die", follow: "bh-card",
          explode: { dir: [0, 1, 0], dist: 20, at: [0.4, 0.9] },
        },
        {
          id: "lid-plate", label: "Lid centre plate", line: "Raised centre of the lid with the Blackhole mark.",
          role: "structure", tone: "silver", shape: "slab", size: [PKG.plate, PKG.plateH, PKG.plate], pos: [PKG.x, LID_TOP + PKG.plateH / 2, 0],
          xray: true, follow: "bh-package",
        },
        {
          id: "heatsink", label: "Fin stack", line: "Aluminium fins over the package and memory; fin count not published.",
          role: "cooling", tone: "anodised", shape: "box", size: [HS.x1 - HS.x0, HS.y1 - HS.y0, HS.z],
          pos: [(HS.x0 + HS.x1) / 2, (HS.y0 + HS.y1) / 2, 0], grid: { nx: 32, nz: 1, gap: 2 }, schematic: true, xray: true,
          explode: { dir: [0, 1, 0], dist: 58, spread: 0.1, at: [0.2, 0.75] },
        },
        {
          id: "cooler", label: "Blower fan", line: "Active fan on the p150a; the p150b is passive.",
          role: "cooling", tone: "matte", shape: "fan", blades: 25, size: [FAN.d, FAN.y1 - FAN.y0, FAN.d],
          pos: [FAN.x, (FAN.y0 + FAN.y1) / 2, 0], schematic: true, xray: true,
          explode: { dir: [0, 1, 0], dist: 95, at: [0.1, 0.6] },
        },
        {
          id: "shroud", label: "Shroud sides", line: "Metal shell of a 42 mm dual-slot card.",
          role: "structure", tone: "silver", shape: "frame", wall: SH.wall, size: [SH.x1 - SH.x0, SH.top - SH.topH - SH.y0, SH.d],
          pos: [0, (SH.y0 + SH.top - SH.topH) / 2, 0], xray: true,
          explode: { dir: [0, 1, 0], dist: 120, at: [0.05, 0.55] },
        },
        {
          id: "shroud-top", label: "Shroud top", line: "Top cover with the blower opening; the p150a lists at $1,399.",
          role: "structure", tone: "silver", shape: "slab", size: [SH.x1 - SH.x0, SH.topH, SH.d], pos: [0, SH.top - SH.topH / 2, 0],
          holes: [[FAN.x, 0, FAN.d + 2]], xray: true,
          explode: { dir: [0, 1, 0], dist: 190, at: [0, 0.5] },
        },
        {
          id: "shroud-stripes", label: "Chevron stripes", line: "Dark chevron stripes on the cover, as on the product photo.",
          role: "structure", tone: "matte", shape: "box", size: [36, 0.5, 2.1], pos: [0, SH.top + 0.25, 0],
          at: chevronAt, count: chevronAt.length, schematic: true, xray: true, follow: "shroud-top",
        },
        {
          id: "fan-hub", label: "Fan hub", line: "Dark hub cap in the middle of the blower rotor.",
          role: "cooling", tone: "matte", shape: "cyl", size: [26, 0.5, 26], pos: [FAN.x, FAN.y1 + 0.25, 0], schematic: true, follow: "cooler",
        },
        {
          id: "thermal-pads", label: "Thermal pads", line: "Soft pads carry heat from each memory chip into the fins.",
          role: "structure", tone: "graphite", shape: "box", size: [GDDR.w, HS.y0 - PCB.top - GDDR.h, GDDR.d],
          pos: [PKG.x, PCB.top + GDDR.h + (HS.y0 - PCB.top - GDDR.h) / 2, 0], at: gddrAt, count: 8, schematic: true, follow: "heatsink",
        },
        {
          id: "power-stages", label: "Power stages", line: "Row of small black voltage-regulator chips; count schematic.",
          role: "power", tone: "matte", shape: "box", size: [5, 1.6, 5], pos: [57, PCB.top + 0.8, 0],
          at: Array.from({ length: 6 }, (_, i) => [0, 0, (i - 2.5) * 7]), count: 6, schematic: true, follow: "bh-card",
          explode: { dir: [0, 1, 0], dist: 6, at: [0.45, 0.95] },
        },
        {
          id: "capacitors", label: "Capacitors", line: "Round can capacitors smooth the supply; count schematic.",
          role: "power", tone: "silver", shape: "cyl", size: [5.5, 9, 5.5], pos: [98, PCB.top + 4.5, 0],
          at: Array.from({ length: 6 }, (_, i) => [0, 0, (i - 2.5) * 8]), count: 6, schematic: true, follow: "bh-card",
          explode: { dir: [0, 1, 0], dist: 6, at: [0.45, 0.95] },
        },
        {
          id: "mount-screws", label: "Cooler screws", line: "Four screws clamp the cooler around the package.",
          role: "structure", tone: "silver", shape: "cyl", size: [4, 3, 4], pos: [PKG.x, PCB.top + 1.5, 0],
          at: [[-34, 0, -34], [34, 0, -34], [-34, 0, 34], [34, 0, 34]], count: 4, schematic: true, follow: "bh-card",
          explode: { dir: [0, 1, 0], dist: 40, at: [0.3, 0.8] },
        },
        {
          id: "port-openings", label: "Port openings", line: "Dark openings in the bracket for the two QSFP-DD cages.",
          role: "structure", tone: "matte", shape: "box", size: [0.4, 9, 28], pos: [-139.7, PCB.top + 9.5, 0],
          at: [[0, 0, -25], [0, 0, 25]], count: 2, follow: "bracket",
        },
        {
          id: "bracket-vents", label: "Bracket vents", line: "Slotted air vents in the bracket above the cages.",
          role: "structure", tone: "matte", shape: "box", size: [0.4, 14, 1.6], pos: [-139.7, 32, 4],
          at: Array.from({ length: 28 }, (_, i) => [0, 0, (i - 13.5) * 3.8]), count: 28, schematic: true, follow: "bracket",
        },
      ],
      flows: [
        { from: "gddr6-chips", to: "bh-die", label: "512 GB/s from 32 GB of GDDR6", speed: 1 },
        { from: "qsfp-dd-ports", to: "bh-die", label: "4 x 800 Gb/s Ethernet to other Blackhole cards", speed: 0.8 },
        { from: "pcie-edge", to: "bh-die", label: "64 GB/s over PCIe 5.0 x16 (8x slower than memory)", speed: 0.35 },
        { from: "power-connector", to: "inductors", label: "300 W total board power in", speed: 0.45 },
        { from: "inductors", to: "bh-die", label: "Inductors and modules step the voltage down for the die", speed: 0.45 },
      ],
      callouts: [
        { part: "bh-card", title: "Open design", text: "RISC-V cores and open TT-Metalium software; card costs $1,399." },
        { part: "gddr6-chips", title: "Plain GDDR6", text: "32 GB at 512 GB/s; no HBM stacks." },
        { part: "qsfp-dd-ports", title: "Scale-out ports", text: "4 ports at 800G each link cards directly." },
        { part: "power-connector", title: "One cable", text: "300 W board power through one 12V-2x6 connector." },
        { part: "cooler", title: "Active cooling", text: "p150a has a fan; p150b is passive for racks." },
        { part: "bh-package", title: "Six nanometre", text: "Hot Chips 2024 lists the process as 6 nm." },
      ],
    },
    {
      id: "die",
      title: "Blackhole die",
      parentPart: "bh-package",
      parts: [
        {
          id: "die-bh", label: "Blackhole die", line: "Hot Chips lists 752 small RISC-V cores; die size schematic.",
          role: "structure", tone: "die-colour", shape: "slab", size: [DIE.w, DIE.top, DIE.d], pos: [0, DIE.top / 2, 0], schematic: true,
        },
        {
          id: "tensix-grid", label: "Tensix cores", line: "14 x 10 grid on die; 120 of 140 enabled on p150a.",
          role: "compute", shape: "box", size: [TILE.w, TILE.h, TILE.d], pos: [0, DIE_Y, GRID_Z],
          grid: { nx: TILE.nx, nz: TILE.nz, gap: TILE.gap }, count: 140, off: TENSIX_OFF, glow: true, enter: "tensix",
          explode: { dir: [0, 1, 0], dist: 1.6, spread: 0.12, at: [0.15, 0.75] },
        },
        {
          id: "noc-cols", label: "NoC links, columns", line: "Two 2D-torus NoCs; 83 GB/s per link.",
          role: "interconnect", shape: "box", size: [0.08, TILE.h, TILE.d], pos: [0, DIE_Y, GRID_Z], at: nocVAt, xray: true,
          explode: { dir: [0, 1, 0], dist: 3.2, spread: 0.12, at: [0.15, 0.75] },
        },
        {
          id: "noc-rows", label: "NoC links, rows", line: "NoC 0 and NoC 1 run in opposite directions.",
          role: "interconnect", shape: "box", size: [TILE.w, 0.06, 0.08], pos: [0, DIE.top + TILE.h + 0.03, GRID_Z], at: nocHAt, xray: true,
          explode: { dir: [0, 1, 0], dist: 3.2, spread: 0.12, at: [0.15, 0.75] },
        },
        {
          id: "eth-cores", label: "Ethernet cores", line: "10 x 400 Gbps on die per Hot Chips 2024.",
          role: "interconnect", shape: "box", size: [ETH.w, TILE.h, ETH.d], pos: [0, DIE_Y, ETH.z], at: ethAt, count: ETH.n,
          explode: { dir: [0, 0.3, -1], dist: 2.2, at: [0.25, 0.85] },
        },
        {
          id: "dram-controllers", label: "GDDR6 controllers", line: "Edge blocks for the 256-bit bus; count not published.",
          role: "memory", shape: "box", size: [DRAM.w, TILE.h, DRAM.d], pos: [0, DIE_Y, 0], at: dramAt, count: 8,
          schematic: true,
          explode: { dir: [0, 0.3, 0], dist: 1, spread: 0.18, at: [0.2, 0.8] },
        },
        {
          id: "big-riscv", label: "X280 RISC-V cores", line: "16 Linux-capable 64-bit cores in 4 clusters.",
          role: "compute", shape: "box", size: [CPU.s, TILE.h, CPU.s], pos: [0, DIE_Y, 0], at: cpuAt, count: 16, glow: true,
          explode: { dir: [0, 0.3, 1], dist: 2.4, at: [0.25, 0.85] },
        },
        {
          id: "x280-l2", label: "X280 L2 cache", line: "128 KB L2 beside each big core.",
          role: "memory", shape: "box", size: [1.0, TILE.h, 0.25], pos: [0, DIE_Y, 0], at: l2At, count: 16, follow: "big-riscv",
          explode: { dir: [0, 1, 0], dist: 0.5, at: [0.3, 0.9] },
        },
        {
          id: "x280-l3", label: "X280 L3 cache", line: "L3 per cluster; Hot Chips lists 2 MB per CPU.",
          role: "memory", shape: "box", size: [2.2, TILE.h, 0.55], pos: [0, DIE_Y, BOT.z0 + 3.35], at: l3At, count: 4,
          schematic: true, follow: "big-riscv",
          explode: { dir: [0, 1, 0], dist: 0.5, at: [0.3, 0.9] },
        },
        {
          id: "pcie-core", label: "PCIe 5.0 core", line: "Host link on the die edge: 64 GB/s.",
          role: "io", shape: "box", size: [4.4, TILE.h, 2.4], pos: [0, DIE_Y, BOT.z0 + 1.6],
          explode: { dir: [0, 0.3, 1], dist: 3.2, at: [0.25, 0.85] },
        },
      ],
      flows: [
        { from: "dram-controllers", to: "tensix-grid", label: "512 GB/s of GDDR6 into the grid", speed: 1 },
        { from: "noc-rows", to: "tensix-grid", label: "83 GB/s per NoC link between cores", speed: 0.55 },
        { from: "eth-cores", to: "tensix-grid", label: "10 x 400 Gbps Ethernet on the die", speed: 0.8 },
        { from: "pcie-core", to: "big-riscv", label: "64 GB/s over PCIe 5.0 x16", speed: 0.35 },
      ],
      callouts: [
        { part: "tensix-grid", title: "The grid", text: "140 Tensix cores on die; 120 enabled on p150a." },
        { part: "big-riscv", title: "Linux inside", text: "16 big RISC-V cores in 4 clusters run Linux." },
        { part: "noc-rows", title: "Two networks", text: "Two 2D-torus NoCs run in opposite directions." },
        { part: "eth-cores", title: "Chip-to-chip", text: "10 x 400 Gbps Ethernet on the die per Hot Chips." },
        { part: "pcie-core", title: "Host link", text: "PCIe 5.0 x16 gives 64 GB/s." },
        { part: "die-bh", title: "752 tiny CPUs", text: "752 small RISC-V cores sit on one chip." },
      ],
    },
    {
      id: "tensix",
      title: "One Tensix core",
      parentPart: "tensix-grid",
      parts: [
        {
          id: "tensix-core", label: "One Tensix core", line: "One of 140 compute tiles; floor plan is schematic.",
          role: "structure", tone: "die-colour", shape: "rbox", size: [TX.s, TX.base, TX.s], pos: [0, TX.base / 2, 0], schematic: true,
        },
        {
          id: "tensix-riscv", label: "Baby RISC-V cores", line: "Five 32-bit cores: two move data, three drive math.",
          role: "compute", shape: "box", size: [0.18, 0.012, 0.14], pos: [0, TOP + 0.006, -0.6], at: riscvAt, count: 5,
          glow: true,
          explode: { dir: [0, 1, -0.6], dist: 0.32, spread: 0.3, at: [0.2, 0.8] },
        },
        {
          id: "tile-math", label: "Matrix unit", line: "Matrix engine multiplies 32 x 32 tiles in one step.",
          role: "compute", shape: "box", size: [MM.w, MATH.h, MATH.d], pos: [MM.x, TOP + MATH.h / 2, MATH.z],
          explode: { dir: [-0.5, 1, 0], dist: 0.22, at: [0.25, 0.85] },
        },
        {
          id: "tile-cells", label: "32 x 32 tile", line: "One cell per value in a 32 x 32 tile; drawing schematic.",
          role: "compute", shape: "box", size: [MM.w - 0.04, 0.006, MATH.d - 0.04], pos: [MM.x, TOP + MATH.h + 0.003, MATH.z],
          grid: { nx: 32, nz: 32, gap: 0.006 }, schematic: true, glow: true, follow: "tile-math",
          explode: { dir: [0, 1, 0], dist: 0.1, at: [0.3, 0.9] },
        },
        {
          id: "vector-math", label: "Vector unit", line: "Vector engine for sort, shuffle and lookup; 64 wide per slide.",
          role: "compute", shape: "box", size: [0.48, 0.016, MATH.d], pos: [0.38, TOP + 0.008, MATH.z], glow: true,
          explode: { dir: [0.5, 1, 0], dist: 0.22, at: [0.25, 0.85] },
        },
        {
          id: "packer-unpacker", label: "Pack and unpack", line: "Converts data between SRAM and math registers; size schematic.",
          role: "interconnect", shape: "box", size: [1.2, 0.01, 0.06], pos: [0, TOP + 0.005, 0.13], schematic: true,
          explode: { dir: [0, 1, 0], dist: 0.14, at: [0.3, 0.9] },
        },
        {
          id: "l1-sram", label: "L1 SRAM", line: "1.5 MB of local SRAM, the largest block.",
          role: "memory", shape: "slab", size: [1.36, 0.02, 0.38], pos: [0, TOP + 0.01, 0.38],
          explode: { dir: [0, 0.4, 1], dist: 0.3, at: [0.3, 0.9] },
        },
        {
          id: "noc-routers", label: "NoC routers", line: "2 routers join this core to both NoCs.",
          role: "interconnect", shape: "box", size: [0.14, 0.03, 0.14], pos: [0, TOP + 0.015, 0],
          at: [[-0.65, 0, -0.65], [0.65, 0, 0.65]], count: 2,
          explode: { dir: [0, 1, 0], dist: 0.26, spread: 0.4, at: [0.15, 0.75] },
        },
      ],
      flows: [
        { from: "noc-routers", to: "l1-sram", label: "333 GB/s between SRAM and the NoCs per core", speed: 0.6 },
        { from: "l1-sram", to: "tile-math", label: "Operand tiles through the unpacker; rate not published", speed: 1 },
        { from: "tensix-riscv", to: "vector-math", label: "Three cores issue math instructions; rate not published", speed: 0.4 },
      ],
      callouts: [
        { part: "tensix-riscv", title: "Five CPUs", text: "Five small RISC-V cores steer each Tensix core." },
        { part: "l1-sram", title: "Local memory", text: "1.5 MB of SRAM per Tensix core." },
        { part: "tile-math", title: "Tile engine", text: "Matrix engine works on 32 x 32 tiles." },
        { part: "vector-math", title: "Vector unit", text: "Vector engine adds sort, shuffle and lookup operations." },
        { part: "noc-routers", title: "Two routers", text: "Each core joins both NoCs." },
      ],
    },
  ],
  glossary: [
    ["Tensix core", "Tenstorrent's compute tile: five small CPUs, a matrix unit, a vector unit and local SRAM."],
    ["RISC-V", "an open instruction set; anyone may build a CPU for it without a licence fee."],
    ["Baby RISC-V", "a small 32-bit core that steers data and instructions, not heavy math."],
    ["Big RISC-V", "a full 64-bit core that can run Linux; Blackhole has 16."],
    ["SiFive X280", "a RISC-V CPU design with a vector unit from SiFive."],
    ["SRAM", "fast memory on the chip itself; here the L1 inside each Tensix core."],
    ["GDDR6", "graphics memory chips on the card, outside the die."],
    ["GT/s", "giga-transfers per second; sets the memory pin speed."],
    ["NoC", "network on chip: a grid of routers that moves data between tiles."],
    ["2D torus", "a grid whose edges wrap around, so every point has a short path to any other."],
    ["Router", "a small switch at a tile that forwards NoC packets."],
    ["Tile (math)", "a 32 x 32 block of numbers that the matrix engine handles in one step."],
    ["Matrix engine (FPU)", "hardware that multiplies matrices."],
    ["Vector engine (SFPU)", "hardware that applies one operation to many values, such as sort or lookup."],
    ["Packer and unpacker", "units that convert data between SRAM and the math registers."],
    ["Block FP8", "an 8-bit floating-point format where a group of values shares one exponent."],
    ["TFLOPS", "trillions of floating-point operations per second."],
    ["TBP", "total board power, the most the whole card draws."],
    ["QSFP-DD", "a high-speed network connector; Blackhole uses it at 800G per port."],
    ["PCIe 5.0 x16", "the host slot link, 64 GB/s."],
    ["TT-Metalium", "Tenstorrent's open-source low-level programming model and runtime."],
    ["Passive cooling", "a heatsink with no fan; server fans push air through it."],
  ],
  notPublished: [
    "Core count conflict: Hot Chips 2024 says 140 Tensix; Tenstorrent docs (2026) say 120 enabled on p150a. The model shows 140 on die, 120 on.",
    "Which 20 Tensix cores are off is not published; the model darkens two whole columns.",
    "TFLOPS conflict: docs give 664 Block FP8 (120 cores); Hot Chips gives 745 8-bit and 372 to 373 BF16 (140 cores); The Register lists 774 FP8, 387 Block FP8, 194 FP16.",
    "Per-precision TFLOPS for the 120-core card are not published.",
    "GDDR6 chip count (8) is inferred from the 256-bit bus; controller count (8 drawn) is not published.",
    "Die area is not published; the 29.5 x 24.1 mm die and the 50 mm package are schematic.",
    "The 14 x 10 Tensix layout comes from secondary summaries; one says 13 x 10 for compute.",
    "Ethernet: Hot Chips shows 10 x 400 Gbps on die, the card has 4 x 800G; the mapping is not published.",
    "SRAM total: 180 MB (120 cores), 210 MB (140 cores) or 241 MB chip-wide per Hot Chips.",
    "L3 is listed as 2 MB per CPU; how it is shared in a cluster is not published.",
    "Process: 6 nm per Hot Chips; the foundry is not stated there.",
    "Vector unit width: the slide shows 64 beside it; the meaning is not explained.",
    "Fan type, fin count, heatsink size and PCB layout are not published; all are schematic.",
    "Shapes, colours and positions are design choices; counts and hierarchy are real where sourced.",
  ],
  sourcesPath: "details/tenstorrent-blackhole.md",
};
