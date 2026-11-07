# NVIDIA Jetson AGX Orin 64 GB module and developer kit (NVIDIA, 2022)

Slug: nvidia-jetson-orin. Written: 2026-10-27. Researcher: Claude Sonnet 5.5 research agent. Status: draft, numbers verified against the sources listed at the end.

## 1. What it is (3 sentences, plain words)
The Jetson AGX Orin is a small computer module for robots, vehicles and edge AI. One Orin chip holds an Arm CPU, an Ampere GPU, two deep learning accelerators and a vision accelerator, with 64 GB of shared LPDDR5 memory next to it. The developer kit puts this module on a carrier board with a heatsink, a fan and common ports, so you can plug it in and run models.

## 2. Why it is in this gallery (1 to 2 sentences; the owner's interest, given in the brief)
Zaur ran 7B and 13B open models and a voice assistant on a Jetson kit in a vehicle prototype early in his LLM work. The 64 GB of memory shared by CPU and GPU, and its 204.8 GB/s speed, decide which models fit and how fast they talk.

## 3. Hero facts (exactly 3, each one number with unit and source id)
- 64 GB of 256-bit LPDDR5 memory at 204.8 GB/s, shared by CPU and GPU [S1][S2].
- 275 TOPS INT8, sparse (claimed): 170 from the GPU plus 105 from the two DLAs. Dense is 137.5 TOPS (85 + 52.5) [S1][S2][S5].
- 12 Arm Cortex-A78AE cores in 3 clusters, and 2,048 CUDA cores with 64 tensor cores, in a 15 W to 60 W power range [S1][S2].

## 4. Teardown tree (the 3D model is built from this; keep shapes schematic, counts and hierarchy real)
Levels: 3. Level 1 is the developer kit as it ships. Each level answers "what is inside X?".

| Level | Part id | Parent | Count | Role (compute, memory, io, power, cooling, structure, interconnect) | Material and colour | Shape hint (box, rbox, cyl, grid, fan, wafer, slab) | Relative size and position (plain words) | Enter (opens which level) |
|---|---|---|---|---|---|---|---|---|
| 1 | devkit | none | 1 | structure | Black metal and plastic case, dark grey | rbox | Whole kit, the largest item; the module sits in the middle | L2 |
| 1 | devkit-heatsink-fan | devkit | 1 heatsink, 1 fan | cooling | Aluminium fins, silver; black fan | fan | On top of the module, covers its thermal plate; fan connector J9 is 4-pin | L2 |
| 1 | carrier-board | devkit | 1 | structure | Green PCB | slab | Flat board under the module, spans the full kit | none |
| 1 | pcie-slot | carrier-board | 1 | io | Black plastic, gold pins | box | One x16 slot (J6) at the board edge; runs PCIe 4.0 x8 | none |
| 1 | usb-ports | carrier-board | 4 type-A, 2 type-C on kit (plus carrier headers) | io | Silver metal, blue and black plastic | box | Row of ports on the side of the case | none |
| 1 | ethernet-port | carrier-board | 1 | io | Silver metal | box | One RJ45 (J17), up to 10GBASE-T | none |
| 1 | csi-connector | carrier-board | 1 | io | Black plastic | box | One camera connector (J509) on the board | none |
| 1 | m2-slots | carrier-board | 2 | io | Gold pins | slab | M-key for NVMe (J1), E-key for wireless (J505) | none |
| 1 | dc-jack | carrier-board | 1 | power | Silver barrel | cyl | One 5.5 mm barrel jack (J41), at the board edge | none |
| 1 | module-connector | carrier-board | 1 | interconnect | Black plastic | grid | 699-pin socket (J3) under the module | L2 |
| 2 | module | devkit | 1 | compute | Dark module with metal plate | rbox | 100 x 87 x 16 mm, centred on the carrier | L3 |
| 2 | thermal-plate | module | 1 | cooling | Aluminium plate with heatpipe, silver | slab | Top surface of the module; touches the heatsink | none |
| 2 | soc-package | module | 1 | compute | Black package, silver lid | box | Large chip near the centre of the module | L3 |
| 2 | lpddr5-chips | module | not published | memory | Black chips | box | Packages beside the SoC; 64 GB total on a 256-bit bus | none |
| 2 | emmc | module | 1 | memory | Black chip | box | Small chip; 64 GB eMMC 5.1 | none |
| 2 | pmic-and-regulators | module | not published | power | Small black chips and inductors | box | Spread around the SoC; module takes 5 V and 12 V in | none |
| 2 | nor-flash | module | 2 (64 MB boot, 8 MB key) | memory | Small black chips | box | Tiny chips near the connector | none |
| 2 | b2b-connector-699 | module | 1 | interconnect | Black Molex-style mezzanine connector | grid | Underside of the module; mates with the carrier | none |
| 3 | orin-die | soc-package | 1 | compute | Silicon, grey | wafer | One die in the package; size not published | none |
| 3 | gpu-ampere | orin-die | 1 (2 GPC, 8 TPC, 16 SM) | compute | Blue region | grid | Largest block; 2,048 CUDA cores, 64 tensor cores | none |
| 3 | cpu-a78ae | orin-die | 12 cores in 3 clusters of 4 | compute | Orange region | grid | Three groups of four cores, each with a 2 MB L3 | none |
| 3 | dla | orin-die | 2 | compute | Green blocks | box | Two NVDLA v2 engines, with 2 MB SRAM | none |
| 3 | pva | orin-die | 1 | compute | Purple block | box | One vision accelerator with 2 MB SRAM | none |
| 3 | nvenc-nvdec | orin-die | 1 encoder, 1 decoder | compute | Yellow blocks | box | Video engines, small blocks near the edge | none |
| 3 | memory-controllers | orin-die | not published | interconnect | Grey strip | slab | Along the die edge facing the DRAM | none |
| 3 | io-controllers | orin-die | 7 PCIe controllers, 6 CSI links | io | Grey blocks | box | Around the die edge | none |

