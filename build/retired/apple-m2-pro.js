// Apple M2 Pro: built from details/apple-m2-pro.md (sections 3 to 8) and Apple's M2 Pro chip image (build/ref/apple-m2-pro.png)
// under build/MODEL-RULES.md. All sizes and positions in mm. pos is the centre of the part's box. y is up; the package lies flat.
// Three levels: the package on a board, the die floor plan, one performance cluster.
// Package, die and block sizes are not published; they are scaled from the press image at 0.0368 mm per pixel, so
// the die comes out at about 20.8 x 14.0 mm (Chips and Cheese estimate: 289 mm2).

const PX = 0.0368;

/* ---------- Level 1: the package on a board (image centre = package centre) ---------- */
const BOARD = { w: 64, h: 1.2, d: 46 };
const SUB = { w: 43.8, h: 1.0, d: 31.4, y1: BOARD.h + 1.0 };
const DIE_L1 = { w: 20.8, h: 0.8, d: 14.0, z: -0.4 };
const MOD = { w: 7.0, h: 1.2, d: 12.9 };
const PASS = { w: 0.7, h: 0.5, d: 1.1 };
const modAt = [];
for (const z of [-6.8, 6.8]) for (const x of [-16.9, 16.9]) modAt.push([x, 0, z]);
const px2x = (p) => +((p - 980) * PX).toFixed(2);
const topRow = [733, 785, 830];
for (let i = 0; i < 12; i++) topRow.push(918 + (i * (1225 - 918)) / 11);
const botRow = [735];
for (let i = 0; i < 5; i++) botRow.push(790 + (i * (896 - 790)) / 4);
botRow.push(1130, 1170, 1221);
const passAt = [...topRow.map((p) => [px2x(p), 0, -9.31]), ...botRow.map((p) => [px2x(p), 0, 8.54])];
const padAt = [[-10.8, 0, -9.0], [10.7, 0, -9.0], [-10.8, 0, 8.3], [10.7, 0, 8.3]];

/* ---------- Level 2: the die floor plan (die image 565 x 380 px) ---------- */
const DIE = { w: 20.8, d: 14.0 };
const DIE_TOP = 0.75;
const BLK = 0.12;
const DIE_Y = DIE_TOP + BLK / 2;
// block from die-image pixels (x0, y0, x1, y1) to { size, pos } on the die
const blk = (x0, y0, x1, y1) => ({
  size: [(x1 - x0) * PX, BLK, (y1 - y0) * PX],
  pos: [((x0 + x1) / 2 - 282.5) * PX, DIE_Y, ((y0 + y1) / 2 - 190) * PX],
});
const gpu = blk(54, 227, 513, 378);
const memctl = blk(2, 197, 50, 378);
const pclu = blk(188, 52, 398, 222);
const eclu = blk(405, 160, 458, 222);
const slc = blk(462, 160, 512, 222);
const ane = blk(72, 66, 165, 200);
const media = blk(402, 52, 508, 155);
const ioTop = blk(8, 4, 556, 40);
const ioRight = blk(516, 46, 562, 192);

/* ---------- Level 3: one performance cluster (schematic) ---------- */
const CL = { w: 3.75, d: 6.26, h: 0.05 };
const CT = CL.h + 0.015;
const cl3Core = [];
for (const z of [-1.4, 1.4]) for (const x of [-1.2, 1.2]) cl3Core.push([x, 0, z]);

