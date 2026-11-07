// NVIDIA Jetson AGX Orin 64 GB developer kit: built from details/nvidia-jetson-orin.md (sections 3 to 8) under build/MODEL-RULES.md,
// after NVIDIA's own hardware-layout photos (grey aluminium shell with slatted top and fan opening, black lower base, ports on two faces)
// and the exploded style of build/ref/jetson-thor-exploded.png. All sizes and positions in mm. pos is the centre of the part's box.
// y is up. Front face = +z (buttons, DC jack, RJ45, USB-A, DisplayPort), right face = +x (USB-A pair). Kit outline 110 x 110 x 71.65 mm.
// Three levels: the developer kit, the 100 x 87 mm module, the Orin package die (schematic floor plan).

/* ---------- Level 1: the kit (110 x 110 x 71.65 mm outline is published; inner layout is schematic) ---------- */
const KIT = 110;
const WALL = 2;
const TOP = 71.65;
const CARRIER = { s: 104, y0: 10, y1: 11.6 };
const CY = CARRIER.y1; // carrier top
const MOD = { w: 100, d: 87, cx: -2.5, cz: -9.5, y0: CY + 3.4, t: 1.6 }; // module board sits on a 3 mm board-to-board connector
const MOD_TOP = MOD.y0 + MOD.t; // 16.6
const SOC = { s: 40, h: 2.4, lx: -4, lz: -6 }; // package size not published; module-local centre
const PLATE_Y0 = MOD_TOP + SOC.h; // 18.6
const FIN = { y0: PLATE_Y0 + 2, h: 37 }; // fins end at 57.6
const FAN = { y0: FIN.y0 + FIN.h, h: 10, d: 72 };
const SHELL_Y0 = 30;
const TOPPLATE = 2.5;
const lpddrLocal = [];
for (const x of [-34, 26]) for (const z of [-24, -12, 0, 12]) lpddrLocal.push([x, z]);
const inductorX = [];
for (let i = 0; i < 10; i++) inductorX.push(-36 + i * 8);
const capX = [];
for (let i = 0; i < 9; i++) capX.push(-32 + i * 8);
const slatX = [];
for (let i = 0; i < 17; i++) slatX.push((i - 8) * 5.2);
const sideSlotZ = [];
for (let i = 0; i < 20; i++) sideSlotZ.push((i - 9.5) * 4.6);
const FRONT = 44; // z centre of the port strip in front of the module (module ends at z = 34)

/* ---------- Level 2: the module (module-local, board top at 1.6 mm) ---------- */
const BT = 1.6;
const pmicX = [-24, -12, 0, 12, 24];
const screwAt = [[-47, 0, -41], [47, 0, -41], [-47, 0, 41], [47, 0, 41]];

/* ---------- Level 3: the Orin die (22 x 22 mm drawn, schematic; real counts) ---------- */
const SUB = { s: 40, h: 1.2 };
const DIE = { s: 22, h: 0.8 };
const BLK_Y = SUB.h + DIE.h + 0.06; // centre of 0.12 mm blocks on the die
const BLK_TOP = SUB.h + DIE.h + 0.12;
const clusterX = [-6.5, 0, 6.5];
const coreAt = [];
for (const cx of clusterX) for (const ix of [-1.3, 1.3]) for (const iz of [-1.15, 1.15]) coreAt.push([cx + ix, 0, -7 + iz]);
const gpcX = [-4.9, 4.9];
const smAt = [];
for (const gx of gpcX) for (const cx of [-3.45, -1.15, 1.15, 3.45]) for (const iz of [-1.9, 1.9]) smAt.push([gx + cx, 0, 0.2 + iz]);
const pcieAt = [];
for (let i = 0; i < 7; i++) pcieAt.push([-9 + i * 3, 0, 0]);
const csiAt = [];
for (let i = 0; i < 6; i++) csiAt.push([-7.5 + i * 3, 0, 0]);

const FRONT_EXP = { dir: [0, 0, 1], dist: 14, at: [0.5, 0.95] };
const SIDE_EXP = { dir: [1, 0, 0], dist: 14, at: [0.5, 0.95] };

