// Google TPU Ironwood (TPU7x): built from details/google-tpu.md and build/ref/tpu-ironwood-package.png under build/MODEL-RULES.md (7b).
// All sizes and positions in mm. pos is the centre of the part's box. y is up. Level 1 is the package as photographed:
// silver frame, dark ring, gold field, two dies in the centre, four HBM stacks in a column on each side.
// Package, die and floor plan sizes are not published; they are schematic, read off the photo and sized from published neighbours.

/* ---------- Level 1: the tray (4 chips, liquid cooled). Layout read off the Google tray photo (xpu.pub, 2025); all tray sizes are schematic. ---------- */
const TB = { w: 543, d: 463, h: 3 }; // board; 1 mm = about 1 px of the photo
const CX = [-198, -66, 66, 198]; // chip centres across the board
const CZ = -17; // chip row, toward the connector end
const BT = TB.h; // board top
const rowAt = (f) => CX.flatMap((x) => f(x));
const cornersAt = rowAt((x) => [[x - 49, 0, CZ - 50], [x + 49, 0, CZ - 50], [x - 49, 0, CZ + 50], [x + 49, 0, CZ + 50]]);
const coilsAt = rowAt((x) => {
  const o = [];
  for (const dx of [-59, -53, 53, 59]) for (let i = 0; i < 6; i++) o.push([x + dx, 0, CZ - 30 + i * 12]);
  for (const dz of [-58, 58]) for (let i = 0; i < 8; i++) o.push([x - 35 + i * 10, 0, CZ + dz]);
  return o;
});
const capsAt = rowAt((x) => [[x - 20, 0, CZ + 68], [x, 0, CZ + 68], [x + 20, 0, CZ + 68]]);
const cageX = [-203, -74, 83, 209];
const finX = [-250, -190, -122, -60, 10, 76, 142, 205, 262];
const TIDE = 4.6;

/* ---------- Level 1: the package ---------- */
const PKG = 86; // square package; schematic
const SUB_H = 1.6;
const FIELD = 66; // gold field visible through the frame
const RING = { w: 70, wall: 2 }; // dark ring between frame and field
const FRAME = { wall: 8 }; // silver frame: 86 outer, 70 opening
const DIE = { w: 15.2, h: 0.8, d: 62, x: 8 }; // two dies side by side, 0.8 mm seam
const HBM = { w: 13, d: 14.5, pitch: 15.4, x: 22.8 }; // about 11 mm class stack; column of four each side
const TOP = SUB_H + DIE.h;
const FRAME_H = 1.4;
const dieAt = [[-DIE.x, 0, 0], [DIE.x, 0, 0]];
const hbmAt = [];
for (const x of [-HBM.x, HBM.x]) for (let i = 0; i < 4; i++) hbmAt.push([x, 0, (i - 1.5) * HBM.pitch]);

/* ---------- Level 2: one compute die (left die; HBM edge at -x, die-to-die edge at +x) ---------- */
const BLK = 0.1;
const BLK_Y = DIE.h + BLK / 2;
const iciAt = [[-3.6, 0, 0], [0, 0, 0], [3.6, 0, 0]];

/* ---------- Level 3: one TensorCore (floor plan schematic; one MXU shown) ---------- */
const TC = { w: 16, d: 12, h: 0.2 };
const MXU = { s: 9.6, x: -3, h: 0.15 };
const MXU_TOP = TC.h + MXU.h;
const CELL_H = 0.12;
const SIDE = { h: 0.4 };

