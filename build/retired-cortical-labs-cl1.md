# Cortical Labs CL1 (Cortical Labs, 2025)

Slug: cortical-labs-cl1. Written: 2026-10-27. Researcher: Claude Sonnet 5.5 (research agent). Status: draft, numbers verified against the sources listed at the end. No teardown of a real unit has been published, so the internal layout is built from company statements and press descriptions. Shapes in section 4 are schematic.

## 1. What it is (3 sentences, plain words)
The CL1 is a computer that uses living human neurons as its processor. About 800,000 lab-grown neurons sit on a flat silicon-and-glass electrode array, and the chip sends electrical pulses in and reads electrical spikes out. A life-support system in the same shoebox-sized unit keeps the cells alive for up to six months, and it can be bought as hardware or rented as Wetware-as-a-Service.

## 2. Why it is in this gallery (1 to 2 sentences; the owner's interest, given in the brief)
Zaur Samadov made a short documentary about Cortical Labs. The CL1 is the strangest "chip" in the gallery because the part that computes is alive.

## 3. Hero facts (exactly 3, each one number with unit and source id)
- About 800,000 human cortical neurons per culture, grown from stem cells [S5].
- 59 electrodes on the planar array in the CL1 (the Cortical Cloud paper counts 64 sites, 60 interactive) [S3][S5].
- US$35,000 per unit; a 30-unit rack uses about 850 to 1,000 W in total [S3].

## 4. Teardown tree (the 3D model is built from this; keep shapes schematic, counts and hierarchy real)
Levels: 3. Level 1 is the whole device as it ships. Each level answers "what is inside X?".

| Level | Part id | Parent | Count | Role (compute, memory, io, power, cooling, structure, interconnect) | Material and colour | Shape hint (box, rbox, cyl, grid, fan, wafer, slab) | Relative size and position (plain words) | Enter (opens which level) |
|---|---|---|---|---|---|---|---|---|
| 1 | cl1-unit | (root) | 1 | structure | Rectangular enclosure, light grey plastic and metal (finish not published) | rbox | Shoebox-sized; exact size not published | Opens level 2 |
| 2 | enclosure-shell | cl1-unit | 1 | structure | Grey shell with a front window or display area (display not confirmed) | rbox | Outer skin; first part to lift off | none |
| 2 | life-support-cabinet | cl1-unit | 1 | cooling | Steel and tubing, mid grey | rbox | Larger lower or rear section, holds all fluid parts | none |
| 2 | media-reservoir | life-support-cabinet | 1 (count not published) | io | Clear plastic bottle, pale pink (culture media) | cyl | Inside the cabinet, feeds the chip bay | none |
| 2 | waste-filtration | life-support-cabinet | 1 (count not published) | cooling | White filter cartridge | cyl | Next to the reservoir, on the return line | none |
| 2 | peristaltic-pumps | life-support-cabinet | not published | power | Metal pump heads with silicone tube, blue | cyl | Between reservoir and chip bay | none |
| 2 | gas-mixer | life-support-cabinet | 1 | io | Valve block, dark grey; mixes CO2, O2, N2 | box | Beside the pumps, gas line to the chip bay | none |
| 2 | heater | life-support-cabinet | 1 (type not published) | cooling | Metal plate, orange | slab | Under or around the chip bay | none |
| 2 | electronics-stack | cl1-unit | 1 | compute | Green circuit boards stacked in a block | box | Beside the chip bay; runs biOS and the stimulation and read electronics | none |
| 2 | chip-bay | cl1-unit | 1 | structure | Sealed chamber, dark grey | rbox | Centre of the unit; where the chip assembly sits | Opens level 3 |
| 3 | mea-chip | chip-bay | 1 | io | Silicon and glass with metal electrodes, silver | slab | Small plate at the base of the well | Opens level 4 (electrode site) |
| 3 | culture-well | chip-bay | 1 | structure | Clear ring that holds media over the chip | cyl | Ring on top of the chip | none |
| 3 | neuron-layer | culture-well | about 800,000 cells | compute | Living cells, pale yellow-white | grid | Thin film across the array | none |
| 3 | electrode-grid | mea-chip | 59 (60 interactive of 64 in the Cortical Cloud paper) | io | Metal pads on glass, gold | grid | Pattern of dots on the chip centre | Opens level 4 |
| 3 | interface-board | chip-bay | 1 | interconnect | Green circuit board with contact pins (not published) | slab | Under the chip, links electrodes to the electronics stack | none |
| 3 | stimulation-read-path | interface-board | 1 | io | Traces and amplifiers (design not published) | box | Between electrode pads and the stack | Opens level 4 |
| 4 | electrode-site | electrode-grid | 1 of 59 | io | One metal pad, gold | cyl | A single dot, about neuron-cell scale | none |
| 4 | neuron-cluster | electrode-site | a few cells per site (count not published) | compute | Cell bodies and fibres, pale yellow | grid | Small group lying on one pad | none |
| 4 | adc-and-biOS-loop | interface-board | 1 | compute | Chip and software, green (parts not published) | box | Digitises spikes, runs the closed loop | none |

