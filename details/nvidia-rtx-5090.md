# NVIDIA GeForce RTX 5090 (NVIDIA, 2025)

Slug: nvidia-rtx-5090. Written: 2026-10-28. Researcher: Claude (Sonnet 5.5) research agent. Status: draft, numbers verified against the sources listed at the end.

## 1. What it is (3 sentences, plain words)
The RTX 5090 is a graphics card that carries one very large GB202 chip and 32 GB of GDDR7 memory. The chip uses NVIDIA's Blackwell design and is built by TSMC on its 4N process. The Founders Edition draws up to 575 W through one 12V-2x6 plug and fits a PCIe 5.0 x16 slot.

## 2. Why it is in this gallery (1 to 2 sentences; the owner's interest, given in the brief)
It is the next step up from the RTX 4090 in Zaur's home cluster, which he uses for daily CUDA practice. Each level of this teardown is a level a kernel touches: card memory, L2 cache, one SM.

## 3. Hero facts (exactly 3, each one number with unit and source id)
- 92.2 billion transistors in one GB202 chip [S2]
- 21,760 CUDA cores on a single GB202 [S1, S2]
- 1,792 GB/s memory bandwidth from GDDR7 [S2]

## 4. Teardown tree (the 3D model is built from this; keep shapes schematic, counts and hierarchy real)
Levels: 3. Level 1 is the whole Founders Edition card as it ships. Level 2 is the GB202 die. Level 3 is one SM.

Counts for the RTX 5090 as sold. Where a count is derived or sources differ, the note is in section 8. Die size and package size marked "unconfirmed" come from leaks.

