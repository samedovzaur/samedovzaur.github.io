# HC1 Hardcore Model chip (Taalas, 2026)

Slug: taalas-hardcore. Written: 2026-10-27. Researcher: Claude (Sonnet 5.5) research agent. Status: draft, numbers verified against the sources listed at the end.

## 1. What it is (3 sentences, plain words)
The HC1 is a chip from Taalas, a Toronto company. It has one AI model, Llama 3.1 8B, built into the silicon itself, so the weights are part of the circuit and not loaded from memory. A small programmable SRAM holds the KV cache and fine-tuning (LoRA) weights, and the chip runs only that one model. [S1, S2, S4]

## 2. Why it is in this gallery (1 to 2 sentences; the owner's interest, given in the brief)
The owner wrote a long research journal and a short book about Taalas ("Hard Wired"). He sees it as the opposite design point to a general GPU: the model is the computer, not a program that runs on one.

## 3. Hero facts (exactly 3, each one number with unit and source id)
- Taalas claims 17,000 tokens per second per user on Llama 3.1 8B (Taalas-measured; EE Times saw 15,000+ on the public demo). [S1, S2]
- HC1 draws about 250 W per chip, air-cooled; 10 cards in a server draw about 2.5 kW. [S2, S4]
- One model change needs only 2 mask layers re-made, about 2 months from model to chip, per Taalas. [S2, S4]

## 4. Teardown tree (the 3D model is built from this; keep shapes schematic, counts and hierarchy real)
Levels: 3. Level 1 is the card as it ships. Level 2 is the die floor plan. Level 3 is one weight-storage bank. Only the hierarchy and the counts marked with a source are real. Block sizes and positions are schematic; the real floor plan is not published (see section 8).

| Level | Part id | Parent | Count | Role (compute, memory, io, power, cooling, structure, interconnect) | Material and colour | Shape hint (box, rbox, cyl, grid, fan, wafer, slab) | Relative size and position (plain words) | Enter (opens which level) |
|---|---|---|---|---|---|---|---|---|
| 1 | hc1-card | root | 1 (10 per server, S2) | structure | green PCB, dark heat sink | slab | Full-height card shape is schematic; exact form factor not published | opens level 2 via hc1-package |
| 1 | hc1-package | hc1-card | 1 | structure | black package, metal lid | rbox | Sits in the middle of the card; no HBM stacks beside it (S1) | opens level 2 |
| 1 | pcie-edge | hc1-card | 1 | io | gold contact fingers | slab | Along the bottom edge; card is shown as a PCIe card in S2, protocol not stated | none |
| 1 | cooler | hc1-card | 1 | cooling | grey aluminium | grid | Over the package; air-cooled per S4, fin design not published | none |
| 1 | power-delivery | hc1-card | not published | power | dark components | box | Small parts around the package; not described in any source | none |
| 2 | die-815 | hc1-package | 1 | structure | grey silicon, TSMC N6, 815 mm2 (S2, S3) | wafer | One large square die, about 28.5 mm per side (calculated, if square) | opens level 3 via recall-fabric |
| 2 | recall-fabric | die-815 | not published | memory | warm gold, mask ROM | grid | Most of the die area; holds the Llama 3.1 8B weights (S2) | opens level 3 |
| 2 | compute-fabric | die-815 | not published | compute | blue, digital logic | grid | Interleaved with the ROM, not a separate block; multiply is done at the weight (S2) | opens level 3 |
| 2 | sram-block | die-815 | not published | memory | teal, programmable SRAM | box | Smaller block; holds KV cache and LoRA weights (S2, S4); capacity not published | none |
| 2 | dataflow-wiring | die-815 | not published | interconnect | thin copper lines | grid | Top metal layers; the weights and dataflow live in 2 mask layers (S2) | none |
| 2 | host-io | die-815 | not published | io | purple | box | Die edge, towards the card edge; type not published | none |
| 3 | rom-bank | recall-fabric | not published | memory | gold cells in a grid | grid | One patch of the fabric, drawn as a repeating cell array | none |
| 3 | weight-cell | rom-bank | not published | memory | single gold transistor | cyl | One transistor stores a 4-bit parameter and multiplies; Bajic says so (S2) | none |
| 3 | mult-path | rom-bank | not published | compute | blue line | box | Short path from the cell to a digital adder tree; adder tree layout not published | none |

