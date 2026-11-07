# NVIDIA GeForce RTX 4090 (NVIDIA, 2022)

Slug: nvidia-rtx-4090. Written: 2026-10-27. Researcher: Claude (Sonnet 5.5) research agent. Status: draft, numbers verified against the sources listed at the end.

## 1. What it is (3 sentences, plain words)
The RTX 4090 is a graphics card that carries one large AD102 chip and 24 GB of fast memory. The chip uses NVIDIA's Ada Lovelace design and is built by TSMC on its 4N process. It draws up to 450 W and plugs into a PCIe 4.0 x16 slot.

## 2. Why it is in this gallery (1 to 2 sentences; the owner's interest, given in the brief)
It is the GPU in Zaur's home cluster. He practises CUDA kernels on it every morning, so each level of this teardown is a level a kernel touches: card memory, L2 cache, one SM.

## 3. Hero facts (exactly 3, each one number with unit and source id)
- 76.3 billion transistors on a 608.5 mm2 die, made on TSMC 4N [S2]
- 16,384 CUDA cores in 128 SMs, with 2,520 MHz boost clock [S1, S2, S4]
- 24 GB GDDR6X on a 384-bit bus gives 1,008 GB/s of memory bandwidth [S1, S2]

## 4. Teardown tree (the 3D model is built from this; keep shapes schematic, counts and hierarchy real)
Levels: 3. Level 1 is the whole card as it ships. Level 2 is the AD102 die. Level 3 is one SM.

Counts for the RTX 4090 as sold. Where a count is derived, the note is in section 8.

| Level | Part id | Parent | Count | Role (compute, memory, io, power, cooling, structure, interconnect) | Material and colour | Shape hint (box, rbox, cyl, grid, fan, wafer, slab) | Relative size and position (plain words) | Enter (opens which level) |
|---|---|---|---|---|---|---|---|---|
| 1 | card | root | 1 | structure | Dark grey shroud over the cooler | rbox | Whole card, 304 x 137 x 61 mm, 3 slots [S1] | opens 1 |
| 1 | shroud | card | 1 | structure | Dark metal and plastic cover | rbox | Outer shell, wraps the whole top and sides | no |
| 1 | fans | card | 2 | cooling | Black blades, 7 per fan, 11.5 cm wide [S4] | fan | One at each end of the card, fully visible when shroud is off | no |
| 1 | heatsink | card | 1 | cooling | Aluminium fins on a vapour chamber, silver | grid | Fills most of the card body under the shroud | no |
| 1 | vapour-chamber | heatsink | 1 | cooling | Flat copper plate, silver | slab | Sits directly on the AD102 package and the memory chips [S4] | no |
| 1 | pcb | card | 1 | structure | Dark green or black circuit board | slab | Shorter than the cooler, in the middle of the card | no |
| 1 | ad102 | pcb | 1 | compute | Silver chip package | box | Large square at the centre of the PCB, under the vapour chamber | opens 2 |
| 1 | gddr6x | pcb | 12 | memory | Black chip packages | box | Ring of chips around the GPU, 2 GB each [S2, S8] | no |
| 1 | vrm | pcb | 23 | power | Small black power-stage chips and silver coils | grid | Rows of stages along the edge nearest the power plug [S4, S5] | no |
| 1 | pcie-edge | pcb | 1 | interconnect | Gold finger contacts | slab | Bottom edge of the PCB, 16 lanes | no |
| 1 | power-16pin | pcb | 1 | power | Black 12+4 pin plug | box | At the top edge, near the middle of the card [S4] | no |
| 2 | die | ad102 | 1 | structure | Silicon, grey | rbox | One large square die, 608.5 mm2 [S2] | opens 2 |
| 2 | gpc | die | 11 enabled (12 on full die) | compute | Silicon, blue tint | rbox | Big tiles filling most of the die, in rows | no |
| 2 | tpc | gpc | 64 enabled (72 on full die) | compute | Silicon, blue tint | box | 6 per full GPC, small tiles inside each GPC [S2, S4] | no |
| 2 | sm | tpc | 128 enabled (144 on full die) | compute | Silicon, bright blue | box | 2 per TPC; the smallest tile you can enter | opens 3 |
| 2 | l2 | die | 72 MB enabled (96 MB on die) | memory | Silicon, amber | slab | Central band across the die, between SM rows [S2] | no |
| 2 | memctl | die | 12 | memory | Silicon, orange | box | Along the die edges facing the memory chips, 32-bit each [S2] | no |
| 2 | nvenc | die | 2 (8th gen) | compute | Silicon, grey | box | Small media block at the die edge [S2] | no |
| 2 | nvdec | die | 1 (5th gen) | compute | Silicon, grey | box | Small media block next to NVENC [S2] | no |
| 2 | gigathread | die | 1 | structure | Silicon, grey | slab | Thin strip along the top of the die | no |
| 2 | pcie-if | die | 1 | interconnect | Silicon, grey | box | Small block at the die edge facing the PCIe fingers [S2] | no |
| 3 | sm-one | sm | 1 | compute | Silicon, bright blue | rbox | One SM opened up | opens 3 |
| 3 | partition | sm-one | 4 | compute | Silicon, blue | box | Four equal quarters in a 2 x 2 layout [S2] | no |
| 3 | cuda-core | partition | 32 per partition (128 per SM) | compute | Silicon, light blue | grid | Grid of 16 + 16 small cells per partition [S2] | no |
| 3 | warp-sched | partition | 1 per partition (4 per SM) | compute | Silicon, grey | box | Small strip at the top of each partition [S2] | no |
| 3 | tensor-core | partition | 1 per partition (4 per SM, 4th gen) | compute | Silicon, purple | box | Block beside the CUDA core grid [S2] | no |
| 3 | regfile | partition | 64 KB per partition (256 KB per SM; 64K x 32-bit) | memory | Silicon, amber | slab | Wide strip under the core grid [S2, S3] | no |
| 3 | rt-core | sm-one | 1 (3rd gen) | compute | Silicon, green | box | One block shared by the SM, at the bottom edge [S2] | no |
| 3 | l1-shared | sm-one | 1 (128 KB) | memory | Silicon, amber | slab | Wide band under the four partitions [S2, S3] | no |

