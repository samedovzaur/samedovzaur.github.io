# NVIDIA Blackwell B200 GPU (NVIDIA, 2024)

Slug: nvidia-blackwell-b200. Written: 2026-10-27. Researcher: Claude (Sonnet 5.5). Status: draft, numbers verified against the sources listed at the end.

## 1. What it is (3 sentences, plain words)
The B200 is a data center GPU for AI training and inference. It joins two reticle-limited dies in one package so that software sees a single GPU. Eight HBM3e memory stacks sit beside the dies on a CoWoS-L interposer.

## 2. Why it is in this gallery (1 to 2 sentences; the owner's interest, given in the brief)
This is the datacenter counterpart of Zaur's RTX 4090. He studies inference serving and follows how two dies are joined into one GPU.

## 3. Hero facts (exactly 3, each one number with unit and source id)
- 208 billion transistors in two dies on TSMC 4NP (S1). Per die: 104 billion (derived as 208 / 2, not stated by NVIDIA).
- 10 TB/s NV-HBI link joins the two dies into one unified GPU (S1, S6).
- 20 PFLOPS FP4 sparse per GPU (10 PFLOPS dense), in the GB200 configuration (S2). Derived from the Superchip row, 40 sparse | 20 dense for 2 GPUs.

## 4. Teardown tree (the 3D model is built from this; keep shapes schematic, counts and hierarchy real)
Levels: 3. Level 1 is the package as it ships on the SXM board. Each level answers "what is inside X?".

| Level | Part id | Parent | Count | Role (compute, memory, io, power, cooling, structure, interconnect) | Material and colour | Shape hint (box, rbox, cyl, grid, fan, wafer, slab) | Relative size and position (plain words) | Enter (opens which level) |
|---|---|---|---|---|---|---|---|---|
| 1 | b200-package | (root) | 1 | structure | Organic substrate, green-brown, dark lid | slab | Square package, about the size of a palm | Yes, opens level 2 |
| 1 | gpu-die | b200-package | 2 | compute | Silicon, dark grey | rbox | Two large dies side by side in the centre, joined along one edge | Yes, opens level 2 |
| 1 | hbm3e-stack | b200-package | 8 | memory | Silicon stack, silver and black | rbox | Four stacks on the outer side of each die | Yes, opens level 3 |
| 1 | nv-hbi | b200-package | 1 | interconnect | Silicon wiring, thin gold line | slab | Thin strip across the seam between the two dies | No |
| 1 | cowos-l-interposer | b200-package | 1 | interconnect | Silicon with embedded bridges, pale grey | slab | Flat layer under dies and stacks, above the substrate | No |
| 1 | substrate | b200-package | 1 | structure | Organic laminate, green | slab | Bottom layer, wider than the interposer | No |
| 2 | sm-array | gpu-die | 1 per die | compute | Silicon, teal | grid | Large grid filling most of each die | No |
| 2 | l2-cache | gpu-die | 1 per die | memory | Silicon, blue | slab | Central band of each die between SM groups | No |
| 2 | hbm-controllers | gpu-die | 1 set per die | memory | Silicon, orange | box | Strip on the die edge facing the HBM stacks | No |
| 2 | nvlink5-io | gpu-die | 1 set per die | io | Silicon, purple | box | Edge blocks on the outer sides of the die | No |
| 2 | nv-hbi-phy | gpu-die | 1 per die | interconnect | Silicon, gold | slab | Edge strip on the inner side, facing the other die | No |
| 2 | decompression-engine | gpu-die | 1 | compute | Silicon, light green | box | Small block near the L2 band | No |
| 2 | ras-engine | gpu-die | 1 | structure | Silicon, red | box | Small block near the die edge | No |
| 3 | dram-die | hbm3e-stack | 8 or 12 | memory | Thinned silicon, grey | wafer | Thin layers stacked in a tower | No |
| 3 | tsv-column | hbm3e-stack | many | interconnect | Copper, orange | cyl | Vertical pins through every DRAM die | No |
| 3 | hbm-base-die | hbm3e-stack | 1 | memory | Silicon logic die, dark grey | slab | Bottom layer of the tower, sits on the interposer | No |

Explode order (outer to inner, one line per part):
1. Lid and package shell lift off.
2. Dies and HBM stacks lift off the interposer.
3. Interposer lifts off the substrate.
4. Substrate stays at the bottom.
5. Inside a die: L2 band, SM array, HBM controllers, NVLink 5 I/O, NV-HBI PHY, engines spread out.
6. Inside a stack: DRAM dies separate from the base die; TSV columns stay visible.

X-ray covers (parts that go transparent): package lid, interposer, one die top layer (to show SMs and L2), the top DRAM dies of the stack (to show TSVs).

