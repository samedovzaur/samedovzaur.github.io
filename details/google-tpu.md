# Google TPU Ironwood, TPU v7 (Google, 2025)

Slug: google-tpu. Written: 2026-10-27. Researcher: Claude Sonnet 5.5 research agent. Status: draft, numbers verified against the sources listed at the end.

## 1. What it is (3 sentences, plain words)
Ironwood is the seventh generation of Google's Tensor Processing Unit, a chip built only for AI math. Each chip holds two compute dies, eight HBM3E memory stacks, and links to six neighbours in a 3D torus. Four chips sit on one liquid-cooled tray, 64 chips fill a rack, and optical switches join 144 racks into a 9,216-chip pod.

## 2. Why it is in this gallery (1 to 2 sentences; the owner's interest, given in the brief)
The systolic array is the cleanest example of a matrix engine. The owner compares it to GPU tensor cores.

## 3. Hero facts (exactly 3, each one number with unit and source id)
- 4,614 TFLOPS peak FP8 per chip (2,307 TFLOPS BF16) [S1]
- 192 GiB HBM3E per chip at 7,380 GB/s, in eight stacks [S1, S2]
- 9,216 chips per pod, joined by 3D torus ICI and optical circuit switches [S1, S2]

## 4. Teardown tree (the 3D model is built from this; keep shapes schematic, counts and hierarchy real)
Levels: 3. Level 1 is the tray. Level 2 is one chip. Level 3 is one TensorCore with its MXU. Each level answers "what is inside X?".

| Level | Part id | Parent | Count | Role (compute, memory, io, power, cooling, structure, interconnect) | Material and colour | Shape hint (box, rbox, cyl, grid, fan, wafer, slab) | Relative size and position (plain words) | Enter (opens which level) |
|---|---|---|---|---|---|---|---|---|
| 1 | tray | none | 1 (16 per rack) | structure | green PCB with metal frame | slab | Wide flat board, the whole device as shipped | opens level 2 via chip |
| 1 | tpu-chip | tray | 4 | compute | dark package, silver lid | rbox | Four packages in a row on the board | level 2 |
| 1 | cold-plate | tray | 4 (one per chip) | cooling | copper and silver | slab | Flat plate on top of each chip | none |
| 1 | coolant-lines | tray | 1 loop set | cooling | blue tubes | cyl | Tubes running along the tray to each cold plate | none |
| 1 | ici-ports | tray | 6 links per chip | interconnect | gold connectors | grid | Along the board edge, toward neighbours | none |
| 1 | host-link | tray | 1 PCIe path per chip group | io | thin grey cable | cyl | Joins the tray to a separate CPU host | none |
| 2 | compute-die | tpu-chip | 2 | compute | dark silicon, N3P process (secondary source) | box | Two equal dies side by side in the middle | level 3 via tensorcore |
| 2 | tensorcore | compute-die | 1 per die (2 per chip) | compute | blue block on die | box | Large block on each die | level 3 |
| 2 | sparsecore | compute-die | 2 per die (4 per chip) | compute | orange block on die | box | Small blocks next to the TensorCore | none |
| 2 | d2d-link | tpu-chip | 1 | interconnect | thin gold strip | slab | Strip between the two dies | none |
| 2 | hbm-stack | tpu-chip | 8 (4 per die) | memory | grey stacked layers | box | Four stacks on each outer side of the dies | none |
| 2 | ici-phy | tpu-chip | 6 links | interconnect | gold | grid | Chip edge, toward the tray edge | none |
| 3 | mxu | tensorcore | count not published | compute | bright blue grid | grid | Large square array, the biggest block | none |
| 3 | mxu-cell | mxu | 256 x 256 cells | compute | small blue squares | grid | Repeated multiply-accumulate cell | none |
| 3 | vpu | tensorcore | 1 | compute | teal block | box | Strip beside the MXU for vector math | none |
| 3 | scalar-unit | tensorcore | 1 | compute | purple block | box | Small block that runs control flow | none |
| 3 | vector-mem | tensorcore | 1 | memory | green block | box | On-chip SRAM near the VPU, size not published | none |

