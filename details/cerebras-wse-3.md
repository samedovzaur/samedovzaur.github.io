# Cerebras Wafer-Scale Engine 3 in the CS-3 system (Cerebras Systems, 2024)

Slug: cerebras-wse-3. Written: 2026-10-27. Researcher: Claude research agent. Status: draft, numbers verified against the sources listed at the end.

## 1. What it is (3 sentences, plain words)
The WSE-3 is one AI chip that uses almost a whole 300 mm silicon wafer. It holds 900,000 small cores and 44 GB of fast SRAM, all joined by an on-wafer network. It sits inside the CS-3, a water-cooled system that feeds it power and data.

## 2. Why it is in this gallery (1 to 2 sentences; the owner's interest, given in the brief)
It is the largest single chip ever made. The gallery shows what a wafer looks like when the wafer is the chip.

## 3. Hero facts (exactly 3, each one number with unit and source id)
- 46,225 mm2 of silicon, one chip, about 21.5 cm per side [S2].
- 4 trillion transistors and 900,000 AI cores on TSMC 5 nm [S1, S2].
- 44 GB on-chip SRAM at 21 PB/s memory bandwidth [S2, S4].

## 4. Teardown tree (the 3D model is built from this; keep shapes schematic, counts and hierarchy real)
Levels: 3. Level 1 is the CS-3 system as it ships. Level 2 is the wafer. Level 3 is one die and one core. Each level answers "what is inside X?".

| Level | Part id | Parent | Count | Role (compute, memory, io, power, cooling, structure, interconnect) | Material and colour | Shape hint (box, rbox, cyl, grid, fan, wafer, slab) | Relative size and position (plain words) | Enter (opens which level) |
|---|---|---|---|---|---|---|---|---|
| 1 | cs3-chassis | root | 1 | structure | sheet metal, dark grey | rbox | 15U rack-mount box; holds everything [S6] | none |
| 1 | engine-block | cs3-chassis | 1 | structure | machined metal, silver | slab | centre of the chassis; the wafer sits inside it | 2 |
| 1 | wafer | engine-block | 1 | compute | silicon, dark blue-grey | wafer | square wafer, about 21.5 cm per side, in the middle of the stack [S2] | 2 |
| 1 | cold-plate | engine-block | 1 | cooling | copper, orange | slab | on the wafer back side; micro-fins carry water [S3] | none |
| 1 | power-modules | engine-block | 300+ (number is "more than 300") | power | green boards with chips | grid | spread over the wafer, feed current straight down, above the wafer [S3] | none |
| 1 | connector-membrane | engine-block | 1 | io | flex membrane, gold | slab | thin layer between wafer and board; carries signals and power [S3] | none |
| 1 | pumps-and-fans | cs3-chassis | not published | cooling | metal and black plastic | fan | beside the engine block; redundant pumps [S5] | none |
| 1 | io-ports | cs3-chassis | 12 x 100 GbE as 4 x QSFP-DD [S7] | io | metal cages, silver | box | edge of the chassis; fibre connectivity at the top [S5] | none |
| 2 | die-grid | wafer | about 84 dies (secondary source, see section 8) [S7] | compute | silicon, blue | grid | 84 tiles in a rectangle covering the wafer | 3 |
| 2 | scribe-wires | wafer | between all dies | interconnect | metal wires, light line | grid | thin lines between tiles; cut in other chips, wired here [S3] | none |
| 2 | spare-cores | wafer | about 70,000 (970,000 physical minus 900,000 enabled) [S7] | compute | silicon, grey | grid | tiny spares inside every die; routed around faults [S3, S8] | none |
| 3 | core | die-grid | about 10,700 per die; 900,000 total [S1, S7] | compute | silicon, blue | rbox | one tile of a core grid; about 0.05 mm2 each [S3] | none |
| 3 | sram-slice | core | 1 per core | memory | silicon, teal | rbox | 48 KiB block, most of the core area [S7] | none |
| 3 | datapath | core | 1 per core | compute | silicon, orange | box | small block beside the SRAM; 8-way FP16 SIMD [S4, S7] | none |
| 3 | router | core | 1 per core | interconnect | silicon, purple | box | corner of the core; links to four neighbours [S3 via 2D mesh text] | none |
| 3 | mesh-links | core | 4 per core (one per neighbour) | interconnect | metal, light purple | grid | lines out of the router to the neighbouring cores | none |

Explode order (outer to inner, one line per part):
1. cs3-chassis lid opens, then pumps-and-fans and io-ports slide out.
2. engine-block lifts; cold-plate separates upward.
3. power-modules rise above the wafer.
4. connector-membrane separates below the wafer.
5. wafer stays in the centre; die-grid tiles spread slightly.
6. Inside one die, cores spread; inside one core, SRAM, datapath, router separate.

