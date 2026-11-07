# Blackhole p150a AI accelerator card (Tenstorrent, 2024)

Slug: tenstorrent-blackhole. Written: 2026-10-27. Researcher: Claude (Sonnet 5.5) research agent. Status: draft, numbers verified against the sources listed at the end.

## 1. What it is (3 sentences, plain words)
Blackhole is an AI chip from Tenstorrent, sold as a PCIe card (p100a, p150a, p150b). The die holds a grid of Tensix cores, each with five tiny RISC-V CPUs, a matrix unit and 1.5 MB of SRAM, plus 16 big 64-bit RISC-V CPUs that run Linux. Cards link to each other with Ethernet and run an open-source software stack (TT-Metalium), so no host GPU stack is needed. [S1, S2, S3, S5]

## 2. Why it is in this gallery (1 to 2 sentences; the owner's interest, given in the brief)
It is the only open-architecture AI chip in the gallery: RISC-V cores and an open-source software stack. The same engineers later founded Taalas, whose chip sits next to it in the gallery (see taalas-hardcore.md).

## 3. Hero facts (exactly 3, each one number with unit and source id)
- 140 Tensix cores on the die; 120 are enabled on the shipping p150a (Tenstorrent docs, 2026). [S1, S2]
- 664 TFLOPS Block FP8 on the p150a at 300 W board power (Tenstorrent docs; the 2024 Hot Chips figure for the full 140-core die is 745 TFLOPS). [S1, S2]
- 512 GB/s memory bandwidth from 32 GB of GDDR6 at 16 GT/s on a 256-bit bus. [S1, S2, S3]

## 4. Teardown tree (the 3D model is built from this; keep shapes schematic, counts and hierarchy real)
Levels: 3. Level 1 is the p150a card as it ships. Level 2 is the die floor plan. Level 3 is one Tensix core. Counts marked with a source id are real. Positions on the die are schematic; the exact floor plan is not published in text form (see section 8).

