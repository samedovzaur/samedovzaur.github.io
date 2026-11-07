# Single source of truth for the bio (condensed from past chats, GitHub samedovzaur, Hugging Face zaursamadov)

Owner: Zaur Samadov. Istanbul, Turkey. Remote. Email zaursamedov.sftwr@gmail.com.
Links: GitHub https://github.com/samedovzaur?tab=repositories (Projects). Hugging Face https://huggingface.co/zaursamadov (Open Source). Substack https://zaursamadov.substack.com (Write-ups). LinkedIn https://www.linkedin.com/in/zaursamedov.
Tone: honest, plain, first person. No sales language. No year-range timelines. No employer names next to work. No internal product names, vendors or metrics. Describe kinds of work, interests, technologies and frameworks, not individual projects. Unpublished local builds are described only as kinds of work.

## Who I am (facts to draw from)
- Computer engineering degree (2024). Thesis on vector retrieval and benchmarks for lower hallucination with less data.
- Started with classic ML and deep learning: course work and practice notebooks (scikit-learn, PyTorch, TensorFlow), then NLP (NER, tokenisers, GPT-2 era), then LLMs.
- Taught in two developer communities (ML and NLP lectures; cloud ML meetups).
- Early LLM work: fine-tuned Llama 2 with QLoRA for NER on a dataset I curated and published; later a Mixtral-based mixture-of-experts fine-tune for step-by-step finance and math, FinQA fine-tunes on Llama 3, a FLUX LoRA for game characters. All public on Hugging Face.
- Startup work: RAG with guardrails, small-model fine-tuning on synthetic data, multimodal (LLaVA-class) assistants, evaluation with RAGAS, 7B to 13B models on NVIDIA Jetson in a vehicle prototype.
- Since 2024: AI engineer on a US financial media company's AI team. Kinds of work: LLM pipelines that score and summarise thousands of companies (LLMs extract, Python computes), TTS audio products with automated quality control, multi-agent systems with LLM judges, guard models (LoRA fine-tune of a 0.6B model; on-device classifiers with Core ML), red-teaming, cost-capped model benchmarks, multi-agent coding workflows (review, audit, verify agents), reliability and on-call tooling on AWS.
- On my own time: voice assistants (STT to LLM to TTS, Rust server), video generation pipelines, a document-to-podcast tool, agent control apps for phone and desktop, a Rust firewall, a local chat archive with hybrid search, a safe-route map app, a home GPU cluster.
- Now learning: inference and kernel engineering. CUDA and PMPP, a GPU-kernel hackathon, an inference engineering book, daily kernel practice on an RTX 4090. Also: quantization (int8, fp8, 4-bit), serving (vLLM, llama.cpp, MLX), LoRA stacking on video diffusion, distilling and merging small models.
- Interests: open-weight models, running things locally, measuring instead of guessing, chess, teaching myself the next layer down.

## Technologies and frameworks (name freely)
Python, Rust, TypeScript, SQL. PyTorch, Transformers, PEFT and LoRA, Unsloth, bitsandbytes, vLLM, llama.cpp, MLX, Core ML, ONNX. Claude and OpenAI APIs, Gemini, Qwen, Llama, Mixtral, FLUX, LTX, MiniMax video models, Whisper, VoxCPM, ElevenLabs-style TTS. RAG stacks (LlamaIndex, Haystack, Qdrant), NeMo Guardrails, RAGAS. AWS (Lambda, ECS, Bedrock, S3, CloudWatch), Terraform, GitHub Actions, Docker, PostgreSQL, DynamoDB, MLflow, OpenTelemetry. ComfyUI, Three.js, FastAPI, React, SwiftUI, Tailscale.

## Home AI cluster (facts for its page)
Three machines on Tailscale. MacBook Pro M2 Pro 16 GB: controller only, no models. Windows PC with RTX 4090 24 GB and 128 GB RAM: heavy worker (video, image, big LLM, fine-tuning, master model store). Mac mini M2 8 GB: small MLX worker. Software: llama.cpp (Qwen3-1.7B), an OpenAI-compatible API door, ComfyUI, mlx-lm, WSL with Unsloth for LoRA fine-tuning. Video diffusion: MiniMax-H3 (reference-image conditioning, native audio), FastH3 Omni int8 with stacked Turbo and realism LoRAs, LTX-2.5 fp8 (720p 10 s in 94 s). Images: FLUX-3 Klein (5 to 10 s per 1024 px image). Voices: VoxCPM. A clip harness: an LLM writer plans scenes, FLUX makes keyframe sheets, H3 renders 10 to 20 s clips chained by the last frames, agents review each clip 0 to 100. Rules learned: one GPU job at a time (two renders ran 3.5x slower), downloads only on the PC over home Wi-Fi, check a model's file format loads before downloading it. Every morning the 4090 is reserved for kernel practice.

## Profile photo
assets/profile.jpg (owner will supply; use a neutral placeholder block with his initials until the file exists).