Explode order (outer to inner, one line per part):
1. shroud lifts up and away
2. fans lift up
3. heatsink with vapour chamber lifts up
4. pcb slides out below, with power-16pin and pcie-edge on its edges
5. ad102 package lifts off the pcb, gddr6x ring spreads out, vrm stages spread out
6. (level 2) die separates from package, GPC tiles spread, L2 band and memory controllers split off the edge
7. (level 3) SM opens into four partitions, then L1/shared and RT core separate

X-ray covers (parts that go transparent): shroud, fans, heatsink (so the vapour chamber and PCB show); at level 2 the GPC tiles (so L2 and memory controllers show); at level 3 the partitions (so the cores and registers show).

## 5. Flows (1 to 3 per level: real data or power paths with the real number)
| Level | From | To | What moves | Number (unit) | Source id |
|---|---|---|---|---|---|
| 1 | gddr6x | ad102 | Data between memory chips and GPU | 1,008 GB/s | S1, S2 |
| 1 | power-16pin | ad102 and gddr6x (via vrm) | Electrical power | 450 W total graphics power | S1, S2 |
| 1 | pcie-edge | ad102 | Data from the host over PCIe 4.0 x16 | about 31.5 GB/s each way (16 GT/s x 16 lanes, derived) | S1, S7 |
| 2 | memctl | l2 | Data between memory controllers and L2 | 384-bit total, 12 controllers x 32-bit | S2 |
| 2 | l2 | sm | Cached data to the SMs | 72 MB L2 enabled | S2 |
| 3 | l1-shared | cuda-core | Operands from L1 / shared memory | 128 KB per SM | S2, S3 |
| 3 | regfile | cuda-core | Operands from registers | 65,536 x 32-bit registers per SM; up to 255 per thread | S3 |