Note: the TEMPLATE asks for 2 or 3 levels. Levels here are 1 (unit), 2 (inside the unit), 3 (chip assembly) and 4 (electrode site). If the gallery supports only 3, merge level 1 and 2 by treating the unit as level 1 and dropping the enclosure-shell row.

Explode order (outer to inner, one line per part):
1. enclosure-shell lifts off
2. life-support-cabinet slides down and back
3. electronics-stack slides aside
4. chip-bay opens
5. culture-well and media lift off the chip
6. mea-chip separates from interface-board
7. neuron-layer shown on electrode-grid
8. one electrode-site zoomed

X-ray covers (parts that go transparent): enclosure-shell, life-support-cabinet walls, chip-bay lid, culture-well ring.

## 5. Flows (1 to 3 per level: real data or power paths with the real number)
| Level | From | To | What moves | Number (unit) | Source id |
|---|---|---|---|---|---|
| 2 | media-reservoir | chip-bay via peristaltic-pumps | Nutrient media, then waste back through filtration | Flow rate not published | S3, S4 |
| 2 | gas-mixer | chip-bay | CO2, O2, N2 mix | Mix ratio not published | S4 |
| 2 | rack of 30 CL1 | mains | Electrical power | 850 to 1,000 W per rack (about 28 to 33 W per unit, derived) | S3 |
| 3 | interface-board | electrode-grid | Stimulation current pulses into the neurons | Balanced charge, example 2 microamps in and 2 microamps out | S3 |
| 3 | electrode-grid | interface-board | Recorded spikes, one electrode index and timestamp each | 59 electrodes (64 sites, 60 interactive in the cloud paper) | S3, S5 |
| 4 | one electrode-site | adc-and-biOS-loop | Spike data and next stimulation, closed loop with the simulated world | Not published for CL1. DishBrain: 20,000 samples per second and about 5 ms spike-to-stimulation latency | S2 |

## 6. Callouts for the gallery (4 to 6 per level; title <= 3 words; text <= 12 words with one number)
| Level | Part id | Title | Text |
|---|---|---|---|
| 1 | cl1-unit | Shoebox brain | A self-contained unit needs no external computer to run. |
| 1 | cl1-unit | Price tag | Starts at 35,000 US dollars per unit. |
| 1 | life-support-cabinet | Pumps like hearts | Pumps, filters, gas and heat keep cells alive up to 6 months. |
| 1 | cl1-unit | Rack power | A 30-unit rack draws only 850 to 1,000 watts. |
| 1 | cl1-unit | Rent a brain | Cloud access reported at 300 US dollars per week. |
| 2 | gas-mixer | Breathing mix | Mixes CO2, O2 and N2 for the culture. |
| 2 | peristaltic-pumps | Heartbeat | Pumps circulate media and carry waste to the filter. |
| 2 | heater | Body heat | Holds the culture at body temperature; the set point is not published. |
| 2 | electronics-stack | No PC needed | The unit runs biOS and the simulated world on board. |
| 3 | neuron-layer | Living layer | About 800,000 human neurons grown from stem cells. |
| 3 | mea-chip | Metal and glass | Kagan calls the array basically just metal and glass. |
| 3 | electrode-grid | 59 contacts | 59 electrodes both stimulate and listen. |
| 3 | culture-well | Nutrient bath | Neurons sit in a nutrient-rich solution on the chip. |
| 3 | interface-board | Charge balance | 2 microamps in means 2 microamps out, to protect cells. |
| 4 | electrode-site | One contact | One pad sends pulses and records spikes from nearby cells. |
| 4 | neuron-cluster | Tiny network | Neurons form connections that respond to electrical stimuli. |
| 4 | adc-and-biOS-loop | biOS loop | biOS sends the simulated world to the neurons as stimulation. |
| 4 | adc-and-biOS-loop | DishBrain speed | The 2022 DishBrain loop took about 5 ms from spike to stimulus. |

## 7. Glossary (every technical word used above, one line each, own words)
- Neuron: a nerve cell that sends electrical signals.
- iPSC: induced pluripotent stem cell, a cell made from adult blood that can be turned into neurons.
- Cortical: from the cortex, the outer layer of the brain.
- Multi-electrode array (MEA): a chip with many small metal contacts that stimulate and record cells.
- HD-MEA: high-density MEA, with thousands of electrodes (DishBrain used one).
- CMOS: the standard silicon chip process; a CMOS array has the amplifiers built in the chip.
- Planar electrode array: a flat array of electrodes, as used in the CL1.
- Stimulation: sending a small electrical pulse into the cells.
- Spike: one electrical pulse fired by a neuron.
- Charge balance: making the current out equal to the current in, so cells are not harmed.
- Culture well: a small pool that holds cells and liquid on the chip.
- Media: the nutrient liquid the cells live in.
- Perfusion circuit: a loop that feeds fresh media and removes waste.
- Peristaltic pump: a pump that squeezes a soft tube to move liquid.
- Filtration: removing waste products from the media.
- Gas mixer: a valve block that sets the CO2, O2 and N2 mix.
- ADC: analog-to-digital converter, turns the small voltage into numbers.
- biOS: Biological Intelligence Operating System, the software that runs the simulated world and the closed loop.
- Closed loop: output from the neurons changes the next input they get.
- DishBrain: the 2022 experiment where cultured neurons learned to play Pong.
- Wetware-as-a-Service (WaaS): renting access to living neurons over the internet.
- Cortical Cloud: the Cortical Labs service for remote access to CL1 units.
- DIV: days in vitro, the age of a culture in days.

