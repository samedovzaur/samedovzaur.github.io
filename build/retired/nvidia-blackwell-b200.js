// NVIDIA Blackwell B200: built from details/nvidia-blackwell-b200.md (sections 3 to 8) under build/MODEL-RULES.md.
// Reference photo: build/ref/gb300-board.png (gold substrate, two dies in the centre, four HBM stacks each side).
// All sizes and positions in mm. pos is the centre of the part's box. y is up; the two dies sit along x.
// Three levels: the package, the two dies joined by NV-HBI, one HBM3e stack.

/* ---------- Level 1: the package (package and die sizes not published; drawn schematic) ---------- */
const BGA_H = 0.6;
const SUB = { y0: BGA_H, y1: BGA_H + 2, w: 100, d: 70 };
const INT = { y0: SUB.y1, y1: SUB.y1 + 0.8 };
const CHIP = { y0: INT.y1, y1: INT.y1 + 0.75 };
const DIE = { w: 26, d: 33, seam: 1.2 };
const DIE_X = DIE.seam / 2 + DIE.w / 2;
const HBM = { w: 11, d: 11, gap: 0.6 };
const HBM_X = DIE.seam / 2 + DIE.w + 1.4 + HBM.w / 2;
const dieAt = [[-DIE_X, 0, 0], [DIE_X, 0, 0]];
const hbmAt = [];
for (const x of [-HBM_X, HBM_X]) for (let i = 0; i < 4; i++) hbmAt.push([x, 0, (i - 1.5) * (HBM.d + HBM.gap)]);
const FRAME = { w: 90, d: 56, wall: 3 };
const CAP = { w: 2, h: 0.6, d: 1.2 };
const capAt = [];
for (const x of [-47.5, 47.5]) for (let i = 0; i < 10; i++) capAt.push([x, 0, (i - 4.5) * 5.2]);
for (const z of [-31.5, 31.5]) for (let i = 0; i < 14; i++) capAt.push([(i - 6.5) * 6, 0, z]);

/* ---------- Level 2: both dies (floor plan schematic; each die mirrors the other across the NV-HBI seam) ---------- */
const DT = 0.75;
const BH = 0.1;
const BY = DT + BH / 2;
const mirror = (list) => [...list.map(([x, y, z]) => [-DIE_X + x, y, z]), ...list.map(([x, y, z]) => [DIE_X - x, y, z])];
const smLocal = [];
for (const z0 of [-8.4, 8.4]) for (let r = 0; r < 4; r++) for (let c = 0; c < 8; c++) smLocal.push([-9.275 + c * 2.65, 0, z0 - 4.875 + r * 3.25]);
const smAt = mirror(smLocal);
const l2At = mirror([[-2, 0, 0]]);
const decAt = mirror([[8.9, 0, 0]]);
const ctrlLocal = [];
for (let i = 0; i < 4; i++) ctrlLocal.push([-12.3, 0, -12 + i * 8]);
const ctrlAt = mirror(ctrlLocal);
const phyAt = mirror([[12.3, 0, 0]]);
const linkAt = mirror([[-2, 0, -15.7], [-2, 0, 15.7]]);
const rasAt = mirror([[8.5, 0, -15.7]]);

/* ---------- Level 3: one HBM3e stack (11 x 11 mm footprint; layer thickness schematic) ---------- */
const BUMP_H = 0.03;
const BASE = { y0: BUMP_H, y1: BUMP_H + 0.1 };
const DRAM = { layer: 0.05, gap: 0.01, n: 8 };
const DRAM_H = DRAM.n * DRAM.layer + (DRAM.n - 1) * DRAM.gap;
const DRAM_Y = BASE.y1 + DRAM_H / 2;
const STRIP = 1.0; // central TSV strip between the two cell-array halves
const HALF_D = (HBM.d - STRIP) / 2;
const TSV = { nx: 40, nz: 2, cell: 0.12 }; // one schematic bundle; each die's segment rides with its die
const TSV_W = TSV.nx * TSV.cell + (TSV.nx - 1) * DRAM.gap;
const TSV_D = TSV.nz * TSV.cell + (TSV.nz - 1) * DRAM.gap;

