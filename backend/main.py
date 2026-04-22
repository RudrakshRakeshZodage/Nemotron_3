import os
import json
import httpx
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import Optional, List
from dotenv import load_dotenv
import asyncio

load_dotenv()

app = FastAPI(title="NemoCore AI API", version="1.0.0")


app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("FRONTEND_URL", "http://localhost:3000"), "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

NVIDIA_API_KEY = os.getenv("NVIDIA_API_KEY", "")
NVIDIA_BASE_URL = os.getenv("NVIDIA_BASE_URL", "https://integrate.api.nvidia.com/v1")
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY", "")
OPENROUTER_BASE_URL = os.getenv("OPENROUTER_BASE_URL", "https://openrouter.ai/api/v1")
MOCK_MODE = (not NVIDIA_API_KEY or NVIDIA_API_KEY.startswith("nvapi-xxx")) and (not OPENROUTER_API_KEY or OPENROUTER_API_KEY.startswith("sk-or-xxx"))

# ── Models ────────────────────────────────────────────────────────────────────

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[ChatMessage]
    model: str = "nvidia/llama-3.1-nemotron-70b-instruct"
    temperature: float = 0.7
    max_tokens: int = 1024

class AgentRequest(BaseModel):
    task: str
    model: str = "nvidia/llama-3.1-nemotron-70b-instruct"

class BlogRequest(BaseModel):
    topic: str
    tone: str = "professional"
    length: str = "medium"

class PaperRequest(BaseModel):
    title: str
    domain: str = "Computer Science"
    keywords: List[str] = []

class SaveProjectRequest(BaseModel):
    user_id: str
    title: str
    description: str
    content: str
    type: str = "chat"

# ── Helpers ───────────────────────────────────────────────────────────────────

async def stream_chat(messages: list, model: str, temperature: float, max_tokens: int):
    """Stream from appropriate API based on model prefix."""
    if MOCK_MODE:
        mock_response = (
            "I'm **NemoCore AI**, powered by NVIDIA Nemotron 3. "
            "This is a simulated response — add your API key to `.env` for live responses.\n\n"
            "```python\n# Example code output\ndef hello_nemotron():\n    return 'NVIDIA Nemotron 3 is live!'\n```\n\n"
            "Nemotron 3 features:\n- 🚀 Multi-token prediction\n- 🧠 Hybrid Transformer + Mamba architecture\n- ⚡ 5x throughput vs standard models\n- 🔬 Latent Mixture-of-Experts"
        )
        for word in mock_response.split(" "):
            yield f"data: {json.dumps({'choices': [{'delta': {'content': word + ' '}}]})}\n\n"
            await asyncio.sleep(0.04)
        yield "data: [DONE]\n\n"
        return

    # Determine API provider based on model prefix
    if model.startswith("nvidia/"):
        api_key = NVIDIA_API_KEY
        base_url = NVIDIA_BASE_URL
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        }
    elif model.startswith("openrouter/"):
        api_key = OPENROUTER_API_KEY
        base_url = OPENROUTER_BASE_URL
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
            "HTTP-Referer": os.getenv("FRONTEND_URL", "http://localhost:3000"),
            "X-Title": "NemoCore AI",
        }
        # Convert openrouter model name to actual model ID
        if model == "openrouter/nvidia-nemotron-3-nano-30b-a3b":
            model = "nvidia/nemotron-3-nano-30b-a3b"
    else:
        raise HTTPException(status_code=400, detail=f"Unsupported model: {model}")

    payload = {
        "model": model,
        "messages": messages,
        "temperature": temperature,
        "max_tokens": max_tokens,
        "stream": True,
    }

    async with httpx.AsyncClient(timeout=120) as client:
        try:
            async with client.stream("POST", f"{base_url}/chat/completions", headers=headers, json=payload) as resp:
                if resp.status_code != 200:
                    error_text = await resp.aread()
                    raise HTTPException(status_code=resp.status_code, detail=f"API Error: {error_text.decode()}")

                async for line in resp.aiter_lines():
                    if line.startswith("data:"):
                        yield f"{line}\n\n"
        except httpx.RequestError as e:
            raise HTTPException(status_code=500, detail=f"Request failed: {str(e)}")


async def generate_full(prompt: str, model: str = "nvidia/llama-3.1-nemotron-70b-instruct") -> str:
    """Non-streaming full response (for structured generation)."""
    if MOCK_MODE:
        return f"[MOCK] Generated response for: {prompt[:80]}..."

    headers = {"Authorization": f"Bearer {NVIDIA_API_KEY}", "Content-Type": "application/json"}
    payload = {
        "model": model,
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0.7,
        "max_tokens": 2048,
        "stream": False,
    }
    async with httpx.AsyncClient(timeout=120) as client:
        resp = await client.post(f"{NVIDIA_BASE_URL}/chat/completions", headers=headers, json=payload)
        resp.raise_for_status()
        return resp.json()["choices"][0]["message"]["content"]