| Level | Part id | Parent | Count | Role (compute, memory, io, power, cooling, structure, interconnect) | Material and colour | Shape hint (box, rbox, cyl, grid, fan, wafer, slab) | Relative size and position (plain words) | Enter (opens which level) |
|---|---|---|---|---|---|---|---|---|
| 1 | bh-card | root | 1 | structure | dark PCB, black shroud | slab | Dual-slot PCIe card, 42 x 270 x 111 mm (S1, S2) | opens level 2 via bh-package |
| 1 | bh-package | bh-card | 1 | structure | black package, metal lid | rbox | Sits in the middle of the PCB under the cooler | opens level 2 |
| 1 | gddr6-chips | bh-card | 8 chips assumed from 256-bit bus; count not published | memory | black packages | box | Ring of chips around the package; 32 GB total on p150a (S1, S2) | none |
| 1 | qsfp-dd-ports | bh-card | 4 on p150a (S2) | interconnect | silver cages | box | Stacked on the rear bracket; 800G each, passive cables up to 2 m, link only to other Blackhole cards (S2) | none |
| 1 | pcie-edge | bh-card | 1 | io | gold contact fingers | slab | Bottom edge; PCIe 5.0 x16, 64 GB/s (S1, S2) | none |
| 1 | power-connector | bh-card | 1 | power | black plastic | box | One 12+4-pin 12V-2x6 connector on the card top edge (S2) | none |
| 1 | cooler | bh-card | 1 | cooling | black shroud, aluminium fins | fan | Active on p150a and p100a; p150b is passive (S2) | none |
| 2 | die-bh | bh-package | 1 | structure | grey silicon, 6 nm | wafer | One large die; area not published | opens level 3 via tensix-grid |
| 2 | tensix-grid | die-bh | 140 on die; 120 enabled on p150a (S1, S2) | compute | blue tiles in a rectangle | grid | Middle of the die; the HC24 slide shows a 14 x 10 layout (S1; layout from one secondary summary, see section 8) | opens level 3 |
| 2 | big-riscv | die-bh | 16 (4 clusters of 4) (S1, S2) | compute | orange | grid | Block on the die edge; 64-bit, dual-issue, in-order; runs Linux (S1) | none |
| 2 | big-riscv-cache | big-riscv | L1 32 KB I + 32 KB D, L2 128 KB, L3 2 MB, all per CPU (S1) | memory | light orange | box | Inside each big core | none |
| 2 | dram-controllers | die-bh | count not published | memory | teal | box | Along one die edge, towards the GDDR6 chips; 256-bit bus (S2) | none |
| 2 | eth-cores | die-bh | 10 x 400 Gbps per HC24 (S1); 4 x 800G ports on card (S2) | interconnect | purple | box | Row along the top of the die (S1, S3) | none |
| 2 | pcie-core | die-bh | 1 | io | gold | box | Die edge, towards the card edge; Gen5 x16 (S1) | none |
| 2 | noc | die-bh | 2 NoCs, 2D torus, 64 B link, 83 GB/s per link (S1) | interconnect | thin white lines | grid | Overlay across all tiles; NoC 0 and NoC 1 run in opposite directions (S1, S4) | none |
| 2 | baby-riscv-total | die-bh | 752 on die (S1) | compute | blue dots | grid | Spread over Tensix, DRAM, Ethernet and PCIe tiles | none |
| 3 | tensix-core | tensix-grid | 1 (140 on die) | compute | blue tile | rbox | One tile of the grid | opens level 3 |
| 3 | tensix-riscv | tensix-core | 5 baby RISC-V (S1, S4) | compute | small blue squares | box | Row of five along the top: 2 data movement, unpack, math, pack (S4); 32-bit, FP32 and BF16 capable (S1) | none |
| 3 | tile-math | tensix-core | 1 | compute | bright blue | box | Matrix engine on 32 x 32 tiles (S1, S3) | none |
| 3 | vector-math | tensix-core | 1 | compute | cyan | box | Vector engine; 64-wide per HC24 slide (S1) | none |
| 3 | packer-unpacker | tensix-core | not published | interconnect | grey | box | Between SRAM and the math engines (S4) | none |
| 3 | l1-sram | tensix-core | 1.5 MB (S2, S4) | memory | teal | slab | Largest block in the tile | none |
| 3 | noc-routers | tensix-core | 2 (S1, S3) | interconnect | white | box | At the tile corners; one per NoC | none |

Explode order (outer to inner, one line per part):
1. cooler lifts off the package.
2. qsfp-dd-ports, power-connector and pcie-edge slide out from the card.
3. gddr6-chips lift off the PCB.
4. bh-package lid lifts to show the die.
5. bh-card PCB drops away.
6. die-bh separates into tensix-grid, big-riscv, dram-controllers, eth-cores, pcie-core.
7. One tensix-core lifts out and splits into tensix-riscv, tile-math, vector-math, packer-unpacker, l1-sram, noc-routers.

X-ray covers (parts that go transparent): cooler, bh-package lid, the noc overlay (to show the grid below).

## 5. Flows (1 to 3 per level: real data or power paths with the real number)
| Level | From | To | What moves | Number (unit) | Source id |
|---|---|---|---|---|---|
| 1 | gddr6-chips | bh-package | model weights and activations | 512 GB/s | S1, S2 |
| 1 | host (pcie-edge) | bh-package | commands and tensors | 64 GB/s (PCIe 5.0 x16) | S1 |
| 1 | qsfp-dd-ports | other Blackhole cards | tensor traffic between cards | 4 x 800 Gb/s | S2 |
| 2 | tensix-grid | tensix-grid (via noc) | tiles between cores | 83 GB/s per NoC link | S1 |
| 2 | dram-controllers | tensix-grid | weights from GDDR6 | 512 GB/s | S1 |
| 3 | l1-sram | tile-math | operand tiles via unpacker | 47 TB/s SRAM to NoC aggregate over the chip (HC24) | S1 |
| 3 | noc-routers | l1-sram | tile data in and out | 333 GB/s SRAM to NoCs per core (HC24) | S1 |