export default {
  id: "google-tpu",
  name: "TPU Ironwood (v7)",
  maker: "Google",
  year: "2025",
  order: 6,
  oneLine: "The clean systolic-array example.",
  hero: [
    "Google claims 4,614 TFLOPS peak FP8 per chip",
    "192 GiB HBM3E per chip at 7,380 GB/s",
    "9,216 chips per pod over 3D torus ICI",
  ],
  scale: { unit: "mm", stage: 30 },
  levels: [
    {
      id: "tray",
      title: "Ironwood tray",
      parentPart: null,
      parts: [
        {
          id: "tray-board", label: "Tray board", line: "Green board carrying 4 Ironwood chips; size is schematic.",
          role: "structure", tone: "pcb-green", shape: "slab", size: [TB.w, TB.h, TB.d], pos: [0, TB.h / 2, 0], schematic: true,
          explode: { dir: [0, -1, 0], dist: 14, at: [0.6, 1] },
        },
        {
          id: "tpu-package", label: "Ironwood chip", line: "One of 4 chips on the tray; two dies and 8 HBM3E each.",
          role: "io", tone: "gold", shape: "slab", size: [PKG, SUB_H, PKG], pos: [0, BT + SUB_H / 2, CZ], at: CX.map((x) => [x, 0, 0]), count: 4,
          schematic: true, enter: "package", explode: { dir: [0, 1, 0], dist: 4, at: [0.45, 0.8] },
        },
        {
          id: "tray-dies", label: "Compute die", line: "Two dies per chip, 8 on the tray; die size not published.",
          role: "compute", tone: "gold", shape: "box", size: [DIE.w, DIE.h, DIE.d], pos: [0, BT + SUB_H + DIE.h / 2, CZ],
          at: rowAt((x) => [[x - DIE.x, 0, 0], [x + DIE.x, 0, 0]]), count: 8, schematic: true,
          explode: { dir: [0, 1, 0], dist: 18, at: [0.35, 0.75] },
        },
        {
          id: "tray-hbm", label: "HBM3E stack", line: "8 stacks per chip, 32 on the tray, in two columns of four.",
          role: "memory", tone: "copper", shape: "box", size: [HBM.w, DIE.h, HBM.d], pos: [0, BT + SUB_H + DIE.h / 2, CZ],
          at: rowAt((x) => [-HBM.x, HBM.x].flatMap((dx) => [0, 1, 2, 3].map((i) => [x + dx, 0, (i - 1.5) * HBM.pitch]))), count: 32,
          explode: { dir: [0, 1, 0], dist: 18, spread: 0.1, at: [0.35, 0.75] },
        },
        {
          id: "tray-ring", label: "Dark ring", line: "Dark ring between the silver frame and the gold field.",
          role: "structure", tone: "graphite", shape: "frame", wall: RING.wall, size: [RING.w, DIE.h, RING.w], pos: [0, BT + TOP - DIE.h / 2, CZ],
          at: CX.map((x) => [x, 0, 0]), count: 4, schematic: true, explode: { dir: [0, 1, 0], dist: 30, at: [0.2, 0.6] },
        },
        {
          id: "tray-frame", label: "Silver frame", line: "Silver lid frame on each chip, with a gold field inside.",
          role: "structure", tone: "silver", shape: "frame", wall: FRAME.wall, size: [PKG, FRAME_H, PKG], pos: [0, BT + SUB_H + FRAME_H / 2, CZ],
          at: CX.map((x) => [x, 0, 0]), count: 4, schematic: true, explode: { dir: [0, 1, 0], dist: 55, at: [0.1, 0.5] },
        },
        {
          id: "cold-plate", label: "Cold plate", line: "Metal plate with liquid channels on each chip; one per chip.",
          role: "coolingCopper", tone: "copper", shape: "rbox", size: [92, 5, 92], pos: [0, BT + SUB_H + FRAME_H + 2.5, CZ],
          at: CX.map((x) => [x, 0, 0]), count: 4, schematic: true, xray: true, explode: { dir: [0, 1, 0], dist: 110, at: [0, 0.4] },
        },
        {
          id: "coolant-lines", label: "Coolant tubes", line: "Tubes carry liquid along the tray to each cold plate.",
          role: "cooling", tone: "matte", shape: "cyl", size: [8, 450, 8], pos: [0, BT + SUB_H + FRAME_H + 5 + 2 + 4, CZ - 40], rot: [0, 0, Math.PI / 2],
          schematic: true, explode: { dir: [0, 1, 0], dist: 130, at: [0, 0.35] },
        },
        {
          id: "coolant-drops", label: "Coolant drops", line: "Short tubes join the main line to each cold plate.",
          role: "cooling", tone: "matte", shape: "cyl", size: [8, 2, 8], pos: [0, BT + SUB_H + FRAME_H + 5 + 1, CZ - 40],
          at: CX.map((x) => [x, 0, 0]), count: 4, schematic: true, explode: { dir: [0, 1, 0], dist: 130, at: [0, 0.35] },
        },
        {
          id: "standoffs", label: "Mounting screws", line: "4 screws per chip hold the cold plate; counts are schematic.",
          role: "structure", tone: "nickel", shape: "cyl", size: [5, 6, 5], pos: [0, BT + 3, 0], at: cornersAt, count: 16, schematic: true,
          explode: { dir: [0, 1, 0], dist: 80, at: [0, 0.4] },
        },
        {
          id: "inductors", label: "Power inductors", line: "Rows of power stages around each chip; counts are schematic.",
          role: "power", tone: "matte", shape: "box", size: [4, 3.5, 4], pos: [0, BT + 1.75, 0], at: coilsAt.map(([x, y, z]) => [x, 0, z]), count: coilsAt.length,
          schematic: true, explode: { dir: [0, 1, 0], dist: 6, spread: 0.1, at: [0.3, 0.7] },
        },
        {
          id: "caps", label: "Power capacitors", line: "Round capacitors below each chip; placement is schematic.",
          role: "power", tone: "nickel", shape: "cyl", size: [9, 9, 9], pos: [0, BT + 4.5, 0], at: capsAt.map(([x, y, z]) => [x, 0, z]), count: 12,
          schematic: true, explode: { dir: [0, 1, 0], dist: 7, at: [0.3, 0.7] },
        },
        {
          id: "vrm-sinks", label: "Power heatsinks", line: "Silver finned blocks over the power stages; placement schematic.",
          role: "cooling", tone: "silver", shape: "box", size: [46, 16, 46], pos: [0, BT + 8, 98],
          at: [0, 1, 2, 3].flatMap((g) => [-250 + 120 * g + 23, -250 + 120 * g + 69]).map((x) => [x, 0, 0]), count: 8, schematic: true,
          explode: { dir: [0, 1, 0], dist: 34, at: [0.2, 0.6] },
        },
        {
          id: "vrm-blocks", label: "Power modules", line: "Black power modules between the finned heatsinks.",
          role: "power", tone: "graphite", shape: "box", size: [24, 16, 46], pos: [0, BT + 8, 98],
          at: [0, 1, 2, 3].map((g) => [-250 + 120 * g + 105, 0, 0]), count: 4, schematic: true,
          explode: { dir: [0, 1, 0], dist: 18, at: [0.2, 0.6] },
        },
        {
          id: "ici-cages", label: "ICI connector cages", line: "Black connector cages on the tray edge; 6 ICI links per chip.",
          role: "io", tone: "matte", shape: "box", size: [110, 30, 108], pos: [0, BT + 15, -187], at: cageX.map((x) => [x, 0, 0]), count: 4, schematic: true,
          explode: { dir: [0, 0.3, -1], dist: 40, at: [0.2, 0.7] },
        },
        {
          id: "ici-ports", label: "ICI ports", line: "Port rows on each cage, toward neighbouring chips.",
          role: "io", tone: "gold", shape: "box", size: [96, 1.2, 94], pos: [0, BT + 30.6, -187], at: cageX.map((x) => [x, 0, 0]), count: 4,
          schematic: true, explode: { dir: [0, 0.3, -1], dist: 40, at: [0.2, 0.7] },
        },
        {
          id: "aux-sinks", label: "Auxiliary heatsinks", line: "Two small silver heatsinks near the tray's rear edge.",
          role: "cooling", tone: "silver", shape: "box", size: [70, 14, 38], pos: [0, BT + 7, 201], at: [[-68, 0, 0], [172, 0, 0]], count: 2, schematic: true,
          explode: { dir: [0, 1, 0], dist: 20, at: [0.2, 0.6] },
        },
        {
          id: "host-link", label: "Host link", line: "PCIe path to the CPU host; connector placement is schematic.",
          role: "io", tone: "graphite", shape: "box", size: [60, 6, 14], pos: [60, BT + 3, 218], schematic: true,
          explode: { dir: [0, 0.3, 1], dist: 30, at: [0.2, 0.7] },
        },
      ],
      flows: [],
      callouts: [
        { part: "tpu-package", title: "Four chips", text: "Each tray holds 4 Ironwood chips in a row." },
        { part: "cold-plate", title: "Liquid cooled", text: "Cold plates on each chip carry heat into liquid." },
        { part: "ici-cages", title: "ICI links", text: "Each chip has 6 ICI links to its neighbours." },
        { part: "tray-board", title: "16 per rack", text: "16 trays make one 64-chip rack." },
      ],
    },
    {
      id: "package",
      title: "Ironwood package",
      parentPart: "tpu-package",
      parts: [
        {
          id: "substrate", label: "Package substrate", line: "Gold-coloured base under both dies and 8 stacks; size is schematic.",
          role: "io", tone: "gold", shape: "slab", size: [PKG, SUB_H, PKG], pos: [0, SUB_H / 2, 0], schematic: true,
          explode: { dir: [0, -1, 0], dist: 12, at: [0.5, 1] },
        },
        {
          id: "lid-frame", label: "Silver frame", line: "Silver frame around the gold field; it lifts off first.",
          role: "structure", tone: "silver", shape: "frame", wall: FRAME.wall, size: [PKG, FRAME_H, PKG], pos: [0, SUB_H + FRAME_H / 2, 0],
          schematic: true, xray: true, explode: { dir: [0, 1, 0], dist: 40, at: [0, 0.5] },
        },
        {
          id: "dark-ring", label: "Dark ring", line: "Dark ring between the silver frame and the gold field.",
          role: "structure", tone: "graphite", shape: "frame", wall: RING.wall, size: [RING.w, DIE.h, RING.w], pos: [0, TOP - DIE.h / 2, 0],
          schematic: true, explode: { dir: [0, 1, 0], dist: 22, at: [0.1, 0.55] },
        },
        {
          id: "compute-die", label: "Compute die", line: "One of 2 compute dies, side by side; die size is not published.",
          role: "compute", tone: "gold", shape: "box", size: [DIE.w, DIE.h, DIE.d], pos: [0, SUB_H + DIE.h / 2, 0], at: dieAt, count: 2,
          schematic: true, enter: "die", explode: { dir: [0, 1, 0], dist: 4, spread: 0.2, at: [0.3, 0.85] },
        },
        {
          id: "hbm-stack", label: "HBM3E stack", line: "Stacked memory beside the dies; 8 per chip feed 7,380 GB/s.",
          role: "memory", tone: "copper", shape: "box", size: [HBM.w, DIE.h, HBM.d], pos: [0, SUB_H + DIE.h / 2, 0], at: hbmAt, count: 8,
          explode: { dir: [0, 1, 0], dist: 2, spread: 0.3, at: [0.2, 0.75] },
        },
      ],
      flows: [
        { from: "hbm-stack", to: "compute-die", label: "7,380 GB/s from 8 HBM3E stacks per chip", speed: 1 },
      ],
      callouts: [
        { part: "compute-die", title: "Two dies", text: "One chip is two compute dies in one package." },
        { part: "hbm-stack", title: "Eight stacks", text: "8 HBM3E stacks give 192 GiB per chip." },
        { part: "hbm-stack", title: "7.4 TB/s", text: "Memory bandwidth feeds the matrix engines at 7,380 GB/s." },
        { part: "lid-frame", title: "Silver frame", text: "Silver frame protects the package; shape read from the photo." },
      ],
    },
    {
      id: "die",
      title: "One compute die",
      parentPart: "compute-die",
      parts: [
        {
          id: "die-body", label: "Compute die", line: "One of 2 compute dies; die size is not published.",
          role: "compute", tone: "gold", shape: "box", size: [DIE.w, DIE.h, DIE.d], pos: [0, DIE.h / 2, 0], schematic: true,
        },
        {
          id: "hbm-phy", label: "HBM interface", line: "Die edge that talks to its 4 HBM3E stacks; placement schematic.",
          role: "memory", shape: "box", size: [1.6, BLK, 56], pos: [-6.4, BLK_Y, 0], schematic: true,
          explode: { dir: [-1, 0.5, 0], dist: 4, at: [0.2, 0.8] },
        },
        {
          id: "d2d-phy", label: "Die-to-die link", line: "Joins the two dies; bandwidth given only as 6x one ICI link.",
          role: "interconnect", shape: "box", size: [1.2, BLK, 56], pos: [6.6, BLK_Y, 0], schematic: true,
          explode: { dir: [1, 0.5, 0], dist: 4, at: [0.2, 0.8] },
        },
        {
          id: "tensorcore", label: "TensorCore", line: "Holds the matrix, vector and scalar units; one per die.",
          role: "compute", shape: "box", size: [10, BLK, 30], pos: [0, BLK_Y, -6], glow: true, enter: "core",
          explode: { dir: [0, 1, 0], dist: 3, at: [0.15, 0.75] },
        },
        {
          id: "sparsecore", label: "SparseCore", line: "Dataflow engine for embedding lookups; 4 per chip.",
          role: "compute", shape: "box", size: [10, BLK, 8], pos: [0, BLK_Y, 21], at: [[0, 0, -4.5], [0, 0, 4.5]], count: 2,
          schematic: true, explode: { dir: [0, 1, 0], dist: 2, at: [0.25, 0.85] },
        },
        {
          id: "ici-phy", label: "ICI PHY", line: "Die end of the 6 ICI links; 3 per die, placement schematic.",
          role: "interconnect", shape: "box", size: [3, BLK, 5], pos: [0, BLK_Y, -27.5], at: iciAt, count: 3, schematic: true,
          explode: { dir: [0, 0.4, -1], dist: 4, at: [0.25, 0.85] },
        },
      ],
      flows: [
        { from: "hbm-phy", to: "tensorcore", label: "7,380 GB/s from 8 HBM3E stacks per chip", speed: 1 },
        { from: "tensorcore", to: "d2d-phy", label: "about 1,200 GB/s die to die, derived from 6x one ICI link", speed: 0.35 },
        { from: "tensorcore", to: "ici-phy", label: "1,200 GB/s bidirectional ICI per chip over 6 links", speed: 0.35 },
      ],
      callouts: [
        { part: "tensorcore", title: "TensorCore", text: "One TensorCore sits on each of the 2 dies." },
        { part: "sparsecore", title: "SparseCore", text: "4 SparseCores per chip handle embedding lookups." },
        { part: "hbm-phy", title: "Memory edge", text: "Each die feeds 4 of the 8 HBM3E stacks." },
        { part: "d2d-phy", title: "Die to die", text: "The seam joins the two dies at about 1,200 GB/s, derived." },
      ],
    },
    {
      id: "core",
      title: "One TensorCore",
      parentPart: "tensorcore",
      parts: [
        {
          id: "tc-floor", label: "TensorCore floor", line: "One of 2 TensorCores per chip; floor plan is schematic.",
          role: "structure", shape: "rbox", size: [TC.w, TC.h, TC.d], pos: [0, TC.h / 2, 0], schematic: true,
        },
        {
          id: "mxu", label: "MXU", line: "Matrix multiply unit; MXUs per TensorCore not published, one shown.",
          role: "compute", shape: "slab", size: [MXU.s + 0.4, MXU.h, MXU.s + 0.4], pos: [MXU.x, TC.h + MXU.h / 2, 0],
          schematic: true, explode: { dir: [0, 1, 0], dist: 2.5, at: [0.15, 0.75] },
        },
        {
          id: "mxu-cell", label: "MAC cells (schematic)", line: "Real array is 256 x 256 cells; drawn 64 x 64 so cells read.",
          role: "compute", shape: "box", size: [MXU.s, CELL_H, MXU.s], pos: [MXU.x, MXU_TOP + CELL_H / 2, 0],
          grid: { nx: 64, nz: 64, gap: 0.03 }, count: 4096, schematic: true, glow: true, follow: "mxu",
          explode: { dir: [0, 1, 0], dist: 1.5, at: [0.15, 0.75] },
        },
        {
          id: "vpu", label: "Vector unit", line: "Handles activations and softmax on FP32 results, not matrix math.",
          role: "compute", shape: "box", size: [2.2, SIDE.h, 9.6], pos: [3.6, TC.h + SIDE.h / 2, 0],
          explode: { dir: [1, 0.5, 0], dist: 3, at: [0.25, 0.85] },
        },
        {
          id: "vector-mem", label: "Vector memory", line: "On-chip SRAM beside the vector unit; size not published.",
          role: "memory", shape: "box", size: [2.6, SIDE.h, 6.6], pos: [6.3, TC.h + SIDE.h / 2, -1.5],
          explode: { dir: [1, 0.5, -0.4], dist: 5, at: [0.3, 0.9] },
        },
        {
          id: "scalar-unit", label: "Scalar unit", line: "Runs control flow and address maths, one value at a time.",
          role: "compute", shape: "box", size: [2.6, SIDE.h, 2.6], pos: [6.3, TC.h + SIDE.h / 2, 3.5],
          explode: { dir: [1, 0.5, 0.6], dist: 5, at: [0.3, 0.9] },
        },
      ],
      flows: [
        { from: "vector-mem", to: "mxu-cell", label: "Weights load, then data streams in; rate not published", speed: 0.8 },
        { from: "mxu-cell", to: "vpu", label: "FP32 accumulated results out; rate not published", speed: 0.6 },
        { from: "scalar-unit", to: "vpu", label: "Control and addresses for each step", speed: 0.3 },
      ],
      callouts: [
        { part: "mxu-cell", title: "Systolic array", text: "Data flows through a grid of 256 x 256 cells." },
        { part: "mxu-cell", title: "One MAC", text: "Each cell multiplies and adds. The array does 65,536 per cycle." },
        { part: "mxu", title: "No memory reads", text: "Operands move cell to cell, with no memory access mid-multiply." },
        { part: "vpu", title: "Vector unit", text: "Handles activations and softmax, not matrix math." },
        { part: "scalar-unit", title: "Scalar unit", text: "Runs control flow and address maths." },
        { part: "mxu", title: "FP8 and BF16", text: "Takes BF16 inputs, FP8 on this chip, accumulates in FP32." },
      ],
    },
  ],
  glossary: [
    ["TPU", "Tensor Processing Unit, Google's chip for neural network math."],
    ["TensorCore", "the main compute block of a TPU: MXU, vector unit and scalar unit."],
    ["MXU", "Matrix Multiply Unit, a systolic array that does matrix multiplication."],
    ["Systolic array", "a grid of cells where data moves cell to cell in rhythm, reused without going back to memory."],
    ["MAC", "multiply-accumulate: multiply two numbers and add to a running sum."],
    ["Tensor core (GPU)", "NVIDIA's matrix engine; comparison only, not part of this device."],
    ["VPU", "vector processing unit; works on many values at once for non-matrix math."],
    ["Scalar unit", "runs control flow and address maths, one value at a time."],
    ["VMEM", "vector memory, fast on-chip SRAM next to the vector unit."],
    ["SparseCore", "a small dataflow engine for embedding lookups."],
    ["HBM3E", "stacked high-bandwidth memory placed next to the chip."],
    ["Compute die", "one silicon die; Ironwood joins two in one package."],
    ["D2D", "die-to-die link between the two compute dies."],
    ["ICI", "Inter-Chip Interconnect, direct links between TPU chips."],
    ["3D torus", "a grid where each chip has six neighbours and the edges wrap around."],
    ["OCS", "optical circuit switch; reconnects light paths between racks without converting to electricity."],
    ["Cube", "a 64-chip rack, the unit the OCS connects."],
    ["Pod", "the full 9,216-chip system."],
    ["DCN", "data center network, used between pods."],
    ["FP8, BF16, FP32", "number formats of 8, 16 and 32 bits."],
    ["PCIe", "the bus that joins chips to the CPU host."],
    ["Cold plate", "a metal plate with liquid channels that sits on a chip."],
    ["TFLOPS", "trillions of floating point operations per second."],
  ],
  notPublished: [
    "MXUs per TensorCore on Ironwood: not published (4 on v4, 2 on v6e). One MXU is drawn.",
    "MXU size 256 x 256 is from Google docs; the Hot Chips slide text was not checked.",
    "Docs say 128K bfloat16 MACs per cycle for a 256 x 256 MXU, which has 65,536 cells. Unresolved.",
    "Chip power or TDP: not published. A pod figure near 10 MW comes from one press article.",
    "VMEM size and clock speed: not published.",
    "Die size, transistor count and process node; N3P is from secondary sources only. Dies are drawn 15 x 62 mm, read off the photo.",
    "Die-to-die bandwidth: only 6x one 1D ICI link; about 1,200 GB/s is derived.",
    "PCIe bandwidth to the host: not published.",
    "Package size and weight: not published. Package, frame and ring sizes are read off the photo (schematic).",
    "Placement of the 6 ICI links on the die: schematic.",
    "TensorCore, SparseCore, vector unit, scalar unit and VMEM floor plan: schematic.",
    "4,614 TFLOPS is FP8 per Google docs; one source wrongly labels it BF16.",
    "Pod here means the 9,216-chip system; one Google blog calls it a superpod.",
    "Shapes, colours and layout are design choices; counts and hierarchy are real.",
  ],
  sourcesPath: "details/google-tpu.md",
};