| Level | Part id | Parent | Count | Role (compute, memory, io, power, cooling, structure, interconnect) | Material and colour | Shape hint (box, rbox, cyl, grid, fan, wafer, slab) | Relative size and position (plain words) | Enter (opens which level) |
|---|---|---|---|---|---|---|---|---|
| 1 | card | root | 1 | structure | Dark grey shroud over the cooler | rbox | Whole card, 304 x 137 mm, 2 slots [S1, S7] | opens 1 |
| 1 | shroud | card | 1 | structure | Dark metal and plastic cover | rbox | Outer shell, wraps the top and sides, with open ends for air | no |
| 1 | fans | card | 2 | cooling | Black blades, axial | fan | One at each end of the card; air flows straight through the heatsink [S10] | no |
| 1 | heatsink | card | 1 | cooling | Aluminium fins, silver | grid | Fills the card body between the two fans [S10] | no |
| 1 | vapour-chamber | heatsink | 1 | cooling | Flat copper plate, silver | slab | Sits on the GB202, the memory and the power stages [S10] | no |
| 1 | liquid-metal-tim | vapour-chamber | 1 | cooling | Thin silver film | slab | Thin layer between the GB202 and the vapour chamber [S7, S10, S11] | no |
| 1 | pcb-main | card | 1 | structure | Dark circuit board | slab | Small board in the middle of the card; holds the GPU, memory and power stages [S5, S8] | no |
| 1 | gb202 | pcb-main | 1 | compute | Silver chip package | box | Large square at the centre of the main board; takes about a third of its area [S4] | opens 2 |
| 1 | gddr7 | pcb-main | 16 | memory | Black chip packages | box | Ring of chips around the GPU, 2 GB each [S2, S8, S13] | no |
| 1 | vrm | pcb-main | 34 (sources say 27, 30 or 34) | power | Small black power-stage chips and silver coils | grid | Power stages on the front of the main board, plus four on the back [S4, S5, S6] | no |
| 1 | pcb-io | card | 1 | structure | Dark circuit board | slab | Small separate board at the display end, linked by small connectors [S7, S8] | no |
| 1 | pcie-edge | pcb-io | 1 | interconnect | Gold finger contacts | slab | Gold fingers, 16 lanes, PCIe 5.0; board that carries them is not clear in sources [S1, S8] | no |
| 1 | pcb-power | card | 1 | structure | Dark circuit board | slab | Small separate board that carries the power plug [S7] | no |
| 1 | power-12v-2x6 | pcb-power | 1 | power | Black 12V-2x6 plug | box | One plug, at the end of the card [S1] | no |
| 2 | die | gb202 | 1 | structure | Silicon, grey | rbox | One large die, 750 mm2 [S2]; leaked size about 24 x 31 mm, unconfirmed [S9] | opens 2 |
| 2 | gpc | die | 11 enabled (12 on full die) | compute | Silicon, blue tint | rbox | Big tiles filling most of the die, in rows [S2] | no |
| 2 | tpc | gpc | 85 enabled (96 on full die) | compute | Silicon, blue tint | box | Up to 8 per GPC, small tiles inside each GPC [S2] | no |
| 2 | sm | tpc | 170 enabled (192 on full die) | compute | Silicon, bright blue | box | 2 per TPC; the smallest tile you can enter [S2] | opens 3 |
| 2 | l2 | die | 96 MB enabled (128 MB on full die) | memory | Silicon, amber | slab | Central band across the die, between SM rows [S2] | no |
| 2 | memctl | die | 16 | memory | Silicon, orange | box | Along the die edges facing the memory chips, 32-bit each [S2] | no |
| 2 | nvenc | die | 3 (9th gen) | compute | Silicon, grey | box | Small media block at the die edge [S2] | no |
| 2 | nvdec | die | 2 (6th gen) | compute | Silicon, grey | box | Small media block next to NVENC [S2] | no |
| 2 | gigathread | die | 1 | structure | Silicon, grey | slab | Thin strip along the top of the die | no |
| 2 | pcie-if | die | 1 | interconnect | Silicon, grey | box | Small block at the die edge facing the PCIe fingers | no |
| 3 | sm-one | sm | 1 | compute | Silicon, bright blue | rbox | One SM opened up | opens 3 |
| 3 | partition | sm-one | 4 | compute | Silicon, blue | box | Four equal quarters in a 2 x 2 layout (derived, see section 8) | no |
| 3 | cuda-core | partition | 32 per partition (128 per SM) | compute | Silicon, light blue | grid | Grid of small cells per partition [S2] | no |
| 3 | warp-sched | partition | 1 per partition (4 per SM) | compute | Silicon, grey | box | Small strip at the top of each partition | no |
| 3 | tensor-core | partition | 1 per partition (4 per SM, 5th gen) | compute | Silicon, purple | box | Block beside the CUDA core grid [S2] | no |
| 3 | regfile | partition | 64 KB per partition (256 KB per SM) | memory | Silicon, amber | slab | Wide strip under the core grid [S2, S3] | no |
| 3 | rt-core | sm-one | 1 (4th gen) | compute | Silicon, green | box | One block shared by the SM, at the bottom edge [S2] | no |
| 3 | l1-shared | sm-one | 1 (128 KB) | memory | Silicon, amber | slab | Wide band under the four partitions [S2, S3] | no |

Explode order (outer to inner, one line per part):
1. shroud lifts up and away
2. fans lift up
3. heatsink with vapour chamber lifts up; liquid metal film shows on the chip
4. pcb-io and pcb-power slide away from the sides of pcb-main, with pcie-edge and power-12v-2x6 on them
5. pcb-main stays in the middle; gb202 package lifts off, gddr7 ring spreads out, vrm stages spread out
6. (level 2) die separates from package, GPC tiles spread, L2 band and memory controllers split off the edge
7. (level 3) SM opens into four partitions, then L1/shared and RT core separate

X-ray covers (parts that go transparent): shroud, fans, heatsink (so the vapour chamber and the three boards show); at level 2 the GPC tiles (so L2 and memory controllers show); at level 3 the partitions (so the cores and registers show).

## 5. Flows (1 to 3 per level: real data or power paths with the real number)
| Level | From | To | What moves | Number (unit) | Source id |
|---|---|---|---|---|---|
| 1 | gddr7 | gb202 | Data between memory chips and GPU | 1,792 GB/s (28 Gbps x 512-bit) | S2 |
| 1 | pcie-edge | gb202 | Data from the host over PCIe 5.0 x16 | about 63 GB/s each way (32 GT/s x 16 lanes, derived) | S1, S12 |
| 1 | power-12v-2x6 | gb202 and gddr7 (via vrm) | Electrical power | up to 600 W through the cable; 575 W total graphics power | S1 |
| 2 | memctl | l2 | Data between memory controllers and L2 | 512-bit total, 16 controllers x 32-bit | S2 |
| 2 | l2 | sm | Cached data to the SMs | 96 MB L2 enabled | S2 |
| 3 | l1-shared | cuda-core | Operands from L1 / shared memory | 128 KB per SM | S2, S3 |
| 3 | regfile | cuda-core | Operands from registers | 65,536 x 32-bit registers per SM | S2, S3 |

