# What I am learning: sources (data for the terminal panel on the home page)

Source: the owner's "Inference Route-Plan" (October 2026): 93 GPU MODE lectures, 5 certified courses, 24 open-source projects, arranged as one 8 to 12 week route from a first CUDA kernel to production inference. The panel shows this as short typed lines; details open on click or hover. Keep it honest: this is a plan in progress, not a list of completed things.

## Route (five stages)
| Stage | Weeks | Goal | Lecture time |
|---|---|---|---|
| Foundation blitz | 1 to 2 | write a working CUDA kernel | 7h 53m |
| Memory and profiling | 3 to 4 | profile a kernel and fix it | 9h 25m |
| Production patterns | 5 to 6 | read llm.c and Flash Attention | 14h 56m |
| Triton and modern tools | 7 to 8 | write kernels in Triton, know when CUTLASS and CuTe are worth it | 15h 35m |
| Specialty track | 9 to 12 | quantisation and efficient inference (A) and production LLM systems (E) | 10h to 16h |

## Sources, by type
- Book: Programming Massively Parallel Processors (PMPP), Hwu, Kirk, El Hajj. Chapters 1 to 3 first, then as reference. The 56-day coached programme follows it.
- Lectures: GPU MODE (YouTube and Discord), 93 lectures. Core route in watch order: 2, 40, 1, 3, 5, 75; 4, 8, 9, 20, 16, 44, 56, 47, 76; 23, 37, 12, 36, 80, 22, 35, 28, 32, 58; 14, 29, 34, 77, 78, 82, 15, 57, 45, 86, 89, 18. Named anchors: "Getting Started With CUDA for Python Programmers" (3), "CUDA Performance Checklist" (8), "Tensor Cores" (23), "Introduction to SASS and GPU Microarchitecture" (37), "Flash Attention" (12), "CUTLASS and Flash Attention 3" (36), "Practitioners Guide to Triton" (14), "Outperforming cuBLAS on H100" (45).
- Language and docs: CUDA C++ (the CUDA C++ Programming Guide, CUDA Best Practices Guide), Nsight Compute and Nsight Systems, PTX and SASS reading. C pointers and memory management (Dartmouth C Programming with Linux, courses 3 and 4 only).
- Courses: Johns Hopkins GPU Programming Specialization (Coursera), courses 1 and 2 in weeks 3 to 4, courses 3 and 4 later. Optional: Georgia Tech CS 7295 GPU Hardware and Software (OMSCS), NVIDIA GTC workshops, HLRS GPU programming week.
- Book: Inference engineering (Baseten), read before the route.
- Community: GPU MODE Discord, AMD x GPU MODE hackathon (joined), NVIDIA developer forums.
- Daily practice: the Muse Spark Open Kernel Challenge (Meta). Four CUDA kernel problems for Meta's Muse model: MoE (W4A16), attention, projection, decode layer. Scored against SGLang on the organiser's H200 judge; the home RTX 4090 runs every correctness test first, 08:00 to 14:00. Standing on 27 Oct 2026: MoE 1.60x, attention 1.69x, proj 1.20x, decode 1.43x; rank 386; goal top 50 by 5 Nov. Coding agents work the problems under written judge rules; a scheduler starts and stops them. Public board: https://openkernelchallenge.com (confirm URL).

## Projects to read or build, by stage
- Weeks 1 to 2: NVIDIA cuda-samples (vectorAdd, then modify), GPU-100-Days (days 1 to 10), cudarc (Rust CUDA bindings), mojo-gpu-puzzles (1 to 5), heap_allocator and buddy_alloc in C.
- Weeks 3 to 4: CUDA-Matrix (tiled matmul with shared memory), karpathy/llm.c dev/cuda/matmul*.cu, burn and candle (Rust tensors).
- Weeks 5 to 6: llm.c in full (the main project), flash-attention (paper, then csrc), llama.cpp ggml-cuda, candle-vllm, modular/max kernels.
- Weeks 7 to 8: triton tutorials (all), cutlass examples, Rust-CUDA, wgpu.
- Tracks A and E: TensorRT-LLM, vLLM, llama.cpp ggml-cuda deep study, JHU courses 3 and 4.

## Checkpoints (what "done" means per stage)
1. Write vector addition in CUDA from memory; explain thread, block, grid; know cudaMalloc, cudaMemcpy, cudaFree.
2. Profile a kernel and say memory-bound or compute-bound; tiled matmul with shared memory; explain coalescing in one sentence.
3. Explain why Flash Attention is faster (not fewer FLOPs); read an llm.c kernel and explain it; explain PagedAttention.
4. Write a matmul in Triton; use auto-tuning; say when to use Triton, CUDA or CUTLASS.
5. Hold a conversation on quantisation (int8, fp8, 4-bit, scaling laws for low precision) and production serving (batching, attention variants, disaggregated inference).

## Languages touched on the route
C, CUDA C++, Triton (Python), Rust (cudarc, candle, burn, wgpu), Mojo (puzzles, MAX), PTX and SASS (reading only).

## Terminal panel lines (first version; the owner can edit; each line links to the matching block above)
1. reading   PMPP ch. 1-3, then the CUDA C++ Programming Guide
2. watching  GPU MODE lectures 2, 40, 1, 3, 5, 75 at 1.5x
3. writing   vectorAdd from memory, then a tiled matmul with shared memory
4. profiling with Nsight Compute: memory-bound or compute-bound, every kernel
5. building  along llm.c, flash-attention and llama.cpp ggml-cuda
6. racing    Meta's Open Kernel Challenge: four Muse kernels vs SGLang, MoE at 1.60x, aiming for top 50
