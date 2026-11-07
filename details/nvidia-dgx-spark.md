# NVIDIA DGX Spark (NVIDIA, 2025)

Slug: nvidia-dgx-spark. Written: 2026-10-27. Researcher: Claude Sonnet 5.5 (research agent). Status: draft, numbers verified against the sources listed at the end.

## 1. What it is (3 sentences, plain words)
The DGX Spark is a small desktop AI computer, about 150 by 150 by 50 mm. It is built around one NVIDIA GB10 chip: a 20-core Arm CPU and a Blackwell GPU share one package and one 128 GB pool of LPDDR5x memory [S1][S2]. Two units can be linked over 200 Gb/s ConnectX-7 networking to run larger models [S1][S3].

## 2. Why it is in this gallery (1 to 2 sentences; the owner's interest, given in the brief)
Zaur evaluated it against his own RTX 4090 box when planning local inference and fine-tuning. The trade is capacity against speed: 128 GB shared memory at 273 GB/s here [S1], versus 24 GB of GDDR6X on a 4090 [S8].

## 3. Hero facts (exactly 3, each one number with unit and source id)
- 128 GB of LPDDR5x unified memory shared by CPU and GPU, on a 256-bit bus at 273 GB/s [S1][S2].
- Up to 1 PFLOP at FP4 with sparsity (a theoretical peak; dense FP4 is about half, and measured BF16 is 99.8 TFLOPS) [S1][S3].
- 150 x 150 x 50.5 mm and 1.2 kg, powered by a 240 W external adapter, with a 140 W chip TDP [S1].

## 4. Teardown tree (the 3D model is built from this; keep shapes schematic, counts and hierarchy real)
Levels: 3. Level 1 is the whole device as it ships. Each level answers "what is inside X?".

| Level | Part id | Parent | Count | Role (compute, memory, io, power, cooling, structure, interconnect) | Material and colour | Shape hint (box, rbox, cyl, grid, fan, wafer, slab) | Relative size and position (plain words) | Enter (opens which level) |
|---|---|---|---|---|---|---|---|---|
| 1 | spark-box | none | 1 | structure | Metal alloy shell, champagne gold (Founders Edition) [S3] | rbox | 150 x 150 x 50.5 mm cube-like box, ports on the rear | 2 (mainboard) |
| 1 | shell-cooling | spark-box | 1 | cooling | Metal shell and internal heat path; fan count not published | slab | Fills the box around the board; vents front and rear (schematic) | none |
| 1 | mainboard | spark-box | 1 | structure | Green PCB | slab | Fills most of the interior, flat in the middle | 2 (mainboard) |
| 1 | base-cover | spark-box | 1 | structure | Metal, magnetic, hides 4 screws [S3] | slab | Bottom plate, thin | none |
| 1 | power-brick | spark-box | 1 | power | Black plastic, external 240 W USB-C adapter [S1][S3] | box | Sits outside the box, linked by cable to a USB-C port | none |
| 2 | gb10-package | mainboard | 1 | compute | Dark package with metal lid | rbox | Centre of the board, the largest chip | 3 (gb10) |
| 2 | lpddr5x | mainboard | 8 | memory | Black soldered packages [S3] | box | Four-ish each side, flanking the GB10 (arrangement schematic) | none |
| 2 | nvme-ssd | mainboard | 1 | memory | M.2 2242 stick, PCIe Gen5, 1 TB or 4 TB [S1][S3] | slab | Small stick on one board edge | none |
| 2 | connectx7 | mainboard | 1 | interconnect | NIC chip, next to the GB10 [S3] | box | Beside the GB10, wired to the 2 rear QSFP cages | none |
| 2 | io-ports | mainboard | 1 set | io | Metal ports: 4 USB-C, 1 HDMI, 1 RJ-45, 2 QSFP [S1] | box | Along the rear edge | none |
| 2 | wifi-module | mainboard | 1 | io | Small MediaTek Wi-Fi 7 card on PCIe Gen3 x1 [S3] | slab | Small card near the edge, antennas run to the top | none |
| 3 | cpu-die | gb10-package | 1 | compute | Silicon, grey (MediaTek "S-Die") [S4] | box | Left half of the package | none |
| 3 | cpu-cores | cpu-die | 20 (10 X925 + 10 A725) | compute | Silicon | grid | Grid inside the CPU die: 2 clusters of 10 | none |
| 3 | gpu-die | gb10-package | 1 | compute | Silicon, green (NVIDIA "G-Die") [S4] | box | Right half of the package | none |
| 3 | nvlink-c2c | gb10-package | 1 | interconnect | Die-to-die link in the package [S4] | slab | Thin strip between the two dies | none |
| 3 | mem-controller | cpu-die | 1 | memory | 256-bit LPDDR5x controller on the CPU die [S4] | box | Edge of the CPU die facing the memory packages | none |