X-ray covers (parts that go transparent): cs3-chassis, engine-block, cold-plate, power-modules (to show the wafer); in level 3 the die-grid tiles around the chosen die.

## 5. Flows (1 to 3 per level: real data or power paths with the real number)
| Level | From | To | What moves | Number (unit) | Source id |
|---|---|---|---|---|---|
| 1 | power-modules | wafer | electric current, straight down | more than 20,000 A | S3 |
| 1 | wafer | cold-plate | heat into water | about 20 kW of heat | S3 |
| 1 | io-ports | wafer | data from outside | 1.2 Tb/s (12 x 100 GbE) | S7 |
| 2 | die | neighbouring die | data over scribe-line wires | same bandwidth as inside one die (no figure per link) | S3 |
| 2 | all cores | all SRAM | reads and writes | 21 PB/s memory bandwidth | S2, S4 |
| 2 | whole wafer fabric | whole wafer fabric | core to core messages | 214 Pb/s fabric bandwidth | S2 |
| 3 | sram-slice | datapath | operands | 48 KiB local memory per core; per-core bandwidth not published | S7 |
| 3 | router | neighbour router | messages on the 2D mesh | link width not verified (see section 8) | S3 |

## 6. Callouts for the gallery (4 to 6 per level; title <= 3 words; text <= 12 words with one number)
| Level | Part id | Title | Text |
|---|---|---|---|
| 1 | wafer | One chip | The chip is one 46,225 mm2 square of silicon. |
| 1 | power-modules | Power from above | Over 20,000 amps flow straight down into the wafer. |
| 1 | cold-plate | Water cooling | About 20 kW of heat leaves through a copper cold plate. |
| 1 | cs3-chassis | Whole system | The CS-3 draws about 23 kW. |
| 1 | io-ports | Wired out | 12 ports of 100 GbE link the wafer to the world. |
| 2 | die-grid | Tiled wafer | About 84 dies sit side by side on the wafer. |
| 2 | scribe-wires | Wired scribe lines | Wires cross the lines that are normally cut. |
| 2 | spare-cores | Built-in spares | About 70,000 extra cores exist to cover defects. |
| 2 | wafer | Core count | 900,000 AI cores work together on one fabric. |
| 2 | wafer | Fast memory | 44 GB of SRAM reads at 21 PB/s. |
| 3 | core | Tiny core | Each core covers only about 0.05 mm2. |
| 3 | sram-slice | Local memory | Each core owns 48 KiB of SRAM. |
| 3 | datapath | Wide math | Each core does 8 FP16 operations per step. |
| 3 | router | Mesh router | Each router talks to 4 neighbouring cores. |

## 7. Glossary (every technical word used above, one line each, own words)
- Wafer: a thin round slice of silicon. Many chips are normally cut from it.
- Die: one rectangular chip area on a wafer.
- Scribe line: the narrow gap between dies where a saw normally cuts. Cerebras puts wires there.
- Reticle: the mask area a chip tool can print in one shot. It limits normal die size.
- Core: a small compute unit with its own memory.
- SRAM: fast memory built from transistors on the same chip as the cores.
- Memory bandwidth: how much data the memory can read or write each second.
- Fabric: the network that joins the cores.
- Router: a small switch in each core. It passes messages between cores.
- 2D mesh: a grid network where each node links to its neighbours.
- SIMD: one instruction works on several numbers at once.
- FP16: a 16-bit floating point number format used in AI.
- Sparse: counting only the non-zero values. Dense counts all values. Sparse peak numbers are higher.
- PFLOPS: 10^15 floating point operations per second.
- Redundancy: spare parts that take over when a part has a defect.
- Cold plate: a metal plate with water channels that carries heat away.
- Vertical power delivery: power comes in from directly above the chip, not from its edges.
- VRM: voltage regulator module; turns incoming power into the chip voltage.
- TSMC 5 nm: the chip factory process used to make the WSE-3.
- GbE: gigabit Ethernet, a network link speed.
- MemoryX: Cerebras external memory box that stores model weights outside the wafer.