## 6. Callouts for the gallery (4 to 6 per level; title <= 3 words; text <= 12 words with one number)
| Level | Part id | Title | Text |
|---|---|---|---|
| 1 | card | Two slots | A 304 mm card that fits in two slots [S1] |
| 1 | fans | Flow-through | Two fans push air straight through the heatsink; 575 W card [S1, S10] |
| 1 | liquid-metal-tim | Liquid metal | NVIDIA says the chip uses liquid metal instead of paste [S7] |
| 1 | pcb-main | Three boards | NVIDIA says the card uses a 3-piece PCB [S7] |
| 1 | gddr7 | 32 GB memory | Sixteen chips of 2 GB each [S2, S8, S13] |
| 1 | vrm | Power stages | Counted as 27, 30 or 34 phases, depending on source [S4, S5, S6] |
| 1 | power-12v-2x6 | One plug | One 12V-2x6 cable carries up to 600 W [S1] |
| 2 | die | GB202 die | 92.2 billion transistors in 750 mm2 [S2] |
| 2 | gpc | Cut-down die | Full die has 12 GPCs; this card enables 11 [S2] |
| 2 | sm | 170 SMs | Full die has 192; 170 are on [S2] |
| 2 | l2 | Big L2 | 96 MB on, from 128 MB on the full die [S2] |
| 2 | memctl | 16 controllers | Sixteen 32-bit controllers make a 512-bit bus [S2] |
| 2 | nvenc | Video engines | Three 9th-gen NVENC and two 6th-gen NVDEC [S2] |
| 3 | partition | Four partitions | Each SM has 4 tensor cores, one per quarter [S2] |
| 3 | cuda-core | 128 cores | 128 CUDA cores per SM [S2] |
| 3 | tensor-core | Tensor cores | 4 fifth-generation tensor cores per SM [S2] |
| 3 | rt-core | RT core | 1 fourth-generation RT core per SM [S2] |
| 3 | l1-shared | L1 and shared | 128 KB per SM, split by software [S2, S3] |
| 3 | regfile | Registers | 256 KB register file per SM [S2] |

## 7. Glossary (every technical word used above, one line each, own words)
- GB202: the name of the GPU chip on the RTX 5090.
- Blackwell: NVIDIA's GPU design generation for this chip.
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
- GDDR7: the fast graphics memory type on the card.
- Memory module: one memory chip package; here 2 GB each.
- Memory controller: the circuit that talks to the memory chips.
- Memory bus (512-bit): total width of the data path to memory.
- Bandwidth: how much data moves per second.
- GigaThread engine: the unit that hands thread blocks out to SMs.
- NVENC and NVDEC: video encode and decode hardware.
- ROP: raster operations unit, which writes finished pixels.
- Vapour chamber: a flat sealed plate that spreads heat fast.
- Liquid metal TIM: a metal alloy that is liquid at room temperature, used to pass heat from chip to cooler.
- Flow-through fan: a fan layout where air passes straight through the heatsink fins and out the other side.
- VRM: voltage regulator module; turns 12 V into the low voltage the chip needs.
- Power stage (phase): one small chip in the VRM that switches current.
- PCB: printed circuit board.
- Three-piece PCB: a card made of a main board plus two small separate boards.
- PCIe: the slot link between card and computer.
- PCIe edge: the gold contacts on the card that fit the slot.
- 12V-2x6: the 16-pin power plug used by this card. The name comes from press reviews; NVIDIA's page says "600 W PCIe Gen 5 cable".
- TGP: total graphics power, the power budget of the card.
- Compute capability 12.0: the CUDA version number for GeForce Blackwell chips.