Explode order (outer to inner, one line per part):
1. cold-plate lifts off the chips.
2. coolant-lines lift away with the plates.
3. tpu-chip lifts off the tray (level 1 done).
4. hbm-stack moves out to the sides (level 2).
5. sparsecore and d2d-link spread apart.
6. tensorcore opens to show mxu, vpu, scalar-unit, vector-mem (level 3).

X-ray covers (parts that go transparent): cold-plate, chip lid, hbm-stack tops, tensorcore top layer.

## 5. Flows (1 to 3 per level: real data or power paths with the real number)
| Level | From | To | What moves | Number (unit) | Source id |
|---|---|---|---|---|---|
| 1 | tpu-chip | neighbour chip | ICI traffic, six links | 1,200 GB/s bidirectional per chip (200 GB/s per link) | S1 |
| 1 | tray | CPU host | PCIe, four chips per host | not published | S1 |
| 1 | tpu-chip | datacenter network | DCN traffic | 100 Gbps per chip | S1 |
| 2 | hbm-stack | tensorcore | weights and activations | 7,380 GB/s per chip | S1 |
| 2 | compute-die | compute-die | die-to-die traffic | 6x one 1D ICI link (about 1,200 GB/s, derived) | S1 |
| 3 | hbm-stack | mxu | weights loaded, then data streamed in | not published per MXU | S4 |
| 3 | mxu | vpu | FP32 accumulated results | not published | S4 |

## 6. Callouts for the gallery (4 to 6 per level; title <= 3 words; text <= 12 words with one number)
| Level | Part id | Title | Text |
|---|---|---|---|
| 1 | tray | Four chips | Each liquid-cooled tray holds 4 Ironwood chips. |
| 1 | coolant-lines | Liquid cooled | Liquid cooling sustains up to 2x the performance of air. |
| 1 | ici-ports | Six neighbours | Each chip links to 6 neighbours in a 3D torus. |
| 1 | tray | 64-chip cube | 16 trays make one 64-chip rack called a cube. |
| 1 | ici-ports | Optical pod | Optical switches join 144 cubes into 9,216 chips. |
| 1 | tpu-chip | 4,614 TFLOPS | Peak FP8 compute for one chip. |
| 2 | compute-die | Two dies | One chip is two compute dies in one package. |
| 2 | hbm-stack | Eight stacks | 8 HBM3E stacks give 192 GiB per chip. |
| 2 | hbm-stack | 7.4 TB/s | Memory bandwidth feeds the matrix engines at 7,380 GB/s. |
| 2 | sparsecore | SparseCore | 4 SparseCores per chip handle embedding lookups. |
| 2 | tensorcore | TensorCore | One TensorCore sits on each of the 2 dies. |
| 3 | mxu | Systolic array | Data flows through a grid of 256 x 256 cells. |
| 3 | mxu-cell | One MAC | Each cell multiplies and adds. The array does 65,536 per cycle. |
| 3 | mxu | No memory reads | Operands move cell to cell, with no memory access mid-multiply. |
| 3 | vpu | Vector unit | Handles activations and softmax, not matrix math. |
| 3 | scalar-unit | Scalar unit | Runs control flow and address maths. |
| 3 | mxu | FP8 and BF16 | Takes BF16 inputs, FP8 on this chip, accumulates in FP32. |