Explode order (outer to inner, one line per part):
1. cooler lifts off the package.
2. hc1-package lid lifts to show the die.
3. power-delivery and pcie-edge slide out from the card.
4. hc1-card board drops away.
5. die-815 separates into recall-fabric, compute-fabric, sram-block, host-io, dataflow-wiring.
6. rom-bank expands into weight-cell and mult-path.

X-ray covers (parts that go transparent): cooler, hc1-package lid, dataflow-wiring (top metal layers, to show the ROM below).

## 5. Flows (1 to 3 per level: real data or power paths with the real number)
| Level | From | To | What moves | Number (unit) | Source id |
|---|---|---|---|---|---|
| 1 | host (card edge) | hc1-package | prompt tokens in, generated tokens out | 17,000 tokens/s per user (Taalas claim) | S1 |
| 1 | server power | 10 cards | electrical power | about 2.5 kW per server, about 250 W per chip | S2 |
| 2 | sram-block | compute-fabric | KV cache and LoRA weights | capacity and bandwidth not published | S2, S4 |
| 3 | weight-cell | mult-path | one 4-bit weight, multiplied in place | 1 transistor per 4-bit parameter (Bajic) | S2 |

## 6. Callouts for the gallery (4 to 6 per level; title <= 3 words; text <= 12 words with one number)
| Level | Part id | Title | Text |
|---|---|---|---|
| 1 | hc1-card | One model | Llama 3.1 8B is fixed in the chip; no other model runs. |
| 1 | hc1-package | No HBM | Taalas says the chip needs no HBM, no 3D stacking, no liquid cooling. |
| 1 | cooler | Air cooled | About 250 W per chip, so standard air-cooled racks work. |
| 1 | hc1-card | Speed claim | Taalas claims 17,000 tokens per second per user. |
| 1 | hc1-card | Server size | 10 cards in one server draw about 2.5 kW. |
| 2 | die-815 | Big die | 815 mm2 on TSMC N6, per Taalas. |
| 2 | recall-fabric | Weights as wires | Mask ROM holds the Llama 3.1 8B weights. |
| 2 | sram-block | Small writable part | SRAM keeps the KV cache and LoRA weights; size not published. |
| 2 | dataflow-wiring | Two masks | Changing 2 mask layers retargets the chip to a new model. |
| 2 | compute-fabric | Fully digital | Compute is digital; ROM and multiply are merged. |
| 3 | weight-cell | One transistor | One transistor stores a 4-bit weight and multiplies, says Bajic. |
| 3 | rom-bank | No fetch | Weights never travel; the multiplier sits where the weight is. |
| 3 | rom-bank | Mixed bits | Taalas uses 3-bit and 6-bit parameters on HC1. |
| 3 | mult-path | Frozen at fab | The weights cannot change after the mask is made. |

## 7. Glossary (every technical word used above, one line each, own words)
- Token: a small piece of text, about a word or part of one, that an LLM reads or writes.
- Tokens per second per user: how fast one user gets text back.
- LLM: large language model, a neural network that predicts text.
- Weights: the stored numbers that make up a trained model.
- Parameter: one weight.
- Llama 3.1 8B: an open model from Meta with about 8 billion parameters.
- Quantization: storing weights with fewer bits to save space; this costs some quality.
- Mask ROM: read-only memory whose contents are set by a chip-making mask, so it never changes.
- Mask layer: one of the patterned layers used to print a chip.
- Tape-out: sending the final chip design to the factory.
- SRAM: fast on-chip memory that can be written and read at any time.
- KV cache: saved intermediate results of earlier tokens, so the model does not redo them.
- LoRA: a small add-on set of weights that tunes a base model for a task.
- HBM: stacked memory next to a GPU; big and costly, not on HC1.
- Memory wall: the speed limit that comes from moving weights between memory and compute.
- Die: the piece of silicon that holds the circuits.
- TSMC N6: a 6 nm-class chip process from TSMC.
- TDP: the power a chip is designed to give off as heat.
- PCIe: the standard slot and link used for add-in cards.
- Recall fabric: Taalas's term, as used by EE Times, for the ROM-based weight storage.
- Structured ASIC: a chip where only the top wiring layers change per customer.
- GPU: a general-purpose parallel processor that runs the model as software.
- Hardcore Model: Taalas's name for a model turned into custom silicon.
- Digital compute: arithmetic done with logic gates, not analog signals.

