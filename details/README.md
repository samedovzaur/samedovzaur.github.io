# details/

One file per device in the "What I am learning" 3D teardown gallery. Every file follows TEMPLATE.md: what it is, why it is here, three sourced hero facts, a teardown tree (2 to 3 levels; the 3D model is built from it), flows, callouts, glossary, what is not published, numbered sources.

| Slug | Device | Why it is here |
|---|---|---|
| nvidia-rtx-4090 | NVIDIA GeForce RTX 4090, AD102 | the owner's GPU; daily CUDA practice |
| nvidia-blackwell-b200 | NVIDIA Blackwell B200 / GB200 | two dies joined; datacenter counterpart |
| nvidia-dgx-spark | NVIDIA DGX Spark, GB10 | evaluated against the owner's 4090 box |
| nvidia-jetson-orin | NVIDIA Jetson AGX Orin | the owner's first on-device LLM work |
| apple-m2-pro | Apple M2 Pro SoC | the cluster controller; Neural Engine, unified memory |
| google-tpu | Google TPU Ironwood (v7) | the clean systolic-array example |
| cerebras-wse-3 | Cerebras WSE-3 | the wafer is the chip |
| groq-lpu | Groq LPU (TSP) | all-SRAM, deterministic |
| etched-sohu | Etched Sohu | transformer-only ASIC |
| taalas-hardcore | Taalas model-in-silicon | weights in mask ROM; the owner's "Hard Wired" book |
| tenstorrent-blackhole | Tenstorrent Blackhole | open RISC-V AI chip; same engineers as Taalas |
| cortical-labs-cl1 | Cortical Labs CL1 | neurons on a multi-electrode array |

Rules for the page: show only numbers that carry a source id; attribute vendor claims ("Etched claims"); where a file says "not published", the model stays schematic and the page says so.