## 6. Callouts for the gallery (4 to 6 per level; title <= 3 words; text <= 12 words with one number)
| Level | Part id | Title | Text |
|---|---|---|---|
| 1 | card | Big card | 304 mm long and 3 slots thick [S1] |
| 1 | fans | Two fans | Two 11.5 cm fans, seven blades each [S4] |
| 1 | vapour-chamber | Vapour chamber | Cools the GPU and memory from one plate; card weighs 2,075 g [S4] |
| 1 | gddr6x | 24 GB memory | Gives 1,008 GB/s of bandwidth [S1, S2] |
| 1 | vrm | Power stages | 23 phases feed the GPU and memory [S5] |
| 1 | power-16pin | 16-pin plug | 12+4 pin plug carries a 450 W card [S1, S4] |
| 2 | die | AD102 die | 76.3 billion transistors in 608.5 mm2 [S2] |
| 2 | gpc | Cut-down die | Full die has 12 GPCs; this card enables 11 [S2, S4] |
| 2 | sm | 128 SMs | Full die has 144; 128 are on [S2, S4] |
| 2 | l2 | Huge L2 | 72 MB on, from 96 MB on the die [S2, S3] |
| 2 | memctl | 12 controllers | Twelve 32-bit controllers make a 384-bit bus [S2] |
| 2 | nvenc | Video engines | Two 8th-gen NVENC and one 5th-gen NVDEC [S2] |
| 3 | partition | Four partitions | Each SM has 4 partitions with 1 warp scheduler each [S2] |
| 3 | cuda-core | 128 cores | 128 CUDA cores per SM [S2] |
| 3 | tensor-core | Tensor cores | 4 fourth-gen tensor cores per SM [S2] |
| 3 | rt-core | RT core | 1 third-gen RT core per SM [S2] |
| 3 | l1-shared | L1 and shared | 128 KB per SM, split by software [S2, S3] |
| 3 | regfile | Registers | 64K 32-bit registers per SM [S3] |

## 7. Glossary (every technical word used above, one line each, own words)
- AD102: the name of the GPU chip on the RTX 4090.
- Ada Lovelace: NVIDIA's GPU design generation for this chip.
- TSMC 4N: a chip-making process from TSMC, tuned for NVIDIA.
- Die: the piece of silicon with the circuits on it.
- Package: the die plus the base it is mounted on.
- Transistor: a tiny switch; chips have billions.
- GPC: graphics processing cluster, a big group of compute tiles on the die.
- TPC: texture processing cluster, a pair of SMs inside a GPC.
- SM: streaming multiprocessor, the unit that runs your CUDA threads.
- CUDA core: one lane that does a basic maths operation.
- Tensor core: a unit for matrix maths, used in AI.
- RT core: a unit that speeds up ray tracing.
- Warp: a group of 32 threads that run together.
- Warp scheduler: hardware that picks which warp runs next.
- Register file: the fastest memory, private to each thread.
- L1 cache: small fast memory inside each SM.
- Shared memory: part of L1 that your kernel controls.
- L2 cache: larger memory shared by all SMs.
- GDDR6X: the fast graphics memory type on the card.
- Memory controller: the circuit that talks to the memory chips.
- Memory bus (384-bit): total width of the data path to memory.
- Bandwidth: how much data moves per second.
- GigaThread engine: the unit that hands thread blocks out to SMs.
- NVENC and NVDEC: video encode and decode hardware.
- ROP: raster operations unit, which writes finished pixels.
- Vapour chamber: a flat sealed plate that spreads heat fast.
- VRM: voltage regulator module; turns 12 V into the low voltage the chip needs.
- Power stage: one small chip in the VRM that switches current.
- PCB: printed circuit board.
- PCIe: the slot link between card and computer.
- PCIe edge: the gold contacts on the card that fit the slot.
- 12VHPWR (16-pin): the 12+4 pin power plug used by this card.
- TGP: total graphics power, the power budget of the card.
- Compute capability 8.9: the CUDA version number for Ada chips.