## 7. Glossary (every technical word used above, one line each, own words)
- TPU: Tensor Processing Unit. Google's chip for neural network math.
- TensorCore: the main compute block of a TPU. It holds the MXU, vector unit and scalar unit.
- MXU: Matrix Multiply Unit. A systolic array that does matrix multiplication.
- Systolic array: a grid of cells where data moves from cell to cell in rhythm, so each value is reused without going back to memory.
- MAC: multiply-accumulate. Multiply two numbers and add to a running sum.
- Tensor core (GPU): NVIDIA's matrix engine. Comparison only, not part of this device.
- VPU: vector processing unit. It works on many values at once for non-matrix math.
- Scalar unit: runs control flow and address maths, one value at a time.
- VMEM / vector memory: fast on-chip SRAM next to the vector unit.
- SparseCore: a small dataflow engine for embedding lookups.
- HBM3E: stacked high-bandwidth memory placed next to the chip.
- Chiplet / compute die: one silicon die. Ironwood joins two in one package.
- D2D: die-to-die link between the two compute dies.
- ICI: Inter-Chip Interconnect. Direct links between TPU chips.
- 3D torus: a grid where each chip has six neighbours and the edges wrap around.
- OCS: optical circuit switch. It reconnects light paths between racks without converting to electricity.
- Cube: a 64-chip rack, the unit the OCS connects.
- Pod / superpod: the full 9,216-chip system.
- DCN: data center network, used between pods.
- FP8, BF16, FP32: number formats of 8, 16 and 32 bits.
- PCIe: the bus that joins chips to the CPU host.
- Cold plate: a metal plate with liquid channels that sits on a chip.
- TFLOPS: trillions of floating point operations per second.

## 8. What is not public or uncertain (be explicit; the page must say "not published" rather than guess)
- MXUs per TensorCore on Ironwood: not published. Earlier chips: 4 per TensorCore on v4 [S8], 2 on v6e [S5].
- MXU size 256 x 256 for TPU7x: stated by Google docs [S4]. The Hot Chips slides were not machine-readable, so the slide text was not checked.
- Docs [S4] say a 256 x 256 MXU does "128K" bfloat16 multiply-accumulates per cycle. 256 x 256 is 65,536 cells. The 128K figure may count operations as 2 per MAC. Unresolved.
- Chip power or TDP: not published. A pod figure of about 10 MW comes from one press article [S7] only.
- VMEM size: not published.
- Clock speed: not published.
- Die size, transistor count: not published. The N3P process node is from secondary sources only.
- Die-to-die bandwidth: only "6x one 1D ICI link" [S1]. The 1,200 GB/s value is derived.
- PCIe bandwidth to the host: not published.
- Absolute tray dimensions and weight: not published.
- The 4,614 TFLOPS figure is FP8 [S1, S9]. One source labels it BF16 and is wrong per Google docs.
- The 256-chip "pod" in [S2] is four cubes. The 9,216-chip system is called a superpod there and a pod in [S1]. This page uses pod for 9,216.
- Tray count of 16 per rack is derived from 64 / 4 and matches [S7].

## 9. Sources (numbered; official spec pages, whitepapers, reputable teardowns; include access date)
All accessed 2026-10-27.
- S1: Google Cloud docs, TPU7x (Ironwood). https://docs.cloud.google.com/tpu/docs/tpu7x
- S2: Google Cloud blog, Inside the Ironwood TPU codesigned AI stack. https://cloud.google.com/blog/products/compute/inside-the-ironwood-tpu-codesigned-ai-stack
- S3: Google Cloud blog, Ironwood TPUs and new Axion-based VMs. https://cloud.google.com/blog/products/compute/ironwood-tpus-and-new-axion-based-vms-for-your-ai-workloads
- S4: Google Cloud docs, TPU system architecture (MXU section). https://docs.cloud.google.com/tpu/docs/system-architecture-tpu-vm
- S5: Google Cloud docs, TPU v6e (Trillium). https://docs.cloud.google.com/tpu/docs/v6e
- S6: Hot Chips 2025, Google Ironwood slides. https://hc2025.hotchips.org/assets/program/conference/day2/61_Google_Ironwood-Final.pdf (not text-extractable; listed as primary, not used for numbers)
- S7: ServeTheHome, Google Ironwood TPU at Hot Chips 2025. https://www.servethehome.com/google-ironwood-tpu-swings-for-reasoning-model-leadership-at-hot-chips-2025/
- S8: Jouppi et al., TPU v4, ISCA 2023. https://arxiv.org/abs/2304.01433 (4 MXUs per TensorCore taken from the paper body, not re-fetched; abstract checked for OCS and SparseCore)
- S9: The Register, Ironwood debut, 2025-04-10. https://www.theregister.com/2025/04/10/googles_7thgen_ironwood_tpus_debut/