## 8. What is not public or uncertain (be explicit; the page must say "not published" rather than guess)
- Neuron count for the CL1: the company page does not state it. 800,000 comes from an independent paper on the Cortical Cloud [S5] and press [S6]. Other press reports say about 200,000 [S6]. Treat 800,000 as likely, not confirmed by the maker.
- Electrode count: 59 per New Atlas and Gizmodo [S3][S4]; 64 sites, 60 interactive, over 8 mm2 per an independent paper [S5]. Cortical Labs does not state it on the product page [S1].
- DishBrain neuron count: the Neuron paper gives about 800,000 primary mouse cells or about 1,000,000 hiPSC-derived cells per array, so "800,000 human neurons" belongs to CL1, not to DishBrain [S2].
- Power per unit: not published. Only the 850 to 1,000 W per 30-unit rack figure exists [S3].
- Price: about US$35,000 per unit and about US$20,000 per unit in a 30-unit rack [S3][S6]. WaaS price: about US$300 per week, from a secondary report only [S6].
- Lifespan of the culture: "up to 6 months" [S1][S4]. Average lifespan under normal use: not published.
- Dimensions, weight, enclosure material, display: not published.
- Pump model and count, flow rate, reservoir volume, filter type, heater type, temperature set point, gas ratio: not published.
- ADC resolution, sampling rate and loop latency of the CL1: not published. The DishBrain figures (20,000 samples per second, about 5 ms) belong to a different chip, the MaxOne [S2].
- Interface board, electronics stack contents, chip supplier: not published.
- No independent teardown, photo set or diagram of the inside was found. All layout in section 4 is inferred from the company description of its life-support system.
- Page does not say whether the human cells are donor-derived beyond "cultivated from blood samples" [S3].

## 9. Sources (numbered; official spec pages, whitepapers, reputable teardowns; include access date)
- S1. Cortical Labs, CL1 product page, https://corticallabs.com/cl1.html (neurons alive up to 6 months, internal life support, biOS, bi-directional stimulation and read; no neuron count, electrode count, price or power). Accessed 2026-10-27.
- S2. Kagan et al., "In vitro neurons learn and exhibit sentience when embodied in a simulated game-world", Neuron 110(23):3952-3969, 2022, https://pmc.ncbi.nlm.nih.gov/articles/PMC9747182 (MaxOne HD-MEA about 26,000 electrodes over 8 mm2, up to 1,024 recording channels, 8 sensory electrodes, 20,000 samples per second, about 5 ms latency, 800,000 mouse cells or about 1,000,000 hiPSC cells per array; the methods text was read only in part). Accessed 2026-10-27.
- S3. New Atlas, interview with Brett Kagan on the CL1, https://newatlas.com/brain/cortical-bioengineered-intelligence/ (59 electrodes, planar metal and glass array, perfusion circuit, 850 to 1,000 W per rack, about US$35,000, 2 microamp charge balance). Accessed 2026-10-27.
- S4. Gizmodo, "This $35,000 Computer Is Powered by Trapped Human Brain Cells", https://gizmodo.com/this-35000-computer-is-powered-by-trapped-human-brain-cells-2000573993 (59 electrodes, pumps, waste, reservoirs, filtration, CO2/O2/N2 mixer, up to 6 months). Accessed 2026-10-27.
- S5. Schottlender et al., "Evaluating Encoding Strategies for Closed-Loop Classification in Biological Neural Networks", arXiv 2607.13644, https://arxiv.org/pdf/2607.13644 (CL-1 cultures about 8 x 10^5 human cortical neurons from iPSCs, 8 mm2 MEA with 64 electrodes, 60 interactive, Cortical Cloud in Melbourne). Accessed 2026-10-27.
- S6. TechRadar, DataCenterDynamics, PCWorld and BioPharmaTrend launch coverage, e.g. https://www.techradar.com/pro/what-a-deal-you-can-now-rent-human-brain-cells-on-a-silicon-chip-for-7-days-for-less-than-a-nintendo-switch-2 and https://www.biopharmatrend.com/news/cortical-labs-introduces-biological-computer-built-on-human-brain-cells-1156/ (US$35,000, US$20,000 in rack, WaaS about US$300 per week, neuron counts disagree between outlets; the TechRadar body text could not be read, so the WaaS price is from a search summary). Accessed 2026-10-27.
- Not read: IEEE Spectrum, The Register, Nature news, eeNews (no hardware numbers). Neuron full text on cell.com returned 403.