## 8. What is not public or uncertain (be explicit; the page must say "not published" rather than guess)
- Memory chip count (12) is derived, not read from a teardown: 384-bit bus divided by 32 bits per chip, and 24 GB divided by 2 GB (16 Gbit) per chip. NVIDIA says 16 Gbit chips, from a secondary report [S8]. No teardown page I could read states "12".
- Number of power stages (23) is the headline figure from Tom's Hardware [S5], whose body I could not read. Igor's Lab describes 10 GPU phases with 20 control loops, plus 3 memory phases, and does not state a total [S4]. 20 + 3 = 23 fits, but that sum is my inference.
- Fin count, heat pipe count and vapour chamber size are not published in any source I could read.
- PCB layer count and PCB thickness: not published.
- Total die area split (how much is L2, SMs, memory controllers): not published. The 3D proportions are schematic.
- Which 11 of 12 GPCs are on, and which SMs are cut, is not published. Igor's Lab states 11 GPCs with two cut to 10 SMs [S4]; NVIDIA's whitepaper gives only the 128 total [S2].
- Whether the 24 MB of disabled L2 is physically defective or fused off: not published.
- GigaThread engine: I know it from the whitepaper block diagram, but I did not find a sentence in its text that describes it. Its role in the glossary is general knowledge, not sourced.
- PCIe 4.0 x16 "about 31.5 GB/s each way" is a calculation from the PCIe rate (16 GT/s, 128b/130b encoding), not a measured or NVIDIA-stated figure [S7]. The brief said "about 32 GB/s".
- TechPowerUp's GPU database and TechPowerUp review pages returned HTTP 403 to my fetch tool. They were not used.
- Precise shape, colour and layout in the 3D model are design choices. Counts and hierarchy are real.
- Board-partner cards differ from the Founders Edition teardown here (cooler, fans, VRM).

## 9. Sources (numbered; official spec pages, whitepapers, reputable teardowns; include access date)
- S1. NVIDIA, GeForce RTX 4090 product page (CUDA cores, boost clock, memory, bus, PCIe Gen 4, 450 W, dimensions). https://www.nvidia.com/en-us/geforce/graphics-cards/40-series/rtx-4090/ Accessed 2026-10-27.
- S2. NVIDIA, Ada GPU Architecture whitepaper (AD102 full die, SM structure, L2, die size, transistors, process, 4090 spec appendix). https://images.nvidia.com/aem-dam/Solutions/geforce/ada/nvidia-ada-gpu-architecture.pdf Accessed 2026-10-27, text read from the downloaded PDF.
- S3. NVIDIA, Tuning CUDA Applications for NVIDIA Ada GPU Architecture (compute capability 8.9, 128 KB L1/shared, 98304 KB L2 on AD102, 64K registers per SM). https://docs.nvidia.com/cuda/ada-tuning-guide/index.html Accessed 2026-10-27.
- S4. Igor's Lab, NVIDIA GeForce RTX 4090 Founders Edition 24GB review, pages 1 and 3 (11 GPCs, 64 TPCs, cooler, fans, VRM, weight, 12VHPWR). https://www.igorslab.de/en/nvidia-geforce-rtx-4090-founders-edition-24gb-review-drink-less-work-more/ Accessed 2026-10-27.
- S5. Tom's Hardware, Nvidia Details GeForce RTX 4090 FE PCB: 23 Phases and Clean Power (headline only; body not readable by my tool). https://www.tomshardware.com/news/nvidia-details-geforce-rtx-4090-fe-pcb-23-phases-and-clean-power Accessed 2026-10-27.
- S6. ServeTheHome, RTX 4090 Founders Edition review, the GPU page (21 Gbps memory, 2,520 MHz boost, cross-check). https://www.servethehome.com/nvidia-geforce-rtx-4090-founders-edition-review-the-gpu/2 Accessed 2026-10-27.
- S7. PCI-SIG PCIe 4.0 rate (16 GT/s per lane, 128b/130b), used for my own calculation. Not fetched; standard published figure. Accessed 2026-10-27.
- S8. Secondary reports of NVIDIA's design briefing on 16 Gbit memory chips (Notebookcheck, 4gamers, via search results; not fully read). Weak source. Accessed 2026-10-27.