## 8. What is not public or uncertain (be explicit; the page must say "not published" rather than guess)
- Package size (about 63 x 56 mm) and die size (about 24 x 31 mm, which gives 744 mm2) are unconfirmed. They come from a leak posted on 22 November 2024 and repeated in press [S9]. NVIDIA's own figure for die area is 750 mm2 [S2]. The 24 x 31 mm shape is not NVIDIA-stated.
- VRM phase count differs by source. TechPowerUp counts 27 (19 for the GPU and 8 for memory) [S4]. Tom's Hardware counts 30 on the front board [S5] and says the back adds four more, for 34 [S6]. I read these through search summaries and headlines because the pages returned HTTP 403 or came back truncated. I cannot say which count is right. The model uses 34 as the largest figure, and the page should show all three.
- Phase assignment (which phases feed the GPU, which feed memory, which are on the back board) is not published by NVIDIA. TechPowerUp's 19 + 8 split is one reviewer's count.
- Exactly which GPC is disabled is not published. NVIDIA gives 11 GPCs, 85 TPCs and 170 SMs enabled [S2]. Eleven full GPCs would give 88 TPCs, so at least 3 more TPCs are also off. Which ones: not published.
- Fin count, heat pipe count and vapour chamber size are not published in any source I could read. TweakTown is reported (via search summary) to count five heat pipes; I did not read it.
- Liquid metal area and amount are not published. NVIDIA says the card uses liquid metal TIM [S7]. Igor's Lab says it can only be removed mechanically, so it skipped a teardown [S11].
- Card thickness: the brief gives 48 mm. NVIDIA's page gives only 304 mm x 137 mm and "2-Slot" [S1]. Its prose also mentions space for a 3-slot (61 mm) card, which looks like generic text for all 50-series cards. Other reviews give about 37 mm or about 2 inches. I did not confirm 48 mm.
- Which of the two side boards carries the PCIe fingers is not clear. Wccftech says the PCIe connector and display outputs sit on separate boards [S8]. The tree puts the PCIe edge on the I/O board; this is my reading.
- Memory chip size (2 GB each) is derived: 32 GB divided by 16 packages. The Samsung part number (K4VAF3257C-SC28, 16 packages) comes from a Tom's Hardware summary I read second-hand [S13].
- PCIe 5.0 x16 "about 63 GB/s each way" is a calculation from the PCIe rate (32 GT/s, 128b/130b encoding), not an NVIDIA-stated figure [S12].
- The four-partition SM layout in a 2 x 2 grid is a drawing choice from the whitepaper's text (4 tensor cores, 128 CUDA cores). I did not find a sentence that states 32 cores per partition. Register file per partition (64 KB) is derived: 256 KB divided by 4.
- GigaThread engine and PCIe interface block: shown on NVIDIA block diagrams. I found no sentence in the text that describes them. Their glossary role is general knowledge.
- ROP count: NVIDIA's whitepaper says 176 for the RTX 5090 [S2]. TechPowerUp lists 176 on one page and 192 on another.
- Total die area split (how much is L2, SMs, memory controllers): not published. The 3D proportions are schematic.
- The TechPowerUp GPU database, TechPowerUp review pages, TweakTown and parts of Tom's Hardware returned HTTP 403 or truncated text to my fetch tool. Facts from them come from search summaries and are marked as such.
- Precise shape, colour and layout in the 3D model are design choices. Counts and hierarchy are real.
- Board-partner cards differ from the Founders Edition teardown here (cooler, fans, boards, VRM).

