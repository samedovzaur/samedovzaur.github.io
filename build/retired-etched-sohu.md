# Etched Sohu (Etched, 2024)

Slug: etched-sohu. Written: 2026-10-27. Researcher: Claude (Sonnet 5.5) research agent. Status: draft, numbers verified against the sources listed at the end. Etched has published few hard numbers. Every figure below is a company claim unless marked "derived" or "estimate".

## 1. What it is (3 sentences, plain words)

Sohu is a chip that runs only transformer models, such as Llama. Etched announced it in June 2024 and builds it on TSMC 4 nm (S3, S4). It has one very large matrix multiply engine and no general-purpose cores, so it is fast on transformer inference and cannot run much else (S2, S4, S5).

## 2. Why it is in this gallery (1 to 2 sentences; the owner's interest, given in the brief)

Zaur compares transformer-locked chips with GPUs and with model-in-silicon chips when he thinks about where inference goes next. Sohu sits in the middle: locked to one architecture, but not locked to one set of weights.

## 3. Hero facts (exactly 3, each one number with unit and source id)
- Etched claims 500,000 tokens per second on Llama 70B from one 8-chip server (FP8, no sparsity, 2,048 input and 128 output tokens). [S2, S4]
- Etched claims one 8-chip Sohu server replaces 160 Nvidia H100 GPUs. [S2, S3]
- 144 GB of HBM3 per chip, in six stacks, about 1.1 TB per 8-chip server. [S2] (S4 says HBM3E. See section 8.)

## 4. Teardown tree (the 3D model is built from this; keep shapes schematic, counts and hierarchy real)
Levels: 3. Level 1 is the whole server as it ships. Level 2 is one Sohu package and its die floor plan. Level 3 is one HBM3 stack. Counts of chips and stacks come from S2. All floor-plan geometry is schematic: Etched has not published a floor plan.

| Level | Part id | Parent | Count | Role (compute, memory, io, power, cooling, structure, interconnect) | Material and colour | Shape hint (box, rbox, cyl, grid, fan, wafer, slab) | Relative size and position (plain words) | Enter (opens which level) |
|---|---|---|---|---|---|---|---|---|
| 1 | server | none | 1 | structure | Dark metal chassis, grey | box | Full-width rack-unit box, the biggest part | none |
| 1 | sohu-module | server | 8 | compute | Green board, black package lid | rbox | Eight modules in two rows of four, middle of the chassis. Module layout is schematic (not published) | Level 2 |
| 1 | host-board | server | 1 | io | Green board, small chips | slab | Thin board at the front, links all modules. Contents not published | none |
| 1 | cooling-and-power | server | 1 | cooling | Silver fins, orange fans | fan | Fan wall at the back, power supply beside it. Specs not published | none |
| 2 | package | sohu-module | 1 | structure | Black lid on green substrate | slab | Square package, about the size of a hand | none |
| 2 | matmul-engine | package | 1 | compute | Bright blue silicon | grid | Biggest block, fills the centre of the die. Etched describes one large engine | none |
| 2 | sram | package | 1 | memory | Teal silicon | grid | Bands beside the engine. Size not published | none |
| 2 | control-logic | package | 1 | compute | Grey silicon | box | Small strip next to the engine (Etched says control logic is minimal) | none |
| 2 | hbm-controller | package | 6 | memory | Purple silicon | box | One small block per HBM stack, on the die edge facing the stack | none |
| 2 | host-interface | package | 1 | io | Yellow silicon | box | Small block on one edge of the die. Interface type not published | none |
| 2 | hbm-stack | package | 6 | memory | Dark grey stack, copper dots | box | Six tall stacks, three on each side of the compute die | Level 3 |
| 3 | base-die | hbm-stack | 1 | memory | Purple silicon | slab | Flat die at the bottom of the stack, holds the interface | none |
| 3 | dram-dies | hbm-stack | not published | memory | Grey silicon | slab | Thin dies stacked on the base die. Layer count not published | none |
| 3 | tsv-columns | hbm-stack | not published | interconnect | Copper | cyl | Thin vertical wires through all dies | none |

Explode order (outer to inner, one line per part):
1. Server lid and cooling-and-power lift away.
2. Host-board slides forward.
3. Eight Sohu modules separate.
4. Package lid lifts off one module.
5. Six HBM stacks move out from the compute die.
6. Compute die blocks separate: matmul-engine, sram, control-logic, hbm-controller, host-interface.
7. One HBM stack splits into base-die and DRAM dies.

X-ray covers (parts that go transparent): server lid, package lid, cooling-and-power, HBM stack outer shell (level 3).