export default {
  id: "nvidia-jetson-orin",
  name: "Jetson AGX Orin",
  maker: "NVIDIA",
  year: "2022",
  order: 3,
  oneLine: "The owner's first on-device LLM work.",
  hero: [
    "64 GB LPDDR5, 204.8 GB/s, shared by CPU, GPU",
    "275 sparse INT8 TOPS (claimed); dense is 137.5",
    "12 Arm cores, 2,048 CUDA cores, 15-60 W",
  ],
  scale: { unit: "mm", stage: 12 },
  levels: [
    {
      id: "kit",
      title: "Developer kit",
      parentPart: null,
      parts: [
        {
          id: "chassis-base", label: "Bottom chassis", line: "Black base plate under the carrier board.",
          role: "structure", tone: "graphite", shape: "slab", size: [KIT, 2, KIT], pos: [0, 1, 0],
          explode: { dir: [0, -1, 0], dist: 34, at: [0.5, 0.95] },
        },
        {
          id: "chassis-wall", label: "Lower housing", line: "Black housing round the carrier; ports poke through its sides.",
          role: "structure", tone: "graphite", shape: "frame", wall: WALL, size: [KIT, SHELL_Y0 - 2, KIT], pos: [0, 2 + (SHELL_Y0 - 2) / 2, 0],
          xray: true, explode: { dir: [0, -1, 0], dist: 20, at: [0.4, 0.9] },
        },
        {
          id: "standoffs", label: "Standoffs", line: "Four posts hold the carrier above the base; schematic.",
          role: "structure", tone: "nickel", shape: "cyl", size: [5, CARRIER.y0 - 2, 5], pos: [0, 2 + (CARRIER.y0 - 2) / 2, 0], count: 4, schematic: true,
          at: [[-47, 0, -47], [47, 0, -47], [-47, 0, 47], [47, 0, 47]], follow: "chassis-base",
        },
        {
          id: "carrier", label: "Carrier board", line: "Black board that gives the module its ports and power; about 110 mm square.",
          role: "structure", tone: "pcb-black", shape: "slab", size: [CARRIER.s, CARRIER.y1 - CARRIER.y0, CARRIER.s],
          pos: [0, (CARRIER.y0 + CARRIER.y1) / 2, 0], schematic: true,
        },
        /* underside of the carrier */
        {
          id: "pcie-slot", label: "PCIe x16 slot", line: "An x16 slot on the board underside; it runs 8 lanes of PCIe 4.0.",
          role: "io", tone: "graphite", shape: "box", size: [8, 7.5, 89], pos: [44, CARRIER.y0 - 3.75, 0], follow: "carrier",
          explode: { dir: [0, -1, 0], dist: 10, at: [0.5, 0.95] },
        },
        {
          id: "m2-slots", label: "M.2 slots", line: "M-key for NVMe and E-key for wireless, under the board.",
          role: "io", tone: "gold", shape: "box", size: [22, 3.5, 6], pos: [-30, CARRIER.y0 - 1.75, 36], count: 2, at: [[0, 0, -8], [0, 0, 8]],
          schematic: true, follow: "carrier", explode: { dir: [0, -1, 0], dist: 10, at: [0.5, 0.95] },
        },
        {
          id: "csi", label: "Camera connector", line: "One camera port; the module itself offers 16 CSI lanes.",
          role: "io", tone: "graphite", shape: "box", size: [30, 4, 5], pos: [-2, CARRIER.y0 - 2, 44], follow: "carrier",
          schematic: true, explode: { dir: [0, -1, 0], dist: 10, at: [0.5, 0.95] },
        },
        {
          id: "microsd", label: "microSD slot", line: "UHS-I card slot under the board.",
          role: "io", tone: "nickel", shape: "box", size: [12, 1.8, 13], pos: [34, CARRIER.y0 - 0.9, 38], follow: "carrier",
          explode: { dir: [0, -1, 0], dist: 10, at: [0.5, 0.95] },
        },
        /* front face (+z), left to right: buttons, USB-C over DC jack, RJ45, USB-A pair, DisplayPort */
        {
          id: "buttons", label: "Buttons", line: "Power, force recovery and reset buttons on the front.",
          role: "io", tone: "nickel", shape: "box", size: [4, 3, 4], pos: [-47, CY + 1.5, 50], count: 3, at: [[0, 0, 0], [7, 0, 0], [14, 0, 0]],
          follow: "carrier", explode: FRONT_EXP,
        },
        {
          id: "dc-jack", label: "DC power jack", line: "One 5.5 mm barrel jack feeds the kit.",
          role: "power", tone: "graphite", shape: "box", size: [11, 11, 14], pos: [-21.5, CY + 5.5, 45], follow: "carrier", explode: FRONT_EXP,
        },
        {
          id: "usb-c", label: "USB-C ports", line: "Two type-C ports: one above the DC jack, one by the header.",
          role: "io", tone: "silver", shape: "box", size: [8.9, 3.2, 7], pos: [-21.5, CY + 12.6, 47.5], count: 2, at: [[0, 0, 0], [70, -11, -94]],
          schematic: true, follow: "carrier", explode: FRONT_EXP,
        },
        {
          id: "ethernet", label: "RJ45 Ethernet", line: "One RJ45 port, up to 10 gigabit.",
          role: "io", tone: "silver", shape: "box", size: [16, 13.5, 19], pos: [-5, CY + 6.75, 43.5], follow: "carrier", explode: FRONT_EXP,
        },
        {
          id: "usb-a", label: "USB-A ports", line: "Four type-A ports in two stacked pairs.",
          role: "io", tone: "silver", shape: "box", size: [13.3, 15.6, 17], pos: [11.6, CY + 7.8, 43.5], follow: "carrier", explode: FRONT_EXP,
        },
        {
          id: "usb-a-side", label: "USB-A pair, side", line: "The second stacked pair of type-A ports, on the right face.",
          role: "io", tone: "silver", shape: "box", size: [16.5, 15.6, 13.3], pos: [44.75, CY + 7.8, 43], follow: "carrier", explode: SIDE_EXP,
        },
        {
          id: "displayport", label: "DisplayPort", line: "The only video out; no HDMI.",
          role: "io", tone: "silver", shape: "box", size: [15, 6.5, 17], pos: [29, CY + 3.25, 43.5], follow: "carrier", explode: FRONT_EXP,
        },
        {
          id: "fan-header", label: "Fan header", line: "4-pin fan connector next to the DC jack.",
          role: "io", tone: "silver", shape: "box", size: [5.5, 4.5, 4], pos: [-34.25, CY + 2.25, 36.5], follow: "carrier", schematic: true,
          explode: FRONT_EXP,
        },
        /* right edge, under the module overhang free zone */
        {
          id: "header-40", label: "40-pin header", line: "Two rows of 20 pins for GPIO, I2C, SPI and UART.",
          role: "io", tone: "graphite", shape: "box", size: [5, 8.5, 51], pos: [50.5, CY + 4.25, -10], follow: "carrier",
          explode: SIDE_EXP,
        },
        {
          id: "header-pins", label: "Header pins", line: "40 gold pins, two rows at 2.54 mm pitch.",
          role: "io", tone: "gold", shape: "box", size: [2.54, 3, 50.8], pos: [50.5, CY + 10, -10], grid: { nx: 2, nz: 20, gap: 1.4 },
          follow: "carrier", explode: SIDE_EXP,
        },
        {
          id: "b2b", label: "699-pin connector", line: "One mezzanine connector carries every signal to the module.",
          role: "interconnect", tone: "graphite", shape: "box", size: [67, 3.4, 23], pos: [MOD.cx, CY + 1.7, MOD.cz], schematic: true,
          follow: "carrier",
        },
        {
          id: "module-board", label: "Module board", line: "100 x 87 mm green board; the whole computer lives here.",
          role: "structure", tone: "pcb-green", shape: "slab", size: [MOD.w, MOD.t, MOD.d], pos: [MOD.cx, MOD.y0 + MOD.t / 2, MOD.cz],
          enter: "module", explode: { dir: [0, 1, 0], dist: 18, at: [0.4, 0.9] },
        },
        {
          id: "kit-soc", label: "Orin SoC", line: "Arm CPU, Ampere GPU and accelerators under a silver lid.",
          role: "compute", tone: "silver", shape: "rbox", size: [SOC.s, SOC.h, SOC.s],
          pos: [MOD.cx + SOC.lx, MOD_TOP + SOC.h / 2, MOD.cz + SOC.lz], schematic: true, follow: "module-board",
          explode: { dir: [0, 1, 0], dist: 4, at: [0.5, 0.95] },
        },
        {
          id: "kit-lpddr5", label: "LPDDR5 memory", line: "64 GB on a 256-bit bus; chip count is schematic.",
          role: "memory", shape: "box", size: [11, 1, 11], pos: [MOD.cx + SOC.lx, MOD_TOP + 0.5, MOD.cz + SOC.lz], count: 8,
          at: lpddrLocal.map(([x, z]) => [x - SOC.lx, 0, z - SOC.lz]), schematic: true, follow: "module-board",
          explode: { dir: [0, 1, 0], dist: 2, at: [0.5, 0.95] },
        },
        {
          id: "kit-emmc", label: "eMMC storage", line: "64 GB eMMC 5.1 holds the operating system.",
          role: "memory", shape: "box", size: [12, 1.2, 12], pos: [MOD.cx + 38, MOD_TOP + 0.6, MOD.cz + 30], schematic: true, follow: "module-board",
          explode: { dir: [0, 1, 0], dist: 2, at: [0.5, 0.95] },
        },
        {
          id: "kit-pmic", label: "Power chips", line: "Small regulators; part count and numbers not published.",
          role: "power", tone: "graphite", shape: "box", size: [6, 1.2, 6], pos: [MOD.cx, MOD_TOP + 0.6, MOD.cz + 30], count: 5,
          at: pmicX.map((x) => [x, 0, 0]), schematic: true, follow: "module-board", explode: { dir: [0, 1, 0], dist: 2, at: [0.5, 0.95] },
        },
        {
          id: "kit-power", label: "Inductors", line: "Power inductors turn 5 V and 12 V into core voltages.",
          role: "power", tone: "graphite", shape: "box", size: [5, 2, 5], pos: [MOD.cx, MOD_TOP + 1, MOD.cz - 37], count: 10,
          at: inductorX.map((x) => [x, 0, 0]), schematic: true, follow: "module-board",
          explode: { dir: [0, 1, 0], dist: 2, at: [0.5, 0.95] },
        },
        {
          id: "kit-caps", label: "Capacitors", line: "A row of polymer capacitors on the front edge; schematic.",
          role: "memory", tone: "matte", shape: "box", size: [3.2, 1.8, 3.2], pos: [MOD.cx, MOD_TOP + 0.9, MOD.cz + 38.5], count: 9,
          at: capX.map((x) => [x, 0, 0]), schematic: true, follow: "module-board", explode: { dir: [0, 1, 0], dist: 2, at: [0.5, 0.95] },
        },
        {
          id: "thermal-plate", label: "Heat spreader", line: "Aluminium plate over the SoC carries heat up to the fins.",
          role: "cooling", tone: "silver", shape: "slab", size: [96, 2, 84], pos: [MOD.cx, PLATE_Y0 + 1, MOD.cz], schematic: true,
          xray: true, explode: { dir: [0, 1, 0], dist: 38, at: [0.3, 0.8] },
        },
        {
          id: "heatsink", label: "Heatsink fins", line: "Black finned block on the heat spreader; fin count not published.",
          role: "cooling", tone: "matte", shape: "box", size: [MOD.w, FIN.h, MOD.d], pos: [MOD.cx, FIN.y0 + FIN.h / 2, MOD.cz],
          grid: { nx: 33, nz: 1, gap: 2.2 }, schematic: true, xray: true,
          explode: { dir: [0, 1, 0], dist: 58, spread: 0.08, at: [0.2, 0.7] },
        },
        {
          id: "fan", label: "Fan", line: "One fan on the fins; the board has a 4-pin fan header.",
          role: "cooling", tone: "matte", shape: "fan", blades: 9, size: [FAN.d, FAN.h, FAN.d], pos: [MOD.cx, FAN.y0 + FAN.h / 2, MOD.cz],
          schematic: true, xray: true, explode: { dir: [0, 1, 0], dist: 78, at: [0.1, 0.6] },
        },
        {
          id: "shell", label: "Aluminium shell", line: "Grey anodised cover with side vents; the kit runs up to 60 W.",
          role: "structure", tone: "anodised", shape: "frame", wall: WALL, size: [KIT, TOP - SHELL_Y0 - TOPPLATE, KIT],
          pos: [0, SHELL_Y0 + (TOP - SHELL_Y0 - TOPPLATE) / 2, 0], xray: true,
          explode: { dir: [0, 1, 0], dist: 110, at: [0.02, 0.55] },
        },
        {
          id: "shell-top", label: "Top frame", line: "Square top frame round the fan opening.",
          role: "structure", tone: "anodised", shape: "frame", wall: 8, size: [KIT, TOPPLATE, KIT], pos: [0, TOP - TOPPLATE / 2, 0],
          xray: true, explode: { dir: [0, 1, 0], dist: 110, at: [0.02, 0.55] },
        },
        {
          id: "top-slats", label: "Top vent slats", line: "Seventeen slats over the fan opening.",
          role: "structure", tone: "anodised", shape: "box", size: [2.2, 1.5, 94], pos: [0, TOP - 0.75, 0], count: 17, at: slatX.map((x) => [x, 0, 0]),
          schematic: true, xray: true, follow: "shell-top",
        },
        {
          id: "side-vents-front", label: "Front vent slots", line: "Dark vent slots cut in the shell front.",
          role: "structure", tone: "matte", shape: "box", size: [2.2, 10, 0.4], pos: [0, 62, KIT / 2 + 0.2], count: 20,
          at: sideSlotZ.map((x) => [x, 0, 0]), schematic: true, follow: "shell",
        },
        {
          id: "side-vents-right", label: "Side vent slots", line: "Dark vent slots cut in the shell right side.",
          role: "structure", tone: "matte", shape: "box", size: [0.4, 10, 2.2], pos: [KIT / 2 + 0.2, 62, 0], count: 20,
          at: sideSlotZ.map((z) => [0, 0, z]), schematic: true, follow: "shell",
        },
      ],
      flows: [
        { from: "dc-jack", to: "module-board", label: "Power in; the module draws 15 W to 60 W", speed: 0.45 },
        { from: "pcie-slot", to: "module-board", label: "PCIe 4.0 data, 8 lanes", speed: 0.4 },
        { from: "csi", to: "module-board", label: "Camera data; the module supports 16 CSI lanes", speed: 0.6 },
      ],
      callouts: [
        { part: "shell", title: "Whole kit", text: "Module, carrier, fan and ports in one box; up to 60 W." },
        { part: "heatsink", title: "Cooling", text: "A fan and heatsink keep the thermal plate under 80 C." },
        { part: "module-board", title: "The module", text: "A 100 by 87 mm board holds the whole computer." },
        { part: "pcie-slot", title: "PCIe slot", text: "An x16 slot that runs 8 lanes of PCIe 4.0." },
        { part: "ethernet", title: "Fast network", text: "One Ethernet port, up to 10 gigabit." },
        { part: "m2-slots", title: "M.2 storage", text: "Two M.2 slots; add NVMe so big models load faster." },
      ],
    },
    {
      id: "module",
      title: "Module board",
      parentPart: "module-board",
      parts: [
        {
          id: "board", label: "Module board", line: "100 x 87 mm; the layout of small parts is schematic.",
          role: "structure", tone: "pcb-green", shape: "slab", size: [MOD.w, BT, MOD.d], pos: [0, BT / 2, 0], schematic: true,
        },
        {
          id: "b2b-699", label: "699-pin connector", line: "Underside socket that mates with the carrier board.",
          role: "interconnect", tone: "graphite", shape: "box", size: [60, 3, 12], pos: [0, -1.5, 28], schematic: true,
          follow: "board", explode: { dir: [0, -1, 0], dist: 10, at: [0.3, 0.8] },
        },
        {
          id: "soc", label: "Orin SoC package", line: "One chip: Arm CPU, Ampere GPU, two DLAs and a vision engine.",
          role: "compute", tone: "silver", shape: "rbox", size: [SOC.s, SOC.h, SOC.s], pos: [SOC.lx, BT + SOC.h / 2, SOC.lz], schematic: true,
          enter: "die", follow: "board", explode: { dir: [0, 1, 0], dist: 10, at: [0.45, 0.95] },
        },
        {
          id: "lpddr5", label: "LPDDR5 chips", line: "64 GB total, 256-bit bus, 204.8 GB/s; chip count is schematic.",
          role: "memory", shape: "box", size: [11, 1, 11], pos: [SOC.lx, BT + 0.5, SOC.lz], count: 8,
          at: lpddrLocal.map(([x, z]) => [x - SOC.lx, 0, z - SOC.lz]), schematic: true, follow: "board",
          explode: { dir: [0, 1, 0], dist: 5, spread: 0.2, at: [0.45, 0.95] },
        },
        {
          id: "emmc", label: "eMMC storage", line: "64 GB eMMC 5.1 holds the operating system.",
          role: "memory", shape: "box", size: [12, 1.2, 12], pos: [38, BT + 0.6, 30], schematic: true, follow: "board",
          explode: { dir: [0, 1, 0], dist: 5, at: [0.45, 0.95] },
        },
        {
          id: "nor", label: "NOR flash", line: "Two small boot chips: 64 MB boot and 8 MB key.",
          role: "memory", shape: "box", size: [5, 1, 4], pos: [-44, BT + 0.5, 33], count: 2, at: [[0, 0, -3.5], [0, 0, 3.5]],
          follow: "board", explode: { dir: [0, 1, 0], dist: 5, at: [0.45, 0.95] },
        },
        {
          id: "pmic", label: "Power chips", line: "Small regulators; part count and numbers not published.",
          role: "power", tone: "graphite", shape: "box", size: [6, 1.2, 6], pos: [0, BT + 0.6, 30], count: 5, at: pmicX.map((x) => [x, 0, 0]),
          schematic: true, follow: "board", explode: { dir: [0, 1, 0], dist: 5, at: [0.45, 0.95] },
        },
        {
          id: "inductors", label: "Inductor row", line: "Ten power inductors along the rear edge; count is schematic.",
          role: "power", tone: "graphite", shape: "box", size: [5, 2, 5], pos: [0, BT + 1, -37], count: 10, at: inductorX.map((x) => [x, 0, 0]),
          schematic: true, follow: "board", explode: { dir: [0, 1, 0], dist: 5, at: [0.45, 0.95] },
        },
        {
          id: "caps", label: "Capacitors", line: "A row of polymer capacitors on the front edge; schematic.",
          role: "memory", tone: "matte", shape: "box", size: [3.2, 1.8, 3.2], pos: [0, BT + 0.9, 38.5], count: 9, at: capX.map((x) => [x, 0, 0]),
          schematic: true, follow: "board", explode: { dir: [0, 1, 0], dist: 5, at: [0.45, 0.95] },
        },
        {
          id: "screws", label: "Mounting screws", line: "Four screws fix the module to the carrier; schematic.",
          role: "structure", tone: "nickel", shape: "cyl", size: [3, 1, 3], pos: [0, BT + 0.5, 0], count: 4, at: screwAt, schematic: true,
          follow: "board", explode: { dir: [0, 1, 0], dist: 8, at: [0.45, 0.95] },
        },
        {
          id: "plate", label: "Thermal plate", line: "Silver plate over the chip; it touches the heatsink.",
          role: "cooling", tone: "silver", shape: "slab", size: [96, 2, 84], pos: [0, BT + SOC.h + 1, 0], schematic: true, xray: true,
          explode: { dir: [0, 1, 0], dist: 30, at: [0.2, 0.7] },
        },
      ],
      flows: [
        { from: "lpddr5", to: "soc", label: "204.8 GB/s shared by CPU and GPU", speed: 1 },
        { from: "b2b-699", to: "soc", label: "699 pins carry USB, PCIe, Ethernet and CSI", speed: 0.5 },
      ],
      callouts: [
        { part: "board", title: "The module", text: "A 100 by 87 mm board holds the whole computer." },
        { part: "lpddr5", title: "Shared memory", text: "64 GB LPDDR5, 204.8 GB/s, used by CPU and GPU together." },
        { part: "b2b-699", title: "699 pins", text: "One connector carries every signal to the carrier board." },
        { part: "emmc", title: "On-board storage", text: "64 GB eMMC holds the operating system." },
        { part: "plate", title: "Heat path", text: "A thermal plate with heatpipe moves heat to the heatsink." },
      ],
    },
    {
      id: "die",
      title: "Orin die",
      parentPart: "soc",
      parts: [
        {
          id: "substrate", label: "Package base", line: "Green substrate under the die; size not published.",
          role: "structure", tone: "pcb-green", shape: "slab", size: [SUB.s, SUB.h, SUB.s], pos: [0, SUB.h / 2, 0], schematic: true,
        },
        {
          id: "lid-wall", label: "Lid walls", line: "Silver rim of the package lid; schematic.",
          role: "structure", tone: "silver", shape: "frame", wall: 3, size: [SUB.s, 3, SUB.s], pos: [0, SUB.h + 1.5, 0], schematic: true,
          xray: true, explode: { dir: [0, 1, 0], dist: 16, at: [0.1, 0.6] },
        },
        {
          id: "lid-top", label: "Package lid", line: "Silver lid; it opens here to show the die.",
          role: "structure", tone: "silver", shape: "slab", size: [SUB.s, 0.8, SUB.s], pos: [0, SUB.h + 3.4, 0], schematic: true, xray: true,
          explode: { dir: [0, 1, 0], dist: 26, at: [0, 0.5] },
        },
        {
          id: "die-base", label: "Orin die", line: "One die; size and transistor count not published.",
          role: "structure", tone: "die-colour", shape: "slab", size: [DIE.s, DIE.h, DIE.s], pos: [0, SUB.h + DIE.h / 2, 0], schematic: true,
        },
        {
          id: "cpu-cluster", label: "CPU cluster", line: "Three clusters of four Arm cores, 2 MB L3 each.",
          role: "compute", shape: "box", size: [5.6, 0.12, 5], pos: [0, BLK_Y, -7], count: 3, at: clusterX.map((x) => [x, 0, 0]),
          schematic: true, explode: { dir: [0, 1, 0], dist: 0.8, spread: 0.1, at: [0.15, 0.75] },
        },
        {
          id: "cpu-core", label: "Cortex-A78AE core", line: "Twelve cores, 256 KB L2 each, up to 2.2 GHz.",
          role: "compute", shape: "box", size: [2.2, 0.1, 2], pos: [0, BLK_TOP + 0.05, 0], count: 12, at: coreAt, glow: true,
          schematic: true, follow: "cpu-cluster", explode: { dir: [0, 1, 0], dist: 0.6, spread: 0.1, at: [0.15, 0.75] },
        },
        {
          id: "gpc", label: "GPC", line: "Two graphics processing clusters, four TPCs each.",
          role: "compute", shape: "box", size: [9.2, 0.12, 7.6], pos: [0, BLK_Y, 0.2], count: 2, at: gpcX.map((x) => [x, 0, 0]),
          schematic: true, xray: true, explode: { dir: [0, 1, 0], dist: 0.8, spread: 0.1, at: [0.15, 0.75] },
        },
        {
          id: "sm", label: "SM", line: "Sixteen SMs: 2,048 CUDA cores and 64 tensor cores.",
          role: "compute", shape: "box", size: [2, 0.1, 3.4], pos: [0, BLK_TOP + 0.05, 0], count: 16, at: smAt, glow: true,
          schematic: true, follow: "gpc", explode: { dir: [0, 1, 0], dist: 0.6, spread: 0.1, at: [0.15, 0.75] },
        },
        {
          id: "dla", label: "DLA", line: "Two NVDLA engines, 105 sparse TOPS in total.",
          role: "compute", shape: "box", size: [4.2, 0.12, 4], pos: [0, BLK_Y, 7.2], count: 2, at: [[-7.2, 0, 0], [-2.6, 0, 0]],
          glow: true, schematic: true, explode: { dir: [0, 1, 0], dist: 1, at: [0.2, 0.8] },
        },
        {
          id: "pva", label: "Vision engine", line: "One PVA with 2 MB of SRAM for camera pipelines.",
          role: "compute", shape: "box", size: [4, 0.12, 4], pos: [2.2, BLK_Y, 7.2], schematic: true,
          explode: { dir: [0, 1, 0], dist: 1, at: [0.2, 0.8] },
        },
        {
          id: "nvenc", label: "NVENC encoder", line: "One hardware video encoder.",
          role: "compute", shape: "box", size: [2.2, 0.12, 4], pos: [6.2, BLK_Y, 7.2], schematic: true,
          explode: { dir: [0, 1, 0], dist: 1, at: [0.2, 0.8] },
        },
        {
          id: "nvdec", label: "NVDEC decoder", line: "One hardware video decoder.",
          role: "compute", shape: "box", size: [2.2, 0.12, 4], pos: [8.6, BLK_Y, 7.2], schematic: true,
          explode: { dir: [0, 1, 0], dist: 1, at: [0.2, 0.8] },
        },
        {
          id: "memctl", label: "Memory controllers", line: "Strips on the DRAM-facing edges; the count is not published.",
          role: "interconnect", shape: "box", size: [1, 0.12, 19], pos: [0, BLK_Y, 0], count: 2, at: [[-10.4, 0, 0], [10.4, 0, 0]],
          schematic: true, explode: { dir: [1, 0, 0], dist: 1.6, spread: 0.02, at: [0.25, 0.85] },
        },
        {
          id: "pcie-ctl", label: "PCIe controllers", line: "Seven PCIe controllers along the rear edge.",
          role: "io", shape: "box", size: [2.4, 0.12, 0.9], pos: [0, BLK_Y, -10.4], count: 7, at: pcieAt,
          explode: { dir: [0, 0, -1], dist: 1.6, at: [0.25, 0.85] },
        },
        {
          id: "csi-links", label: "CSI links", line: "Six camera links along the front edge.",
          role: "io", shape: "box", size: [2.4, 0.12, 0.9], pos: [0, BLK_Y, 10.4], count: 6, at: csiAt,
          explode: { dir: [0, 0, 1], dist: 1.6, at: [0.25, 0.85] },
        },
      ],
      flows: [
        { from: "sm", to: "die-base", label: "GPU: 170 sparse INT8 TOPS (85 dense)", speed: 1 },
        { from: "dla", to: "die-base", label: "Two DLAs: 105 sparse TOPS (52.5 dense)", speed: 0.7 },
        { from: "cpu-core", to: "die-base", label: "12 cores, 256 KB L2 each, 2 MB L3 per cluster", speed: 0.5 },
      ],
      callouts: [
        { part: "die-base", title: "The claim", text: "275 sparse INT8 TOPS; dense is 137.5." },
        { part: "sm", title: "Ampere GPU", text: "2,048 CUDA cores and 64 tensor cores do the model math." },
        { part: "cpu-cluster", title: "12 CPU cores", text: "Three clusters of four Arm cores, up to 2.2 GHz." },
        { part: "dla", title: "Two DLAs", text: "Fixed-function engines give 105 sparse TOPS in total." },
        { part: "pva", title: "Vision engine", text: "A vision accelerator for camera pipelines, 2 MB of SRAM." },
      ],
    },
  ],
  glossary: [
    ["SoC", "system on chip; CPU, GPU and other engines on one die."],
    ["Module", "a small board with the SoC, memory and power parts."],
    ["Carrier board", "the larger board that gives the module ports and power."],
    ["LPDDR5", "low-power DRAM used in phones and edge devices."],
    ["eMMC", "flash storage soldered to a board."],
    ["DLA", "deep learning accelerator; a fixed engine for neural network layers."],
    ["PVA", "programmable vision accelerator for image processing."],
    ["TOPS", "trillions of operations per second."],
    ["Sparse vs dense", "sparse TOPS assume many weights are zero and skipped; dense is half here."],
    ["GPC, TPC, SM", "GPU building blocks, from cluster down to streaming multiprocessor."],
    ["PCIe", "fast link for add-in cards and drives."],
    ["CSI", "camera serial interface."],
  ],
  notPublished: [
    "Die size, transistor count and foundry node (reported as 8 nm, unverified).",
    "DRAM chip vendor, part numbers and chip count; eight chips are drawn.",
    "Power chip part numbers and counts.",
    "Dev kit outline, heatsink fin count and fan details.",
    "Die floor plan; the block layout is schematic, counts come from the datasheet.",
    "275 TOPS is a sparse INT8 peak, not a measured result.",
    "Tokens per second for 7B and 13B models.",
  ],
  sourcesPath: "details/nvidia-jetson-orin.md",
};