## 6. Callouts for the gallery (4 to 6 per level; title <= 3 words; text <= 12 words with one number)
| Level | Part id | Title | Text |
|---|---|---|---|
| 1 | bh-card | Open design | RISC-V cores and open TT-Metalium software; card costs $1,399. |
| 1 | gddr6-chips | Plain GDDR6 | 32 GB at 512 GB/s; no HBM stacks. |
| 1 | qsfp-dd-ports | Scale-out ports | 4 ports at 800G each link cards directly. |
| 1 | power-connector | One cable | 300 W board power through one 12V-2x6 connector. |
| 1 | cooler | Active cooling | p150a has a fan; p150b is passive for racks. |
| 1 | bh-package | Six nanometre | Hot Chips 2024 lists the process as 6 nm. |
| 2 | tensix-grid | The grid | 140 Tensix cores on die; 120 enabled on p150a. |
| 2 | big-riscv | Linux inside | 16 big RISC-V cores in 4 clusters run Linux. |
| 2 | noc | Two networks | Two 2D-torus NoCs run in opposite directions. |
| 2 | eth-cores | Chip-to-chip | 10 x 400 Gbps Ethernet on the die per Hot Chips. |
| 2 | pcie-core | Host link | PCIe 5.0 x16 gives 64 GB/s. |
| 2 | baby-riscv-total | 752 tiny CPUs | 752 small RISC-V cores sit on one chip. |
| 3 | tensix-riscv | Five CPUs | Five small RISC-V cores steer each Tensix core. |
| 3 | l1-sram | Local memory | 1.5 MB of SRAM per Tensix core. |
| 3 | tile-math | Tile engine | Matrix engine works on 32 x 32 tiles. |
| 3 | vector-math | Vector unit | Vector engine adds sort, shuffle and lookup operations. |
| 3 | noc-routers | Two routers | Each core joins both NoCs. |

## 7. Glossary (every technical word used above, one line each, own words)
- Tensix core: Tenstorrent's compute tile. It has five small CPUs, a matrix unit, a vector unit and local SRAM.
- RISC-V: an open instruction set. Anyone may build a CPU for it without a licence fee.
- Baby RISC-V: a small 32-bit core that mostly steers data and instructions, not heavy math.
- Big RISC-V: a full 64-bit core that can run Linux. Blackhole has 16. The docs name them SiFive X280.
- SiFive X280: a RISC-V CPU design with a vector unit from the company SiFive.
- SRAM: fast memory on the chip itself. Here it is called L1 and sits inside each Tensix core.
- GDDR6: graphics memory chips on the card, outside the die.
- GT/s: giga-transfers per second. It sets the memory pin speed.
- NoC: network on chip. A grid of routers that moves data between tiles.
- 2D torus: a grid whose edges wrap around, so any point has a short path to any other.
- Router: a small switch at a tile that forwards NoC packets.
- Tile (math): a 32 x 32 block of numbers that the matrix engine handles in one step.
- Matrix engine (FPU): hardware that multiplies matrices.
- Vector engine (SFPU): hardware that applies one operation to many values, such as sort or lookup.
- Packer and unpacker: units that convert data between SRAM and the math registers.
- Block FP8: an 8-bit floating-point format where a group of values shares one exponent.
- TFLOPS: trillions of floating-point operations per second.
- TBP: total board power, the most the whole card draws.
- QSFP-DD: a high-speed network connector. Blackhole uses it at 800G per port.
- Ethernet: the standard network protocol. Blackhole uses it directly between chips.
- PCIe 5.0 x16: the host slot link, 64 GB/s.
- TT-Metalium: Tenstorrent's open-source low-level programming model and runtime.
- Cache (L1, L2, L3): small fast memories next to a CPU. The big cores have all three.
- Passive cooling: a heatsink with no fan; the server fans must push air through it.