export default {
  id: "apple-m2-pro",
  name: "M2 Pro",
  maker: "Apple",
  year: "2023",
  order: 12,
  oneLine: "The cluster controller; Neural Engine, unified memory.",
  hero: [
    "40 billion transistors on second-generation 5 nm",
    "200 GB/s unified memory, up to 32 GB",
    "16-core Neural Engine: 15.8 trillion ops per second",
  ],
  scale: { unit: "mm", stage: 40 },
  levels: [
    {
      id: "package",
      title: "M2 Pro package",
      parentPart: null,
      parts: [
        {
          id: "board", label: "Logic board", line: "Board under the package; outline and colour are schematic.",
          role: "structure", tone: "pcb-green", shape: "slab", size: [BOARD.w, BOARD.h, BOARD.d], pos: [0, BOARD.h / 2, 0],
          schematic: true, explode: { dir: [0, -1, 0], dist: 14, at: [0.3, 0.9] },
        },
        {
          id: "substrate", label: "Package substrate", line: "Black base that carries the die and four memory packages.",
          role: "structure", tone: "pcb-black", shape: "slab", size: [SUB.w, SUB.h, SUB.d], pos: [0, BOARD.h + SUB.h / 2, 0],
          schematic: true, explode: { dir: [0, -1, 0], dist: 6, at: [0.3, 0.9] },
        },
        {
          id: "soc-die", label: "M2 Pro die", line: "CPU, GPU and Neural Engine on one die; 40 billion transistors.",
          role: "compute", tone: "die-colour", shape: "slab", size: [DIE_L1.w, DIE_L1.h, DIE_L1.d],
          pos: [0, SUB.y1 + DIE_L1.h / 2, DIE_L1.z], glow: true, enter: "die",
          explode: { dir: [0, 1, 0], dist: 20, at: [0.4, 0.95] },
        },
        {
          id: "die-frame", label: "Die frame", line: "Gold ring around the die on the substrate.",
          role: "io", tone: "gold", shape: "frame", wall: 0.25, size: [22.3, 0.2, 15.5], pos: [0, SUB.y1 + 0.1, -0.37],
          schematic: true, explode: { dir: [0, 1, 0], dist: 6, at: [0.3, 0.9] },
        },
        {
          id: "lpddr5", label: "LPDDR5 memory", line: "Four packages beside the die; up to 32 GB at 200 GB/s.",
          role: "memory", shape: "box", size: [MOD.w, MOD.h, MOD.d], pos: [0, SUB.y1 + MOD.h / 2, 0], count: 4, at: modAt,
          explode: { dir: [0, 1, 0], dist: 10, spread: 0.3, at: [0.25, 0.9] },
        },
        {
          id: "passives", label: "Passive parts", line: "Small parts in two rows by the die: 15 above, 9 below.",
          role: "power", tone: "silver", shape: "box", size: [PASS.w, PASS.h, PASS.d], pos: [0, SUB.y1 + PASS.h / 2, 0],
          count: passAt.length, at: passAt, schematic: true,
          explode: { dir: [0, 1, 0], dist: 14, at: [0.2, 0.85] },
        },
        {
          id: "corner-pads", label: "Gold corner pads", line: "Four gold squares at the die corners; purpose not published.",
          role: "io", tone: "gold", shape: "box", size: [0.6, 0.1, 0.6], pos: [0, SUB.y1 + 0.05, 0], count: 4, at: padAt,
          schematic: true, explode: { dir: [0, 1, 0], dist: 8, at: [0.2, 0.85] },
        },
      ],
      flows: [
        { from: "lpddr5", to: "soc-die", label: "200 GB/s unified memory bandwidth, shared by CPU, GPU and Neural Engine", speed: 1 },
      ],
      callouts: [
        { part: "soc-die", title: "One chip", text: "CPU, GPU and Neural Engine share 40 billion transistors." },
        { part: "lpddr5", title: "Shared memory", text: "Up to 32 GB of LPDDR5 serves every engine at 200 GB/s." },
        { part: "substrate", title: "Package base", text: "Die and memory share one substrate; its size is not published." },
        { part: "passives", title: "Small parts", text: "24 small parts sit in two rows beside the die." },
        { part: "board", title: "Logic board", text: "Schematic board; the real layout is not published." },
      ],
    },
    {
      id: "die",
      title: "M2 Pro die",
      parentPart: "soc-die",
      parts: [
        {
          id: "die-base", label: "M2 Pro die", line: "About 289 mm2 by estimate; Apple does not publish die size.",
          role: "structure", tone: "die-colour", shape: "slab", size: [DIE.w, DIE_TOP, DIE.d], pos: [0, DIE_TOP / 2, 0],
          schematic: true,
        },
        {
          id: "gpu", label: "GPU", line: "Up to 19 GPU cores; 6.5 TFLOPs FP32 measured.",
          role: "compute", shape: "box", size: gpu.size, pos: gpu.pos, grid: { nx: 10, nz: 2, gap: 0.12 }, count: 19,
          glow: true, schematic: true, xray: true, explode: { dir: [0, 1, 0], dist: 1.0, at: [0.15, 0.75] },
        },
        {
          id: "p-cluster", label: "Performance cores", line: "Eight performance cores in two mirrored blocks; 16 MB L2.",
          role: "compute", shape: "box", size: [pclu.size[0] / 2 - 0.05, BLK, pclu.size[2]], pos: pclu.pos, count: 2,
          at: [[-(pclu.size[0] / 4), 0, 0], [pclu.size[0] / 4, 0, 0]], glow: true, enter: "cluster", schematic: true,
          explode: { dir: [0, 1, 0], dist: 1.6, at: [0.2, 0.85] },
        },
        {
          id: "e-cluster", label: "Efficiency cores", line: "Four efficiency cores handle light work.",
          role: "compute", shape: "box", size: eclu.size, pos: eclu.pos, schematic: true,
          explode: { dir: [0, 1, 0], dist: 1.0, at: [0.2, 0.8] },
        },
        {
          id: "slc", label: "System cache", line: "Shared cache in front of memory; 24 MB, secondary source.",
          role: "memory", shape: "box", size: slc.size, pos: slc.pos, schematic: true,
          explode: { dir: [0, 1, 0], dist: 0.8, at: [0.25, 0.85] },
        },
        {
          id: "neural-engine", label: "Neural Engine", line: "Sixteen cores, 15.8 trillion operations per second.",
          role: "compute", shape: "box", size: ane.size, pos: ane.pos, schematic: true,
          explode: { dir: [0, 1, 0], dist: 1.4, at: [0.2, 0.85] },
        },
        {
          id: "media-engine", label: "Media engine", line: "Fixed-function block for video encode and decode.",
          role: "compute", shape: "box", size: media.size, pos: media.pos, schematic: true,
          explode: { dir: [0, 1, 0], dist: 1.2, at: [0.2, 0.85] },
        },
        {
          id: "mem-ctrl", label: "Memory controllers", line: "256-bit LPDDR5 interface on both die edges; split not published.",
          role: "interconnect", shape: "box", size: memctl.size, pos: [0, DIE_Y, memctl.pos[2]], count: 2,
          at: [[memctl.pos[0], 0, 0], [-memctl.pos[0], 0, 0]], schematic: true,
          explode: { dir: [0, 1, 0], dist: 0.7, spread: 0.1, at: [0.25, 0.85] },
        },
        {
          id: "io-top", label: "I/O strip", line: "Top strip of interface blocks; contents not published.",
          role: "io", shape: "box", size: ioTop.size, pos: ioTop.pos, schematic: true,
          explode: { dir: [0, 1, 0], dist: 0.6, at: [0.25, 0.85] },
        },
        {
          id: "io-right", label: "I/O edge", line: "Right edge interface blocks; contents not published.",
          role: "io", shape: "box", size: ioRight.size, pos: ioRight.pos, schematic: true,
          explode: { dir: [0, 1, 0], dist: 0.6, at: [0.25, 0.85] },
        },
      ],
      flows: [
        { from: "mem-ctrl", to: "gpu", label: "GPU reads from DRAM at over 200 GB/s, measured", speed: 1 },
        { from: "mem-ctrl", to: "p-cluster", label: "CPU reads from DRAM at about 125 GB/s, measured", speed: 0.6 },
      ],
      callouts: [
        { part: "p-cluster", title: "Fast cores", text: "Eight performance cores share 16 MB of L2 cache." },
        { part: "e-cluster", title: "Quiet cores", text: "Four efficiency cores take light work on a 4 MB L2." },
        { part: "gpu", title: "Big GPU", text: "Up to 19 cores; 6.5 TFLOPs FP32 measured." },
        { part: "neural-engine", title: "Neural Engine", text: "Sixteen cores deliver 15.8 trillion operations per second." },
        { part: "slc", title: "Shared cache", text: "A 24 MB system cache sits in front of DRAM." },
      ],
    },
    {
      id: "cluster",
      title: "One P cluster",
      parentPart: "p-cluster",
      parts: [
        {
          id: "cluster-base", label: "P cluster", line: "One of two mirrored performance blocks; floor plan is schematic.",
          role: "structure", shape: "rbox", size: [CL.w, CL.h, CL.d], pos: [0, CL.h / 2, 0], schematic: true,
        },
        {
          id: "p-core", label: "Performance core", line: "Four cores shown per block; core size is not published.",
          role: "compute", shape: "box", size: [1.1, 0.03, 2.5], pos: [0, CT + 0.015, 0], count: 4, at: cl3Core,
          glow: true, schematic: true, explode: { dir: [0, 1, 0], dist: 0.5, spread: 0.2, at: [0.15, 0.8] },
        },
        {
          id: "p-l2", label: "Shared L2 cache", line: "Cluster cache; 16 MB for all eight cores, secondary source.",
          role: "memory", shape: "slab", size: [1.0, 0.03, 5.2], pos: [0, CT + 0.015, 0], schematic: true,
          explode: { dir: [0, 1, 0], dist: 0.9, at: [0.25, 0.9] },
        },
        {
          id: "fabric-port", label: "Fabric port", line: "Where the cluster joins the on-die network; not published.",
          role: "interconnect", shape: "slab", size: [3.2, 0.03, 0.4], pos: [0, CT + 0.015, 2.9], schematic: true,
          explode: { dir: [0, 0.4, 1], dist: 0.8, at: [0.3, 0.9] },
        },
      ],
      flows: [
        { from: "p-l2", to: "p-core", label: "Cache lines inside the cluster; bandwidth not published", speed: 0.7 },
      ],
      callouts: [
        { part: "p-core", title: "Four cores", text: "Eight performance cores sit in two blocks of four." },
        { part: "p-l2", title: "Shared L2", text: "Cores share 16 MB, up from 12 MB on M1 Pro." },
        { part: "fabric-port", title: "Fabric port", text: "Schematic link to the rest of the die." },
      ],
    },
  ],
  glossary: [
    ["System on a chip", "one die that holds the CPU, GPU and other engines together."],
    ["Die", "the cut piece of silicon that holds the circuits."],
    ["Substrate", "the small circuit board the die and memory packages sit on."],
    ["Package", "the chip body with its protective base."],
    ["Performance core", "a fast CPU core for heavy work."],
    ["Efficiency core", "a slow, low-power CPU core for light work."],
    ["Cluster", "a group of cores that share a cache."],
    ["L2 cache", "fast memory shared by the cores of one cluster."],
    ["System cache", "a cache shared by all engines, in front of main memory."],
    ["Neural Engine", "a block built to run neural network inference at low power."],
    ["LPDDR5", "low-power DRAM used as main memory."],
    ["Unified memory", "one memory pool that CPU, GPU and Neural Engine all read."],
    ["Memory controller", "the circuit that talks to the DRAM."],
    ["5 nm", "the name of a manufacturing process, not a literal feature size."],
  ],
  notPublished: [
    "Die size: not published; about 289 mm2 is a pixel-count estimate.",
    "Floor plan, block positions and per-block area: the layout here is traced from Apple's image and is schematic.",
    "Package, substrate and board sizes: schematic, scaled from the image.",
    "L2 sizes (16 MB and 4 MB) and the 24 MB system cache come from secondary sources.",
    "How the eight performance cores split into clusters is read from the image, not stated by Apple.",
    "Neural Engine internals, clocks and memory channel split.",
    "Type and purpose of the small parts and gold pads around the die.",
    "Colours, shapes and layout are design choices; counts and hierarchy follow the sources.",
  ],
  sourcesPath: "details/apple-m2-pro.md",
};
