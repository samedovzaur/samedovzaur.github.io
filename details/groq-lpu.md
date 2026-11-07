# Groq LPU (GroqChip 1, Groq, 2020 paper, 2022 products)

Slug: groq-lpu. Written: 2026-10-27. Researcher: Claude (Sonnet 5.5 research agent). Status: draft, numbers verified against the sources listed at the end.

## 1. What it is (3 sentences, plain words)

The Groq LPU is an AI inference chip. Groq's papers call the first chip the Tensor Streaming Processor (TSP); the product is the GroqChip 1. It has no external DRAM: all 230 MB of its memory is SRAM on the die, and a compiler schedules every instruction and every data move before the program runs, so timing never varies.

## 2. Why it is in this gallery (1 to 2 sentences; the owner's interest, given in the brief)

The owner studies inference serving. This chip shows the extreme end of the trade-off: keep all weights in SRAM spread over hundreds of chips (576 chips for one Mixtral deployment, S7), versus a GPU that holds the weights in HBM (one 80 GB H100 can hold that model, S7).

## 3. Hero facts (exactly 3, each one number with unit and source id)
- 230 MB of on-die SRAM per chip, and no external memory (S3).
- Up to 80 TB/s of on-die memory bandwidth per chip (S3).
- 576 chips linked to serve one Mixtral deployment, because one chip cannot hold a useful model (S7).

## 4. Teardown tree (the 3D model is built from this; keep shapes schematic, counts and hierarchy real)
Levels: 3. Level 1 is the GroqCard as it ships (one GroqChip on a PCIe card). Each level answers "what is inside X?".

Layout note for level 2: the east-west order of the units, from the west edge to the east edge, is MXM, SXM, MEM, VXM, MEM, SXM, MXM (S6 slide 19; S1 Sec. III). The VXM sits in the middle. The ICU (instruction control) is a tile in every slice, not a separate block (S1). The exact positions of the C2C and PCIe blocks on the die are not published, so the model shows them as schematic edge strips.

| Level | Part id | Parent | Count | Role (compute, memory, io, power, cooling, structure, interconnect) | Material and colour | Shape hint (box, rbox, cyl, grid, fan, wafer, slab) | Relative size and position (plain words) | Enter (opens which level) |
|---|---|---|---|---|---|---|---|---|
| 1 | groqcard | root | 1 | structure | Dark PCB with a metal shroud, graphite | slab | Dual-width, full-height, three-quarter-length PCIe card (S4). Whole device. | 2 (via groqchip) |
| 1 | groqchip | groqcard | 1 | compute | Silicon die under a package lid, silver | rbox | Small square in the middle of the card, under the heat sink. Die is 25 x 29 mm (S1). | 2 |
| 1 | heatsink | groqcard | 1 | cooling | Aluminium fins, silver | grid | Large block over the chip. It takes most of the card's width (S2 Fig. 5). | none |
| 1 | pcie_edge | groqcard | 1 | io | Gold fingers on PCB, gold | slab | Thin strip on the bottom edge. PCIe Gen4 x16 (S4). | none |
| 1 | c2c_ports | groqcard | 11 | interconnect | Cable connectors, black | box | Row of small ports on the card end. Count is 11 on the GC1-010B SKU, 9 on GC1-0109, 0 on GC1-0100 (S4). | none |
| 1 | dram | groqcard | 0 | memory | Not present | box | Absent on purpose. The model shows an empty, ghosted slot where DRAM would go. | none |
| 2 | mem_west | groqchip | 44 | memory | SRAM slices, blue | grid | Second block in from the west edge. 44 thin slices, each 2.5 MiB (S1). | 3 |
| 2 | mem_east | groqchip | 44 | memory | SRAM slices, blue | grid | Mirror of mem_west, east of the VXM. 44 slices (S1). | 3 |
| 2 | vxm | groqchip | 1 | compute | Vector ALU strip, orange | slab | Narrow centre strip. 16 ALUs in each of 320 lanes, 5,120 in total (S6). | 3 |
| 2 | mxm_west | groqchip | 2 | compute | Matrix MAC planes, red | grid | Outermost block on the west edge. Two 320 x 320 planes (S1). | 3 |
| 2 | mxm_east | groqchip | 2 | compute | Matrix MAC planes, red | grid | Outermost block on the east edge. Two 320 x 320 planes (S1). | 3 |
| 2 | sxm_west | groqchip | 1 | interconnect | Switch and reshape unit, green | slab | Between mxm_west and mem_west (S6 slide 19). | 3 |
| 2 | sxm_east | groqchip | 1 | interconnect | Switch and reshape unit, green | slab | Between mem_east and mxm_east (S6 slide 19). | 3 |
| 2 | icu | groqchip | 144 | structure | Instruction queues, grey | box | Drawn as a thin line along the north edge of each slice. 144 queues in total (S1). | none |
| 2 | c2c_io | groqchip | 16 | io | Serdes links, yellow | box | Schematic strip on the die edge. 16 links of 4 lanes at 30 Gbps (S1). Position not published. | none |
| 3 | superlane | groqchip | 20 | structure | Horizontal row across all slices, translucent | slab | One thin row cut across the whole die. 16 lanes wide (S1). | none |
| 3 | sl_mem_tile | superlane | 88 | memory | SRAM tile, blue | box | One tile per MEM slice in this row. 128 KiB per tile (derived: 2.5 MiB / 20 tiles). | none |
| 3 | sl_vxm_tile | superlane | 1 | compute | 4 x 4 ALU mesh per lane, orange | grid | Centre of the row. 16 lanes x 16 ALUs = 256 ALUs (derived from S1). | none |
| 3 | sl_mxm_cell | superlane | 4 | compute | 16 x 16 MAC supercell, red | grid | One supercell in each of the 4 planes. 256 MACs each (S1). | none |
| 3 | sl_sxm_tile | superlane | 2 | interconnect | Lane shifter and permuter, green | box | One in the west half, one in the east half (S1). | none |
| 3 | sl_streams | superlane | 64 | interconnect | Stream registers, white lines | cyl | Lines running east and west between all tiles. 32 east, 32 west (S1). | none |

