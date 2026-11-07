# Apple M2 Pro system on a chip (Apple, 2023)

Slug: apple-m2-pro. Written: 2026-10-27. Researcher: Claude Sonnet 5.5 subagent. Status: draft, numbers verified against the sources listed at the end.

## 1. What it is (3 sentences, plain words)
The M2 Pro is a system on a chip. One piece of silicon holds the CPU, GPU, Neural Engine, media engine and memory controllers. It ships in the 14-inch and 16-inch MacBook Pro and the Mac mini, with LPDDR5 memory packages sitting beside it on the same substrate [S1][S2][S6].

## 2. Why it is in this gallery (1 to 2 sentences; the owner's interest, given in the brief)
It is the controller machine of Zaur's home cluster. He ships on-device classifiers to the Apple Neural Engine with Core ML and runs small models with MLX on unified memory.

## 3. Hero facts (exactly 3, each one number with unit and source id)
- 40 billion transistors on second-generation 5 nm silicon [S1].
- 200 GB/s of unified memory bandwidth, up to 32 GB shared by CPU, GPU and Neural Engine [S1][S2].
- 15.8 trillion operations per second from a 16-core Neural Engine [S1].

## 4. Teardown tree (the 3D model is built from this; keep shapes schematic, counts and hierarchy real)
Levels: 3. Level 1 is the logic board of the 14-inch MacBook Pro. Level 2 is the M2 Pro die. Level 3 is one performance core cluster (the Neural Engine is a named alternative; its internals are not published beyond "16-core").

