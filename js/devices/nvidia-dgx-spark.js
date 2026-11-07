// NVIDIA DGX Spark: built from details/nvidia-dgx-spark.md (sections 3 to 8) and the photos build/ref/dgx-spark-*.png under build/MODEL-RULES.md.
// All sizes and positions in mm. pos is the centre of the part's box. y is up; the front panel (logo, two slots) faces +z, the rear ports face -z.
// Three levels: the 150 x 150 x 50.5 mm box, the mainboard, the GB10 package.

/* ---------- Level 1: the box ---------- */
const L = 132; // length of the U-shaped lid and the base between the two foam panels
const PANEL = 9;
const H = 50.5;
const TOP = 3;
const BOARD1 = { y0: 5, y1: 6.6 };
const BOARD_W = 132;
const BOARD_D = 118;
const PKG = [28, -8]; // GB10 package centre on the board (x, z)


/* Foam grain: a deterministic scatter of small flecks on a panel face (offsets from the face centre, x and y in mm). */
const fleck = (n, skip) => {
  const out = [];
  let a = 7919;
  const rnd = () => ((a = (a * 16807) % 2147483647) / 2147483647);
  while (out.length < n) {
    const x = (rnd() - 0.5) * 144;
    const y = (rnd() - 0.5) * 46;
    if (!skip(x, y + H / 2)) out.push([x, y, 0]);
  }
  return out;
};
const frontFlecks = fleck(520, (x, y) => Math.abs(x) > 47 && Math.abs(y - H / 2) < 19);
const rearFlecks = fleck(520, (x, y) => (y > 16 && y < 37) || (x < -49 && y > 35));

/* ---------- Level 2: the mainboard (board-relative, top at 1.6 mm) ---------- */
const BT = 1.6;
const memAt = [[58, 0, -30], [58, 0, -16], [58, 0, -2], [58, 0, 12], [5, 0, 21], [19, 0, 21], [33, 0, 21], [-4, 0, -8]];
const indAt = [];
for (const z of [-42, -34]) for (let i = 0; i < 6; i++) indAt.push([-17.5 + i * 7, 0, z]);

/* ---------- Level 3: the GB10 package (die sizes schematic) ---------- */
const SUB_TOP = 1.2;
const DIE_TOP = 2.0;
const CPU_X = -9.6;
const clusterAt = [[0, 0, -5.3], [0, 0, 5.3]];
const coreRow = (lz) => {
  const out = [];
  for (const [, , cz] of clusterAt) for (let i = 0; i < 5; i++) out.push([-3.6 + i * 1.8, 0, cz + lz]);
  return out;
};