## 8. What is not public or uncertain (be explicit; the page must say "not published" rather than guess)
- Throughput versus power: the "100x per watt or per dollar" figure in the brief is not what Taalas published. Taalas states about 10X less power, 20X less build cost and nearly 10X faster than the state of the art. TrendForce reports 48 times a B200 on speed. [S1, S4] Do not show 100x.
- All benchmark numbers are Taalas's own. Taalas set the test as Llama 3.1 8B, 1k/1k tokens, H200 from Nvidia data, B200 measured by Taalas. [S1] Independent checks so far: EE Times measured 15,000+ tokens/s on the public demo; heise reports almost 16,000. [S2, S3] One press summary mentions a 14,357 tokens/s analyst test; I could not trace it to a primary source, so it is not used.
- Price of the chip or card: not published. Taalas gives a cost per token (0.75 cents per million tokens on Llama 3.1 8B, versus 3.79 cents for a B200), attributed to its own analysis. [S4] The business model is undecided (own API, chip sales or custom chips). [S2]
- Model size and quantization: Llama 3.1 8B, with a custom 3-bit base type and 3-bit and 6-bit parameters; some quality loss versus GPU. [S1] Bajic describes a 4-bit parameter on one transistor in S2. Those two statements do not fully match, so the exact bit layout is not published.
- Process node and die: TSMC N6 and 815 mm2 from EE Times and heise (attributed to Taalas). Taalas's own page does not give them. [S1, S2, S3] Transistor count: heise reports "around 53 billion", attributed to Taalas. [S3] Not on the Taalas page; not used in the teardown.
- Floor plan: not published. Sizes, positions and the counts of ROM banks, compute units, SRAM blocks and IO blocks are not public. The die view in this gallery is schematic.
- SRAM capacity, KV cache size, supported context length and LoRA limits: not published.
- Host interface: shown as a PCIe card in S2, but the protocol, lane count and card form factor are not stated. The card power circuits and cooler design are not described.
- Server details beyond "10 cards, about 2.5 kW": not published. The two numbers appear in S2 only.
- How the ROM and multiplier are merged: Bajic gave only the one-transistor statement. [S2] Bit-cell design is not published.
- Multi-chip: Taalas simulated DeepSeek R1-671B on about 30 chips at about 12,000 tokens/s per user and 7.6 cents per million tokens. That is a simulation, not a shipped product. [S2]
- Ownership: AMD announced on 2026-08-06 that it agreed to acquire Taalas. Terms are undisclosed and closing needs approvals. [S5] The effect on the product line is not published.
- Roadmap: Taalas said a mid-size reasoning model would follow on HC1 and a frontier model on a second-generation chip (HC2, 4-bit floating point) by winter. [S1, S2] Whether either has shipped was not checked.
- Qualitative only: the design puts storage and compute on one chip at DRAM-like density, with no external memory. [S1] The HC1 is "intended largely as a demo". [S2]
- Owner notes: the owner's own notes in /Users/zaursamadov/chat-recall-data/corpus/ (chats of 2026-02-20 and 2026-04-25) were read for context only. Claims there (patents, founder list, "1000x" efficiency) are not used because they have no public source here. Founder and team claims in section 1 are limited to S1.

## 9. Sources (numbered; official spec pages, whitepapers, reputable teardowns; include access date)
- S1. Taalas, "The path to ubiquitous AI", by Ljubisa Bajic, Feb 2026. https://taalas.com/the-path-to-ubiquitous-ai/ (accessed 2026-10-27)
- S2. Sally Ward-Foxton, "Taalas Specializes to Extremes for Extraordinary Token Speed", EE Times, 2026-02-19. https://www.eetimes.com/taalas-specializes-to-extremes-for-extraordinary-token-speed/ (accessed 2026-10-27)
- S3. heise online, "AI inference cast in silicon: Taalas announces HC1 chip", Feb 2026. https://www.heise.de/en/news/AI-inference-cast-in-silicon-Taalas-announces-HC1-chip-11185112.html (accessed 2026-10-27)
- S4. TrendForce Insights, "The Inference Economy Arrives: AI Chip Rules Are Being Rewritten". https://insights.trendforce.com/p/ai-inference-chip-architecture (accessed 2026-10-27)
- S5. AMD press release, "AMD Acquires Taalas to Advance Compute Solutions for Rapidly Growing AI Inference Market", 2026-08-06. https://ir.amd.com/news-events/press-releases/detail/1296/amd-acquires-taalas-to-accelerate-ai-inference/ (accessed 2026-10-27; seen in search results, page body not read)