Explode order (outer to inner, one line per part):
1. power-brick (moves out first, it is outside)
2. base-cover
3. shell-cooling
4. spark-box shell
5. mainboard
6. lpddr5x, nvme-ssd, connectx7, wifi-module, io-ports
7. gb10-package lid
8. cpu-die and gpu-die, apart
9. nvlink-c2c strip between them

X-ray covers (parts that go transparent): spark-box shell, shell-cooling, base-cover, gb10-package lid.

## 5. Flows (1 to 3 per level: real data or power paths with the real number)
| Level | From | To | What moves | Number (unit) | Source id |
|---|---|---|---|---|---|
| 1 | power-brick | mainboard | DC power over USB-C (rated supply) | 240 W | S1, S3 |
| 1 | mainboard | rear QSFP ports | Network traffic from ConnectX-7 | 200 Gb/s total | S1, S5 |
| 2 | lpddr5x | gb10-package | Weights and activations | 273 GB/s | S1 |
| 2 | nvme-ssd | gb10-package | Model files, sequential read (measured) | 11.4 GiB/s | S3 |
| 2 | connectx7 | gb10-package | PCIe 5.0, two x4 links | 2 x PCIe Gen5 x4 | S3, S5 |
| 3 | cpu-die | gpu-die | NVLink-C2C chip-to-chip | 300 GB/s each direction | S4 |
| 3 | mem-controller | lpddr5x | LPDDR5x bus, 256-bit | 273 GB/s | S1 |

## 6. Callouts for the gallery (4 to 6 per level; title <= 3 words; text <= 12 words with one number)
| Level | Part id | Title | Text |
|---|---|---|---|
| 1 | spark-box | Tiny box | Only 1.2 kg and 50.5 mm tall. |
| 1 | power-brick | External power | A 240 W USB-C brick keeps heat out of the box. |
| 1 | shell-cooling | Metal shell | Shell and heat path cool a 140 W chip. |
| 1 | spark-box | Quiet | Declared sound power is 35 dB at full GPU load. |
| 1 | base-cover | Magnetic base | A magnetic cover hides 4 screws. |
| 2 | gb10-package | One package | CPU and GPU share one 128 GB pool. |
| 2 | lpddr5x | Soldered memory | 8 LPDDR5x packages sit around the chip. |
| 2 | nvme-ssd | Small SSD | M.2 2242 stick, up to 4 TB. |
| 2 | connectx7 | Pair two | 200 Gb/s NIC links two Sparks. |
| 2 | io-ports | Rear ports | 4 USB-C, HDMI, 10 GbE and 2 QSFP. |
| 3 | cpu-cores | 20 Arm cores | 10 X925 big cores plus 10 A725 cores. |
| 3 | nvlink-c2c | Chip link | 300 GB/s each way between CPU and GPU dies. |
| 3 | mem-controller | Memory bottleneck | Bus is 273 GB/s, versus 1008 GB/s on a 4090. |
| 3 | gpu-die | Blackwell GPU | 5th-gen Tensor Cores; claimed 1 PFLOP FP4 sparse. |

## 7. Glossary (every technical word used above, one line each, own words)
- GB10: the NVIDIA and MediaTek chip inside the Spark, a CPU die and a GPU die in one package.
- Superchip: a CPU and a GPU joined so tightly they share memory.
- Blackwell: NVIDIA's GPU architecture generation used here.
- Unified memory: one memory pool that CPU and GPU both read and write.
- LPDDR5x: low-power memory, soldered next to the chip.
- Memory bandwidth: how many bytes per second the chip can read from memory.
- NVLink-C2C: NVIDIA's direct chip-to-chip link, here inside the package.
- Chiplet or die: one piece of silicon; a package can hold several.
- Cortex-X925: a fast Arm CPU core.
- Cortex-A725: a smaller, efficient Arm CPU core.
- Tensor Core: a GPU unit that does matrix math fast.
- FP4: 4-bit floating point numbers, small and fast, less precise.
- Sparse (sparsity): a trick that skips zeros in matrices; the headline PFLOP number assumes it. Dense is about half.
- Dense: no zero-skipping; the honest everyday speed.
- PFLOP: one quadrillion floating point operations per second.
- TOPS: trillions of operations per second, the same idea for integer or low-bit math.
- TDP: thermal design power, the heat the cooling must handle.
- ConnectX-7: NVIDIA's network card chip, up to 200 Gb/s.
- QSFP: a plug cage for fast network cables.
- NIC: network interface card.
- PCIe: the standard board-level link between chips and cards.
- NVMe M.2 SSD: a small flash storage stick.
- Unified-memory trade: more memory capacity but slower memory than a gaming GPU.
- GDDR6X: fast graphics memory used on the RTX 4090.
- SM (streaming multiprocessor): a GPU compute block.
- CUDA core: one basic GPU math lane.
- SLC (system-level cache): a shared cache sitting near the memory.
- L3 cache: a cache shared by the CPU cores in a cluster.
- Inference: running a trained model to get answers.
- Fine-tuning: training a model a little more on your own data.
- NVFP4: NVIDIA's 4-bit float format.