Explode order (outer to inner, one line per part):
1. Fan and heatsink lift off the top.
2. Module lifts off the carrier board (699-pin connector separates).
3. Thermal transfer plate lifts off the module.
4. SoC package lifts out from the module board; DRAM, eMMC and PMIC stay on the module.
5. Package lid opens to show the die (level 3).

X-ray covers (parts that go transparent): devkit case, heatsink and fan, thermal plate, package lid.

## 5. Flows (1 to 3 per level: real data or power paths with the real number)
| Level | From | To | What moves | Number (unit) | Source id |
|---|---|---|---|---|---|
| 1 | dc-jack | module | Power in, kit runs 15 W to 60 W module power | 60 W max (64 GB module) | S1, S2 |
| 1 | pcie-slot | module | PCIe 4.0 data (x8 on the kit) | 8 lanes | S3, S2 |
| 1 | csi-connector | module | Camera data (module supports 16 CSI lanes, kit exposes one connector) | 16 lanes (module) | S2, S3 |
| 2 | lpddr5-chips | soc-package | Weights and activations, shared memory | 204.8 GB/s | S1 |
| 2 | b2b-connector-699 | soc-package | All I/O: USB, PCIe, Ethernet, CSI | 699 pins | S1, S2 |
| 3 | gpu-ampere | orin-die | INT8 sparse tensor math | 170 TOPS sparse (85 dense) | S2 |
| 3 | dla | orin-die | INT8 sparse inference | 105 TOPS sparse total (52.5 dense) | S1, S2 |
| 3 | cpu-a78ae | orin-die | Cache traffic, 256 KB L2 per core, 2 MB L3 per cluster | 12 cores | S2 |

## 6. Callouts for the gallery (4 to 6 per level; title <= 3 words; text <= 12 words with one number)
| Level | Part id | Title | Text |
|---|---|---|---|
| 1 | devkit | Whole kit | Module, carrier, fan and ports in one box; runs up to 60 W. |
| 1 | pcie-slot | PCIe slot | An x16 slot that runs 8 lanes of PCIe 4.0. |
| 1 | ethernet-port | Fast network | One Ethernet port, up to 10 gigabit. |
| 1 | m2-slots | M.2 storage | Two M.2 slots; add NVMe so big models load faster. |
| 1 | csi-connector | Camera port | One camera connector; the module itself offers 16 CSI lanes. |
| 1 | heatsink-fan | Cooling | A fan and heatsink keep the thermal plate under 80 C. |
| 2 | module | The module | A 100 by 87 mm board holds the whole computer. |
| 2 | lpddr5-chips | Shared memory | 64 GB LPDDR5, 204.8 GB/s, used by CPU and GPU together. |
| 2 | b2b-connector-699 | 699 pins | One connector carries every signal to the carrier board. |
| 2 | emmc | On-board storage | 64 GB eMMC holds the operating system. |
| 2 | thermal-plate | Heat path | A thermal plate with heatpipe moves heat to the heatsink. |
| 3 | gpu-ampere | Ampere GPU | 2,048 CUDA cores and 64 tensor cores do the model math. |
| 3 | cpu-a78ae | 12 CPU cores | Three clusters of four Arm cores, up to 2.2 GHz. |
| 3 | dla | Two DLAs | Fixed-function engines give 105 sparse TOPS in total. |
| 3 | pva | Vision engine | A vision accelerator for camera pipelines, 2 MB of SRAM. |
| 3 | orin-die | The claim | 275 sparse INT8 TOPS; dense is 137.5. |