Explode order (outer to inner, one line per part):
1. heatsink lifts up and away.
2. c2c_ports and pcie_edge slide out to the sides.
3. The empty dram slot fades in to show nothing is there.
4. groqchip lifts off the PCB, then the die opens into its floor plan (level 2).
5. mxm_west and mxm_east slide outward to the die edges.
6. sxm_west and sxm_east slide outward next.
7. mem_west and mem_east slide outward, which leaves the vxm in the centre.
8. One superlane row lifts out of the stack (level 3).

X-ray covers (parts that go transparent): heatsink, the groqchip package lid, the groqcard shroud, and on level 2 all slices except the one being inspected.

## 5. Flows (1 to 3 per level: real data or power paths with the real number)
| Level | From | To | What moves | Number (unit) | Source id |
|---|---|---|---|---|---|
| 1 | Host CPU | pcie_edge | Model load and run commands | up to 31.5 GB/s, as Groq prints it ("bi-directional") | S4 |
| 1 | groqchip | c2c_ports | Tensors to other chips, no switch | 480 GB/s chip total (16 links x 4 lanes x 30 Gbps x 2 directions = 3.84 Tb/s) | S1, S6 |
| 1 | Server power | groqcard | Electrical power | 240 W typical, 275 W TDP, 375 W max | S4 |
| 2 | mem_west and mem_east | vxm, mxm, sxm | Operand streams (east and west) | 20 TiB/s of stream bandwidth, assuming a 1 GHz clock | S1 |
| 2 | mem slices | mxm planes | Weight install, all 409,600 weights | fewer than 40 cycles | S1 |
| 2 | mem SRAM banks | stream registers | SRAM read and write bandwidth | 55 TiB/s, assuming a 1 GHz clock (Groq's product number is 80 TB/s, see S3) | S1, S6 |
| 3 | icu (instruction queue) | all 20 tiles of one slice | One instruction, issued north | 20 cycles to visit 20 tiles | S1 |
| 3 | sl_mem_tile | sl_mxm_cell | 16 streams of 16 bytes to install weights | 256 weights per cell per cycle | S1 |
| 3 | sl_streams | all tiles in the row | Data moves one hop each cycle, east or west | 32 B per lane per direction | S1 |

## 6. Callouts for the gallery (4 to 6 per level; title <= 3 words; text <= 12 words with one number)
| Level | Part id | Title | Text |
|---|---|---|---|
| 1 | groqchip | One chip | One GroqChip sits on the card; the die is 25 x 29 mm. |
| 1 | dram | No DRAM | Nothing external: all 230 MB of memory is on the die. |
| 1 | c2c_ports | Direct links | Up to 11 chip-to-chip ports, no network switch needed. |
| 1 | pcie_edge | Host link | PCIe Gen4 x16 connects the card to its server. |
| 1 | groqcard | Card power | The card draws 240 W typical. |
| 2 | mem_west | SRAM slices | 88 slices in two halves hold 220 MiB in total. |
| 2 | mxm_west | Matrix units | Four 320 x 320 planes hold 409,600 weights. |
| 2 | vxm | Vector strip | 5,120 vector ALUs sit in the centre of the die. |
| 2 | sxm_west | Switch units | Two units reshape and move data, one per half. |
| 2 | icu | Instruction queues | 144 queues feed the slices from a software schedule. |
| 2 | groqchip | Fixed timing | No caches, no arbiters: every run takes the same time. |
| 3 | superlane | Superlane | 20 superlanes, each 16 lanes wide, make 320 lanes. |
| 3 | sl_mem_tile | Memory tiles | Each row has 88 SRAM tiles of 128 KiB. |
| 3 | sl_mxm_cell | MAC cells | Each row holds four 16 x 16 cells, 1,024 MACs. |
| 3 | sl_vxm_tile | Vector mesh | Each lane has a 4 x 4 mesh: 16 ALUs. |
| 3 | sl_streams | Stream registers | 32 east and 32 west streams carry all data. |

## 7. Glossary (every technical word used above, one line each, own words)
- LPU: Language Processing Unit, Groq's marketing name for its chip.
- TSP (Tensor Streaming Processor): the name of the architecture in Groq's research papers.
- GroqChip: the first product chip built on the TSP design.
- SRAM: fast memory made of transistors on the same die as the logic. It is small but quick.
- DRAM: memory in separate chips that must be refreshed. It is bigger and slower than SRAM.
- HBM: stacks of DRAM placed next to a GPU die. It gives high bandwidth with large capacity.
- TOPS: trillions of operations per second.
- int8: whole numbers stored in 8 bits.
- fp16: decimal numbers stored in 16 bits.
- MACC (multiply-accumulate): multiply two numbers and add the result to a running total.
- Deterministic: the same program takes exactly the same number of cycles every time.
- Compiler-scheduled: the compiler decides when each instruction and data move happens, before the run.
- Arbiter: hardware that picks which of several requests goes first. The TSP has none.
- Cache: small fast memory that guesses what you will need. The TSP has none.
- Functional slice: a column of identical tiles that does one job, such as memory or matrix math.
- Tile: one small block of a slice, 16 lanes wide.
- Lane: one byte-wide data path that runs across the chip. The chip has 320.
- Superlane: a row of 16 lanes that cuts through every slice. It is the smallest unit of work.
- Stream: a vector of data that moves east or west one hop per cycle.
- Stream register: a register that holds a stream between two slices.
- ICU (instruction control unit): the part that fetches instructions and sends them north into a slice.
- VXM (vector execution module): ALUs for per-element math such as add, multiply and ReLU.
- MXM (matrix execution module): arrays of MACC cells for matrix multiply and convolution.
- SXM (switch execution module): moves and reshapes data inside the chip (shift, permute, transpose).
- MEM (memory slice): a slice of SRAM that reads and writes vectors on streams.
- Hemisphere: one half of the chip, east or west, around the central VXM.
- Supercell: a 16 x 16 block of MACC units, one per superlane in each MXM plane.
- C2C (chip-to-chip) link: a direct wire link between two chips.
- RealScale: Groq's brand name for its C2C links.
- PCIe Gen4 x16: the standard host connection for a card in a server.
- GroqCard: one GroqChip on a PCIe card.
- GroqNode: a 4U server with eight GroqCards.
- GroqRack: a rack of nine GroqNodes, 72 chips.
- Dragonfly: a network layout with dense local groups joined by global links.
- Weights: the learned numbers of a model.
- KV cache: stored attention keys and values of past tokens during text generation.
- TDP: the power a cooler must be able to remove at sustained load.
- ECC (error-correcting code): extra bits that let hardware fix a flipped bit.

## 8. What is not public or uncertain (be explicit; the page must say "not published" rather than guess)
- Exact floor plan geometry (area, width and height of each unit): not published. Only the unit order is published (S6).
- Where the C2C and PCIe blocks sit on the die: not published.
- How the 144 instruction queues split across MEM, VXM, MXM and SXM slices: not published.
- Memory units: the first paper says 220 MiB (S1). 88 x 2.5 MiB = 220 MiB = about 230.7 MB in decimal. The product briefs say 230 MB (S3). These are the same capacity in two unit systems. Not a discrepancy.
- The 80 TB/s figure: Groq prints it (S3, S6) but does not show the derivation. The paper's SRAM bandwidth is 55 TiB/s at a 1 GHz clock (S1). At the 900 MHz product clock that is about 51 TB/s. The 80 TB/s derivation is not published.
- 750 TOPS: Groq prints "up to 750 TOPs" at 900 MHz (S3). Derived from S1: 409,600 MACCs x 2 ops x 0.9 GHz = about 737 TOPS. The paper gives 820 TOPS at 1 GHz (S1). Small gap to 750 is not explained.
- The 188 TFLOPS fp16 figure is exactly one quarter of the TOPS figure (S3). Groq does not state the method.
- Packaging type, die thickness, heat sink and PCB layer details: not published. Only the card form factor is (S4).
- Die size: 25 x 29 mm = 725 mm2 in the paper (S1). SemiAnalysis also says about 725 mm2 and names GlobalFoundries 14 nm (S7). Groq's own briefs say only "14nm" (S3). The foundry name comes from S7 and S8, not from a Groq spec sheet.
- Transistor count: 26.8 billion in the 2020 paper (S1). Not repeated in later Groq briefs.
- GroqRack figures: the 2022 paper describes a rack of 9 nodes x 8 TSPs = 72 chips (S2). Groq's current public spec sheet for GroqRack was not retrievable in this research. Rack power, size and bandwidth: not confirmed.
- Production deployments: the 576-chip count is from SemiAnalysis for Mixtral (S7) and from Next Platform for Llama 2 70B (S8, 574 chips used for compute, 576 linked). Groq has not published a per-model chip count.
- Weight-capacity arithmetic (derived, not published): a 70 B parameter model at int8 needs about 70 GB. 70 GB / 230 MB is about 304 chips for weights alone, before the KV cache and activations.
- Power: the chip brief lists max 300 W, TDP 215 W, average 185 W (S3). The card lists typical 240 W (S4). The split between chip and card overhead is not published.
- Later chips: Groq planned a 4 nm next generation (S7, S8). In December 2025 Groq announced a non-exclusive licence deal with Nvidia (S9). Nvidia showed a "Groq 3 LPU" in 2026, reported at about 500 MB SRAM (S9, secondary sources only). This page covers GroqChip 1 only. Later-chip numbers are unverified here.
- The original Groq PDF links (groq.com/wp-content/...) returned 404 on the access date. S1, S2 and S3 were read from Wayback or wow.groq.com copies.

## 9. Sources (numbered; official spec pages, whitepapers, reputable teardowns; include access date)
All accessed 2026-10-27.
- S1. Abts et al., "Think Fast: A Tensor Streaming Processor (TSP) for Accelerating Deep Learning Workloads," ISCA 2020. Groq-hosted PDF (original URL groq.com/wp-content/uploads/2024/02/2020-Isca.pdf, read through web.archive.org). Used for: superlane, 320 lanes, 220 MiB, 44 MEM slices per hemisphere, 4 MXM planes, 144 queues, 25 x 29 mm, 14 nm, 900 MHz, 20 TiB/s, 55 TiB/s, 26.8B transistors.
- S2. Abts et al., "A Software-defined Tensor Streaming Multiprocessor for Large-scale Machine Learning," ISCA 2022. https://wow.groq.com/isca-2022-paper/. Used for: 7 local plus 4 global links, 8 chips per node, 9 nodes per rack, 10,440 TSPs, 2 TB global SRAM, PCIe card with heat sink.
- S3. Groq, "GroqChip Processor Product Brief and Spec Sheet v1.5" (2022). Read through web.archive.org copy of groq.com/wp-content/uploads/2022/10/. Used for: 14 nm, 230 MB, 80 TB/s, 750 TOPS, 188 TFLOPS, 16 C2C links, PCIe Gen4 x16, power.
- S4. Groq, "GroqCard Accelerator Product Brief and Spec Sheet v1.5." https://wow.groq.com/groqcard-accelerator/. Used for: form factor, 11 / 9 / 0 C2C SKUs, 31.5 GB/s, 240 W typical.
- S5. Groq, "GroqNode Server (GN1-B8C) Product Spec Sheet v1.5." https://wow.groq.com/groqnode-server/. Used for: 8 cards, 1.76 GB SRAM, 640 TB/s, 4U, 2 x AMD EPYC 7313, 1 TB DDR4 host memory.
- S6. Abts, "Hot Chips 34: Groq, from chips to systems architectural overview," August 2022. https://hc34.hotchips.org/assets/program/conference/day2/Machine%20Learning/HotChips34%20-%20Groq%20-%20Abts%20-%20final.pdf. Used for: unit order MXM, SXM, MEM, VXM, MEM, SXM, MXM; 5,120 ALUs; 80 TB/s; 480 GB/s; 55 TB/s.
- S7. SemiAnalysis, "Groq Inference Tokenomics: Speed, But At What Cost?" February 2024 (free preview text; the rest is paywalled). https://newsletter.semianalysis.com/p/groq-inference-tokenomics-speed-but. Used for: about 725 mm2, GlobalFoundries 14 nm, 576 chips for Mixtral, Marvell ASIC service, H100 comparison.
- S8. Next Platform, "Groq Says It Can Deploy 1 Million AI Inference Chips In Two Years," 2023-11-27. https://www.nextplatform.com/2023/11/27/groq-says-it-can-deploy-1-million-ai-inference-chips-in-two-years/. Used for: 576 linked chips, Llama 2 70B, 300 tokens per second claim, next-generation 4 nm plan.
- S9. Secondary coverage of the December 2025 Nvidia and Groq licence and the 2026 Groq 3 LPU (SDxCentral, Spheron, 3DTested, found by web search, not read in full). Context only. Not used for any GroqChip 1 number.