| Level | Part id | Parent | Count | Role (compute, memory, io, power, cooling, structure, interconnect) | Material and colour | Shape hint (box, rbox, cyl, grid, fan, wafer, slab) | Relative size and position (plain words) | Enter (opens which level) |
|---|---|---|---|---|---|---|---|---|
| 1 | logic-board | root | 1 | structure | Green PCB, soldered parts | slab | Large flat board filling the lower case | none |
| 1 | soc-package | logic-board | 1 | compute | Grey metal-lid package on substrate | rbox | Centre of board, largest chip | Level 2 |
| 1 | lpddr5-package | logic-board | 4 on a 16 GB board (two each side of the SoC); count for 32 GB not confirmed | memory | Black epoxy packages (SK hynix on the teardown unit) | box | Small squares touching the SoC package edges | none |
| 1 | nand-package | logic-board | 2 on a 512 GB board (256 GB each) | memory | Black epoxy packages | box | Two chips near the board edge, apart from the SoC | none |
| 1 | tb-ports | logic-board | 3 Thunderbolt 4 ports | io | Silver metal USB-C shells | box | Along the left board edge | none |
| 1 | heatsink | logic-board | 1 (smaller than the 2021 model's) | cooling | Copper-coloured heat pipe and fin block | slab | Sits over the SoC, runs toward the two fans | none |
| 2 | die | soc-package | 1 | compute | Silicon, dark grey | slab | Square die under the package lid | Level 3 |
| 2 | p-cluster | die | 1 cluster of 8 performance cores with shared L2 | compute | Blue-grey block | grid | One large block on the CPU side of the die | Level 3 |
| 2 | e-cluster | die | 1 cluster of 4 efficiency cores with shared L2 | compute | Green-grey block | grid | Small block beside the P cluster | none |
| 2 | gpu | die | 1 GPU, 19 cores (up to) | compute | Orange block | grid | Largest area of the die | none |
| 2 | neural-engine | die | 1 engine, 16 cores | compute | Purple block | grid | Small block near the media engine | Level 3 |
| 2 | media-engine | die | 1 | compute | Pink block | rbox | Small block on the edge | none |
| 2 | slc | die | 1 system level cache, 24 MB (secondary source) | memory | Teal block | box | Sits between compute blocks and memory controllers | none |
| 2 | mem-ctrl | die | 256-bit LPDDR5 interface (channel split not published) | interconnect | Yellow strips | slab | Along the die edges facing the RAM packages | none |
| 3 | p-core | p-cluster | 8 | compute | Blue cubes | rbox | Row of cores around the shared L2 | none |
| 3 | p-l2 | p-cluster | 1 shared L2, 16 MB (secondary source) | memory | Light blue slab | slab | Block in the middle of the cluster | none |

Explode order (outer to inner, one line per part):
1. heatsink lifts off first.
2. lpddr5-package and nand-package slide away from the board.
3. soc-package lid lifts to show the die.
4. die separates from the substrate.
5. gpu, neural-engine, media-engine, slc and e-cluster spread out.
6. p-cluster opens into 8 p-core cubes and the shared L2.

X-ray covers (parts that go transparent): heatsink, soc-package lid, lpddr5-package, die outer layers (so the P cluster and Neural Engine show through).

## 5. Flows (1 to 3 per level: real data or power paths with the real number)
| Level | From | To | What moves | Number (unit) | Source id |
|---|---|---|---|---|---|
| 1 | lpddr5-package | soc-package | Weights and activations (unified memory) | 200 (GB/s) | S1 |
| 1 | tb-ports | soc-package | USB4 / Thunderbolt 4 data | 40 (Gb/s per port) | S2 |
| 2 | slc / mem-ctrl | gpu | GPU reads from DRAM, measured | over 200 (GB/s) | S3 |
| 2 | mem-ctrl | p-cluster | CPU reads from DRAM, measured | about 125 (GB/s) | S3 |
| 3 | p-l2 | p-core | Cache lines inside the cluster | not published | S8 |

## 6. Callouts for the gallery (4 to 6 per level; title <= 3 words; text <= 12 words with one number)
| Level | Part id | Title | Text |
|---|---|---|---|
| 1 | soc-package | One package | CPU, GPU and Neural Engine share one chip with 40 billion transistors. |
| 1 | lpddr5-package | Shared memory | Up to 32 GB of LPDDR5 serves every engine at 200 GB/s. |
| 1 | nand-package | Fewer NAND chips | The 512 GB board uses two 256 GB chips, down from four. |
| 1 | heatsink | Smaller heatsink | Apple shrank it versus 2021 as RAM packages moved closer. |
| 1 | tb-ports | Three ports | Each Thunderbolt 4 port carries up to 40 Gb/s. |
| 2 | p-cluster | Fast cores | Eight performance cores share one L2 cache of 16 MB. |
| 2 | e-cluster | Quiet cores | Four efficiency cores handle light work on a 4 MB L2. |
| 2 | gpu | Big GPU | Up to 19 cores; 6.5 TFLOPs FP32 measured. |
| 2 | neural-engine | ANE | Sixteen cores deliver 15.8 trillion operations per second. |
| 2 | slc | Shared cache | A 24 MB system level cache sits in front of DRAM. |
| 3 | p-core | Eight cores | Eight performance cores form the largest CPU block. |
| 3 | p-l2 | Shared L2 | Cores share 16 MB, up from 12 MB on M1 Pro. |
| 3 | neural-engine | Core ML picks | Core ML mixes CPU, GPU and ANE into one plan. |
| 3 | neural-engine | 64-byte rule | ANE buffers align their last axis to 64 bytes. |

## 7. Glossary (every technical word used above, one line each, own words)
- System on a chip: one die that holds the CPU, GPU and other engines together.
- Die: the cut piece of silicon that holds the circuits.
- Substrate: the small circuit board the die and memory packages sit on.
- Package: the chip body with its protective lid or epoxy.
- Transistor: the tiny switch that all digital logic is built from.
- 5 nm: the name of a chip manufacturing process (TSMC), not a literal feature size.
- Performance core: a fast CPU core for heavy work.
- Efficiency core: a slow, low-power CPU core for light work.
- Cluster: a group of cores that share a cache.
- L2 cache: fast memory shared by the cores of one cluster.
- System level cache: a cache shared by all engines, in front of main memory.
- GPU: a chip block with many small cores for parallel work.
- Neural Engine (ANE): a block built to run neural network inference at low power.
- TOPS: trillions of operations per second.
- TFLOPs: trillions of floating point operations per second.
- Media engine: a fixed-function block for video encode and decode.
- LPDDR5: low-power DRAM used as main memory.
- Unified memory: one memory pool that CPU, GPU and Neural Engine all read.
- Memory controller: the circuit that talks to the DRAM.
- NAND: flash memory chips that store files (the SSD).
- Thunderbolt 4: a USB-C port standard for 40 Gb/s data and charging.
- Heat pipe: a sealed copper tube that moves heat away from the chip.
- Core ML: Apple's framework that runs models on CPU, GPU and ANE.
- MLX: Apple's array framework for machine learning on Apple silicon.
- Inference: running a trained model to get an answer.

## 8. What is not public or uncertain (be explicit; the page must say "not published" rather than guess)
- Die size: not published by Apple. Chips and Cheese gives about 289 mm2, pixel-counted from Apple's render [S3]. Treat as an estimate.
- Floorplan, block positions and per-block area: not published. The 3D layout is schematic.
- L2 sizes (16 MB P cluster, 4 MB E cluster) and SLC size (24 MB): not published by Apple. They come from secondary sources [S8] and Chips and Cheese does not state the SLC size [S3].
- Neural Engine: Apple states 16 cores and 15.8 trillion operations per second [S1]. Precision of that figure, clock, and core internals are not published. Apple's own research page gives 15.8 TFlops for the A15 fifth-generation ANE [S4], so the number is shared across chips.
- Core ML does not let a developer force ANE use. It "blends CPU, GPU and ANE" [S4]. MLX supports CPU and GPU only, not the ANE [S5].
- Clock speeds and memory channel split: not published.
- RAM package count on a 32 GB board and exact part numbers: not published by Apple. Teardown coverage reports four 4 GB SK hynix packages on a 16 GB unit [S6][S7]. The brief assumed two packages; the sources say four.
- Thunderbolt controller chips: not published as separate parts. Whether they are on the die or on the board is not stated in the sources read.
- Heat pipe count and heatsink dimensions: not published.
- iFixit's own teardown page was not reachable. Teardown facts come from press coverage of it [S6][S7].
- Core counts: this file uses the 12-core CPU, 19-core GPU variant. A 10-core CPU, 16-core GPU variant also ships [S2].
- Process: Apple says second-generation 5 nm. TSMC as the foundry is common knowledge but is not stated on the Apple pages read.

## 9. Sources (numbered; official spec pages, whitepapers, reputable teardowns; include access date)
- S1. Apple Newsroom, "Apple unveils M2 Pro and M2 Max", 17 Jan 2023. https://www.apple.com/newsroom/2023/01/apple-unveils-m2-pro-and-m2-max-next-generation-chips-for-next-level-workflows/ (accessed 2026-10-27)
- S2. Apple Support, MacBook Pro (14-inch, 2023) tech specs. https://support.apple.com/en-us/111340 (accessed 2026-10-27)
- S3. Chips and Cheese, "A Brief Look at Apple's M2 Pro iGPU", 31 Oct 2023. https://old.chipsandcheese.com/2023/10/31/a-brief-look-at-apples-m2-pro-igpu/ (accessed 2026-10-27)
- S4. Apple Machine Learning Research, "Deploying Transformers on the Apple Neural Engine". https://machinelearning.apple.com/research/neural-engine-transformers (accessed 2026-10-27)
- S5. MLX documentation. https://ml-explore.github.io/mlx/build/html/index.html (accessed 2026-10-27)
- S6. Macworld, MacBook Pro teardown (coverage of iFixit): heatsink, RAM, SSD. https://www.macworld.com/article/1487868/macbook-pro-teardown-hm2-pro-heatsink-ram-ssd.html (accessed 2026-10-27)
- S7. Tom's Hardware, "Apple 14-Inch MacBook Pro M2 Teardown Reveals Big Changes Due to Substrate Pricing" (search summary only; page body not read). https://tomshardware.com/news/apple-m2-14-inch-macbook-pro-teardown (accessed 2026-10-27)
- S8. Low End Mac, "Apple Silicon: M2 Pro chip specs" and Notebookcheck M2 Pro pages (cache sizes, via search summary; secondary). https://lowendmac.com/1234/apple-silicon-m2-pro-chip-specs/ (accessed 2026-10-27)
