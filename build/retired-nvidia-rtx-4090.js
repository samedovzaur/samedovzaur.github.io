// NVIDIA GeForce RTX 4090: built from details/nvidia-rtx-4090.md (sections 3 to 8) under build/MODEL-RULES.md.
// All sizes and positions in mm. pos is the centre of the part's box. y is up; the card lies flat, cooler up,
// PCIe fingers toward +z. Three levels: the Founders Edition card, the AD102 die, one SM.

/* ---------- Level 1: the card (304 x 137 x 61 mm, 3 slots) ---------- */
const PKG = [-50, 0]; // AD102 package centre on the board (x, z)
const PCB_TOP = 1.6;
const VC = { y0: 4.6, y1: 7.6 };
const FIN = { y0: 7.6, y1: 44 };
const FAN = { y0: 44, y1: 56, x: 88, d: 115 };

// 12 GDDR6X chips (14 x 12 mm) around the package: 4 above, 4 below, 2 each side (rotated)
const gddr = [];
[-27, -9, 9, 27].forEach((x) => {
  gddr.push([x, 0, -37]);
  gddr.push([x, 0, 37]);
});
[-9, 9].forEach((z) => {
  gddr.push([-37, 0, z, Math.PI / 2]);
  gddr.push([37, 0, z, Math.PI / 2]);
});

/* ---------- Level 2: the AD102 die (608.5 mm2, drawn 24.67 x 24.67 mm) ---------- */
const DIE = 24.67;
const DIE_TOP = 0.8;
const GPC = { w: 3.4, d: 8.6, h: 0.12, pitch: 3.72, row: 6.6 };
const gpcAt = [];
for (const z of [-GPC.row, GPC.row]) for (let c = 0; c < 6; c++) gpcAt.push([-9.3 + c * GPC.pitch, 0, z]);
const GPC_OFF = [11]; // one of 12 GPCs is off on this card; which one is not published
// 128 SMs: 12 slots per GPC (6 TPCs x 2), 11 GPCs on; two GPCs run 10 SMs (Igor's Lab), so 132 - 4 = 128
const SM = { w: 1.45, d: 1.25, h: 0.1 };
const smAt = [];
gpcAt.forEach(([gx, , gz], g) => {
  if (GPC_OFF.includes(g)) return;
  const rows = g === 3 || g === 8 ? 5 : 6;
  for (let r = 0; r < rows; r++) for (const sx of [-0.8, 0.8]) smAt.push([gx + sx, 0, gz - 3.55 + r * 1.42]);
});
const memctlAt = [];
for (const x of [-11.75, 11.75]) for (let i = 0; i < 6; i++) memctlAt.push([x, 0, -9.33 + i * 3.733]);
const DIE_Y = DIE_TOP + GPC.h / 2; // centre height of blocks that sit on the die

/* ---------- Level 3: one SM (schematic floor plan, real counts) ---------- */
const SM_TOP = 0.04;
const PART_TOP = SM_TOP + 0.02;
const partitionAt = [];
for (const z of [-0.38, 0.08]) for (const x of [-0.35, 0.35]) partitionAt.push([x, 0, z]);
const inPartition = (lx, lz) => partitionAt.map(([px, , pz]) => [px + lx, 0, pz + lz]);
const coreAt = [];
partitionAt.forEach(([px, , pz]) => {
  for (let j = 0; j < 4; j++) for (let i = 0; i < 8; i++) coreAt.push([px - 0.31 + 0.0275 + i * 0.055, 0, pz - 0.13 + 0.025 + j * 0.05]);
});

