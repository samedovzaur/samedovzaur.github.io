// NVIDIA GeForce RTX 5090 Founders Edition: built from details/nvidia-rtx-5090.md under build/MODEL-RULES.md,
// shaped to build/ref/rtx-5090-pcb.png and rtx-5090-fe.png. mm, y up, card flat, PCIe edge toward +z, plug toward -z.
// Three levels: the card, the GB202 die, one SM.

/* ---------- Level 1: the card (304 x 137 mm, 2 slots) ---------- */
const PCB = { w: 92, d: 96, y0: 3, t: 1.6 };
const PCB_TOP = PCB.y0 + PCB.t; // 4.6
const END_X = 99; // centre of each fan end
const FAN_D = 88;
const PKG = [-2, 4]; // package centre on the board (x, z)

// sixteen GDDR7 chips, 12 x 11 mm: 5 left, 5 right, 4 top, 2 bottom (as in the photo)
const gddr = [];
for (let i = 0; i < 5; i++) {
  gddr.push([-37, 0, -24 + 12 * i]);
  gddr.push([34, 0, -24 + 12 * i]);
}
[-21, -7, 7, 21].forEach((x) => gddr.push([x, 0, -32]));
[-17, 5].forEach((x) => gddr.push([x, 0, 36]));

// inductor rows: 12 along the top edge, 11 along the bottom edge, 9 down the right side
const indTop = [];
for (let i = 0; i < 12; i++) indTop.push([-38.5 + 7 * i, 0, 0]);
const indBottom = [];
for (let i = 0; i < 11; i++) indBottom.push([-35 + 7 * i, 0, 0]);
const indRight = [];
for (let i = 0; i < 9; i++) indRight.push([0, 0, -18 + 7 * i]);