# ── Routes ────────────────────────────────────────────────────────────────────

@app.get("/")
async def root():
    return {"message": "NemoCore AI API", "status": "running", "mock_mode": MOCK_MODE}

@app.get("/health")
async def health():
    return {"status": "ok", "nvidia_connected": not MOCK_MODE}

@app.post("/chat")
async def chat(req: ChatRequest):
    messages = [{"role": m.role, "content": m.content} for m in req.messages]
    return StreamingResponse(
        stream_chat(messages, req.model, req.temperature, req.max_tokens),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )

@app.post("/agent")
async def agent(req: AgentRequest):
    prompt = f"""You are an expert AI agent planner. Break the following task into exactly 4 concrete steps.
Respond with a valid JSON array of objects with keys: step (int), title (string), description (string), output (string).

Task: {req.task}

Return ONLY the JSON array, no markdown, no explanation."""

    if MOCK_MODE:
        steps = [
            {"step": 1, "title": "Research & Analysis", "description": f"Gather requirements and analyze the task: {req.task}", "output": "Comprehensive understanding of the task scope, constraints, and success criteria. Identified 3 key components to address."},
            {"step": 2, "title": "Planning & Architecture", "description": "Design the solution architecture and create a detailed implementation plan.", "output": "Step-by-step implementation plan with technology stack, file structure, and component breakdown."},
            {"step": 3, "title": "Implementation & Code", "description": "Write production-ready code following best practices and design patterns.", "output": "```python\n# Core implementation\ndef solve_task():\n    # Nemotron-generated solution\n    return optimized_result\n```"},
            {"step": 4, "title": "Testing & Optimization", "description": "Test the implementation, fix edge cases, and optimize for performance.", "output": "All tests passing. Performance optimized with 40% reduction in execution time. Ready for deployment."},
        ]
        return {"steps": steps, "task": req.task, "mock": True}

    try:
        raw = await generate_full(prompt, req.model)
        # Clean JSON from potential markdown fences
        raw = raw.strip().lstrip("```json").lstrip("```").rstrip("```").strip()
        steps = json.loads(raw)
        return {"steps": steps, "task": req.task, "mock": False}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Agent error: {str(e)}")

@app.post("/generate-blog")
async def generate_blog(req: BlogRequest):
    prompt = f"""Write a comprehensive, engaging {req.tone} blog post about "{req.topic}".

Structure:
- A compelling title
- Introduction (hook + thesis)
- 4-5 main sections with subheadings
- Real examples and data points
- Conclusion with CTA

Format with proper markdown. Length: {req.length} (medium = ~800 words)."""

    if MOCK_MODE:
        content = f"""# {req.topic}: The Future of AI is Here

## Introduction
The landscape of artificial intelligence is rapidly evolving, and **{req.topic}** stands at the forefront of this revolution. In this comprehensive guide, we'll explore how this technology is reshaping industries and what it means for developers, researchers, and businesses alike.

## What Makes It Revolutionary
NVIDIA Nemotron 3 introduces a groundbreaking **Transformer + Mamba hybrid architecture** that delivers unprecedented performance:
- 🚀 **5x throughput** compared to standard transformer models
- 🧠 **Latent Mixture-of-Experts** for dynamic computation
- ⚡ **Multi-token prediction** for faster inference

## Real-World Applications
From autonomous code generation to complex research synthesis, the applications are limitless...

## Implementation Guide
```python
import openai

client = openai.OpenAI(
    base_url="https://integrate.api.nvidia.com/v1",
    api_key="your-nvidia-api-key"
)

response = client.chat.completions.create(
    model="nvidia/llama-3.1-nemotron-70b-instruct",
    messages=[{{"role": "user", "content": "Hello, Nemotron!"}}]
)
```

## The Road Ahead
As AI continues to advance, platforms like NemoCore AI will democratize access to enterprise-grade intelligence...

## Conclusion
The future of AI is agentic, efficient, and accessible. **Start building with NemoCore AI today.**"""
        return {
            "title": f"{req.topic}: The Future of AI is Here",
            "content": content,
            "word_count": len(content.split()),
            "topic": req.topic,
            "mock": True,
        }

    try:
        content = await generate_full(prompt)
        lines = content.strip().split("\n")
        title = lines[0].lstrip("#").strip() if lines else req.topic
        return {"title": title, "content": content, "word_count": len(content.split()), "topic": req.topic, "mock": False}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/generate-paper")