## 5. Flows (1 to 3 per level: real data or power paths with the real number)
| Level | From | To | What moves | Number (unit) | Source id |
|---|---|---|---|---|---|
| 1 | gpu-die A | gpu-die B | Cache-coherent traffic over NV-HBI | 10 TB/s | S1, S6 |
| 1 | hbm3e-stack (all 8) | both dies | Memory reads and writes | 8 TB/s per GPU | S2 (16 TB/s per 2-GPU Superchip) |
| 1 | B200 package | other GPUs and NVLink switch | NVLink 5 traffic | 1.8 TB/s per GPU, bidirectional | S1 |
| 2 | l2-cache (local partition) | SMs | Cache hits in the same partition | 21 TB/s measured | S5 |
| 2 | l2-cache (other partition) | SMs | Cache hits that cross the die seam | 16.8 TB/s measured | S5 |
| 3 | hbm-base-die | gpu-die controllers | Data over the stack interface | 1,024 bits wide per stack | S9 |

## 6. Callouts for the gallery (4 to 6 per level; title <= 3 words; text <= 12 words with one number)
| Level | Part id | Title | Text |
|---|---|---|---|
| 1 | b200-package | Two dies, one GPU | 208 billion transistors across two dies, seen as one GPU (S1). |
| 1 | nv-hbi | Die-to-die link | NV-HBI moves 10 TB/s between the two dies (S1). |
| 1 | hbm3e-stack | Eight stacks | Eight HBM3e stacks sit beside the dies (S7). |
| 1 | cowos-l-interposer | CoWoS-L | First commercial CoWoS-L package; two reticles of TSMC silicon (S7). |
| 1 | gpu-die | TSMC 4NP | Custom 4NP process, a 4 nm class node (S1). |
| 1 | b200-package | Memory size | 192 GB HBM3e per GPU at 8 TB/s (S6, S2). |
| 2 | sm-array | SM count | 74 SMs enabled per die, 148 per GPU, measured (S5). |
| 2 | l2-cache | Big L2 | 126 MB L2 in total, versus 50 MB on H100 (S5). |
| 2 | nvlink5-io | NVLink 5 | 1.8 TB/s per GPU to other GPUs (S1). |
| 2 | decompression-engine | Decompress | Dedicated engine speeds up database query formats (S1). |
| 2 | ras-engine | RAS engine | Dedicated block for reliability and serviceability (S1). |
| 2 | hbm-controllers | Memory controllers | Eight 512-bit controllers give 4,096 bits total (S6). |
| 3 | dram-die | 8 or 12 high | HBM3e stacks 8 or 12 DRAM dies; B200 packages use 8 (S7, S9). |
| 3 | tsv-column | Through-silicon vias | Copper columns link all DRAM dies; each stack has 1,024 data pins (S9). |
| 3 | hbm-base-die | Base die | A logic die under the DRAM carries the 1,024-bit interface (S7, S9). |
| 3 | hbm3e-stack | Capacity | An 8-high stack holds 24 GB; eight stacks give 192 GB (S11, S6). |

## 7. Glossary (every technical word used above, one line each, own words)
- B200: the Blackwell data center GPU package with two dies.
- Blackwell: NVIDIA's GPU architecture generation after Hopper.
- GB200: a module of two B200 GPUs and one Grace CPU.
- Grace: NVIDIA's Arm-based server CPU.
- Die: one piece of silicon cut from a wafer.
- Reticle limit: the largest area one lithography exposure can print.
- NV-HBI: NVIDIA High-Bandwidth Interface, the link between the two dies.
- NVLink 5: the fifth-generation fast link between GPUs.
- NVLink-C2C: the chip-to-chip link between the Grace CPU and the GPUs.
- TSMC 4NP: a custom 4 nm class chip process made by TSMC for NVIDIA.
- CoWoS-L: TSMC packaging that uses a local silicon bridge in an organic interposer to join dies.
- Interposer: a thin layer of wiring under the dies and memory.
- Substrate: the base board of the package that connects to the socket.
- SM: streaming multiprocessor, the main compute block of an NVIDIA GPU.
- L2 cache: shared on-chip memory between the SMs and the main memory.
- HBM3e: stacked high bandwidth memory, third generation, extended.
- DRAM die: one thin layer of memory cells inside an HBM stack.
- TSV: through-silicon via, a vertical wire through a die.
- Base die: the logic layer under the DRAM layers in an HBM stack.
- Memory controller: the block that reads and writes the memory.
- Decompression engine: hardware that unpacks compressed data fast.
- RAS engine: hardware for reliability, availability and serviceability (error detection and health checks).
- FP4: a 4-bit floating-point number format used for inference.
- Sparse: a performance figure that assumes many zero weights are skipped. Dense is half of sparse here.
- TDP: thermal design power, the heat the chip is built to shed.
- PFLOPS: 10^15 floating-point operations per second.
- Inference serving: running a trained model to answer requests.