export default {
  id: "nvidia-blackwell-b200",
  name: "Blackwell B200",
  maker: "NVIDIA",
  year: "2024",
  order: 5,
  oneLine: "Two dies joined; the datacenter counterpart of the owner's 4090.",
  hero: [
    "208 billion transistors across two TSMC 4NP dies",
    "10 TB/s NV-HBI joins two dies into one GPU",
    "NVIDIA claims 20 PFLOPS FP4 sparse, 10 dense",
  ],
  scale: { unit: "mm", stage: 20 },
  levels: [
    {
      id: "package",
      title: "B200 package",
      parentPart: null,
      parts: [
        {
          id: "bga", label: "Package balls", line: "Solder balls to the SXM board; ball count not published.",
          role: "io", shape: "cyl", size: [96, BGA_H, 64], pos: [0, BGA_H / 2, 0], grid: { nx: 24, nz: 16, gap: 3.4 },
          schematic: true, explode: { dir: [0, -1, 0], dist: 6, at: [0.5, 0.95] },
        },
        {
          id: "substrate", label: "Gold substrate", line: "Organic base that wires the package to the board; size schematic.",
          role: "io", tone: "gold", shape: "slab", size: [SUB.w, SUB.y1 - SUB.y0, SUB.d], pos: [0, (SUB.y0 + SUB.y1) / 2, 0],
          schematic: true,
        },
        {
          id: "caps", label: "Land-side caps", line: "Small capacitors in rows round the silicon; count schematic.",
          role: "power", tone: "graphite", shape: "box", size: [CAP.w, CAP.h, CAP.d], pos: [0, SUB.y1 + CAP.h / 2, 0],
          at: capAt, count: capAt.length, schematic: true,
        },
        {
          id: "interposer", label: "CoWoS-L interposer", line: "Organic interposer with silicon bridges under both dies and memory.",
          role: "structure", tone: "champagne", shape: "slab", size: [80, INT.y1 - INT.y0, 48], pos: [0, (INT.y0 + INT.y1) / 2, 0],
          schematic: true, xray: true, explode: { dir: [0, 1, 0], dist: 8, at: [0.5, 0.95] },
        },
        {
          id: "nv-hbi", label: "NV-HBI bridge", line: "Die-to-die link across the seam at 10 TB/s.",
          role: "interconnect", tone: "gold", shape: "slab", size: [DIE.seam, 0.3, 30], pos: [0, INT.y1 + 0.15, 0], follow: "interposer",
          explode: { dir: [0, 1, 0], dist: 9, at: [0.4, 0.9] },
        },
        {
          id: "gpu-die", label: "GPU die", line: "Reticle-sized die with about 104 billion transistors, derived.",
          role: "compute", tone: "die-colour", shape: "rbox", size: [DIE.w, CHIP.y1 - CHIP.y0, DIE.d], pos: [0, (CHIP.y0 + CHIP.y1) / 2, 0],
          at: dieAt, count: 2, schematic: true, enter: "die", follow: "interposer",
          explode: { dir: [0, 1, 0], dist: 20, spread: 0.25, at: [0.35, 0.85] },
        },
        {
          id: "hbm3e", label: "HBM3e stack", line: "Stacked memory beside the dies; the GPU reads 8 TB/s.",
          role: "memory", shape: "rbox", size: [HBM.w, CHIP.y1 - CHIP.y0, HBM.d], pos: [0, (CHIP.y0 + CHIP.y1) / 2, 0],
          at: hbmAt, count: 8, enter: "hbm", follow: "interposer",
          explode: { dir: [0, 1, 0], dist: 20, spread: 0.12, at: [0.35, 0.85] },
        },
        {
          id: "lid-frame", label: "Nickel frame", line: "Metal ring bonded to the substrate round the silicon; schematic.",
          role: "structure", tone: "nickel", shape: "frame", wall: FRAME.wall, size: [FRAME.w, CHIP.y1 - SUB.y1, FRAME.d],
          pos: [0, (SUB.y1 + CHIP.y1) / 2, 0], schematic: true, xray: true,
          explode: { dir: [0, 1, 0], dist: 40, at: [0.05, 0.5] },
        },
      ],
      flows: [
        { from: "gpu-die", to: "nv-hbi", label: "10 TB/s between the two dies over NV-HBI", speed: 1 },
        { from: "hbm3e", to: "gpu-die", label: "8 TB/s per GPU from eight HBM3e stacks", speed: 0.8 },
        { from: "gpu-die", to: "bga", label: "NVLink 5: 1.8 TB/s per GPU, bidirectional, to other GPUs", speed: 0.18 },
      ],
      callouts: [
        { part: "gpu-die", title: "One GPU", text: "208 billion transistors across two dies, seen as one GPU." },
        { part: "nv-hbi", title: "Die-to-die link", text: "NV-HBI moves 10 TB/s between the two dies." },
        { part: "hbm3e", title: "Eight stacks", text: "Eight HBM3e stacks sit beside the dies." },
        { part: "interposer", title: "CoWoS-L", text: "First commercial CoWoS-L package; two reticles of TSMC silicon." },
        { part: "gpu-die", title: "TSMC 4NP", text: "Custom 4NP process, a 4 nm class node." },
        { part: "substrate", title: "Memory size", text: "192 GB HBM3e per GPU at 8 TB/s." },
      ],
    },
    {
      id: "die",
      title: "Two dies, one GPU",
      parentPart: "gpu-die",
      parts: [
        {
          id: "die-base", label: "Two GPU dies", line: "Each die is half of the GPU; size not published.",
          role: "compute", tone: "die-colour", shape: "slab", size: [DIE.w, DT, DIE.d], pos: [0, DT / 2, 0],
          at: dieAt, count: 2, schematic: true,
        },
        {
          id: "sm", label: "SMs (schematic grid)", line: "SM count not published; others measured 74 enabled per die.",
          role: "compute", tone: "die-colour", shape: "box", size: [2.35, BH, 2.95], pos: [0, BY, 0], at: smAt, count: smAt.length,
          schematic: true, glow: true, explode: { dir: [0, 1, 0], dist: 2.4, at: [0.15, 0.75] },
        },
        {
          id: "l2", label: "L2 cache", line: "Each die holds part of the 126 MB L2, measured by others.",
          role: "memory", shape: "slab", size: [17, BH, 3.2], pos: [0, BY, 0], at: l2At, count: 2,
          explode: { dir: [0, 1, 0], dist: 1.4, at: [0.25, 0.85] },
        },
        {
          id: "decompress", label: "Decompression engine", line: "Unpacks compressed data formats for database queries in hardware.",
          role: "compute", tone: "die-colour", shape: "box", size: [3.6, BH, 3.2], pos: [0, BY, 0], at: decAt, count: 2,
          explode: { dir: [0, 1, 0], dist: 2.0, at: [0.3, 0.9] },
        },
        {
          id: "hbm-ctrl", label: "HBM controllers", line: "Memory controllers face each die's four HBM3e stacks.",
          role: "memory", shape: "box", size: [1.2, BH, 7.4], pos: [0, BY, 0], at: ctrlAt, count: 8, schematic: true,
          explode: { dir: [0, 1, 0], dist: 3, at: [0.2, 0.8] },
        },
        {
          id: "nv-hbi-phy", label: "NV-HBI edge", line: "Die edge that carries 10 TB/s to the other die.",
          role: "interconnect", tone: "gold", shape: "slab", size: [1.2, BH, 30], pos: [0, BY, 0], at: phyAt, count: 2, schematic: true,
          explode: { dir: [0, 1, 0], dist: 3, at: [0.2, 0.8] },
        },
        {
          id: "nv-hbi-link", label: "NV-HBI link", line: "Bridge across the seam joins the two dies at 10 TB/s.",
          role: "interconnect", tone: "gold", shape: "slab", size: [3.2, BH, 28], pos: [0, DT + BH + BH / 2, 0], schematic: true,
          explode: { dir: [0, 1, 0], dist: 4.5, at: [0.3, 0.9] },
        },
        {
          id: "nvlink", label: "NVLink 5 ports", line: "Links to other GPUs; 1.8 TB/s per GPU in total.",
          role: "io", shape: "box", size: [16, BH, 1.0], pos: [0, BY, 0], at: linkAt, count: 4,
          schematic: true, explode: { dir: [0, 1, 0], dist: 1.6, at: [0.25, 0.85] },
        },
        {
          id: "ras", label: "RAS engine", line: "Watches the chip for faults and health; reliability and serviceability.",
          role: "structure", shape: "box", size: [3.4, BH, 1.0], pos: [0, BY, 0], at: rasAt, count: 2,
          explode: { dir: [0, 1, 0], dist: 2.4, at: [0.3, 0.9] },
        },
      ],
      flows: [
        { from: "nv-hbi-link", to: "sm", label: "10 TB/s between the two dies over NV-HBI", speed: 1 },
        { from: "l2", to: "sm", label: "21 TB/s for L2 hits in the same die, measured", speed: 0.8 },
        { from: "nv-hbi-phy", to: "sm", label: "16.8 TB/s for L2 hits across the die seam, measured", speed: 0.6 },
      ],
      callouts: [
        { part: "sm", title: "SM count", text: "Not published; others measured 74 enabled per die." },
        { part: "l2", title: "Big L2", text: "126 MB L2 in total, versus 50 MB on H100." },
        { part: "nv-hbi-link", title: "NV-HBI", text: "10 TB/s joins the two dies into one GPU." },
        { part: "nvlink", title: "NVLink 5", text: "1.8 TB/s per GPU to other GPUs." },
        { part: "decompress", title: "Decompress", text: "Dedicated engine speeds up database query formats." },
        { part: "hbm-ctrl", title: "Memory controllers", text: "Each HBM3e stack has a 1,024-bit interface." },
      ],
    },
    {
      id: "hbm",
      title: "One HBM3e stack",
      parentPart: "hbm3e",
      parts: [
        {
          id: "ubumps", label: "Micro-bumps", line: "Tiny solder bumps join the stack to the interposer; schematic.",
          role: "io", shape: "cyl", size: [10, BUMP_H, 10], pos: [0, BUMP_H / 2, 0], grid: { nx: 16, nz: 16, gap: 0.35 },
          schematic: true, explode: { dir: [0, -1, 0], dist: 0.6, at: [0.4, 0.95] },
        },
        {
          id: "base-die", label: "Base logic die", line: "Bottom logic die; it carries the 1,024-bit interface.",
          role: "memory", shape: "slab", size: [HBM.w, BASE.y1 - BASE.y0, HBM.d], pos: [0, (BASE.y0 + BASE.y1) / 2, 0],
        },
        {
          id: "dram-a", label: "DRAM dies, side A", line: "Cell arrays of eight stacked DRAM dies, one side of the TSVs.",
          role: "memory", shape: "slab", size: [HBM.w, DRAM_H, HALF_D], pos: [0, DRAM_Y, -(STRIP + HALF_D) / 2],
          grid: { nx: 1, nz: 1, ny: DRAM.n, gap: DRAM.gap }, xray: true,
          explode: { dir: [0, 1, 0], dist: 1.0, layers: 0.5, at: [0.1, 0.8] },
        },
        {
          id: "dram-b", label: "DRAM dies, side B", line: "Cell arrays of eight stacked DRAM dies, other side of the TSVs.",
          role: "memory", shape: "slab", size: [HBM.w, DRAM_H, HALF_D], pos: [0, DRAM_Y, (STRIP + HALF_D) / 2],
          grid: { nx: 1, nz: 1, ny: DRAM.n, gap: DRAM.gap }, xray: true,
          explode: { dir: [0, 1, 0], dist: 1.0, layers: 0.5, at: [0.1, 0.8] },
        },
        {
          id: "tsv", label: "TSV columns", line: "Copper vias through every DRAM die; real count not published.",
          role: "interconnect", shape: "cyl", size: [TSV_W, DRAM_H, TSV_D], pos: [0, DRAM_Y, 0],
          grid: { nx: TSV.nx, nz: TSV.nz, ny: DRAM.n, gap: DRAM.gap }, schematic: true,
          explode: { dir: [0, 1, 0], dist: 1.0, layers: 0.5, at: [0.1, 0.8] },
        },
      ],
      flows: [
        { from: "dram-a", to: "base-die", label: "Reads and writes run down the TSVs to the base die", speed: 0.6 },
        { from: "base-die", to: "ubumps", label: "1,024 bits wide per stack, to the GPU die's controllers", speed: 0.8 },
      ],
      callouts: [
        { part: "dram-a", title: "Stack height", text: "HBM3e stacks 8 or 12 DRAM dies; B200 uses 8." },
        { part: "tsv", title: "Through-silicon vias", text: "Copper columns link all DRAM dies; 1,024 data pins per stack." },
        { part: "base-die", title: "Base die", text: "A logic die under the DRAM carries the 1,024-bit interface." },
        { part: "dram-b", title: "Capacity", text: "An 8-high stack holds 24 GB; eight give 192 GB." },
      ],
    },
  ],
  glossary: [
    ["B200", "the Blackwell data center GPU package with two dies."],
    ["Blackwell", "NVIDIA's GPU architecture generation after Hopper."],
    ["GB200", "a module of two B200 GPUs and one Grace CPU."],
    ["Die", "one piece of silicon cut from a wafer."],
    ["Reticle limit", "the largest area one lithography exposure can print."],
    ["NV-HBI", "NVIDIA High-Bandwidth Interface, the link between the two dies."],
    ["NVLink 5", "the fifth-generation fast link between GPUs."],
    ["TSMC 4NP", "a custom 4 nm class process made by TSMC for NVIDIA."],
    ["CoWoS-L", "TSMC packaging with local silicon bridges in an organic interposer."],
    ["Interposer", "a thin layer of wiring under the dies and memory."],
    ["Substrate", "the base of the package that connects to the board."],
    ["SM", "streaming multiprocessor, the main compute block of an NVIDIA GPU."],
    ["L2 cache", "shared on-chip memory between the SMs and main memory."],
    ["HBM3e", "stacked high bandwidth memory, third generation, extended."],
    ["DRAM die", "one thin layer of memory cells inside an HBM stack."],
    ["TSV", "through-silicon via, a vertical wire through a die."],
    ["Base die", "the logic layer under the DRAM layers in an HBM stack."],
    ["Memory controller", "the block that reads and writes the memory."],
    ["Decompression engine", "hardware that unpacks compressed data fast."],
    ["RAS engine", "hardware for reliability, availability and serviceability."],
    ["FP4", "a 4-bit floating-point format used for inference."],
    ["Sparse", "a figure that assumes zero weights are skipped. Dense is half of sparse here."],
    ["PFLOPS", "10^15 floating-point operations per second."],
  ],
  notPublished: [
    "SM count per die: not published by NVIDIA. Chips and Cheese measured 74 enabled of 80 per die; Cornell lists 160 per GPU. The 64-cell SM grid is a drawing, not a count.",
    "Die size: not published (\"reticle-limited\"). Drawn at the 26 x 33 mm reticle field; about 800 mm2 per die elsewhere is an estimate.",
    "Package, substrate, interposer and lid sizes and the ball count: not published; all drawn schematic.",
    "Transistors per die (104 billion) is derived from the 208 billion total.",
    "FP4: 20 PFLOPS is sparse, 10 dense, in the GB200 configuration. HGX and DGX B200 give 18 sparse and 9 dense per GPU.",
    "TDP: no per-GPU figure from NVIDIA; 1,000 W (HGX) and 1,200 W (GB200) are secondary reports.",
    "Memory: 192 GB is the common figure; NVIDIA's GB200 page gives 186 GB per GPU. The gap is not explained.",
    "HBM3e stack height: 8 DRAM dies in the part TechInsights examined; 12-high is not confirmed for B200.",
    "NV-HBI protocol and the bridge layout inside the CoWoS-L interposer: not published.",
    "Die floor plan: positions and sizes of SMs, L2, controllers, NVLink ports and engines are schematic.",
    "HBM layer thickness, TSV count and micro-bump count: schematic.",
    "HBM3e supplier: SK hynix in the part TechInsights examined; others may be used.",
    "Shapes, colours and layout are design choices; counts and hierarchy are real where published.",
  ],
  sourcesPath: "details/nvidia-blackwell-b200.md",
};