export default {
  id: "nvidia-dgx-spark",
  name: "DGX Spark",
  maker: "NVIDIA",
  year: "2025",
  order: 4,
  oneLine: "Evaluated against the owner's 4090 box.",
  hero: [
    "128 GB unified LPDDR5x memory at 273 GB/s",
    "NVIDIA claims 1 PFLOP FP4, sparse; dense about half",
    "150 x 150 x 50.5 mm box weighing 1.2 kg",
  ],
  scale: { unit: "mm", stage: 10 },
  levels: [
    {
      id: "box",
      title: "DGX Spark box",
      parentPart: null,
      parts: [
        {
          id: "lid-top", label: "Lid top", line: "Champagne metal lid; the U-shape wraps top and both sides.",
          role: "structure", tone: "champagne", shape: "slab", size: [150, TOP, L], pos: [0, H - TOP / 2, 0], xray: true,
          explode: { dir: [0, 1, 0], dist: 110, at: [0.05, 0.6] },
        },
        {
          id: "lid-sides", label: "Lid sides", line: "The two lid walls that drop down to the base.",
          role: "structure", tone: "champagne", shape: "slab", size: [TOP, H - TOP, L], pos: [0, (H - TOP) / 2, 0], count: 2,
          at: [[-(75 - TOP / 2), 0, 0], [75 - TOP / 2, 0, 0]], follow: "lid-top", xray: true,
        },
        {
          id: "front-panel", label: "Front foam panel", line: "Speckled panel with the NVIDIA badge and two slots; the box weighs 1.2 kg.",
          role: "structure", tone: "speckle", shape: "slab", size: [150, H, PANEL], pos: [0, H / 2, L / 2 + PANEL / 2], xray: true,
          explode: { dir: [0, 1, 0.5], dist: 60, at: [0.15, 0.7] },
        },
        {
          id: "front-grain", label: "Foam grain", line: "Metal-foam flecks on the front panel; pattern is schematic.",
          role: "structure", tone: "champagne", shape: "box", size: [1.3, 1.1, 0.6], pos: [0, H / 2, L / 2 + PANEL + 0.31], count: 520,
          at: frontFlecks, schematic: true, follow: "front-panel",
        },
        {
          id: "rear-grain", label: "Foam grain", line: "Metal-foam flecks on the rear panel; pattern is schematic.",
          role: "structure", tone: "champagne", shape: "box", size: [1.3, 1.1, 0.6], pos: [0, H / 2, -(L / 2 + PANEL) - 0.31], count: 520,
          at: rearFlecks, schematic: true, follow: "rear-panel",
        },
        {
          id: "front-slots", label: "Front slot plates", line: "Two rounded slot plates on the front panel; schematic.",
          role: "structure", tone: "champagne", shape: "rbox", size: [14, 32, 1.2], pos: [0, H / 2, L / 2 + PANEL + 0.6], count: 2,
          at: [[-57, 0, 0], [57, 0, 0]], follow: "front-panel", schematic: true,
        },
        {
          id: "slot-cutouts", label: "Slot openings", line: "Dark vertical slot inside each plate; schematic.",
          role: "structure", tone: "graphite", shape: "rbox", size: [5, 24, 0.6], pos: [0, H / 2, L / 2 + PANEL + 1.5], count: 2,
          at: [[-57, 0, 0], [57, 0, 0]], follow: "front-panel", schematic: true,
        },
        {
          id: "rear-panel", label: "Rear foam panel", line: "Speckled panel at the port end; the base shell carries it.",
          role: "structure", tone: "speckle", shape: "slab", size: [150, H, PANEL], pos: [0, H / 2, -(L / 2 + PANEL / 2)], xray: true,
          explode: { dir: [0, -1, -0.5], dist: 45, at: [0.15, 0.7] },
        },
        {
          id: "base-floor", label: "Bottom shell", line: "Champagne floor plate; a magnetic base hides 4 screws.",
          role: "structure", tone: "champagne", shape: "slab", size: [150 - 2 * TOP, 2, L], pos: [0, 1, 0], xray: true,
          explode: { dir: [0, -1, 0], dist: 45, at: [0.1, 0.65] },
        },
        {
          id: "standoffs", label: "Standoffs", line: "Posts that hold the board above the base; schematic.",
          role: "structure", tone: "graphite", shape: "cyl", size: [6, 3, 6], pos: [0, 3.5, 0], schematic: true, count: 4,
          at: [[-60, 0, -50], [60, 0, -50], [-60, 0, 50], [60, 0, 50]], follow: "base-floor",
        },
        {
          id: "mainboard", label: "Mainboard", line: "Black board with the GB10, memory, SSD and network chip.",
          role: "structure", tone: "pcb-black", shape: "slab", size: [BOARD_W, BOARD1.y1 - BOARD1.y0, BOARD_D],
          pos: [0, (BOARD1.y0 + BOARD1.y1) / 2, 0], schematic: true, enter: "board",
          explode: { dir: [0, 1, 0], dist: 8, at: [0.5, 0.95] },
        },
        {
          id: "gb10", label: "GB10 superchip", line: "CPU and GPU in one package with a 140 W TDP.",
          role: "compute", tone: "graphite", shape: "rbox", size: [40, 2.5, 40], pos: [PKG[0], BOARD1.y1 + 1.25, PKG[1]], schematic: true,
          follow: "mainboard", explode: { dir: [0, 1, 0], dist: 14, at: [0.55, 0.95] },
        },
        {
          id: "gb10-lid", label: "GB10 lid", line: "Silver lid over the GPU and CPU dies; schematic.",
          role: "cooling", tone: "silver", shape: "slab", size: [30, 1, 34], pos: [PKG[0], BOARD1.y1 + 2.5 + 0.5, PKG[1]], schematic: true,
          follow: "mainboard", xray: true, explode: { dir: [0, 1, 0], dist: 24, at: [0.55, 0.95] },
        },
        {
          id: "connectx7", label: "ConnectX-7 chip", line: "Network chip beside the GB10; 200 Gb/s total.",
          role: "interconnect", tone: "silver", shape: "box", size: [18, 1.8, 18], pos: [-30, BOARD1.y1 + 0.9, -8], schematic: true,
          follow: "mainboard", explode: { dir: [0, 1, 0], dist: 12, at: [0.55, 0.95] },
        },
        {
          id: "lpddr5x", label: "LPDDR5x memory", line: "Eight soldered black packages hold the 128 GB pool.",
          role: "memory", tone: "graphite", shape: "box", size: [10, 1, 12], pos: [0, BOARD1.y1 + 0.5, 0], at: memAt, count: 8,
          schematic: true, follow: "mainboard", explode: { dir: [0, 1, 0], dist: 6, at: [0.55, 0.95] },
        },
        {
          id: "nvme-ssd", label: "4 TB SSD", line: "M.2 2242 stick on PCIe Gen5; 1 or 4 TB.",
          role: "memory", tone: "graphite", shape: "slab", size: [42, 2.4, 22], pos: [-20, BOARD1.y1 + 1.2, 38],
          follow: "mainboard", explode: { dir: [0, 1, 0], dist: 4, at: [0.55, 0.95] },
        },
        {
          id: "inductors-1", label: "Power inductors", line: "Twelve black power parts in two rows; schematic.",
          role: "power", tone: "graphite", shape: "box", size: [5, 2.5, 5], pos: [PKG[0], BOARD1.y1 + 1.25, 0], at: indAt, count: 12,
          schematic: true, follow: "mainboard", explode: { dir: [0, 1, 0], dist: 7, at: [0.55, 0.95] },
        },
        {
          id: "board-screws", label: "Board screws", line: "Screws that hold the board on the standoffs; schematic.",
          role: "structure", tone: "nickel", shape: "cyl", size: [5, 1.2, 5], pos: [0, BOARD1.y1 + 0.6, 0], count: 4, schematic: true,
          at: [[-60, 0, -44], [60, 0, -44], [-60, 0, 50], [60, 0, 50]], follow: "mainboard",
          explode: { dir: [0, 1, 0], dist: 5, at: [0.55, 0.95] },
        },
        {
          id: "ssd-chips", label: "SSD chips", line: "Flash and controller packages on the SSD; schematic.",
          role: "memory", tone: "matte", shape: "box", size: [9, 0.9, 9], pos: [-20, BOARD1.y1 + 2.85, 38], count: 3, schematic: true,
          at: [[-12, 0, 0], [0, 0, 0], [12, 0, 0]], follow: "mainboard", explode: { dir: [0, 1, 0], dist: 4.5, at: [0.55, 0.95] },
        },
        {
          id: "heatsink-base", label: "Heatsink base", line: "Metal plate that takes heat from the GB10 lid; schematic.",
          role: "cooling", tone: "nickel", shape: "slab", size: [40, 2, 40], pos: [PKG[0], BOARD1.y1 + 3.5 + 1 + 1, PKG[1]], schematic: true,
          follow: "mainboard", xray: true, explode: { dir: [0, 1, 0], dist: 36, at: [0.45, 0.95] },
        },
        {
          id: "heatsink-fins", label: "Heatsink fins", line: "Thin fins in a block; fin count is not published.",
          role: "cooling", tone: "nickel", shape: "box", size: [38, 18, 38], pos: [PKG[0], BOARD1.y1 + 3.5 + 2 + 9 + 1, PKG[1]], grid: { nx: 16, nz: 1, gap: 0.9 },
          schematic: true, follow: "heatsink-base", xray: true,
        },
        {
          id: "cooling-fan", label: "Cooling fan", line: "Fan that pulls air through the foam panels; fan count not published.",
          role: "cooling", tone: "graphite", shape: "fan", size: [26, 7, 26], pos: [40, BOARD1.y1 + 3.5, 42], schematic: true,
          follow: "mainboard", xray: true, explode: { dir: [0, 1, 0.3], dist: 30, at: [0.45, 0.95] },
        },
        {
          id: "rear-usbc", label: "Rear USB-C ports", line: "Four USB-C ports; one takes the 240 W supply.",
          role: "io", tone: "graphite", shape: "rbox", size: [8.5, 3.5, 1.2], pos: [-60, 26, -(L / 2 + PANEL) - 0.6], count: 4,
          at: [[0, 0, 0], [10, 0, 0], [20, 0, 0], [30, 0, 0]], follow: "rear-panel",
        },
        {
          id: "rear-hdmi", label: "Rear HDMI", line: "One HDMI display output.",
          role: "io", tone: "graphite", shape: "rbox", size: [15, 6, 1.2], pos: [-10, 26, -(L / 2 + PANEL) - 0.6], follow: "rear-panel",
        },
        {
          id: "rear-rj45", label: "Rear RJ-45", line: "10 GbE wired Ethernet port.",
          role: "io", tone: "graphite", shape: "rbox", size: [16, 13, 1.2], pos: [10, 26, -(L / 2 + PANEL) - 0.6], follow: "rear-panel",
        },
        {
          id: "rear-qsfp", label: "Rear QSFP cages", line: "Two QSFP cages for ConnectX-7; 200 Gb/s total.",
          role: "io", tone: "silver", shape: "rbox", size: [19, 9, 1.2], pos: [34, 26, -(L / 2 + PANEL) - 0.6], count: 2,
          at: [[0, 0, 0], [24, 0, 0]], follow: "rear-panel",
        },
        {
          id: "power-button", label: "Power button", line: "Round power button on the rear panel; schematic.",
          role: "io", tone: "nickel", shape: "rbox", size: [6, 6, 1.5], pos: [-60, 40, -(L / 2 + PANEL) - 0.75], schematic: true,
          follow: "rear-panel",
        },
        {
          id: "power-brick", label: "Power adapter", line: "External 240 W USB-C adapter; its size is schematic.",
          role: "power", tone: "matte", shape: "rbox", size: [100, 28, 55], pos: [40, 14, -135], schematic: true,
          explode: { dir: [0.3, 0, -1], dist: 45, at: [0, 0.35] },
        },
      ],
      flows: [
        { from: "power-brick", to: "mainboard", label: "240 W rated supply over USB-C", speed: 0.45 },
        { from: "connectx7", to: "rear-panel", label: "200 Gb/s total through ConnectX-7 to the QSFP cages", speed: 0.4 },
      ],
      callouts: [
        { part: "lid-top", title: "Tiny box", text: "Only 1.2 kg and 50.5 mm tall." },
        { part: "power-brick", title: "External power", text: "A 240 W USB-C brick keeps heat out of the box." },
        { part: "rear-panel", title: "Foam panels", text: "Speckled panels sit at both ends; fan count not published." },
        { part: "front-panel", title: "Quiet", text: "Declared sound power is 35 dB at full GPU load." },
        { part: "base-floor", title: "Magnetic base", text: "A magnetic cover hides 4 screws." },
      ],
    },
    {
      id: "board",
      title: "Mainboard",
      parentPart: "mainboard",
      parts: [
        {
          id: "board-base", label: "Mainboard", line: "Black circuit board; outline and layout are schematic.",
          role: "structure", tone: "pcb-black", shape: "slab", size: [BOARD_W, BT, BOARD_D], pos: [0, BT / 2, 0], schematic: true,
        },
        {
          id: "gb10-package", label: "GB10 package", line: "CPU die and GPU die in one package; package size schematic.",
          role: "compute", tone: "graphite", shape: "rbox", size: [40, 2.5, 40], pos: [PKG[0], BT + 1.25, PKG[1]], schematic: true, glow: true,
          enter: "gb10", explode: { dir: [0, 1, 0], dist: 14, at: [0.3, 0.9] },
        },
        {
          id: "gb10-lid", label: "GB10 lid", line: "Silver lid over the dies; schematic.",
          role: "cooling", tone: "silver", shape: "slab", size: [30, 1, 34], pos: [PKG[0], BT + 2.5 + 0.5, PKG[1]], schematic: true, xray: true,
          follow: "gb10-package", explode: { dir: [0, 1, 0], dist: 10, at: [0.3, 0.9] },
        },
        {
          id: "lpddr5x", label: "LPDDR5x memory", line: "Eight soldered packages hold the shared 128 GB pool.",
          role: "memory", tone: "graphite", shape: "box", size: [10, 1, 12], pos: [0, BT + 0.5, 0], at: memAt, count: 8,
          schematic: true, explode: { dir: [0, 1, 0], dist: 9, spread: 0.2, at: [0.2, 0.8] },
        },
        {
          id: "inductors", label: "Power inductors", line: "Twelve black power parts in two rows above the GB10; schematic.",
          role: "power", tone: "graphite", shape: "box", size: [5, 2.5, 5], pos: [PKG[0], BT + 1.25, 0], at: indAt, count: 12,
          schematic: true, explode: { dir: [0, 1, 0], dist: 8, at: [0.2, 0.8] },
        },
        {
          id: "nvme-ssd", label: "4 TB SSD", line: "M.2 2242 stick on PCIe Gen5; 1 or 4 TB.",
          role: "memory", tone: "graphite", shape: "slab", size: [42, 2.4, 22], pos: [-20, BT + 1.2, 38],
          explode: { dir: [0, 1, 0.3], dist: 20, at: [0.25, 0.85] },
        },
        {
          id: "connectx7", label: "ConnectX-7 NIC", line: "NVIDIA network chip on two PCIe Gen5 x4 links; size schematic.",
          role: "interconnect", tone: "silver", shape: "box", size: [18, 1.8, 18], pos: [-30, BT + 0.9, -8], schematic: true,
          explode: { dir: [0, 1, 0], dist: 12, at: [0.25, 0.85] },
        },
        {
          id: "wifi", label: "Wi-Fi 7 card", line: "Small MediaTek card on one PCIe Gen3 lane; size schematic.",
          role: "io", tone: "pcb-green", shape: "slab", size: [22, 1.2, 30], pos: [-52, BT + 0.6, 22], schematic: true,
          explode: { dir: [-0.4, 1, 0.4], dist: 12, at: [0.25, 0.85] },
        },
        {
          id: "qsfp", label: "QSFP cages", line: "Two cages for ConnectX-7 network links, 200 Gb/s total.",
          role: "io", tone: "silver", shape: "box", size: [19, 9, 20], pos: [-37.5, BT + 4.5, -49], count: 2, at: [[-10.5, 0, 0], [10.5, 0, 0]],
          schematic: true, explode: { dir: [0, 0, -1], dist: 14, at: [0.35, 0.9] },
        },
        {
          id: "rj45", label: "RJ-45 port", line: "Wired 10 GbE Ethernet port.",
          role: "io", tone: "silver", shape: "box", size: [16, 13, 21], pos: [-5, BT + 6.5, -48.5],
          explode: { dir: [0, 0, -1], dist: 14, at: [0.35, 0.9] },
        },
        {
          id: "hdmi", label: "HDMI port", line: "One HDMI display output.",
          role: "io", tone: "silver", shape: "box", size: [15, 6, 12], pos: [14, BT + 3, -53],
          explode: { dir: [0, 0, -1], dist: 14, at: [0.35, 0.9] },
        },
        {
          id: "usbc", label: "USB-C ports", line: "Four USB-C ports; one takes the 240 W power supply.",
          role: "io", tone: "silver", shape: "box", size: [9, 3.5, 8], pos: [43, BT + 1.75, -55], count: 4,
          at: [[-15, 0, 0], [-5, 0, 0], [5, 0, 0], [15, 0, 0]],
          explode: { dir: [0, 0, -1], dist: 14, at: [0.35, 0.9] },
        },
        {
          id: "board-screws", label: "Board screws", line: "Screws that hold the board on the standoffs; schematic.",
          role: "structure", tone: "nickel", shape: "cyl", size: [5, 1.2, 5], pos: [0, BT + 0.6, 0], count: 4, schematic: true,
          at: [[-60, 0, -44], [60, 0, -44], [-60, 0, 50], [60, 0, 50]], explode: { dir: [0, 1, 0], dist: 6, at: [0.2, 0.8] },
        },
        {
          id: "ssd-chips", label: "SSD chips", line: "Flash and controller packages on the SSD; schematic.",
          role: "memory", tone: "matte", shape: "box", size: [9, 0.9, 9], pos: [-20, BT + 2.85, 38], count: 3, schematic: true,
          at: [[-12, 0, 0], [0, 0, 0], [12, 0, 0]], follow: "nvme-ssd",
        },
        {
          id: "heatsink-base", label: "Heatsink base", line: "Metal plate that takes heat from the GB10 lid; schematic.",
          role: "cooling", tone: "nickel", shape: "slab", size: [40, 2, 40], pos: [PKG[0], BT + 3.5 + 1 + 1, PKG[1]], schematic: true,
          xray: true, explode: { dir: [0, 1, 0], dist: 30, at: [0.1, 0.6] },
        },
        {
          id: "heatsink-fins", label: "Heatsink fins", line: "Thin fins in a block; fin count is not published.",
          role: "cooling", tone: "nickel", shape: "box", size: [38, 18, 38], pos: [PKG[0], BT + 3.5 + 2 + 9 + 1, PKG[1]], grid: { nx: 16, nz: 1, gap: 0.9 },
          schematic: true, xray: true, follow: "heatsink-base",
        },
        {
          id: "cooling-fan", label: "Cooling fan", line: "Fan that pulls air through the foam panels; fan count not published.",
          role: "cooling", tone: "graphite", shape: "fan", size: [26, 7, 26], pos: [40, BT + 3.5, 42], schematic: true,
          xray: true, explode: { dir: [0, 1, 0.3], dist: 24, at: [0.1, 0.6] },
        },
      ],
      flows: [
        { from: "lpddr5x", to: "gb10-package", label: "273 GB/s unified memory on a 256-bit LPDDR5x bus", speed: 1 },
        { from: "nvme-ssd", to: "gb10-package", label: "11.4 GiB/s measured sequential read (about 22x slower; compressed)", speed: 0.25 },
        { from: "connectx7", to: "gb10-package", label: "Two PCIe Gen5 x4 links to the GB10", speed: 0.35 },
        { from: "connectx7", to: "qsfp", label: "200 Gb/s total, about 25 GB/s (11x slower than memory; compressed)", speed: 0.3 },
      ],
      callouts: [
        { part: "gb10-package", title: "One package", text: "CPU and GPU share one 128 GB pool." },
        { part: "lpddr5x", title: "Soldered memory", text: "8 LPDDR5x packages sit around the chip." },
        { part: "nvme-ssd", title: "Small SSD", text: "M.2 2242 stick, up to 4 TB." },
        { part: "connectx7", title: "Pair two", text: "200 Gb/s NIC links two Sparks." },
        { part: "rj45", title: "Rear ports", text: "4 USB-C, HDMI, 10 GbE and 2 QSFP." },
      ],
    },
    {
      id: "gb10",
      title: "GB10 package",
      parentPart: "gb10-package",
      parts: [
        {
          id: "substrate", label: "Package substrate", line: "Base that carries both dies; size is schematic.",
          tone: "graphite", role: "structure", shape: "rbox", size: [40, SUB_TOP, 40], pos: [0, SUB_TOP / 2, 0], schematic: true,
        },
        {
          id: "cpu-die", label: "CPU die", line: "MediaTek-built die with 20 Arm cores; size not published.",
          tone: "die-colour", role: "compute", shape: "box", size: [11, DIE_TOP - SUB_TOP, 22], pos: [-10, (SUB_TOP + DIE_TOP) / 2, 0],
          schematic: true, explode: { dir: [-1, 0.3, 0], dist: 4, at: [0.4, 0.95] },
        },
        {
          id: "mem-controller", label: "Memory controller", line: "256-bit LPDDR5x controller on the CPU die edge.",
          role: "memory", shape: "box", size: [0.8, 0.1, 18], pos: [-15, DIE_TOP + 0.05, 0], follow: "cpu-die",
          explode: { dir: [-1, 1, 0], dist: 0.8, at: [0.5, 1] },
        },
        {
          id: "cpu-cluster", label: "CPU cluster", line: "Two clusters of ten cores each; floor plan schematic.",
          role: "compute", shape: "box", size: [9.4, 0.08, 8.6], pos: [CPU_X, DIE_TOP + 0.04, 0], at: clusterAt, count: 2,
          schematic: true, follow: "cpu-die", explode: { dir: [0, 1, 0], dist: 0.5, spread: 0.12, at: [0.5, 1] },
        },
        {
          id: "x925", label: "Cortex-X925 core", line: "Fast Arm core; 10 in the chip.",
          role: "compute", shape: "box", size: [1.6, 0.1, 1.8], pos: [CPU_X, DIE_TOP + 0.13, 0], at: coreRow(-2.2), count: 10,
          glow: true, follow: "cpu-die", explode: { dir: [0, 1, 0], dist: 0.9, spread: 0.12, at: [0.5, 1] },
        },
        {
          id: "a725", label: "Cortex-A725 core", line: "Efficient Arm core; 10 in the chip.",
          role: "compute", shape: "box", size: [1.0, 0.1, 1.2], pos: [CPU_X, DIE_TOP + 0.13, 0], at: coreRow(1.8), count: 10,
          glow: true, follow: "cpu-die", explode: { dir: [0, 1, 0], dist: 0.9, spread: 0.12, at: [0.5, 1] },
        },
        {
          id: "gpu-die", label: "GPU die", line: "NVIDIA Blackwell die with 5th-gen Tensor Cores; size not published.",
          tone: "die-colour", role: "compute", shape: "box", size: [19, DIE_TOP - SUB_TOP, 22], pos: [6, (SUB_TOP + DIE_TOP) / 2, 0],
          schematic: true, explode: { dir: [1, 0.3, 0], dist: 4, at: [0.4, 0.95] },
        },
        {
          id: "sm", label: "SM, schematic", line: "SM count not published; NVIDIA lists 6,144 CUDA cores.",
          role: "compute", shape: "box", size: [17, 0.1, 18], pos: [6, DIE_TOP + 0.05, 0], grid: { nx: 8, nz: 6, gap: 0.3 },
          count: 48, schematic: true, glow: true, follow: "gpu-die",
          explode: { dir: [0, 1, 0], dist: 0.9, spread: 0.12, at: [0.5, 1] },
        },
        {
          id: "nvlink-c2c", label: "NVLink-C2C", line: "Die-to-die link, 300 GB/s each direction.",
          role: "interconnect", shape: "slab", size: [1, 0.3, 18], pos: [-4, SUB_TOP + 0.15, 0],
          explode: { dir: [0, 1, 0], dist: 1.5, at: [0.5, 1] },
        },
        {
          id: "lid-rim", label: "Lid rim", line: "Side wall of the metal lid over both dies.",
          tone: "silver", role: "structure", shape: "frame", wall: 1, size: [36, 1.0, 36], pos: [0, SUB_TOP + 0.5, 0], schematic: true,
          xray: true, explode: { dir: [0, 1, 0], dist: 40, at: [0.08, 0.5] },
        },
        {
          id: "lid", label: "Package lid", line: "Metal lid that spreads heat from a 140 W chip.",
          tone: "silver", role: "structure", shape: "slab", size: [36, 0.6, 36], pos: [0, SUB_TOP + 1.0 + 0.3, 0], schematic: true,
          xray: true, explode: { dir: [0, 1, 0], dist: 50, at: [0, 0.45] },
        },
      ],
      flows: [
        { from: "cpu-die", to: "gpu-die", label: "NVLink-C2C: 300 GB/s each direction", speed: 1 },
        { from: "mem-controller", to: "sm", label: "273 GB/s LPDDR5x bus feeds the GPU", speed: 0.9 },
      ],
      callouts: [
        { part: "x925", title: "20 Arm cores", text: "10 X925 big cores plus 10 A725 cores." },
        { part: "nvlink-c2c", title: "Chip link", text: "300 GB/s each way between CPU and GPU dies." },
        { part: "mem-controller", title: "Memory bottleneck", text: "Bus is 273 GB/s, versus 1008 GB/s on a 4090." },
        { part: "gpu-die", title: "Blackwell GPU", text: "5th-gen Tensor Cores; claimed 1 PFLOP FP4 sparse." },
      ],
    },
  ],
  glossary: [
    ["GB10", "the NVIDIA and MediaTek chip inside the Spark: a CPU die and a GPU die in one package."],
    ["Superchip", "a CPU and a GPU joined so tightly they share memory."],
    ["Blackwell", "NVIDIA's GPU architecture generation used here."],
    ["Unified memory", "one memory pool that CPU and GPU both read and write."],
    ["LPDDR5x", "low-power memory, soldered next to the chip."],
    ["Memory bandwidth", "how many bytes per second the chip can read from memory."],
    ["NVLink-C2C", "NVIDIA's direct chip-to-chip link, here inside the package."],
    ["Die", "one piece of silicon; a package can hold several."],
    ["Cortex-X925", "a fast Arm CPU core."],
    ["Cortex-A725", "a smaller, efficient Arm CPU core."],
    ["SM", "streaming multiprocessor, a GPU compute block."],
    ["Tensor Core", "a GPU unit that does matrix maths fast."],
    ["FP4", "4-bit floating point numbers: small and fast, less precise."],
    ["Sparse", "skips zeros in matrices; the headline PFLOP figure assumes it. Dense is about half."],
    ["PFLOP", "one quadrillion floating point operations per second."],
    ["TDP", "thermal design power, the heat the cooling must handle."],
    ["ConnectX-7", "NVIDIA's network chip, up to 200 Gb/s."],
    ["QSFP", "a plug cage for fast network cables."],
    ["NIC", "network interface card or chip."],
    ["PCIe", "the standard board-level link between chips and cards."],
    ["NVMe M.2 SSD", "a small flash storage stick."],
  ],
  notPublished: [
    "GPU SM count: not published; 48 is a leak. NVIDIA gives 6,144 CUDA cores; the 48-block grid is schematic.",
    "CPU die and GPU die sizes, and the package size; all drawn schematic.",
    "Process node: TSMC 3 nm is reported, not official.",
    "Fan count, heatsink and vapour chamber design: not published. The fan, fins and plate are schematic.",
    "Exact positions of the 8 LPDDR5x packages; the count is from a review, the layout is schematic.",
    "Per-die TDP split; only the 140 W whole-chip figure is given.",
    "Clock speeds: no official GPU or CPU clock.",
    "Dense FP4 TFLOPS: not published; about half the sparse figure is an extrapolation.",
    "Memory: NVIDIA lists 273 GB/s; a Hot Chips report gives a controller ceiling near 301 GB/s.",
    "Whether 200 Gb/s is one QSFP port or split across both is not confirmed.",
    "Split of X925 and A725 cores between the two clusters; drawn five and five.",
    "Measured whole-box power draw, price and launch date.",
    "Shapes, colours and layout are design choices; counts and hierarchy are real.",
  ],
  sourcesPath: "details/nvidia-dgx-spark.md",
};
