// Taalas HC1 (Hardcore Model chip): built from details/taalas-hardcore.md (sections 3 to 8) and build/ref/taalas-card.png
// under build/MODEL-RULES.md. All sizes and positions in mm. pos is the centre of the part's box. y is up; the card lies
// flat, QSFP-DD cages toward -x, PCIe fingers toward +z. No heatsink: the photo shows a bare lidded package.
// Three levels: the card, the die floor plan, one ROM bank.
// Only the hierarchy, the 815 mm2 die and the bit widths are published. Card outline, part rows, package, every
// floor-plan block and the bank layout are schematic.

/* ---------- Level 1: the card (form factor not published; drawn as a half-height card outline) ---------- */
const PCB = { w: 254, d: 111, top: 1.6 };
const PKG = { x: -35, z: 6, s: 66, h: 2.4 };
const SUB_TOP = PCB.top + PKG.h;
const DIE_SIDE = Math.sqrt(815); // 28.55 mm if square
const DIE_H = 0.8;
const LID = { s: 63, rim: 2.5, y0: SUB_TOP, y1: SUB_TOP + DIE_H, top: 1.4 };
const CAGE = { w: 60, h: 12, d: 24, over: 12 };
const CAGE_X = -PCB.w / 2 + CAGE.w / 2 - CAGE.over;
const IND = { h: 8, top: PCB.top };


/* ---------- Level 2: the die floor plan (815 mm2, drawn as a 28.55 mm square) ---------- */
const D = DIE_SIDE;
const DIE_TOP = 0.8;
const BLOCK_H = 0.12;
const BLOCK_Y = DIE_TOP + BLOCK_H / 2;
const EDGE = 0.5; // keep-out from the die edge
const FAB = { x0: -D / 2 + EDGE, x1: 6.2, z0: -D / 2 + EDGE, z1: D / 2 - EDGE };
const COLS = 10;
const ROWS = 12;
const COL_P = (FAB.x1 - FAB.x0) / COLS;
const ROW_P = (FAB.z1 - FAB.z0) / ROWS;
const TILE = { w: COL_P - 0.2, rom: ROW_P * 0.62, cmp: ROW_P * 0.2 };
const FAB_C = [(FAB.x0 + FAB.x1) / 2, (FAB.z0 + FAB.z1) / 2];
const romAt = [];
const cmpAt = [];
for (let r = 0; r < ROWS; r++) {
  for (let c = 0; c < COLS; c++) {
    const x = FAB.x0 + COL_P * (c + 0.5) - FAB_C[0];
    const zRow = FAB.z0 + ROW_P * r - FAB_C[1];
    romAt.push([x, 0, zRow + 0.05 + TILE.rom / 2]);
    cmpAt.push([x, 0, zRow + 0.05 + TILE.rom + 0.08 + TILE.cmp / 2]);
  }
}
const RIGHT = { x0: FAB.x1 + 0.6, x1: D / 2 - EDGE };
const RIGHT_W = RIGHT.x1 - RIGHT.x0;
const RIGHT_X = (RIGHT.x0 + RIGHT.x1) / 2;
const IO = { d: 2.4, z: D / 2 - EDGE - 1.2 };
const SRAM = { z0: -D / 2 + EDGE, z1: IO.z - 1.2 - 0.6 };

/* ---------- Level 3: one ROM bank (schematic size; bank geometry is not published) ---------- */
const BANK = { w: 4, d: 4.8, h: 0.06 };
const CELL = { nx: 32, nz: 16, h: 0.08, gap: 0.04 };
const CELLS_W = 3.8;
const BLK_D = CELL.nz * 0.12 - CELL.gap; // round cells: 0.08 mm cell, 0.12 mm pitch
const Z3 = -BANK.d / 2 + 0.1 + BLK_D / 2; // 3-bit block centre
const Z6 = Z3 + BLK_D + 0.3; // 6-bit block centre, gap shows the two groups
const CELL_TOP = BANK.h + CELL.h;
const WIRE_H = 0.01;
const WIRE = { w: 0.03, gap: 0.09 }; // one wire over each cell column (0.12 mm pitch)
const ADDER = { d: 0.45, z: Z6 + BLK_D / 2 + 0.15 + 0.225 };