## 9. Sources (numbered; official spec pages, whitepapers, reputable teardowns; include access date)
- S1. NVIDIA, GeForce RTX 5090 product page (21,760 CUDA cores, 2.41 GHz boost, 32 GB GDDR7, 512-bit, 575 W, 304 x 137 mm, 2-slot, PCIe Gen 5, 600 W PCIe Gen 5 cable). https://www.nvidia.com/en-us/geforce/graphics-cards/50-series/rtx-5090/ Accessed 2026-10-28.
- S2. NVIDIA, NVIDIA RTX Blackwell GPU Architecture whitepaper (GB202 full die and RTX 5090 counts, 92.2 billion transistors, 750 mm2, L2, 28 Gbps and 1,792 GB/s, SM structure, NVENC and NVDEC, TGP). https://images.nvidia.com/aem-dam/Solutions/geforce/blackwell/nvidia-rtx-blackwell-gpu-architecture.pdf Accessed 2026-10-28, text read from the downloaded PDF.
- S3. NVIDIA, Blackwell Tuning Guide for CUDA Applications (compute capability 12.0: 128 KB shared memory per SM, 64K registers per SM). https://docs.nvidia.com/cuda/blackwell-tuning-guide/index.html Accessed 2026-10-28.
- S4. TechPowerUp, GeForce RTX 5090 Founders Edition review and unboxing, page 4 (three-piece PCB, 27-phase VRM as 19 + 8, GPU takes about a third of the board). https://www.techpowerup.com/review/nvidia-geforce-rtx-5090-founders-edition/4.html and https://techpowerup.com/review/nvidia-geforce-rtx-5090-founders-edition-unboxing/4.html Accessed 2026-10-28. Pages returned 403; facts read from search summaries only.
- S5. Tom's Hardware, Nvidia's powerful RTX 5090 PCB is amazingly small yet pumps 575W of power (30 phases on the front board). https://www.tomshardware.com/pc-components/gpus/nvidia-shows-off-geforce-rtx-5090-fe-pcb-30-phases-of-stable-575w-power Accessed 2026-10-28. Body truncated; read via search summary.
- S6. Tom's Hardware, More GeForce RTX 5090 Founders Edition mysteries revealed: backside of the PCB (four more phases, 34 total). https://www.tomshardware.com/pc-components/gpus/more-geforce-rtx-5090-founders-edition-mysteries-revealed-backside-of-the-pcb Accessed 2026-10-28. Body truncated; read via search summary.
- S7. The FPS Review, Double Flow Through design of GeForce RTX 5090 Founders Edition (NVIDIA statement: liquid metal TIM and a unique 3-piece PCB; 304 mm long x 137 mm high x 2-slot). https://www.thefpsreview.com/2025/01/15/double-flow-through-design-of-geforce-rtx-5090-founders-edition-delivers-drastically-lower-spls-than-traditional-two-slot-coolers-at-higher-power-draws-nvidia-reveals/ Accessed 2026-10-28.
- S8. Wccftech, hands-on with the RTX 5090 Founders Edition and its compact PCB (16 GDDR7 chips around the GPU, modular PCB with PCIe connector and display outputs on separate boards, 30 phases). https://wccftech.com/hands-on-nvidia-powerful-geforce-rtx-5090-gpu-impressive-compact-pcb/ Accessed 2026-10-28.
- S9. Tom's Hardware, the RTX 5090's GB202 GPU reportedly 744 mm2, and leaker MEGAsizeGPU's 24 x 31 mm die and 63 x 56 mm package (leak, unconfirmed). https://www.tomshardware.com/pc-components/gpus/the-rtx-5090s-gb202-gpu-will-reportedly-be-the-largest-desktop-chip-from-nvidia-since-2018-coming-in-at-744mm-squared-22-percent-larger-than-ad102-on-the-rtx-4090 Accessed 2026-10-28. Read via search summary.
- S10. XDA Developers and HotHardware on the Founders Edition cooler (two flow-through axial fans, unified vapour chamber over GPU, memory and power, liquid metal between chamber and GPU). https://www.xda-developers.com/nvidia-rtx-50-series-founders-edition-cooling/ and https://hothardware.com/reviews/nvidia-geforce-rtx-5090-review Accessed 2026-10-28. Read via search summary.
- S11. Igor's Lab, NVIDIA GeForce RTX 5090 Founders Edition review (750 mm2, 92.2 billion transistors, 1.792 TB/s, 575 W, liquid metal removable only mechanically). https://www.igorslab.de/en/nvidia-geforce-rtx-5090-founders-edition-review-the-600-watt-powerhouse-in-gaming-and-lab-tests/ Accessed 2026-10-28.
- S12. PCI-SIG PCIe 5.0 rate (32 GT/s per lane, 128b/130b), used for my own calculation. Not fetched; standard published figure. Accessed 2026-10-28.
- S13. Tom's Hardware coverage of the RTX 5090 FE PCB: 16 Samsung GDDR7 packages, part K4VAF3257C-SC28 (via search summary of S5; weak source). Accessed 2026-10-28.
