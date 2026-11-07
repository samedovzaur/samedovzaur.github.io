# Plan v4: rework the device models, rebuild the page components

Date: 2026-10-28. Status: waiting for approval (models) and for component choices (sampler).

## Context update (time-awareness)
- Knowledge cutoff: June 2026. Today: 2026-10-28. Window: 2026-01-01 to today.
- three.js: r183 (Feb 2026), r184 (Apr), r185 (Jul), r186 (Sep 8, one source). We pin 0.160.0 on jsdelivr. Keep it: the engine works, no feature of r18x is needed, and an upgrade would re-test every model. Unverified: r186 details.
- RTX 5090 FE: three-piece PCB, GB202 (~63x56 mm package, 24x31 mm die) with 16 GDDR7 2 GB modules around it, 512-bit, two flow-through fans either side of the small centre PCB, 12V-2x6 plug on top edge. Sources: TechPowerUp unboxing, Tom's Hardware PCB story.
- Component patterns: no single open-source "portfolio pattern" set exists. Closest: shadcn/ui (MIT), Hallmark archetype list (nav: three-section, mega menu, retracting banner, inline cmd-K pill; section headers: numbered, hanging, sticky, anchored), PatternFly, bchiang7/v4 (already credited). The sampler draws its 10 variants per component from these plus Stripe/Linear/Vercel/GitHub-docs conventions.

## What the comparison showed (your photos vs my renders)
Common defects: wrong colours (black boxes where the real part is champagne gold, orange PCB or blue PCB), no PCB at all, fake parts (floating copper bars, cylinders, giant heatsink), no small components (VRM inductors, memory modules, connectors), no exploded stack.

| Device | Real part (from photos) | Fix |
|---|---|---|
| RTX 5090 (new, replaces 4090) | Small centre PCB; GB202 under silver frame; 16 GDDR7 chips ring it; VRM rows above and below; two fans in a dark shroud left and right; PCIe edge; 12V-2x6 on top | Build card = shroud + 2 fans + centre PCB; board level = PCB with chip, 16 modules, VRM; die level = GB202 with GPC grid |
| Taalas HC1 (2nd) | Blue PCB, silver lidded package centre-left, two QSFP-DD cages on the left edge, row of 12 VRM inductors along the top, PCIe x16 edge | Replace the finned heatsink with the real card; keep the die/bank levels; PCB colour muted navy (real), flagged below |
| DGX Spark | Champagne-gold metal box; speckled (foam) front and back panels with the badge; inside: lid, GB10 board (GPU + Grace CPU on one package, LPDDR5X around), SSD, bottom shell | Gold body, textured panels, exploded stack of 4 parts |
| Blackwell B200 | Gold package substrate; two compute dies centre; 8 HBM stacks in two columns (4 left, 4 right); fits on a black board with Grace CPU and ConnectX | Package level = substrate + 2 dies + 8 HBM in correct columns; die level = 2 dies joined by NV-HBI; HBM level = stack cross-section |
| TPU Ironwood | Silver square lid frame; gold inner; two compute dies centre; HBM stacks 4 per side | Same package layout as B200 but TPU proportions; drop the "tray" level, use chip/package/core |
| WSE-3 | Square gold wafer cut from a round 300 mm wafer, grid of alignment holes, faint die grid; in a handling fixture | Engine level = fixture/CS-3 chassis; wafer level = gold square with hole grid and die lines; core level = tile patch |
| Groq LPU | Orange/gold PCB card; silver square IHS centre; 3 connectors on top edge; VRM inductor row on the right; PCIe edge; Groq 3 LPU die photo shows SRAM bands | Orange PCB, silver IHS, connectors, VRM; die level = striped superlanes in colour bands |
| Jetson (keep Orin, or switch to AGX Thor; see question) | Exploded: shell, heatsink+fan, module with chip, carrier board, chassis | Exploded 5-part stack |
| M2 Pro, Blackhole | no photos given | Rebuild with the same rules: real PCB colour, visible small parts |
| Sohu, CL1 | removed | done in this commit |

## Method change (why the last round failed)
1. Agents built from text briefs with no reference image. This round: each brief carries a reference description written from the photo, a parts list with sizes in mm, colours by name, and a layout sketch in ASCII.
2. Each model gets a screenshot check against the photo before it is marked ready (Playwright, contact sheet), and I compare them myself.
3. Materials: real PCB colours, brushed metal for lids, gold substrate, matte black shrouds. No invented parts.
4. One device at a time, 5090 first, in your order: 5090, Taalas, M2 Pro, Jetson, DGX Spark, B200, TPU, WSE-3, Groq, Blackhole.

## Prior art for the rebuild
- Keep: procedural three.js primitives (boxes, cylinders, extruded fins). Zero licence risk, small download, teardown levels work.
- Considered: real GLTF models from Sketchfab. Few exist for these parts, most CC-BY with 5 to 50 MB files, none for Taalas/Groq/TPU. Not used.
- Reuse: the engine (gallery.js), overlap checker, MODEL-RULES.md.

## What could break
- Camera framing: new models have different bounding boxes; the auto-fit handles it but the teardown spacing per device needs re-tuning.
- The page weight: more parts per model (16 memory modules, 12 inductors). Still under 50 kB per device file.
- Colour rule: Taalas PCB is blue. Fidelity wins; it is a material colour, not UI chrome.

## Verify
1. `python3 -m http.server 8011` then open `?dev=<slug>` for each device.
2. `node build/check-overlap.mjs` empty.
3. Contact sheet `/tmp/gal/contact.png` next to the photos in this file.
4. `grep -inwFf build/banned-terms.txt` empty.

## Questions (non-blocking; defaults in brackets)
- Jetson: keep AGX Orin [default] or switch to AGX Thor (2025, Blackwell) to match "40s are old now"?
- Jetson, M2 Pro, Blackhole: send a reference photo each, or I pick the official press photo.