## 5. Flows (1 to 3 per level: real data or power paths with the real number)
| Level | From | To | What moves | Number (unit) | Source id |
|---|---|---|---|---|---|
| 1 | server (8 chips) | clients | Generated tokens, Llama 70B, FP8. Etched claims | 500,000 (tokens/s) | S2, S4 |
| 1 | single Sohu module | server output | Share of the claim, derived by dividing 500,000 by 8. Not an Etched number | about 62,500 (tokens/s per chip) | S5 |
| 2 | HBM stacks | matmul-engine | Weights and KV cache. The Register estimates the peak | about 4 (TB/s per chip) | S2 |
| 2 | HBM stacks (all six) | on-chip memory | Capacity per chip | 144 (GB) | S2 |
| 3 | one HBM stack | hbm-controller | Share of the estimated chip bandwidth, derived by dividing 4 TB/s by 6 | about 0.67 (TB/s per stack) | S2 |
| 3 | DRAM dies | base-die | Capacity per stack, derived by dividing 144 GB by 6 | 24 (GB per stack) | S2 |

## 6. Callouts for the gallery (4 to 6 per level; title <= 3 words; text <= 12 words with one number)
| Level | Part id | Title | Text |
|---|---|---|---|
| 1 | server | Eight chips | Etched claims 500,000 tokens per second from one server. [S4] |
| 1 | sohu-module | 160 H100s | Etched claims one server replaces 160 H100 GPUs. [S2] |
| 1 | server | Big memory | Eight chips hold about 1.1 TB of HBM3 together. [S2] |
| 1 | server | Inference only | Etched's test used 2,048 input and 128 output tokens. [S4] |
| 1 | sohu-module | Not shipped (2024) | In June 2024 the chip had not taped out. [S2] |
| 2 | matmul-engine | One big engine | Etched says one large matrix engine, no general-purpose cores. [S4] |
| 2 | control-logic | Less control | Etched says dropping flexibility frees area for math. [S3] |
| 2 | hbm-stack | Six stacks | Six HBM3 stacks give 144 GB per chip. [S2] |
| 2 | hbm-controller | Bandwidth limit | The Register estimates about 4 TB/s, below H200 and Blackwell. [S2] |
| 2 | package | TSMC 4 nm | Etched builds Sohu on TSMC 4 nm; exact variant unclear. [S3, S6] |
| 3 | hbm-stack | 24 GB each | Derived: 144 GB over six stacks gives 24 GB. [S2] |
| 3 | base-die | Interface die | The base die connects the stack to the chip. Details not published. |
| 3 | dram-dies | Stacked DRAM | Layer count per stack is not published. |
| 3 | hbm-stack | Supply limit | The Register says HBM3 supply is constrained. [S2] |

## 7. Glossary (every technical word used above, one line each, own words)
- ASIC: a chip built for one job, not for general use.
- Transformer: the neural network design behind Llama, GPT and similar models.
- Inference: running a trained model to produce answers, not training it.
- Token: a small piece of text, about three quarters of a word, that a model reads or writes.
- Tokens per second: how many tokens a system produces each second.
- Llama 70B: an open language model with 70 billion weights.
- Matrix multiply engine: the circuit that multiplies large grids of numbers, the core work of a transformer.
- General-purpose core: a small processor that can run any program, as found in a GPU or CPU.
- HBM (high bandwidth memory): stacked DRAM placed next to the chip for very fast reads.
- HBM3 and HBM3E: two generations of HBM. The E version is faster.
- HBM stack: several DRAM dies on one base die, joined by vertical wires.
- Base die: the bottom die of an HBM stack, holding the interface logic.
- TSV (through-silicon via): a vertical copper wire through a die.
- SRAM: fast memory built into the chip itself, small but very quick.
- Memory controller: the circuit that reads and writes the memory.
- Host interface: the link between the chip and the server's main processor.
- Die: one piece of silicon cut from a wafer.
- Floor plan: the layout of blocks on a die.
- TSMC 4 nm: a chip manufacturing process from TSMC. N4 and N4P are variants.
- FP8: an 8-bit number format that saves memory and speeds up math.
- Sparsity: skipping zero values to save work. Etched says it did not use it in the benchmark.
- Batch size: how many requests the chip serves at the same time.
- KV cache: memory that stores past tokens' keys and values so the model need not recompute them.
- Bandwidth: how much data memory can move per second.
- Tape-out: the point when a chip design is sent to the factory.
- FLOPS utilization: the share of the chip's peak math speed that real work uses.
- Mixture of experts (MoE): a model design that sends each token to a few of many sub-networks.
- H100, H200, B200, GB200: Nvidia data-centre GPUs. B200 and GB200 are Blackwell.
- Model-in-silicon chip: a chip with one model's weights built into the hardware. Sohu is not one.