/* ---------- Level 2: the GB202 die (750 mm2, drawn 24 x 31 mm) ---------- */
const DIE = { w: 24, d: 31 };
const DIE_TOP = 0.8;
const GPC = { w: 3.0, d: 10, h: 0.12, pitch: 3.3, row: 8 };
const DIE_Y = DIE_TOP + GPC.h / 2;
const gpcAt = [];
for (const z of [-GPC.row, GPC.row]) for (let c = 0; c < 6; c++) gpcAt.push([-8.25 + c * GPC.pitch, 0, z]);
const GPC_OFF = [11]; // one of 12 GPCs is off; which one is not published
// 12 GPCs x 16 SM slots = 192. 170 are on: the off GPC (16) plus 6 more SMs (3 TPCs), positions schematic
const SM = { w: 1.3, d: 1.1, h: 0.1 };
const smAt = [];
const smOff = [];
const EXTRA_OFF = new Set([4 * 16 + 14, 4 * 16 + 15, 7 * 16 + 14, 7 * 16 + 15, 9 * 16 + 14, 9 * 16 + 15]);
gpcAt.forEach(([gx, , gz], g) => {
  for (let r = 0; r < 8; r++) {
    for (const sx of [-0.7, 0.7]) {
      const i = smAt.length;
      smAt.push([gx + sx, 0, gz - 4.2 + r * 1.2]);
      if (GPC_OFF.includes(g) || EXTRA_OFF.has(i)) smOff.push(i);
    }
  }
});
const memctlAt = [];
for (const x of [-11.25, 11.25]) for (let i = 0; i < 8; i++) memctlAt.push([x, 0, -12.25 + 3.5 * i]);

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
  id: "nvidia-rtx-5090",
  name: "GeForce RTX 5090",
  maker: "NVIDIA",
  year: "2025",
  order: 2,
  oneLine: "The next step up from the 4090; one huge Blackwell chip with GDDR7.",
  hero: [
    "92.2 billion transistors in one GB202 chip",
    "21,760 CUDA cores on a single die",
    "1,792 GB/s memory bandwidth from GDDR7",
  ],
  scale: { unit: "mm", stage: 30 },
  levels: [
    {
      id: "card",
      title: "RTX 5090 card",
      parentPart: null,
      parts: [
        {
          id: "plate", label: "Base plate", line: "Dark back plate with round cut-outs under both fans; schematic.",
          role: "structure", tone: "graphite", shape: "slab", size: [304, 3, 137], pos: [0, 1.5, 0], holes: [[-99, 0, 80], [99, 0, 80]], schematic: true,
          explode: { dir: [0, -1, 0], dist: 30, at: [0.5, 0.95] },
        },
        {
          id: "pcb-main", label: "Main board", line: "Small black board inside the body, between the fin stacks.",
          role: "structure", tone: "pcb-black", shape: "slab", size: [PCB.w, PCB.t, PCB.d], pos: [0, PCB.y0 + PCB.t / 2, 0],
        },
        {
          id: "pcb-io", label: "I/O board", line: "Separate small board that carries the PCIe edge.",
          role: "structure", tone: "pcb-black", shape: "slab", size: [84, PCB.t, 22], pos: [-2, PCB.y0 + PCB.t / 2, 59],
          explode: { dir: [0, 0, 1], dist: 26, at: [0.6, 0.95] },
        },
        {
          id: "pcie-edge", label: "PCIe 5.0 x16 edge", line: "Gold fingers, 16 lanes; about 63 GB/s each way.",
          role: "io", shape: "slab", size: [80, 0.4, 10], pos: [-2, PCB_TOP + 0.2, 67], grid: { nx: 56, nz: 1, gap: 0.6 }, follow: "pcb-io",
          explode: { dir: [0, 0, 1], dist: 4, at: [0.6, 0.95] },
        },
        {
          id: "pcb-power", label: "Power board", line: "Separate small board that carries the power plug.",
          role: "structure", tone: "pcb-black", shape: "slab", size: [30, PCB.t, 10], pos: [14, PCB.y0 + PCB.t / 2, -57],
          explode: { dir: [0, 0, -1], dist: 26, at: [0.6, 0.95] },
        },
        {
          id: "substrate", label: "GB202 package", line: "Substrate under the die; package size is not confirmed.",
          role: "structure", tone: "pcb-green", shape: "slab", size: [38, 1, 36], pos: [PKG[0], PCB_TOP + 0.5, PKG[1]], schematic: true,
          explode: { dir: [0, 1, 0], dist: 14, at: [0.5, 0.95] },
        },
        {
          id: "stiffener", label: "Silver frame", line: "Metal frame around the package; keeps it flat.",
          role: "structure", tone: "silver", shape: "frame", wall: 7, size: [52, 1.2, 50], pos: [PKG[0], PCB_TOP + 0.6, PKG[1]], schematic: true,
          explode: { dir: [0, 1, 0], dist: 8, at: [0.45, 0.95] },
        },
        {
          id: "gb202", label: "GB202 die", line: "92.2 billion transistors in about 750 mm2.",
          role: "compute", tone: "die-colour", shape: "box", size: [24, 0.8, 31], pos: [PKG[0], PCB_TOP + 1 + 0.4, PKG[1]],
          glow: true, enter: "die", explode: { dir: [0, 1, 0], dist: 24, at: [0.5, 0.95] },
        },
        {
          id: "gddr7", label: "GDDR7 memory", line: "Sixteen 2 GB chips on a 512-bit bus: 1,792 GB/s.",
          role: "memory", shape: "box", size: [12, 1.2, 11], pos: [0, PCB_TOP + 0.6, 0], count: 16, at: gddr,
          explode: { dir: [0, 1, 0], dist: 8, spread: 0.25, at: [0.45, 0.95] },
        },
        {
          id: "pads", label: "Thermal pads", line: "Soft pads carry heat from each memory chip to the cooler.",
          role: "structure", tone: "matte", shape: "slab", size: [12, 0.6, 11], pos: [0, PCB_TOP + 1.5, 0], count: 16, at: gddr, schematic: true,
          explode: { dir: [0, 1, 0], dist: 14, spread: 0.25, at: [0.45, 0.95] },
        },
        {
          id: "vc", label: "Vapour chamber", line: "Flat sealed plate on the die; spreads heat to the pipes.",
          role: "cooling", tone: "nickel", shape: "slab", size: [83, 3, 68], pos: [-1.5, 7.9, 4], schematic: true,
          explode: { dir: [0, 1, 0], dist: 36, at: [0.3, 0.8] },
        },
        {
          id: "heatpipes", label: "Heat pipes", line: "Nickel-plated copper pipes carry heat from the chamber to both fin stacks.",
          role: "cooling", tone: "nickel", shape: "rbox", size: [92, 4, 4], pos: [0, 11.4, 0], count: 4,
          at: [[0, 0, -15], [0, 0, -3], [0, 0, 9], [0, 0, 21]], schematic: true,
          explode: { dir: [0, 1, 0], dist: 36, at: [0.3, 0.8] },
        },
        {
          id: "vc-screws", label: "Cooler screws", line: "Four spring screws press the cooler on the chip.",
          role: "structure", tone: "nickel", shape: "cyl", size: [5, 1.2, 5], pos: [-1.5, 10, 4], count: 4, follow: "vc", schematic: true,
          at: [[-38.5, 0, -31], [38.5 - 3, 0, -31], [-38.5, 0, 31], [38.5 - 3, 0, 31]],
          explode: { dir: [0, 1, 0], dist: 8, at: [0.3, 0.8] },
        },
        {
          id: "pwm-ctrl", label: "Controller chip", line: "Power controller chip; exact part is not published.",
          role: "compute", tone: "matte", shape: "box", size: [7, 1, 6], pos: [30, PCB_TOP + 0.5, 38.5], schematic: true,
        },
        {
          id: "caps", label: "Capacitors", line: "Small polymer capacitors smooth the supply voltage.",
          role: "structure", tone: "nickel", shape: "cyl", size: [4, 1.8, 4], pos: [15, PCB_TOP + 0.9, 33], count: 5, schematic: true,
          at: [[0, 0, 0], [4, 0, 0], [8, 0, 0], [12, 0, 0], [16, 0, 0]],
        },
        {
          id: "mlcc-bl", label: "Ceramic capacitors", line: "Rows of tiny chip capacitors; count and size are schematic.",
          role: "structure", tone: "champagne", shape: "box", size: [18, 0.5, 8], pos: [-35, PCB_TOP + 0.25, 36], grid: { nx: 9, nz: 4, gap: 0.8 }, schematic: true,
        },
        {
          id: "vrm-top", label: "Power stages", line: "Inductor row along the top edge; 27, 30 or 34 phases.",
          role: "power", tone: "matte", shape: "box", size: [5, 4, 5], pos: [0, PCB_TOP + 2, -43], count: 12, at: indTop,
          explode: { dir: [0, 1, 0], dist: 5, spread: 0.12, at: [0.45, 0.95] },
        },
        {
          id: "vrm-bottom", label: "Power stages", line: "Inductor row along the bottom edge.",
          role: "power", tone: "matte", shape: "box", size: [5, 4, 4], pos: [0, PCB_TOP + 2, 44.5], count: 11, at: indBottom,
          explode: { dir: [0, 1, 0], dist: 5, spread: 0.12, at: [0.45, 0.95] },
        },
        {
          id: "vrm-right", label: "Power stages", line: "Inductor column down the right edge.",
          role: "power", tone: "matte", shape: "box", size: [4, 4, 5], pos: [42.5, PCB_TOP + 2, 0], count: 9, at: indRight,
          explode: { dir: [0, 1, 0], dist: 5, spread: 0.12, at: [0.45, 0.95] },
        },
        {
          id: "heatsink-l", label: "Fin stack", line: "Flow-through fins under the fan; fin count not published.",
          role: "cooling", tone: "anodised", shape: "box", size: [90, 24, 118], pos: [-99, 15, 0],
          grid: { nx: 56, nz: 1, gap: 0.9 }, schematic: true, xray: true,
          explode: { dir: [0, 1, 0], dist: 80, at: [0.15, 0.7] },
        },
        {
          id: "heatsink-r", label: "Fin stack", line: "Flow-through fins under the fan; fin count not published.",
          role: "cooling", tone: "anodised", shape: "box", size: [90, 24, 118], pos: [99, 15, 0],
          grid: { nx: 56, nz: 1, gap: 0.9 }, schematic: true, xray: true,
          explode: { dir: [0, 1, 0], dist: 80, at: [0.15, 0.7] },
        },
        {
          id: "fans", label: "Fans", line: "Two axial fans push air straight through the fins.",
          role: "cooling", tone: "matte", shape: "fan", blades: 9, size: [2 * FAN_D + (2 * END_X - FAN_D), 6, FAN_D],
          pos: [0, 30, 0], count: 2, grid: { nx: 2, nz: 1, gap: 2 * END_X - FAN_D }, xray: true,
          explode: { dir: [0, 1, 0], dist: 130, at: [0.08, 0.6] },
        },
        {
          id: "hubs", label: "Fan hubs", line: "Brushed metal cap at the centre of each fan.",
          role: "cooling", tone: "anodised", shape: "cyl", size: [26, 3, 26], pos: [0, 34.5, 0], count: 2,
          at: [[-END_X, 0, 0], [END_X, 0, 0]], follow: "fans",
          explode: { dir: [0, 1, 0], dist: 4, at: [0.08, 0.6] },
        },
        {
          id: "shroud-l", label: "Shroud end", line: "Dark shell, rounded corners; the full card is 304 x 137 mm.",
          role: "structure", tone: "graphite", shape: "frame", wall: 4, size: [106, 33, 137], pos: [-99, 19.5, 0], xray: true,
          explode: { dir: [0, 1, 0], dist: 40, at: [0.2, 0.7] },
        },
        {
          id: "shroud-r", label: "Shroud end", line: "Dark shell, rounded corners; the full card is 304 x 137 mm.",
          role: "structure", tone: "graphite", shape: "frame", wall: 4, size: [106, 33, 137], pos: [99, 19.5, 0], xray: true,
          explode: { dir: [0, 1, 0], dist: 40, at: [0.2, 0.7] },
        },
        {
          id: "shroud-front", label: "Shroud middle", line: "Solid middle wall on the plug side.",
          role: "structure", tone: "graphite", shape: "slab", size: [92, 33, 4], pos: [0, 19.5, -66.5], xray: true,
          explode: { dir: [0, 1, 0], dist: 40, at: [0.2, 0.7] },
        },
        {
          id: "shroud-back", label: "Shroud middle", line: "Middle wall on the PCIe side; open at the bottom for the edge.",
          role: "structure", tone: "graphite", shape: "slab", size: [92, 25, 4], pos: [0, 23.5, 66.5], xray: true,
          explode: { dir: [0, 1, 0], dist: 40, at: [0.2, 0.7] },
        },
        {
          id: "shroud-top", label: "Fan openings", line: "Top of each end with a deep round opening for the fan.",
          role: "structure", tone: "graphite", shape: "slab", size: [106, 4, 137], pos: [0, 38, 0], count: 2,
          at: [[-END_X, 0, 0], [END_X, 0, 0]], holes: [[0, 0, FAN_D + 2]], xray: true,
          explode: { dir: [0, 1, 0], dist: 200, at: [0.05, 0.5] },
        },
        {
          id: "rim-l", label: "Rim strip", line: "Lighter grey line around the top face.",
          role: "structure", tone: "anodised", shape: "frame", wall: 1.5, size: [106, 0.6, 137], pos: [-99, 40.3, 0],
          explode: { dir: [0, 1, 0], dist: 200, at: [0.05, 0.5] },
        },
        {
          id: "rim-r", label: "Rim strip", line: "Lighter grey line around the top face.",
          role: "structure", tone: "anodised", shape: "frame", wall: 1.5, size: [106, 0.6, 137], pos: [99, 40.3, 0],
          explode: { dir: [0, 1, 0], dist: 200, at: [0.05, 0.5] },
        },
        {
          id: "cover", label: "Centre cover", line: "Solid cover over the board; lifts off first.",
          role: "structure", tone: "graphite", shape: "slab", size: [92, 4, 137], pos: [0, 38, 0], xray: true,
          explode: { dir: [0, 1, 0], dist: 80, at: [0, 0.3] },
        },
        {
          id: "x-cover-1", label: "X cover strip", line: "Raised strip; the two strips form an X.",
          role: "structure", tone: "anodised", shape: "slab", size: [3, 0.8, 120], pos: [0, 40.4, 0], rot: [0, 0.59, 0], follow: "cover", schematic: true,
          explode: { dir: [0, 1, 0], dist: 80, at: [0, 0.3] },
        },
        {
          id: "x-cover-2", label: "X cover strip", line: "Raised strip; the two strips form an X.",
          role: "structure", tone: "anodised", shape: "slab", size: [3, 0.8, 120], pos: [0, 41.2, 0], rot: [0, -0.59, 0], follow: "cover", schematic: true,
          explode: { dir: [0, 1, 0], dist: 80, at: [0, 0.3] },
        },
        {
          id: "power-12v-2x6", label: "12V-2x6 plug", line: "One plug carries up to 600 W; card draws 575 W.",
          role: "power", tone: "matte", shape: "box", size: [20, 8, 12], pos: [14, 44, -57], follow: "cover", schematic: true,
          explode: { dir: [0, 1, 0], dist: 80, at: [0, 0.3] },
        },
        {
          id: "plate-screws", label: "Back plate screws", line: "Eight screws hold the back plate; count is schematic.",
          role: "structure", tone: "nickel", shape: "cyl", size: [3.5, 1.2, 3.5], pos: [0, 3.6, 0], count: 8, follow: "plate", schematic: true,
          at: [[-125, 0, -62], [-70, 0, -62], [70, 0, -62], [125, 0, -62], [-125, 0, 62], [-70, 0, 62], [70, 0, 62], [125, 0, 62]],
        },
        {
          id: "plug-pins", label: "Plug pins", line: "Twelve power pins and four sense pins make 16.",
          role: "io", tone: "gold", shape: "box", size: [17, 0.8, 5], pos: [14, 48.4, -57], grid: { nx: 8, nz: 2, gap: 0.8 }, follow: "cover", schematic: true,
          explode: { dir: [0, 1, 0], dist: 80, at: [0, 0.3] },
        },
        {
          id: "vents-front", label: "Vent slots", line: "Slots in the plug-side wall; schematic count.",
          role: "structure", tone: "anodised", shape: "slab", size: [78, 16, 1], pos: [0, 22, -69], grid: { nx: 22, nz: 1, gap: 1.2 }, follow: "shroud-front", schematic: true,
          explode: { dir: [0, 1, 0], dist: 40, at: [0.2, 0.7] },
        },
        {
          id: "vents-back", label: "Vent slots", line: "Slots in the PCIe-side wall; schematic count.",
          role: "structure", tone: "anodised", shape: "slab", size: [78, 10, 1], pos: [0, 28, 69], grid: { nx: 22, nz: 1, gap: 1.2 }, follow: "shroud-back", schematic: true,
          explode: { dir: [0, 1, 0], dist: 40, at: [0.2, 0.7] },
        },
        {
          id: "ports", label: "Display ports", line: "Three DisplayPort 2.1b and one HDMI 2.1b on the bracket.",
          role: "io", tone: "nickel", shape: "box", size: [0.8, 8, 16], pos: [-155.4, 22, 13], count: 4, follow: "bracket",
          at: [[0, 0, -30], [0, 0, -10], [0, 0, 10], [0, 0, 30]],
          explode: { dir: [-1, 0, 0], dist: 20, at: [0.6, 0.95] },
        },
        {
          id: "bracket", label: "I/O bracket", line: "Thin black bracket on the left end; taller than the card.",
          role: "structure", tone: "matte", shape: "slab", size: [3, 44, 158], pos: [-153.5, 22, 13], schematic: true,
          explode: { dir: [-1, 0, 0], dist: 20, at: [0.6, 0.95] },
        },
      ],
      flows: [
        { from: "gddr7", to: "gb202", label: "1,792 GB/s between memory and GPU (28 Gbps x 512-bit)", speed: 1 },
        { from: "pcie-edge", to: "gb202", label: "about 63 GB/s each way over PCIe 5.0 x16 (compressed)", speed: 0.15 },
        { from: "power-12v-2x6", to: "vrm-top", label: "575 W total graphics power in", speed: 0.45 },
      ],
      callouts: [
        { part: "shroud-l", title: "Two slots", text: "A 304 mm card that fits in two slots." },
        { part: "fans", title: "Flow-through", text: "Two fans push air straight through the fins; 575 W card." },
        { part: "pcb-main", title: "Three boards", text: "NVIDIA says the card uses a 3-piece board." },
        { part: "gddr7", title: "32 GB memory", text: "Sixteen chips of 2 GB each." },
        { part: "vrm-top", title: "Power stages", text: "Counted as 27, 30 or 34 phases, depending on source." },
        { part: "power-12v-2x6", title: "One plug", text: "One 12V-2x6 cable carries up to 600 W." },
      ],
    },
    {
      id: "die",
      title: "GB202 die",
      parentPart: "gb202",
      parts: [
        {
          id: "die-base", label: "GB202 die", line: "92.2 billion transistors in 750 mm2, TSMC 4N.",
          role: "structure", tone: "die-colour", shape: "slab", size: [DIE.w, DIE_TOP, DIE.d], pos: [0, DIE_TOP / 2, 0],
        },
        {
          id: "gpc", label: "GPC", line: "Graphics processing cluster; 11 of 12 are on.",
          role: "compute", shape: "rbox", size: [GPC.w, GPC.h, GPC.d], pos: [0, DIE_Y, 0], at: gpcAt, count: 12,
          off: GPC_OFF, schematic: true, xray: true,
          explode: { dir: [0, 1, 0], dist: 1.2, spread: 0.18, at: [0.15, 0.75] },
        },
        {
          id: "sm", label: "SM", line: "Streaming multiprocessor that runs CUDA threads; 170 of 192 on.",
          role: "compute", shape: "box", size: [SM.w, SM.h, SM.d], pos: [0, DIE_TOP + GPC.h + SM.h / 2, 0], at: smAt,
          count: 192, off: smOff, glow: true, enter: "sm", follow: "gpc", schematic: true,
          explode: { dir: [0, 1, 0], dist: 1.4, spread: 0.18, at: [0.15, 0.75] },
        },
        {
          id: "l2", label: "L2 cache", line: "96 MB enabled of 128 MB on the full die.",
          role: "memory", shape: "slab", size: [14, 0.12, 5], pos: [-3, DIE_Y, 0], schematic: true,
          explode: { dir: [0, 1, 0], dist: 0.7, at: [0.25, 0.85] },
        },
        {
          id: "memctl", label: "Memory controllers", line: "Sixteen 32-bit controllers make the 512-bit bus.",
          role: "memory", shape: "box", size: [1.4, 0.12, 3], pos: [0, DIE_Y, 0], at: memctlAt, count: 16,
          explode: { dir: [0, 1, 0], dist: 0.4, spread: 0.3, at: [0.2, 0.8] },
        },
        {
          id: "nvenc", label: "NVENC encoders", line: "Three 9th-generation video encoders.",
          role: "compute", shape: "box", size: [1.6, 0.12, 2.2], pos: [7, DIE_Y, -1.4], at: [[-1.8, 0, 0], [0, 0, 0], [1.8, 0, 0]],
          count: 3, schematic: true, explode: { dir: [0, 1, 0], dist: 0.9, at: [0.3, 0.9] },
        },
        {
          id: "nvdec", label: "NVDEC decoders", line: "Two 6th-generation video decoders.",
          role: "compute", shape: "box", size: [1.6, 0.12, 2.2], pos: [6.1, DIE_Y, 1.4], at: [[-0.9, 0, 0], [0.9, 0, 0]],
          count: 2, schematic: true, explode: { dir: [0, 1, 0], dist: 0.9, at: [0.3, 0.9] },
        },
        {
          id: "gigathread", label: "GigaThread engine", line: "Hands thread blocks out to the SMs.",
          role: "structure", shape: "slab", size: [20, 0.12, 0.8], pos: [0, DIE_Y, -14.7], schematic: true,
          explode: { dir: [0, 0, -1], dist: 2.2, at: [0.25, 0.85] },
        },
        {
          id: "pcie-if", label: "PCIe interface", line: "Die end of the PCIe 5.0 x16 link.",
          role: "interconnect", shape: "slab", size: [6, 0.12, 1.2], pos: [-4, DIE_Y, 14.7], schematic: true,
          explode: { dir: [0, 0, 1], dist: 2.2, at: [0.25, 0.85] },
        },
      ],
      flows: [
        { from: "memctl", to: "l2", label: "512-bit total: 16 controllers x 32-bit", speed: 0.7 },
        { from: "l2", to: "sm", label: "96 MB of L2 feeds all 170 SMs", speed: 1 },
      ],
      callouts: [
        { part: "die-base", title: "GB202 die", text: "92.2 billion transistors in 750 mm2." },
        { part: "gpc", title: "Cut-down die", text: "Full die has 12 GPCs; this card enables 11." },
        { part: "sm", title: "170 SMs", text: "Full die has 192; 170 are on." },
        { part: "l2", title: "Big L2", text: "96 MB on, from 128 MB on the full die." },
        { part: "memctl", title: "16 controllers", text: "Sixteen 32-bit controllers make a 512-bit bus." },
        { part: "nvenc", title: "Video engines", text: "Three 9th-gen NVENC and two 6th-gen NVDEC." },
      ],
    },
    {
      id: "sm",
      title: "One SM",
      parentPart: "sm",
      parts: [
        {
          id: "sm-one", label: "One SM", line: "One streaming multiprocessor of 170; floor plan is schematic.",
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
          id: "tensor-core", label: "Tensor core", line: "5th-generation matrix unit; 4 per SM.",
          role: "compute", shape: "box", size: [0.15, 0.016, 0.2], pos: [0, PART_TOP + 0.008, 0], at: inPartition(0.235, -0.03),
          count: 4, follow: "partition", explode: { dir: [0, 1, 0], dist: 0.08, spread: 0.35, at: [0.1, 0.7] },
        },
        {
          id: "regfile", label: "Register file", line: "64 KB per partition; 256 KB per SM.",
          role: "memory", shape: "box", size: [0.62, 0.012, 0.1], pos: [0, PART_TOP + 0.006, 0], at: inPartition(0, 0.15),
          count: 4, follow: "partition", explode: { dir: [0, 1, 0], dist: 0.04, spread: 0.35, at: [0.1, 0.7] },
        },
        {
          id: "l1-shared", label: "L1 and shared memory", line: "128 KB per SM, split between cache and shared memory.",
          role: "memory", shape: "slab", size: [1.36, 0.02, 0.16], pos: [0, SM_TOP + 0.01, 0.4],
          explode: { dir: [0, 0.4, 1], dist: 0.22, at: [0.3, 0.9] },
        },
        {
          id: "rt-core", label: "RT core", line: "One 4th-generation ray-tracing unit per SM.",
          role: "compute", shape: "box", size: [0.5, 0.03, 0.1], pos: [0, SM_TOP + 0.015, 0.55],
          explode: { dir: [0, 0.4, 1], dist: 0.4, at: [0.35, 0.95] },
        },
      ],
      flows: [
        { from: "l1-shared", to: "cuda-core", label: "128 KB of L1 and shared memory per SM", speed: 0.6 },
        { from: "regfile", to: "cuda-core", label: "65,536 32-bit registers per SM", speed: 1 },
      ],
      callouts: [
        { part: "partition", title: "Four partitions", text: "Each SM has 4 tensor cores, one per quarter." },
        { part: "cuda-core", title: "128 cores", text: "128 CUDA cores per SM." },
        { part: "tensor-core", title: "Tensor cores", text: "4 fifth-generation tensor cores per SM." },
        { part: "rt-core", title: "RT core", text: "1 fourth-generation RT core per SM." },
        { part: "l1-shared", title: "L1 and shared", text: "128 KB per SM, split by software." },
        { part: "regfile", title: "Registers", text: "256 KB register file per SM." },
      ],
    },
  ],
  glossary: [
    ["GB202", "the GPU chip on the RTX 5090."],
    ["Blackwell", "NVIDIA's GPU design generation for this chip."],
    ["Die", "the piece of silicon with the circuits on it."],
    ["Package", "the die plus the base it is mounted on."],
    ["GPC", "graphics processing cluster, a big group of compute tiles."],
    ["TPC", "texture processing cluster, a pair of SMs inside a GPC."],
    ["SM", "streaming multiprocessor, the unit that runs your CUDA threads."],
    ["CUDA core", "one lane that does a basic maths operation."],
    ["Tensor core", "a unit for matrix maths, used in AI."],
    ["Warp", "a group of 32 threads that run together."],
    ["Register file", "the fastest memory, private to each thread."],
    ["Shared memory", "the part of L1 that your kernel controls."],
    ["L2 cache", "larger memory shared by all SMs."],
    ["GDDR7", "the fast graphics memory on the card."],
    ["Flow-through fan", "air passes straight through the fins and out the other side."],
    ["VRM", "turns 12 V into the low voltage the chip needs."],
    ["PCIe", "the slot link between card and computer."],
    ["12V-2x6", "the 16-pin power plug used by this card."],
  ],
  notPublished: [
    "Package size (about 63 x 56 mm) and die size (about 24 x 31 mm) are unconfirmed leaks; NVIDIA gives 750 mm2.",
    "Power stage count differs by source: 27, 30 or 34. Which feed GPU or memory is not published.",
    "Which GPC is off, and which 3 more TPCs are off, is not published.",
    "Fin count, heat pipe count and vapour chamber size. The vapour chamber and liquid metal film are not drawn: the photo shows the cooler removed.",
    "Card thickness: 2-slot per NVIDIA; the model height is schematic.",
    "Which side board carries the PCIe fingers is not clear; the I/O board placement is a reading.",
    "Memory chip size (2 GB each) is derived: 32 GB / 16 chips.",
    "Shapes, colours and layout are design choices; counts and hierarchy are real.",
  ],
  sourcesPath: "details/nvidia-rtx-5090.md",
};