## 8. What is not public or uncertain (be explicit; the page must say "not published" rather than guess)
- 125 PFLOPS FP16 is a sparse peak. Cerebras states it as the peak AI figure. A dense number is not published. The Next Platform derives a dense figure about 10x lower by assuming 10x sparsity gain; that is an estimate, not a spec [S4, S9]. One paper lists 250 PFLOPS for CS-3 in a table. That conflicts with 125 and with Cerebras' announcement [S3].
- Die count: 84 dies and about 10,700 cores per die come from one secondary source [S7]. The Cerebras announcement, IEEE Spectrum and the arXiv paper do not state a die count. Treat as unverified.
- Spare cores: about 970,000 physical cores is from one secondary source [S7]. Cerebras does not publish it. Redundancy is confirmed only in words [S3, S8].
- Yield: no measured yield is published. The arXiv paper only gives its own model (46 defects per wafer) [S3].
- Power of the wafer alone: not published as a spec. The arXiv paper says "about 20 kW of heat from the wafer" and 23 kW per CS-3 [S3]. The same paper uses 46 kW in one table. Cerebras says only "same power as WSE-2" [S1, S2].
- Router ports, mesh link width and latency: not verified from a primary source. A secondary source says a five-port router with 32-bit links; it is not used in the numbers above.
- Per-core SRAM (48 KiB), 8-way FP16 SIMD, 0.05 mm2 per core: from Klockwood and the arXiv paper, not from a Cerebras primary page [S3, S7]. 44 GB / 900,000 cores gives about 49 KB, which fits.
- Chassis part layout, pump count, fan count, exact connector parts: not published.
- Cerebras now sells a WSE-3 Turbo rated at 250 PFLOPS [S10]. This page covers the 2024 WSE-3 only.
- 21 PB/s memory bandwidth and 214 Pb/s fabric bandwidth come from the IEEE Spectrum article, which gives units without the words "SRAM" or "sparse".

## 9. Sources (numbered; official spec pages, whitepapers, reputable teardowns; include access date)
- S1. Cerebras press release, "Cerebras Announces Third Generation Wafer Scale Engine", 2024-03-13. https://www.cerebras.ai/press-release/cerebras-announces-third-generation-wafer-scale-engine . Accessed 2026-10-27. (4 trillion transistors, 900,000 cores, 44 GB SRAM, 5 nm TSMC, 125 PFLOPS, 2,048 systems)
- S2. IEEE Spectrum, "Cerebras Unveils Its Next Waferscale AI Chip". https://spectrum.ieee.org/amp/cerebras-chip-cs3-2667497526 . Accessed 2026-10-27. (46,225 mm2, 21 PB/s, 214 Pb/s)
- S3. arXiv 2503.11698, "A Comparison of the Cerebras Wafer-Scale Integration Technology with Nvidia GPU-based Systems for AI". https://arxiv.org/html/2503.11698v1 . Accessed 2026-10-27. (scribe-line wires, 20,000 A, 300+ VRMs, water cooling, 23 kW, 0.05 mm2 per core, defect model)
- S4. The Next Platform, "Cerebras Goes Hyperscale With Third Gen Waferscale Supercomputers", 2024-03-14. https://www.nextplatform.com/ai/2024/03/14/cerebras-goes-hyperscale-with-third-gen-waferscale-supercomputers/1642584 . Accessed 2026-10-27. (8-wide FP16 SIMD, 21 PB/s, sparse vs dense)
- S5. ServeTheHome, "Cerebras WSE-3 AI Chip Launched 56x Larger than NVIDIA H100". https://www.servethehome.com/?p=76637 . Accessed 2026-10-27. (liquid cooling, redundant pumps, MTP/MPO fibre at top)
- S6. Introl, Cerebras CS-3 guide (15U form factor). https://introl.com/zh/blog/cerebras-wafer-scale-engine-cs3-alternative-ai-architecture-guide-2025 . Accessed 2026-10-27. Secondary; the 15U figure is not confirmed by a primary source.
- S7. Glenn Klockwood, Cerebras notes. https://www.glennklockwood.com/garden/cerebras . Accessed 2026-10-27. (48 KiB SRAM, 84 dies, about 10,700 cores per die, 970,000 physical cores, 12 x 100 GbE). Secondary; the author's own notes.
- S8. Cerebras chip page. https://www.cerebras.ai/chip/ . Accessed 2026-10-27. (redundant cores and routing, fail-in-place; this page now describes WSE-3 Turbo)
- S9. Cerebras CS-3 datasheet footnote on sparsity, as quoted by flopper.io. https://flopper.io/system/cerebras-cs-3 . Accessed 2026-10-27. (FLOPS shown as sparse, unstructured)
- S10. ServeTheHome, "Cerebras Intros Faster WSE-3 Turbo Processor and First Rack Scale CS-4 System". https://www.servethehome.com/cerebras-intros-faster-wse-3-turbo-processor-and-first-rack-scale-cs-4-system/ . Accessed 2026-10-27.