async def generate_paper(req: PaperRequest):
    prompt = f"""Write a formal academic research paper titled "{req.title}" in the domain of {req.domain}.
Keywords: {", ".join(req.keywords) if req.keywords else "AI, machine learning, neural networks"}

Include these sections in proper academic format:
1. Abstract (150-200 words)
2. Introduction
3. Related Work
4. Methodology
5. Experimental Results
6. Discussion
7. Conclusion
8. References (5-8 mock references in APA format)

Use markdown formatting with proper section headers."""

    if MOCK_MODE:
        content = f"""# {req.title}

**Abstract**

This paper presents a comprehensive investigation into {req.title.lower()} within the domain of {req.domain}. We propose a novel framework leveraging NVIDIA Nemotron 3's hybrid Transformer-Mamba architecture to achieve state-of-the-art performance. Our experimental results demonstrate a 5x improvement in throughput and 40% reduction in computational overhead compared to baseline models. The findings suggest significant implications for real-world deployment of large language models in resource-constrained environments.

**Keywords:** {", ".join(req.keywords) if req.keywords else "artificial intelligence, Nemotron, transformer, mixture-of-experts"}

---

## 1. Introduction

The rapid advancement of large language models (LLMs) has created unprecedented opportunities in {req.domain}. However, significant challenges remain in balancing computational efficiency with model capability...

## 2. Related Work

Previous work by Vaswani et al. (2017) established the transformer architecture as the dominant paradigm. Recent developments including Mamba (Gu & Dao, 2023) have demonstrated the viability of state-space models as competitive alternatives...

## 3. Methodology

Our proposed framework integrates three key innovations:

**3.1 Hybrid Architecture**
We combine transformer attention mechanisms with Mamba's selective state-space models to balance global and local context modeling.

**3.2 Latent Mixture-of-Experts**
Dynamic routing assigns tokens to specialized expert networks, reducing active parameters during inference by 60%.

**3.3 Multi-Token Prediction**
Parallel prediction of multiple future tokens enables 5x inference speedup without accuracy degradation.

## 4. Experimental Results

| Model | Throughput (tok/s) | MMLU | HumanEval |
|-------|-------------------|------|-----------|
| GPT-4 Turbo | 45 | 86.4 | 87.0 |
| Llama 3.1 70B | 78 | 83.6 | 80.5 |
| **Nemotron 3 (Ours)** | **210** | **85.1** | **83.2** |

## 5. Discussion

The results validate our hypothesis that hybrid architectures can achieve competitive accuracy while delivering superior throughput...

## 6. Conclusion

This work demonstrates the effectiveness of combining transformer and state-space model components within a Mixture-of-Experts framework. Future work will explore scaling to 400B+ parameter regimes.

## References

1. Vaswani, A., et al. (2017). *Attention is all you need*. NeurIPS.
2. Gu, A., & Dao, T. (2023). *Mamba: Linear-time sequence modeling with selective state spaces*. arXiv:2312.00752.
3. Shazeer, N., et al. (2017). *Outrageously large neural networks: The sparsely-gated mixture-of-experts layer*. ICLR.
4. Brown, T., et al. (2020). *Language models are few-shot learners*. NeurIPS.
5. Touvron, H., et al. (2023). *Llama 2: Open foundation and fine-tuned chat models*. arXiv:2307.09288."""
        return {"title": req.title, "content": content, "domain": req.domain, "mock": True}

    try:
        content = await generate_full(prompt)
        return {"title": req.title, "content": content, "domain": req.domain, "mock": False}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/projects/{user_id}")
async def get_projects(user_id: str):
    # In production, query Supabase
    return {"projects": [], "user_id": user_id}

@app.post("/save-project")
async def save_project(req: SaveProjectRequest):
    return {"success": True, "id": "mock-project-id", "message": "Project saved (connect Supabase for persistence)"}

@app.delete("/projects/{project_id}")
async def delete_project(project_id: str):
    return {"success": True, "id": project_id}

@app.get("/analytics/{user_id}")
async def get_analytics(user_id: str):
    import random
    days = 7
    daily = []
    for i in range(days):
        daily.append({
            "date": f"2026-04-{7 - i:02d}",
            "queries": random.randint(5, 50),
            "tokens": random.randint(500, 5000),
            "avg_response_ms": random.randint(300, 1200),
        })
    return {
        "user_id": user_id,
        "total_tokens": 24830,
        "total_queries": 148,
        "total_projects": 7,
        "avg_response_ms": 680,
        "daily": daily,
        "model_usage": [
            {"model": "Nemotron 70B", "usage": 65},
            {"model": "Nemotron 8B", "usage": 25},
            {"model": "Nemotron 3B", "usage": 10},
        ]
    }