## 8. What is not public or uncertain (be explicit; the page must say "not published" rather than guess)
- Enabled core count conflicts between sources. Hot Chips 2024 and The Register (2025) say 140 Tensix; Tenstorrent docs (2026) say 120 for p100a, p150a and p150b. A secondary report says firmware v19.5.0 (Feb 2026) cut the p150 count from 140 to 120. This page shows 140 on die and 120 enabled. Not independently confirmed from a Tenstorrent statement.
- TFLOPS conflict. Docs: 664 Block FP8 (120 cores). Hot Chips 2024: 745 TFLOPS 8-bit and 372 to 373 BF16 (140 cores). The Register table: 774 FP8, 387 Block FP8, 194 FP16. Only the 120-core figure is current. Per-precision numbers for the 120-core card are not published.
- SRAM total: 180 MB at 120 cores (S2), 210 MB at 140 cores (S3), 241 MB on the whole chip per Hot Chips (S1). The Hot Chips total includes memory outside the Tensix L1s, such as caches.
- Process foundry is not stated in S1 (only "6nm"). TSMC is from the brief. One 2026 blog says Samsung; not verified.
- Die area: not published in any source I found.
- The Tensix grid layout (14 x 10, with one source saying 13 x 10 usable for compute) comes from secondary summaries, not from text I could verify.
- Ethernet: Hot Chips shows 10 x 400 Gbps on the die; the card has 4 x 800G QSFP-DD. The reviewer in S3 says 8 of 14 Ethernet cores are active. How the die ports map to the card ports is not published.
- GDDR6 chip count and controller count are not published. 8 chips is inferred from the 256-bit bus and is not a source figure.
- The X280 name comes from the Tenstorrent docs page; the Hot Chips slides say only "Big RISC-V". Some sources describe 16 cores as 4 clusters of 4.
- Vector engine width: the Hot Chips slide shows 64 beside the vector unit; the meaning (lane count) is not explained in text.
- Founder link to Taalas: stated in the owner's brief and in taalas-hardcore.md; not re-checked here against a primary source.
- Price: $999 p100a, $1,399 p150a, from S2. Prices may change.
- Physical placement of parts on the PCB and die is schematic.

## 9. Sources (numbered; official spec pages, whitepapers, reputable teardowns; include access date)
- S1. Tenstorrent, "Blackhole & TT-Metalium: The Standalone AI Computer and its Programming Model", Hot Chips 2024 slides. https://hc2024.hotchips.org/assets/program/conference/day1/88_HC2024.Tenstorrent.Jasmina.Davor.v7.pdf (accessed 2026-10-27). Numbers read from extracted slide text.
- S2. Tenstorrent docs, "Blackhole PCIe Cards". https://docs.tenstorrent.com/aibs/blackhole/ and https://docs.tenstorrent.com/aibs/blackhole/specifications.html (accessed 2026-10-27; the second page was only read via a search summary).
- S3. The Register, "Tenstorrent QuietBox tested", 2025-11-27. https://www.theregister.com/2025/11/27/tenstorrent_quietbox_review/ (accessed 2026-10-27).
- S4. Tenstorrent, tt-metal METALIUM_GUIDE.md (Tensix core structure). https://github.com/tenstorrent/tt-metal/blob/main/METALIUM_GUIDE.md (accessed 2026-10-27).
- S5. ServeTheHome, "Tenstorrent Blackhole and Metalium for Standalone AI Processing" (Hot Chips 2024 coverage). https://www.servethehome.com/tenstorrent-blackhole-and-metalium-for-standalone-ai-processing/ (accessed 2026-10-27).
- Not fetched: Chips and Cheese coverage, Tenstorrent product page text beyond the summaries above. Note that S2 values were obtained through a summarizing fetch tool and should be re-read once on the live page.