export default {
  id: "taalas-hardcore",
  name: "HC1 Hardcore Model chip",
  maker: "Taalas",
  year: "2026",
  order: 10,
  oneLine: "Weights in mask ROM; the owner's \"Hard Wired\" book.",
  hero: [
    "Taalas claims 17,000 tokens/s per user on Llama 3.1 8B",
    "About 250 W per chip, air-cooled",
    "Taalas says a new model re-makes only 2 mask layers",
  ],
  scale: { unit: "mm", stage: 30 },
  levels: [
    {
      id: "card",
      title: "HC1 card",
      parentPart: null,
      parts: [
        {
          id: "hc1-card", label: "HC1 card", line: "Blue circuit board; outline is schematic, form factor not published.",
          role: "structure", tone: "pcb-blue", shape: "slab", size: [PCB.w, PCB.top, PCB.d], pos: [0, PCB.top / 2, 0],
          schematic: true,
          explode: { dir: [0, -1, 0], dist: 0, at: [0.4, 0.9] },
        },
        {
          id: "pcie-edge", label: "Card edge fingers", line: "Gold fingers under the package; protocol and lane count not published.",
          role: "io", shape: "slab", size: [89, PCB.top, 8], pos: [-22, PCB.top / 2, PCB.d / 2 + 4], schematic: true,
          follow: "hc1-card", explode: { dir: [0, 0, 1], dist: 16, at: [0.5, 0.95] },
        },
        {
          id: "qsfp-cage", label: "QSFP-DD cages", line: "Two stacked network cages on the left edge; speed not published.",
          role: "io", tone: "silver", shape: "box", size: [CAGE.w, CAGE.h, CAGE.d], pos: [CAGE_X, PCB.top + CAGE.h / 2, 26],
          at: [[0, 0, -14], [0, 0, 14]], count: 2, schematic: true, follow: "hc1-card",
          explode: { dir: [-1, 0, 0], dist: 40, at: [0.35, 0.9] },
        },
        {
          id: "cage-mouth", label: "Cage openings", line: "Dark port openings on the cage faces; nothing plugged in.",
          role: "structure", tone: "pcb-black", shape: "box", size: [0.8, 9, 22], pos: [CAGE_X, PCB.top + CAGE.h / 2, 26],
          at: [[-30.5, 0, -14], [-30.5, 0, 14]], count: 2, schematic: true, follow: "qsfp-cage",
          explode: { dir: [-1, 0, 0], dist: 4, at: [0.5, 0.95] },
        },
        {
          id: "inductor-row", label: "Top inductors", line: "Eight black power inductors in a row along the top edge.",
          role: "power", tone: "pcb-black", shape: "box", size: [71, IND.h, 11], pos: [-48, IND.top + IND.h / 2, -35],
          grid: { nx: 8, nz: 1, gap: 1 }, count: 8, schematic: true, follow: "hc1-card",
          explode: { dir: [0, 0, -1], dist: 18, spread: 0.08, at: [0.5, 0.95] },
        },
        {
          id: "power-stages-top", label: "Top power stages", line: "Small black power-stage chips behind each top inductor.",
          role: "memory", shape: "box", size: [68, 1.4, 5], pos: [-48, PCB.top + 0.7, -44.5],
          grid: { nx: 8, nz: 1, gap: 4 }, count: 8, schematic: true, follow: "hc1-card",
          explode: { dir: [0, 0, -1], dist: 12, spread: 0.08, at: [0.5, 0.95] },
        },
        {
          id: "top-caps", label: "Top capacitors", line: "A line of tiny tan capacitors along the board edge.",
          role: "power", tone: "champagne", shape: "box", size: [70, 0.9, 3], pos: [-48, PCB.top + 0.45, -51],
          grid: { nx: 28, nz: 1, gap: 0.8 }, count: 28, schematic: true, follow: "hc1-card",
          explode: { dir: [0, 1, -0.4], dist: 6, spread: 0.1, at: [0.5, 0.95] },
        },
        {
          id: "inductor-column", label: "Side inductors", line: "Nine black inductors in a column beside the package.",
          role: "power", tone: "pcb-black", shape: "box", size: [10, 7, 98], pos: [8, IND.top + 3.5, 2],
          grid: { nx: 1, nz: 9, gap: 1 }, count: 9, schematic: true, follow: "hc1-card",
          explode: { dir: [1, 0, 0], dist: 14, spread: 0.08, at: [0.5, 0.95] },
        },
        {
          id: "power-stages-side", label: "Side power stages", line: "Small black power-stage chips beside each side inductor.",
          role: "memory", shape: "box", size: [5, 1.4, 94], pos: [19, PCB.top + 0.7, 2],
          grid: { nx: 1, nz: 9, gap: 5 }, count: 9, schematic: true, follow: "hc1-card",
          explode: { dir: [1, 0, 0], dist: 18, spread: 0.08, at: [0.5, 0.95] },
        },
        {
          id: "shield-pad", label: "Dark board patch", line: "Darker square patch on the board; what it is, is not published.",
          role: "structure", tone: "die-colour", shape: "slab", size: [34, 0.3, 40], pos: [60, PCB.top + 0.15, -6],
          schematic: true, follow: "hc1-card", explode: { dir: [0, 1, 0], dist: 3, at: [0.5, 0.95] },
        },
        {
          id: "power-conn", label: "Power connector", line: "Black connector in the top right corner; the chip draws about 250 W.",
          role: "power", tone: "pcb-black", shape: "box", size: [14, 10, 18], pos: [118, PCB.top + 5, -44], schematic: true,
          follow: "hc1-card", explode: { dir: [0, 0, -1], dist: 18, at: [0.5, 0.95] },
        },
        {
          id: "pin-header", label: "Pin headers", line: "Gold pin row along the top edge; purpose not published.",
          role: "io", shape: "box", size: [30, 6, 2.5], pos: [85, PCB.top + 3, -52], grid: { nx: 12, nz: 1, gap: 0.5 }, count: 12,
          schematic: true, follow: "hc1-card", explode: { dir: [0, 0, -1], dist: 10, at: [0.5, 0.95] },
        },
        {
          id: "big-chips", label: "Large chips", line: "Four larger black chips on the right; not described in any source.",
          role: "memory", shape: "box", size: [40, 2.4, 40], pos: [100, PCB.top + 1.2, -14],
          grid: { nx: 2, nz: 2, gap: 16 }, count: 4, schematic: true, follow: "hc1-card",
          explode: { dir: [1, 0, 0], dist: 12, spread: 0.1, at: [0.5, 0.95] },
        },
        {
          id: "controllers", label: "Control chips", line: "Small black chips on the lower right; not described in any source.",
          role: "memory", shape: "box", size: [24, 1.8, 18], pos: [64, PCB.top + 0.9, 31],
          grid: { nx: 4, nz: 2, gap: 2 }, count: 8, schematic: true, follow: "hc1-card",
          explode: { dir: [0, 1, 0.3], dist: 8, spread: 0.1, at: [0.5, 0.95] },
        },
        {
          id: "caps", label: "Capacitors", line: "Tan capacitors in the lower right; count not published.",
          role: "power", tone: "champagne", shape: "cyl", size: [5, 4, 5], pos: [90, PCB.top + 2, 22],
          at: [[0, 0, 0], [10, 0, 0], [20, 0, 0], [0, 0, 10], [10, 0, 10], [20, 0, 10]], count: 6,
          schematic: true, follow: "hc1-card", explode: { dir: [0, 1, 0], dist: 8, spread: 0.2, at: [0.5, 0.95] },
        },
        {
          id: "passives-top", label: "Small passives", line: "Tiny resistors and capacitors; counts not published.",
          role: "power", tone: "nickel", shape: "box", size: [22, 0.7, 18], pos: [36, PCB.top + 0.35, -40],
          grid: { nx: 8, nz: 4, gap: 1.2 }, count: 32, schematic: true, follow: "hc1-card",
          explode: { dir: [0, 1, 0], dist: 5, spread: 0.1, at: [0.5, 0.95] },
        },
        {
          id: "passives-bottom", label: "Package passives", line: "Tiny capacitors in a row below the package.",
          role: "power", tone: "nickel", shape: "box", size: [62, 0.7, 6], pos: [-35, PCB.top + 0.35, 47],
          grid: { nx: 20, nz: 1, gap: 1.2 }, count: 20, schematic: true, follow: "hc1-card",
          explode: { dir: [0, 1, 0.4], dist: 6, spread: 0.1, at: [0.5, 0.95] },
        },
        {
          id: "mount-holes", label: "Mounting pads", line: "Gold-ringed mounting holes spread over the board.",
          role: "io", shape: "cyl", size: [5, 0.25, 5], pos: [0, PCB.top + 0.14, 0],
          at: [[-100, 0, -48], [-100, 0, -10], [-73, 0, 50], [30, 0, -5], [30, 0, 45], [62, 0, -45], [75, 0, 45], [105, 0, 45], [122, 0, 15]],
          count: 9, schematic: true, follow: "hc1-card", explode: { dir: [0, 1, 0], dist: 3, at: [0.5, 0.95] },
        },
        {
          id: "hc1-package", label: "HC1 package", line: "Holds one die and no HBM stacks; package size is schematic.",
          role: "structure", tone: "graphite", shape: "rbox", size: [PKG.s, PKG.h, PKG.s], pos: [PKG.x, PCB.top + PKG.h / 2, PKG.z],
          schematic: true, enter: "die", follow: "hc1-card",
          explode: { dir: [0, 1, 0], dist: 4, at: [0.4, 0.9] },
        },
        {
          id: "hc1-die", label: "HC1 die", line: "815 mm2 on TSMC N6, per EE Times; Llama weights inside.",
          role: "compute", shape: "slab", size: [DIE_SIDE, DIE_H, DIE_SIDE], pos: [PKG.x, SUB_TOP + DIE_H / 2, PKG.z],
          glow: true, enter: "die", follow: "hc1-package",
          explode: { dir: [0, 1, 0], dist: 16, at: [0.4, 0.9] },
        },
        {
          id: "lid-rim", label: "Lid rim", line: "Lid edge resting on the substrate; lid design not published.",
          role: "structure", tone: "nickel", shape: "frame", wall: LID.rim, size: [LID.s, LID.y1 - LID.y0, LID.s],
          pos: [PKG.x, (LID.y0 + LID.y1) / 2, PKG.z], schematic: true, xray: true, enter: "die",
          explode: { dir: [0, 1, 0], dist: 36, at: [0.25, 0.75] },
        },
        {
          id: "lid", label: "Package lid", line: "Silver metal lid over the die; lifts off to show the silicon.",
          role: "structure", tone: "nickel", shape: "slab", size: [LID.s, LID.top, LID.s],
          pos: [PKG.x, LID.y1 + LID.top / 2, PKG.z], schematic: true, xray: true, enter: "die",
          explode: { dir: [0, 1, 0], dist: 52, at: [0.2, 0.7] },
        },
        {
          id: "lid-mark", label: "Lid marking", line: "Printed logo and part code on the lid; text not shown.",
          role: "structure", tone: "graphite", shape: "slab", size: [22, 0.12, 3.5], pos: [PKG.x, LID.y1 + LID.top + 0.06, PKG.z - 6],
          schematic: true, follow: "lid", explode: { dir: [0, 1, 0], dist: 2, at: [0.2, 0.7] },
        },
      ],
      flows: [
        { from: "pcie-edge", to: "hc1-die", label: "prompt tokens in, generated tokens out; Taalas claims 17,000 tokens/s per user", speed: 0.9 },
        { from: "power-conn", to: "inductor-row", label: "about 250 W per chip; about 2.5 kW for a 10-card server", speed: 0.4 },
        { from: "inductor-row", to: "hc1-die", label: "about 250 W into the chip", speed: 0.4 },
      ],
      callouts: [
        { part: "hc1-card", title: "One model", text: "Llama 3.1 8B is fixed in the chip; no other model runs." },
        { part: "hc1-package", title: "No HBM", text: "Taalas says the chip needs no HBM, no 3D stacking." },
        { part: "lid", title: "Air cooled", text: "About 250 W per chip, so standard air-cooled racks work." },
        { part: "hc1-card", title: "Speed claim", text: "Taalas claims 17,000 tokens per second per user." },
        { part: "hc1-card", title: "Server size", text: "10 cards in one server draw about 2.5 kW." },
      ],
    },
    {
      id: "die",
      title: "HC1 die floor plan",
      parentPart: "hc1-package",
      parts: [
        {
          id: "die-815", label: "HC1 die", line: "815 mm2 on TSMC N6, per EE Times; floor plan is schematic.",
          role: "structure", shape: "slab", size: [D, DIE_TOP, D], pos: [0, DIE_TOP / 2, 0], schematic: true,
        },
        {
          id: "recall-fabric", label: "Mask-ROM weight fabric", line: "Llama 3.1 8B weights set by the mask; tile layout schematic.",
          role: "memory", shape: "box", size: [TILE.w, BLOCK_H, TILE.rom], pos: [FAB_C[0], BLOCK_Y, FAB_C[1]], at: romAt,
          schematic: true, enter: "bank",
          explode: { dir: [0, 1, 0], dist: 0.8, spread: 0.12, at: [0.25, 0.85] },
        },
        {
          id: "compute-fabric", label: "Compute fabric", line: "Digital multiply logic interleaved with the ROM; unit count not published.",
          role: "compute", shape: "box", size: [TILE.w, BLOCK_H, TILE.cmp], pos: [FAB_C[0], BLOCK_Y, FAB_C[1]], at: cmpAt,
          schematic: true, glow: true, enter: "bank",
          explode: { dir: [0, 1, 0], dist: 1.6, spread: 0.12, at: [0.25, 0.85] },
        },
        {
          id: "dataflow-wiring", label: "Top metal wiring", line: "Weights and dataflow live in 2 mask layers, per Taalas.",
          role: "interconnect", shape: "box", size: [FAB.x1 - FAB.x0, 0.03, FAB.z1 - FAB.z0],
          pos: [FAB_C[0], DIE_TOP + BLOCK_H + 0.015, FAB_C[1]], grid: { nx: 40, nz: 1, gap: 0.42 },
          schematic: true, xray: true,
          explode: { dir: [0, 1, 0], dist: 3.2, at: [0.02, 0.55] },
        },
        {
          id: "sram-block", label: "Programmable SRAM", line: "Holds KV cache and LoRA weights; capacity not published.",
          role: "memory", shape: "box", size: [RIGHT_W, BLOCK_H, SRAM.z1 - SRAM.z0], pos: [RIGHT_X, BLOCK_Y, (SRAM.z0 + SRAM.z1) / 2],
          schematic: true,
          explode: { dir: [1, 0.3, 0], dist: 3, at: [0.3, 0.9] },
        },
        {
          id: "host-io", label: "Host interface", line: "Tokens in and out at the die edge; type not published.",
          role: "io", shape: "box", size: [RIGHT_W, BLOCK_H, IO.d], pos: [RIGHT_X, BLOCK_Y, IO.z], schematic: true,
          explode: { dir: [0, 0.3, 1], dist: 3, at: [0.3, 0.9] },
        },
      ],
      flows: [
        { from: "sram-block", to: "compute-fabric", label: "KV cache and LoRA weights; capacity and bandwidth not published", speed: 0.6 },
        { from: "host-io", to: "compute-fabric", label: "tokens in and out; Taalas claims 17,000 tokens/s per user", speed: 0.9 },
      ],
      callouts: [
        { part: "die-815", title: "Big die", text: "815 mm2 on TSMC N6, per Taalas via EE Times." },
        { part: "recall-fabric", title: "Weights as wires", text: "Mask ROM holds the Llama 3.1 8B weights." },
        { part: "sram-block", title: "Small writable part", text: "SRAM keeps the KV cache and LoRA weights; size not published." },
        { part: "dataflow-wiring", title: "Two masks", text: "Changing 2 mask layers retargets the chip to a new model." },
        { part: "compute-fabric", title: "Fully digital", text: "Compute is digital; ROM and multiply are merged." },
      ],
    },
    {
      id: "bank",
      title: "One ROM bank",
      parentPart: "recall-fabric",
      parts: [
        {
          id: "rom-bank", label: "One ROM bank", line: "One patch of the weight fabric; bank size and count not published.",
          role: "structure", shape: "slab", size: [BANK.w, BANK.h, BANK.d], pos: [0, BANK.h / 2, 0], schematic: true,
        },
        {
          id: "cells-3bit", label: "3-bit weight cells", line: "Parameters stored in transistors; 3-bit per Taalas, split is schematic.",
          role: "memory", shape: "cyl", size: [CELLS_W, CELL.h, BLK_D], pos: [0, BANK.h + CELL.h / 2, Z3],
          grid: { nx: CELL.nx, nz: CELL.nz, gap: CELL.gap }, schematic: true,
          explode: { dir: [0, 1, 0], dist: 0.3, spread: 0.15, at: [0.2, 0.8] },
        },
        {
          id: "cells-6bit", label: "6-bit weight cells", line: "Parameters stored in transistors; 6-bit per Taalas, split is schematic.",
          role: "memory", shape: "cyl", size: [CELLS_W, CELL.h, BLK_D], pos: [0, BANK.h + CELL.h / 2, Z6],
          grid: { nx: CELL.nx, nz: CELL.nz, gap: CELL.gap }, schematic: true,
          explode: { dir: [0, 1, 0], dist: 0.3, spread: 0.15, at: [0.2, 0.8] },
        },
        {
          id: "mult-path", label: "Multiply paths", line: "Short wires from each cell to the adder tree; layout not published.",
          role: "interconnect", shape: "box", size: [CELL.nx * WIRE.w + (CELL.nx - 1) * WIRE.gap, WIRE_H, ADDER.z - ADDER.d / 2 - Z3 + BLK_D / 2],
          pos: [0, CELL_TOP + WIRE_H / 2, (Z3 - BLK_D / 2 + ADDER.z - ADDER.d / 2) / 2],
          grid: { nx: CELL.nx, nz: 1, gap: WIRE.gap }, schematic: true, xray: true,
          explode: { dir: [0, 1, 0], dist: 0.9, at: [0.02, 0.55] },
        },
        {
          id: "adder-tree", label: "Adder tree", line: "Digital adder tree sums the products; layout not published.",
          role: "compute", shape: "box", size: [CELLS_W, CELL.h, ADDER.d], pos: [0, BANK.h + CELL.h / 2, ADDER.z],
          schematic: true, glow: true,
          explode: { dir: [0, 0.3, 1], dist: 0.6, at: [0.3, 0.9] },
        },
      ],
      flows: [
        { from: "cells-3bit", to: "adder-tree", label: "each weight multiplied where it is stored; no weight fetch", speed: 1 },
        { from: "cells-6bit", to: "adder-tree", label: "1 transistor per 4-bit parameter (Bajic, unreconciled with 3/6-bit)", speed: 1 },
      ],
      callouts: [
        { part: "cells-3bit", title: "One transistor", text: "Bajic: one transistor stores a 4-bit weight; does not match Taalas's page." },
        { part: "rom-bank", title: "No fetch", text: "Weights never travel; the multiplier sits where the weight is." },
        { part: "cells-6bit", title: "Mixed bits", text: "Taalas uses 3-bit and 6-bit parameters on HC1." },
        { part: "mult-path", title: "Frozen at fab", text: "The weights cannot change after the mask is made." },
      ],
    },
  ],
  glossary: [
    ["Token", "a small piece of text, about a word or part of one."],
    ["Tokens per second per user", "how fast one user gets text back."],
    ["Weights", "the stored numbers that make up a trained model."],
    ["Parameter", "one weight."],
    ["Llama 3.1 8B", "an open model from Meta with about 8 billion parameters."],
    ["Quantization", "storing weights with fewer bits; this costs some quality."],
    ["Mask ROM", "read-only memory whose contents are set by a chip-making mask."],
    ["Mask layer", "one of the patterned layers used to print a chip."],
    ["SRAM", "fast on-chip memory that can be written and read at any time."],
    ["KV cache", "saved results of earlier tokens, so the model does not redo them."],
    ["LoRA", "a small add-on set of weights that tunes a base model."],
    ["HBM", "stacked memory next to a GPU; not on HC1."],
    ["Memory wall", "the speed limit from moving weights between memory and compute."],
    ["Die", "the piece of silicon that holds the circuits."],
    ["TSMC N6", "a 6 nm-class chip process from TSMC."],
    ["PCIe", "the standard slot and link used for add-in cards."],
    ["Recall fabric", "Taalas's term, per EE Times, for the ROM-based weight storage."],
    ["Hardcore Model", "Taalas's name for a model turned into custom silicon."],
  ],
  notPublished: [
    "Every speed number is Taalas's own; EE Times saw 15,000+ tokens/s on the demo.",
    "Taalas claims about 10X less power and 20X less build cost than the state of the art.",
    "Price of the chip or card; Taalas gives only its own cost per token.",
    "Bit layout: Taalas says 3-bit and 6-bit; Bajic's one transistor per 4-bit weight is unreconciled.",
    "Die size and process (815 mm2, TSMC N6) come from EE Times and heise, not Taalas's page.",
    "Floor plan: sizes, positions and counts of ROM, compute, SRAM and IO blocks.",
    "SRAM capacity, KV cache size, context length and LoRA limits.",
    "Host interface protocol, lane count and the card form factor.",
    "Card power circuits, power connector and cooler design.",
    "ROM bit-cell and multiplier design; the 3-bit and 6-bit split shown here is schematic.",
    "AMD agreed to acquire Taalas (2026-08-06); the effect on the product is not published.",
    "Shapes, colours and layout are design choices; hierarchy and published numbers are real.",
  ],
  sourcesPath: "details/taalas-hardcore.md",
};