## 8. What is not public or uncertain (be explicit; the page must say "not published" rather than guess)
- GPU SM count: not published by NVIDIA. Leaks suggest 48 SMs, 192 Tensor Cores [S4]. NVIDIA's doc gives 6,144 CUDA cores [S1].
- Die sizes (CPU die and GPU die): not published.
- Process node: TSMC 3 nm is reported for both chiplets in a Hot Chips 2025 write-up [S4]. Not stated on NVIDIA's product page [S2]. Treat as reported, not official.
- Fan count, heatsink and vapor chamber design inside the Founders Edition: not published by NVIDIA. No full public teardown was found. StorageReview calls the shell a passive heat spreader and mentions no fan [S3]. A ServeTheHome reader comment claims twin fans, which applies to ASUS or is unconfirmed [S5]. Do not draw a fan as fact; the cooling part in the model is schematic.
- Whether the mainboard layout (8 LPDDR5x packages "flanking" the GB10) matches the exact positions drawn: the count is from StorageReview [S3]; precise positions are not published.
- Per-die TDP split: not published. Only the 140 W whole-SoC figure and 100 W for the rest are given [S1].
- Clock speeds: no official GPU clock. A reported 2.54 GHz boost is an estimate from the 1,000 TOPS claim [S4]. CPU 3.9 GHz comes from a benchmark leak, not a spec [S6].
- Dense FP4 TFLOPS: not published. About 400 dense and 800 sparse are extrapolations in a review, not measurements [S3].
- Memory speed: NVIDIA lists 4266 MHz (LPDDR5x-8533) and 273 GB/s [S1]. A Hot Chips report gives a controller ceiling of 9400 MT/s and about 301 GB/s [S4]. The shipping product runs at 273 GB/s.
- RTX 4090 bandwidth: NVIDIA's page gives 384-bit and 24 GB but no GB/s figure [S8]. The 1008 GB/s in callouts is derived (384-bit x 21 Gbps per pin, an unlisted pin rate from memory) and should be checked.
- ConnectX-7 wiring: reported as two PCIe Gen5 x4 links, so it shows as four network interfaces [S3][S5]. Whether 200 Gb/s is one port or split across the two QSFP ports is not confirmed on NVIDIA's pages.
- Measured power draw of the whole box: not published in the sources checked. GPU power in one load test was 69.3 to 76.0 W across five OEM systems, not FE specific [S7].
- Price and launch date: not on NVIDIA's product page [S2].
- Weight differs by edition: 1.2 kg (Founders Edition) [S1], 1.48 kg (ASUS GX10) [S5].

## 9. Sources (numbered; official spec pages, whitepapers, reputable teardowns; include access date)
All accessed 2026-10-27.
- S1: NVIDIA DGX Spark Hardware Overview, https://docs.nvidia.com/dgx/dgx-spark/hardware.html
- S2: NVIDIA DGX Spark product page, https://www.nvidia.com/en-us/products/workstations/dgx-spark/
- S3: StorageReview, NVIDIA DGX Spark review, https://storagereview.com/review/nvidia-dgx-spark-review-the-ai-appliance-bringing-datacenter-capabilities-to-desktops
- S4: HWCooling, GB10 details from Hot Chips 2025, https://www.hwcooling.net/en/?p=258118
- S5: ServeTheHome, ASUS Ascent GX10 review (same GB10 platform, not the Founders Edition), https://www.servethehome.com/asus-ascent-gx10-review-a-new-nvidia-gb10-solution/
- S6: Search summary of MediaTek/NVIDIA GB10 coverage (TechNews, CRN India, Futurum), https://www.crn.in/?p=73494 and https://technews.tw/?p=1382800. MediaTek's own notes were not fetched directly.
- S7: StorageReview, DGX Spark thermal test, https://www.storagereview.com/review/nvidia-dgx-spark-thermal-test-how-oem-cooling-designs-stack-up
- S8: NVIDIA GeForce RTX 4090 page, https://www.nvidia.com/en-us/geforce/graphics-cards/40-series/rtx-4090/
- Not used as a source but relevant: ChargerLab teardown of the 240 W adapter, https://www.chargerlab.com/teardown-of-the-nvidia-dgx-spark-original-240w-usb-c-power-adapter/