## 8. What is not public or uncertain (be explicit; the page must say "not published" rather than guess)
- Die size: not published. One secondary source says about 800 mm2 (reticle limit); that is unverified (S8).
- Transistor count: not published.
- On-chip SRAM size: not published.
- Power (TDP per chip or per server): not published. Etched says only that Sohu uses less energy than GPUs (S3).
- Die floor plan: not published. Section 4 is schematic.
- Clock speed, matmul engine size, number of compute units: not published.
- Host interface type and bandwidth, chip-to-chip links inside the server: not published.
- Server design (host CPU, NIC, cooling, size): not published.
- HBM3 or HBM3E: sources disagree. The Register says HBM3 in six stacks (S2). ComputerBase, citing Etched's announcement, says 144 GB of HBM3E (S4). This file uses HBM3 as in the brief.
- Memory bandwidth: not published by Etched. 4 TB/s is The Register's estimate (S2). A secondary source says about 4,800 GB/s (S8, unverified).
- HBM stack layer count and vendor: not published. SK Hynix joined a 2026 funding round (S8, secondary), but no supply link is confirmed.
- Process node: Etched's announcement says TSMC 4 nm. A 2026 Etched statement says A0 silicon returned from TSMC N4P (S6). Whether the 2024 and 2026 parts are the same design is not stated.
- FLOPS utilization: reported as over 90% in secondary coverage (S8). Not confirmed in a primary page I could read.
- 500,000 tokens per second: an Etched claim, at unpublished batch size, with no independent benchmark. A reviewer suspects batch 1 or near (S5). The Register quotes Etched's COO on batch sizes in the thousands (S2). These views conflict. Etched's comparison figures are about 23,000 tokens/s for an 8x H100 and 45,000 for a B200 server (S4).
- Per-chip 62,500 tokens/s is a division by this file's source S5, not an Etched figure.
- Model support: Etched says transformers only. A reviewer states MoE with dynamic routing, vision and diffusion do not run (S5). Etched's 2026 site text mentions trillion-parameter sparse MoEs at "80%+ Peak FLOPs" (S6). Whether that refers to Sohu is not stated. Treat model support as unclear.
- Status: June 2024, no tape-out, FPGA emulation only (S2). June 2026, Etched says A0 silicon was made and systems are in customer validation (S8, S6). August 2026, Etched says it shipped its first rack to Jane Street (S7). No independent benchmarks exist.
- Not found: SemiAnalysis and IEEE Spectrum pieces on Sohu did not surface in search. Etched's original announcement page was not fetchable (404 and a binary mirror), so its claims are taken from S2, S3 and S4.

## 9. Sources (numbered; official spec pages, whitepapers, reputable teardowns; include access date)
- S1. Etched, "Etched is Making the Biggest Bet in AI", 2024-06-25, announcement blog (original page returned 404; a mirror at gwern.net had no readable text). Not used directly. Accessed 2026-10-27.
- S2. Tobias Mann, The Register, 2024-06-26, https://www.theregister.com/2024/06/26/etched_asic_ai/ . Accessed 2026-10-27.
- S3. TechCrunch, 2024-06-25, https://techcrunch.com/2024/06/25/etched-is-building-an-ai-chip-that-only-runs-transformer-models . Accessed 2026-10-27.
- S4. ComputerBase, 2024-06, https://www.computerbase.de/2024-06/transformer-models-sohu-asic-von-etched-soll-20x-schneller-als-nvidia-h100-sein/ . Reports Etched's figures. Accessed 2026-10-27.
- S5. Spheron, "Etched AI Sohu vs Nvidia", https://www.spheron.network/blog/etched-ai-sohu-vs-nvidia-transformer-asic-inference/ . A GPU cloud vendor, so biased toward GPUs. Accessed 2026-10-27.
- S6. Etched homepage, https://www.etched.com . 2026 text on A0 silicon and N4P. Accessed 2026-10-27.
- S7. Etched, "From zero to one", 2026-08-18, https://www.etched.com/progress/from-zero-to-one . Accessed 2026-10-27.
- S8. Secondary summaries seen only as search snippets: fast.io "Etched AI Review 2026", aiwiki.ai "Etched Sohu", hostzealot.com. Unverified. Accessed 2026-10-27.
