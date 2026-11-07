# Device model rules (every js/devices/<slug>.js must obey these)

Physics and logic
1. Real proportions. Use the real dimensions from the details file where published (die mm2, package mm, board mm, wafer 300 mm, module 100 x 87 mm). Scale the whole device to fit the stage, never one part alone. Where a size is not published, derive it from a published neighbour (a die cannot be larger than its package; an HBM stack is about 11 x 11 mm; a GDDR6X chip about 14 x 12 mm; a PCIe x16 edge is 89 mm) and mark the part "schematic" in its label.
2. Real stacking order, bottom to top: board or substrate -> interposer (if any) -> die and memory stacks -> heat spreader or vapour chamber -> fins -> shroud and fans. Power stages and connectors sit on the board edge. Nothing floats and nothing intersects in the assembled state (teardown = 0).
3. Explode along the assembly axis. Parts move the way a technician would lift them: covers up, boards down, side parts outward, stacked dies and layers upward in order. Children move with their parent plus a small offset of their own. The exploded state keeps the same left-right and front-back positions so the eye can map each part back.
4. Enter levels only where the real thing has an inside: card -> die -> one SM or core; wafer -> one die -> one core; package -> die floor plan -> one unit. A level shows the parent's outline faintly as a ground reference.
5. Counts are real when published (12 GDDR6X chips, 8 HBM stacks, 128 SMs). When a file says "not published", render a plausible grid and put the word "schematic" in the label. Never show a precise number that the file does not carry.
6. Flows follow real paths with the real number in the label (VRAM to die 1,008 GB/s; NV-HBI 10 TB/s; PCIe x16 about 31.5 GB/s each way). Faster paths move visibly faster; ratios above about 10x are compressed and the label carries the exact numbers.
7. Materials: the role sets the default (compute = dark silicon grey with die-green glow on active units; memory = near-black; io = gold; power = copper; cooling = anodised grey; structure = graphite; interconnect = copper; biology = amber well). A `tone` overrides the colour with the REAL material seen in the reference photo: copper, gold, silver, nickel, champagne (DGX Spark body), speckle (its foam panels), pcb-green, pcb-blue (Taalas), pcb-orange (Groq), pcb-black, graphite, matte, anodised, die-colour (the blue-purple sheen of a bare die), neuron. The photo wins over the default: a blue board is blue. Use no colour that is not in that list.
7b. Reference photo rule. Every device has a photo in build/ref/ or a press photo named in its brief. The silhouette, the colour of each part, the count and placement of small parts (memory modules, inductor rows, connectors, cages, fans), and the exploded order must match that photo. No invented parts. If the photo shows it and the details file does not name it, add it with `schematic: true` and a plain label.
8. Light and shadow are consistent across devices: same key light, same rim light, same environment, so switching with < and > feels like one bench.

Text
9. Every part has one label (<= 4 words) and ONE explainer line (<= 14 words, one number where the file has one). Nothing longer appears on hover. Longer text lives only in the Details drawer.
10. Hero facts: exactly three, from the file's section 3, each <= 10 words.
11. Vendor claims say "claims" (Etched, Taalas, Groq). Dense vs sparse is stated.

Spec format (js/devices/<slug>.js, ES module, default export)
{
  id, name, maker, year, order, oneLine,            // oneLine from details/README.md
  hero: [string, string, string],
  scale: { unit: "mm", stage: number },             // real mm per scene unit
  levels: [{
    id, title, parentPart,                          // parentPart: the part id this level opens from
    parts: [{ id, label, line, role, shape,          // shape: box | rbox | cyl | grid | fan | wafer | slab | well
              size: [w,h,d] in mm, pos: [x,y,z] in mm, rot?,
              count?, grid?: {nx, nz, gap}, schematic?: true,
              explode: { dir: [x,y,z], dist: mm },   // dist scales with teardown 0..1
              xray?: true, enter?: levelId, glow?: true }],
    flows: [{ from, to, label, speed }],            // speed 0..1 after compression
    callouts: [{ part, title, text }]               // title <= 3 words, text <= 12 words
  }],
  notPublished: [string], sourcesPath: "details/<slug>.md"
}