## 7. Glossary (every technical word used above, one line each, own words)
- SoC: system on chip; CPU, GPU and other engines on one die.
- Module: a small board with the SoC, memory and power parts, meant to plug into a carrier.
- Carrier board: the larger board that gives the module ports and power.
- Developer kit: the module, carrier, heatsink and fan sold as a ready set.
- LPDDR5: low-power DRAM used in phones and edge devices.
- Memory bandwidth: how many bytes per second memory can move.
- eMMC: flash storage soldered to a board.
- NOR flash: small flash chip that holds boot code and keys.
- PMIC: power management chip; makes the right voltages from the input.
- 699-pin connector: the board-to-board socket between module and carrier.
- Thermal transfer plate: metal plate on the module that carries heat to the heatsink.
- CUDA core: a basic GPU math unit.
- Tensor core: a GPU unit built for matrix multiply, the core of AI math.
- Ampere: NVIDIA GPU architecture generation used here.
- GPC, TPC, SM: GPU building blocks; a graphics processing cluster holds texture processing clusters, which hold streaming multiprocessors.
- Arm Cortex-A78AE: an Arm CPU core made for safety uses such as cars.
- Cluster: a group of CPU cores that share a cache.
- L2, L3 cache: fast memory between the CPU core and main memory.
- DLA / NVDLA: deep learning accelerator; a fixed engine for neural network layers.
- PVA: programmable vision accelerator; an engine for image processing.
- NVENC, NVDEC: hardware video encoder and decoder.
- TOPS: trillions of operations per second.
- INT8: 8-bit integer math.
- Sparse vs dense: sparse TOPS assume many weights are zero and skipped; dense TOPS do not. Dense is half of sparse here.
- PCIe: fast link for add-in cards and drives.
- CSI: camera serial interface, the link for camera sensors.
- NVMe: fast SSD protocol.
- 8 nm: a chip making process name; not a literal size.
- Die: the cut piece of silicon holding the circuits.

## 8. What is not public or uncertain (be explicit; the page must say "not published" rather than guess)
- Die size: not published by NVIDIA. No source found.
- Transistor count: not published for the Jetson AGX Orin. NVIDIA and press cited about 17 billion for the Orin SoC at its 2019 announcement (DRIVE Orin); this was not re-checked at a primary source and not shown for the Jetson part. Treat as unverified.
- Foundry and node: the brief says Samsung 8 nm. A press source says Orin is on 8 nm; no NVIDIA page fetched here names Samsung. Mark as reported, unverified.
- The 275 TOPS figure is sparse INT8 and a peak, not a measured result. Dense is 137.5 TOPS (derived: 85 GPU + 52.5 DLA). It excludes PVA.
- The GPU at 170 sparse TOPS and the 8 TPC, 16 SM breakdown (SM count derived: 2 per TPC) are from the datasheet; the die shot reading of 4 groups of 8 SMs on a forum is for the full chip and is not a product claim.
- DRAM chip vendor, part numbers, chip count and PMIC part number: not published here. The paid TechInsights teardown was not accessible (403).
- Dev kit heatsink details, CSI lane count on the kit connector and kit input voltage: not stated on the layout page.
- The 204.8 GB/s figure is stated by NVIDIA; it matches 256 bit at 6400 MT/s (datasheet lists 3200 MHz max DRAM clock).
- LLM speed on this device (7B, 13B) is not in the sources; do not state tokens per second.

## 9. Sources (numbered; official spec pages, whitepapers, reputable teardowns; include access date)
- S1. NVIDIA, Jetson Orin product page, spec table for AGX Orin 64GB. https://www.nvidia.com/en-us/autonomous-machines/embedded-systems/jetson-orin/ . Accessed 2026-10-27.
- S2. NVIDIA, Jetson AGX Orin Series datasheet DS-10662-001 v1.0 (mirror: https://openzeka.com/wp-content/uploads/2022/03/DS-10662-001_v1.0.pdf). Accessed 2026-10-27. Source of 12 cores in 3 clusters, 2 GPC / 8 TPC, 170 and 105 sparse TOPS, 52.5 per DLA, PVA, cache sizes, 100 x 87 x 16 mm, 699-pin connector, 60 W, 5 V and 12 V input.
- S3. NVIDIA, Jetson AGX Orin Developer Kit user guide, hardware layout. https://docs.nvidia.com/jetson/agx-orin-devkit/user-guide/latest/hardware_layout.html . Accessed 2026-10-27.
- S4. TechInsights, teardown of the Nvidia Jetson AGX Orin Developer Kit (summary only; full report paywalled, page returned 403). https://electronics360.globalspec.com/article/23041/techinsights-teardown-nvidia-jetson-agx-orin-developer-kit . Accessed 2026-10-27; no numbers taken from it.
- S5. Derived: dense TOPS = sparse / 2 per datasheet S2 (GPU 85, DLA 52.5 given explicitly).
- S6. AnandTech, NVIDIA Details DRIVE AGX Orin (2019/2020), reported about 17 billion transistors, 8 nm (search snippet only, page not fetched). https://at-web1.www.anandtech.com/show/15245/nvidia-details-drive-agx-orin-a-herculean-arm-automotive-soc-for-2022 . Not verified.