## 8. What is not public or uncertain (be explicit; the page must say "not published" rather than guess)
- Exact SM count per die: not published by NVIDIA. Chips and Cheese reports 80 SMs per die physically and 74 enabled per die (148 per GPU) (S5). Cornell's course page lists 160 SMs (S6). The sources disagree. The page must show "not published".
- Die size in mm2: not published. NVIDIA says only "reticle-limited". TechInsights says the GPU area is near double Hopper's (S7). Figures such as about 800 mm2 per die in other write-ups are estimates.
- Transistors per die (104 billion): derived from the 208 billion total. NVIDIA states only the total.
- FP4 20 PFLOPS is sparse. Dense is 10 PFLOPS per GPU. NVIDIA footnote: "Dense is one-half sparse spec" (S2). The HGX B200 and DGX B200 figures are lower: 144 sparse and 72 dense PFLOPS for 8 GPUs, which is 18 and 9 per GPU (S3, S4).
- TDP: 1,000 W per GPU is the HGX B200 class and 1,200 W is the GB200 configuration, both from secondary reporting (S8). NVIDIA's HGX and GB200 pages list no per-GPU TDP (S2, S3). The DGX B200 system draws about 14.3 kW maximum (S4). Not published by NVIDIA as a per-GPU number.
- Memory capacity: 192 GB is the commonly quoted figure (S6). NVIDIA's GB200 page lists 372 GB for two GPUs, which is 186 GB each (S2). The 6 GB gap is not explained by NVIDIA. It may be usable capacity.
- HBM3e stack height: TechInsights found 8 DRAM dies per stack in the B200 it examined (S7). Twelve-high stacks exist in the market (S9, S11) but are not confirmed for B200.
- NV-HBI link protocol and bridge layout in the CoWoS-L interposer: not published. The TechInsights page does not describe the bridges (S7).
- Whether the die-to-die link is NVLink-based: sources disagree. Not stated by NVIDIA.
- NVLink-C2C 900 GB/s: NVIDIA's release gives 900 GB/s (S1). The GB200 page names NVLink-C2C but lists no number (S2). Direction (total or per direction) is not stated.
- Supplier of HBM3e: TechInsights reports SK hynix in the part it examined (S7). Other suppliers may be used in other units.

## 9. Sources (numbered; official spec pages, whitepapers, reputable teardowns; include access date)
- S1. NVIDIA, "NVIDIA Blackwell Platform Arrives to Power a New Era of Computing", press release, 2024-03-18. https://nvidianews.nvidia.com/news/nvidia-blackwell-platform-arrives-to-power-a-new-era-of-computing. Accessed 2026-10-27. Used for 208 billion transistors, 4NP, 10 TB/s, NVLink 1.8 TB/s, decompression and RAS engines, GB200 with 900 GB/s NVLink-C2C.
- S2. NVIDIA, GB200 NVL72 product page, specification table. https://www.nvidia.com/en-us/data-center/gb200-nvl72/. Accessed 2026-10-27. Used for NVFP4 40 sparse | 20 dense PFLOPS per Superchip, 372 GB HBM3E, 16 TB/s, footnotes.
- S3. NVIDIA, HGX platform page. https://www.nvidia.com/en-us/data-center/hgx/. Accessed 2026-10-27.
- S4. NVIDIA, DGX B200 page. https://www.nvidia.com/en-us/data-center/dgx-b200/. Accessed 2026-10-27.
- S5. Chips and Cheese, "Nvidia's B200: Keeping the CUDA Juggernaut Rolling". https://chipsandcheese.com/p/nvidias-b200-keeping-the-cuda-juggernaut. Accessed 2026-10-27. Third-party measurement.
- S6. Cornell Virtual Workshop, "Blackwell B200 chip". https://cvw.cac.cornell.edu/gpu-architecture/horizon-gpus-blackwell-b200/blackwell_chip. Accessed 2026-10-27. Course page, secondary.
- S7. TechInsights, "NVIDIA HGX B200 Analysis Reveals HBM3E Supplier and Advanced Packaging Innovation". https://www.techinsights.com/blog/techinsights-nvidia-hgx-b200-analysis-reveals-hbm3e-supplier-and-advanced-packaging-innovation. Accessed 2026-10-27. Early teardown summary.
- S8. Tom's Hardware and TweakTown reports on GTC 2024 power figures (1,000 W HGX, 1,200 W and 2,700 W GB200). https://www.tomshardware.com/pc-components/gpus/nvidias-next-gen-ai-gpu-revealed-blackwell-b200-gpu-delivers-up-to-20-petaflops-of-compute-and-massive-improvements-over-hopper-h100 and https://www.tweaktown.com/news/97059/. Accessed 2026-10-27 through search snippets only. Secondary.
- S9. Wikipedia, "High Bandwidth Memory". https://en.wikipedia.org/wiki/High_Bandwidth_Memory. Accessed 2026-10-27 through search snippets. Used for 1,024-bit interface, TSV, base die, 2/4/8/12-high stacks.
- S10. Igor's Lab, GTC 2024 Blackwell article (CoWoS-L, 10 TB/s). https://www.igorslab.de/en/nvidia-goes-mcm-and-officially-announces-blackwell-at-gtc-2024-details-of-the-monster-chip/. Accessed 2026-10-27. Secondary.
- S11. SK hynix HBM3E 8-high 24 GB and 12-high 36 GB coverage. https://www.koreajoongangdaily.com/business/sk-hynix-begins-producing-worlds-first-12-layer-hbm-chip/12409053. Accessed 2026-10-27 through search snippets. Secondary.

Not read directly: the NVIDIA Blackwell architecture technical brief PDF, SemiAnalysis, and TSMC CoWoS-L pages. No claim in sections 3, 5 or 6 depends on them alone.