export default {
  id: "nvidia-rtx-4090",
  name: "GeForce RTX 4090",
  maker: "NVIDIA",
  year: "2022",
  order: 1,
  oneLine: "The owner's GPU; daily CUDA practice.",
  hero: [
    "76.3 billion transistors on a 608.5 mm2 die",
    "16,384 CUDA cores in 128 SMs, 2,520 MHz boost",
    "24 GB GDDR6X, 384-bit, 1,008 GB/s",
  ],
  scale: { unit: "mm", stage: 30 },
  levels: [
    {
      id: "card",
      title: "RTX 4090 card",
      parentPart: null,
      parts: [
        {
          id: "pcb", label: "Circuit board", line: "Carries the GPU, memory and power stages; layout is schematic.",
          role: "structure", shape: "slab", size: [180, 1.6, 116], pos: [-50, 0.8, -2], schematic: true,
          explode: { dir: [0, -1, 0], dist: 40, at: [0.35, 0.9] },
        },
        {
          id: "pcie-edge", label: "PCIe 4.0 x16 edge", line: "Gold fingers, 16 lanes, about 31.5 GB/s each way.",
          role: "io", shape: "slab", size: [89, 1.6, 8], pos: [-85, 0.8, 60], follow: "pcb",
          explode: { dir: [0, 0, 1], dist: 14, at: [0.5, 0.95] },
        },
        {
          id: "power-16pin", label: "16-pin power plug", line: "12+4 pin plug feeds a 450 W card.",
          role: "power", shape: "box", size: [20, 5, 10], pos: [28, PCB_TOP + 2.5, -54], follow: "pcb",
          explode: { dir: [0, 0, -1], dist: 14, at: [0.5, 0.95] },
        },
        {
          id: "vrm", label: "Power stages", line: "23 phases turn 12 V into GPU and memory voltage.",
          role: "power", shape: "box", size: [24, 2, 96], pos: [15, PCB_TOP + 1, 0], count: 23,
          grid: { nx: 2, nz: 12, gap: 2 }, follow: "pcb",
          explode: { dir: [1, 0, 0], dist: 10, spread: 0.2, at: [0.5, 0.95] },
        },
        {
          id: "ad102", label: "AD102 package", line: "One 608.5 mm2 die on its substrate; package size is schematic.",
          role: "compute", shape: "rbox", size: [50, 3, 50], pos: [PKG[0], PCB_TOP + 1.5, PKG[1]], schematic: true,
          glow: true, enter: "die", follow: "pcb",
          explode: { dir: [0, 1, 0], dist: 24, at: [0.45, 0.95] },
        },
        {
          id: "gddr6x", label: "GDDR6X memory", line: "Twelve 2 GB chips on a 384-bit bus: 1,008 GB/s.",
          role: "memory", shape: "box", size: [14, 1.2, 12], pos: [PKG[0], PCB_TOP + 0.6, PKG[1]], count: 12, at: gddr,
          follow: "pcb",
          explode: { dir: [0, 1, 0], dist: 8, spread: 0.4, at: [0.45, 0.95] },
        },
        {
          id: "vapour-chamber", label: "Vapour chamber", line: "Flat copper plate that cools the GPU and memory together.",
          role: "cooling", tone: "copper", shape: "slab", size: [110, VC.y1 - VC.y0, 110],
          pos: [PKG[0], (VC.y0 + VC.y1) / 2, PKG[1]], schematic: true,
          explode: { dir: [0, 1, 0], dist: 48, at: [0.25, 0.8] },
        },
        {
          id: "heatsink", label: "Fin stack", line: "Aluminium fins on the vapour chamber; fin count not published.",
          role: "cooling", shape: "box", size: [290, FIN.y1 - FIN.y0, 125], pos: [0, (FIN.y0 + FIN.y1) / 2, 0],
          grid: { nx: 58, nz: 1, gap: 4.1 }, schematic: true, xray: true,
          explode: { dir: [0, 1, 0], dist: 75, spread: 0.12, at: [0.15, 0.7] },
        },
        {
          id: "fans", label: "Fans", line: "Two 11.5 cm fans with seven blades each.",
          role: "cooling", shape: "fan", blades: 7, size: [2 * FAN.d + (2 * FAN.x - FAN.d), FAN.y1 - FAN.y0, FAN.d],
          pos: [0, (FAN.y0 + FAN.y1) / 2, 0], count: 2, grid: { nx: 2, nz: 1, gap: 2 * FAN.x - FAN.d }, xray: true,
          explode: { dir: [0, 1, 0], dist: 110, at: [0.08, 0.6] },
        },
        {
          id: "shroud", label: "Shroud sides", line: "Metal shell of a 304 mm, 3-slot card.",
          role: "structure", shape: "frame", wall: 2.5, size: [304, 56, 137], pos: [0, 28, 0], xray: true,
          explode: { dir: [0, 1, 0], dist: 205, at: [0.02, 0.55] },
        },
        {
          id: "shroud-top", label: "Shroud top", line: "Top cover with two fan openings; the card weighs 2,075 g.",
          role: "structure", shape: "slab", size: [304, 3, 137], pos: [0, 57.5, 0],
          holes: [[-FAN.x, 0, FAN.d + 2], [FAN.x, 0, FAN.d + 2]], xray: true,
          explode: { dir: [0, 1, 0], dist: 265, at: [0, 0.5] },
        },
      ],
      flows: [
        { from: "gddr6x", to: "ad102", label: "1,008 GB/s between memory and GPU", speed: 1 },
        { from: "pcie-edge", to: "ad102", label: "about 31.5 GB/s each way over PCIe 4.0 x16 (32x slower; compressed)", speed: 0.15 },
        { from: "power-16pin", to: "vrm", label: "450 W total graphics power in", speed: 0.45 },
        { from: "vrm", to: "ad102", label: "23 phases feed the GPU and memory", speed: 0.45 },
      ],
      callouts: [
        { part: "shroud", title: "Big card", text: "304 mm long and 3 slots thick." },
        { part: "fans", title: "Two fans", text: "Two 11.5 cm fans, seven blades each." },
        { part: "vapour-chamber", title: "Vapour chamber", text: "Cools GPU and memory from one plate; card weighs 2,075 g." },
        { part: "gddr6x", title: "24 GB memory", text: "Gives 1,008 GB/s of bandwidth." },
        { part: "vrm", title: "Power stages", text: "23 phases feed the GPU and memory." },
        { part: "power-16pin", title: "16-pin plug", text: "12+4 pin plug carries a 450 W card." },
      ],
    },
    {
      id: "die",
      title: "AD102 die",
      parentPart: "ad102",
      parts: [
        {
          id: "die-base", label: "AD102 die", line: "76.3 billion transistors in 608.5 mm2, TSMC 4N.",
          role: "structure", shape: "slab", size: [DIE, DIE_TOP, DIE], pos: [0, DIE_TOP / 2, 0],
        },
        {
          id: "gpc", label: "GPC", line: "Graphics processing cluster; 11 of 12 are on in this card.",
          role: "compute", shape: "rbox", size: [GPC.w, GPC.h, GPC.d], pos: [0, DIE_Y, 0], at: gpcAt, count: 12,
          off: GPC_OFF, schematic: true, xray: true,
          explode: { dir: [0, 1, 0], dist: 1.2, spread: 0.18, at: [0.15, 0.75] },
        },
        {
          id: "sm", label: "SM", line: "Streaming multiprocessor that runs CUDA threads; 128 of 144 on.",
          role: "compute", shape: "box", size: [SM.w, SM.h, SM.d], pos: [0, DIE_TOP + GPC.h + SM.h / 2, 0], at: smAt,
          count: 128, glow: true, enter: "sm", follow: "gpc",
          explode: { dir: [0, 1, 0], dist: 1.4, spread: 0.18, at: [0.15, 0.75] },
        },
        {
          id: "l2", label: "L2 cache", line: "72 MB enabled of 96 MB on the die.",
          role: "memory", shape: "slab", size: [17.5, 0.12, 3.6], pos: [-2.25, DIE_Y, 0],
          explode: { dir: [0, 1, 0], dist: 0.7, at: [0.25, 0.85] },
        },
        {
          id: "memctl", label: "Memory controllers", line: "Twelve 32-bit controllers make the 384-bit bus.",
          role: "memory", shape: "box", size: [0.7, 0.12, 2.8], pos: [0, DIE_Y, 0], at: memctlAt, count: 12,
          explode: { dir: [0, 1, 0], dist: 0.4, spread: 0.3, at: [0.2, 0.8] },
        },
        {
          id: "nvenc", label: "NVENC encoders", line: "Two 8th-generation video encoders.",
          role: "compute", shape: "box", size: [1.4, 0.12, 1.4], pos: [7.6, DIE_Y, 0], at: [[0, 0, -0.9], [0, 0, 0.9]],
          count: 2, explode: { dir: [0, 1, 0], dist: 0.9, at: [0.3, 0.9] },
        },
        {
          id: "nvdec", label: "NVDEC decoder", line: "One 5th-generation video decoder.",
          role: "compute", shape: "box", size: [1.4, 0.12, 1.4], pos: [9.4, DIE_Y, -0.9],
          explode: { dir: [0, 1, 0], dist: 0.9, at: [0.3, 0.9] },
        },
        {
          id: "gigathread", label: "GigaThread engine", line: "Hands thread blocks out to the SMs.",
          role: "structure", shape: "slab", size: [16, 0.12, 0.6], pos: [0, DIE_Y, -11.75], schematic: true,
          explode: { dir: [0, 0, -1], dist: 2.2, at: [0.25, 0.85] },
        },
        {
          id: "pcie-if", label: "PCIe interface", line: "Die end of the PCIe 4.0 x16 link.",
          role: "interconnect", shape: "slab", size: [5, 0.12, 0.6], pos: [-6, DIE_Y, 11.75],
          explode: { dir: [0, 0, 1], dist: 2.2, at: [0.25, 0.85] },
        },
      ],
      flows: [
        { from: "memctl", to: "l2", label: "384-bit total: 12 controllers x 32-bit", speed: 0.7 },
        { from: "l2", to: "sm", label: "72 MB of L2 feeds all 128 SMs", speed: 1 },
      ],
      callouts: [
        { part: "die-base", title: "AD102 die", text: "76.3 billion transistors in 608.5 mm2." },
        { part: "gpc", title: "Cut-down die", text: "Full die has 12 GPCs; this card enables 11." },
        { part: "sm", title: "128 SMs", text: "Full die has 144; 128 are on." },
        { part: "l2", title: "Huge L2", text: "72 MB on, from 96 MB on the die." },
        { part: "memctl", title: "12 controllers", text: "Twelve 32-bit controllers make a 384-bit bus." },
        { part: "nvenc", title: "Video engines", text: "Two 8th-gen NVENC and one 5th-gen NVDEC." },
      ],
    },
    {
      id: "sm",
      title: "One SM",
      parentPart: "sm",
      parts: [
        {
          id: "sm-one", label: "One SM", line: "One streaming multiprocessor of 128; floor plan is schematic.",
          role: "structure", shape: "rbox", size: [1.45, SM_TOP, 1.25], pos: [0, SM_TOP / 2, 0], schematic: true,
        },
        {
          id: "partition", label: "SM partition", line: "Four quarters, each with one warp scheduler.",
          role: "compute", shape: "box", size: [0.66, 0.02, 0.44], pos: [0, SM_TOP + 0.01, 0], at: partitionAt, count: 4,
          xray: true, explode: { dir: [0, 1, 0], dist: 0.12, spread: 0.35, at: [0.1, 0.7] },
        },
        {
          id: "warp-sched", label: "Warp scheduler", line: "Picks which warp of 32 threads runs next; 4 per SM.",
          role: "compute", shape: "box", size: [0.62, 0.012, 0.06], pos: [0, PART_TOP + 0.006, 0], at: inPartition(0, -0.18),
          count: 4, follow: "partition", explode: { dir: [0, 1, 0], dist: 0.1, spread: 0.35, at: [0.1, 0.7] },
        },
        {
          id: "cuda-core", label: "CUDA core", line: "One lane of basic maths; 128 per SM.",
          role: "compute", shape: "box", size: [0.045, 0.012, 0.04], pos: [0, PART_TOP + 0.006, 0], at: coreAt, count: 128,
          glow: true, follow: "partition", explode: { dir: [0, 1, 0], dist: 0.06, spread: 0.35, at: [0.1, 0.7] },
        },
        {
          id: "tensor-core", label: "Tensor core", line: "4th-generation matrix unit; 4 per SM.",
          role: "compute", shape: "box", size: [0.15, 0.016, 0.2], pos: [0, PART_TOP + 0.008, 0], at: inPartition(0.235, -0.03),
          count: 4, follow: "partition", explode: { dir: [0, 1, 0], dist: 0.08, spread: 0.35, at: [0.1, 0.7] },
        },
        {
          id: "regfile", label: "Register file", line: "64 KB per partition; 64K 32-bit registers per SM.",
          role: "memory", shape: "box", size: [0.62, 0.012, 0.1], pos: [0, PART_TOP + 0.006, 0], at: inPartition(0, 0.15),
          count: 4, follow: "partition", explode: { dir: [0, 1, 0], dist: 0.04, spread: 0.35, at: [0.1, 0.7] },
        },
        {
          id: "l1-shared", label: "L1 and shared memory", line: "128 KB per SM, split between cache and shared memory.",
          role: "memory", shape: "slab", size: [1.36, 0.02, 0.16], pos: [0, SM_TOP + 0.01, 0.4],
          explode: { dir: [0, 0.4, 1], dist: 0.22, at: [0.3, 0.9] },
        },
        {
          id: "rt-core", label: "RT core", line: "One 3rd-generation ray-tracing unit per SM.",
          role: "compute", shape: "box", size: [0.5, 0.03, 0.1], pos: [0, SM_TOP + 0.015, 0.55],
          explode: { dir: [0, 0.4, 1], dist: 0.4, at: [0.35, 0.95] },
        },
      ],
      flows: [
        { from: "l1-shared", to: "cuda-core", label: "128 KB of L1 and shared memory per SM", speed: 0.6 },
        { from: "regfile", to: "cuda-core", label: "65,536 32-bit registers per SM; up to 255 per thread", speed: 1 },
      ],
      callouts: [
        { part: "partition", title: "Four partitions", text: "Each SM has 4 partitions with 1 warp scheduler each." },
        { part: "cuda-core", title: "128 cores", text: "128 CUDA cores per SM." },
        { part: "tensor-core", title: "Tensor cores", text: "4 fourth-gen tensor cores per SM." },
        { part: "rt-core", title: "RT core", text: "1 third-gen RT core per SM." },
        { part: "l1-shared", title: "L1 and shared", text: "128 KB per SM, split by software." },
        { part: "regfile", title: "Registers", text: "64K 32-bit registers per SM." },
      ],
    },
  ],
  glossary: [
    ["AD102", "the GPU chip on the RTX 4090."],
    ["Die", "the piece of silicon with the circuits on it."],
    ["Package", "the die plus the base it is mounted on."],
    ["GPC", "graphics processing cluster, a big group of compute tiles."],
    ["TPC", "a pair of SMs inside a GPC."],
    ["SM", "streaming multiprocessor, the unit that runs your CUDA threads."],
    ["CUDA core", "one lane that does a basic maths operation."],
    ["Tensor core", "a unit for matrix maths, used in AI."],
    ["Warp", "a group of 32 threads that run together."],
    ["Register file", "the fastest memory, private to each thread."],
    ["Shared memory", "the part of L1 that your kernel controls."],
    ["L2 cache", "larger memory shared by all SMs."],
    ["GDDR6X", "the fast graphics memory on the card."],
    ["Vapour chamber", "a flat sealed plate that spreads heat fast."],
    ["VRM", "turns 12 V into the low voltage the chip needs."],
    ["PCIe", "the slot link between card and computer."],
  ],
  notPublished: [
    "Memory chip count (12) is derived: 384-bit bus / 32 bits, and 24 GB / 2 GB.",
    "23 power stages is a headline figure; the split (20 GPU + 3 memory) is an inference.",
    "Fin count, heat pipe count and vapour chamber size.",
    "PCB layer count, thickness and exact outline.",
    "Die floor plan: how much area is L2, SMs and memory controllers.",
    "Which GPC is off and which SMs are cut.",
    "Whether the disabled 24 MB of L2 is defective or fused off.",
    "Package substrate size; the model uses a schematic 50 x 50 mm.",
    "PCIe about 31.5 GB/s each way is a calculation, not an NVIDIA figure.",
    "Shapes, colours and layout are design choices; counts and hierarchy are real.",
  ],
  sourcesPath: "details/nvidia-rtx-4090.md",
};
