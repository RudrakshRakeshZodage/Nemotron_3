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


# Build allowed origins list from environment
_frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3000")
_allowed_origins = [
    "http://localhost:3000",
    "http://localhost:3001",
    _frontend_url,
]
# Also allow all vercel.app subdomains (covers preview + production deployments)

app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_origins=_allowed_origins,
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

async def stream_chat(messages: list, model: str, temperature: float, max_tokens: int, nvidia_key: str = "", openrouter_key: str = ""):
    """Stream from appropriate API based on model prefix."""
    has_nvidia = nvidia_key or (NVIDIA_API_KEY and not NVIDIA_API_KEY.startswith("nvapi-xxx") and NVIDIA_API_KEY != "")
    has_openrouter = openrouter_key or (OPENROUTER_API_KEY and not OPENROUTER_API_KEY.startswith("sk-or-xxx") and OPENROUTER_API_KEY != "")
    is_mock = (model.startswith("nvidia/") and not has_nvidia) or (model.startswith("openrouter/") and not has_openrouter)

    if is_mock:
        mock_response = (
            "I'm **NemoCore AI**, powered by NVIDIA Nemotron 3. "
            "This is a simulated response — add your API key to settings for live responses.\n\n"
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
        api_key = nvidia_key or NVIDIA_API_KEY
        base_url = NVIDIA_BASE_URL
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        }
    elif model.startswith("openrouter/"):
        api_key = openrouter_key or OPENROUTER_API_KEY
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


async def generate_full(prompt: str, model: str = "nvidia/llama-3.1-nemotron-70b-instruct", nvidia_key: str = "", openrouter_key: str = "") -> str:
    """Non-streaming full response (for structured generation)."""
    has_nvidia = nvidia_key or (NVIDIA_API_KEY and not NVIDIA_API_KEY.startswith("nvapi-xxx") and NVIDIA_API_KEY != "")
    has_openrouter = openrouter_key or (OPENROUTER_API_KEY and not OPENROUTER_API_KEY.startswith("sk-or-xxx") and OPENROUTER_API_KEY != "")
    is_mock = (model.startswith("nvidia/") and not has_nvidia) or (model.startswith("openrouter/") and not has_openrouter)

    if is_mock:
        return f"[MOCK] Generated response for: {prompt[:80]}..."

    # Determine API provider based on model prefix
    if model.startswith("nvidia/"):
        api_key = nvidia_key or NVIDIA_API_KEY
        base_url = NVIDIA_BASE_URL
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        }
    elif model.startswith("openrouter/"):
        api_key = openrouter_key or OPENROUTER_API_KEY
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
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0.7,
        "max_tokens": 2048,
        "stream": False,
    }
    async with httpx.AsyncClient(timeout=120) as client:
        resp = await client.post(f"{base_url}/chat/completions", headers=headers, json=payload)
        resp.raise_for_status()
        return resp.json()["choices"][0]["message"]["content"]

# ── Routes ────────────────────────────────────────────────────────────────────

@app.get("/")
async def root():
    env = os.getenv("ENVIRONMENT", "development")
    return {"message": "NemoCore AI API", "status": "running", "environment": env, "mock_mode": MOCK_MODE}

@app.get("/health")
async def health():
    return {"status": "ok", "nvidia_connected": bool(NVIDIA_API_KEY and not NVIDIA_API_KEY.startswith("nvapi-xxx")), "openrouter_connected": bool(OPENROUTER_API_KEY and not OPENROUTER_API_KEY.startswith("sk-or-xxx"))}

@app.post("/chat")
async def chat(req: ChatRequest, request: Request):
    nvidia_key = request.headers.get("x-nvidia-api-key", "")
    openrouter_key = request.headers.get("x-openrouter-api-key", "")
    messages = [{"role": m.role, "content": m.content} for m in req.messages]
    return StreamingResponse(
        stream_chat(messages, req.model, req.temperature, req.max_tokens, nvidia_key, openrouter_key),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )

@app.post("/agent")
async def agent(req: AgentRequest, request: Request):
    nvidia_key = request.headers.get("x-nvidia-api-key", "")
    openrouter_key = request.headers.get("x-openrouter-api-key", "")
    prompt = f"""You are an expert AI agent planner. Break the following task into exactly 4 concrete steps.
Respond with a valid JSON array of objects with keys: step (int), title (string), description (string), output (string).

Task: {req.task}

Return ONLY the JSON array, no markdown, no explanation."""

    has_nvidia = nvidia_key or (NVIDIA_API_KEY and not NVIDIA_API_KEY.startswith("nvapi-xxx") and NVIDIA_API_KEY != "")
    has_openrouter = openrouter_key or (OPENROUTER_API_KEY and not OPENROUTER_API_KEY.startswith("sk-or-xxx") and OPENROUTER_API_KEY != "")
    is_mock = (req.model.startswith("nvidia/") and not has_nvidia) or (req.model.startswith("openrouter/") and not has_openrouter)

    if is_mock:
        steps = [
            {"step": 1, "title": "Research & Analysis", "description": f"Gather requirements and analyze the task: {req.task}", "output": "Comprehensive understanding of the task scope, constraints, and success criteria. Identified 3 key components to address."},
            {"step": 2, "title": "Planning & Architecture", "description": "Design the solution architecture and create a detailed implementation plan.", "output": "Step-by-step implementation plan with technology stack, file structure, and component breakdown."},
            {"step": 3, "title": "Implementation & Code", "description": "Write production-ready code following best practices and design patterns.", "output": "```python\n# Core implementation\ndef solve_task():\n    # Nemotron-generated solution\n    return optimized_result\n```"},
            {"step": 4, "title": "Testing & Optimization", "description": "Test the implementation, fix edge cases, and optimize for performance.", "output": "All tests passing. Performance optimized with 40% reduction in execution time. Ready for deployment."},
        ]
        return {"steps": steps, "task": req.task, "mock": True}

    try:
        raw = await generate_full(prompt, req.model, nvidia_key, openrouter_key)
        # Clean JSON from potential markdown fences
        raw = raw.strip().lstrip("```json").lstrip("```").rstrip("```").strip()
        steps = json.loads(raw)
        return {"steps": steps, "task": req.task, "mock": False}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Agent error: {str(e)}")

@app.post("/generate-blog")
async def generate_blog(req: BlogRequest, request: Request):
    nvidia_key = request.headers.get("x-nvidia-api-key", "")
    openrouter_key = request.headers.get("x-openrouter-api-key", "")
    prompt = f"""Write a detailed, high-fidelity blog post about "{req.topic}" with a {req.tone} tone and {req.length} length.
Include engaging subheadings, markdown formatting, lists, code snippets if applicable, and explicitly embed the following image hooks:
- A banner image at the top: `![NemoCore AI Banner](figure:blog-banner)`
- A chart showing adoption/performance: `![Generative AI Adoption Trend](figure:blog-chart)`
Make it informative, structured, and at least 800 words."""

    has_nvidia = nvidia_key or (NVIDIA_API_KEY and not NVIDIA_API_KEY.startswith("nvapi-xxx") and NVIDIA_API_KEY != "")
    
    try:
        model = "nvidia/llama-3.1-nemotron-70b-instruct" if has_nvidia else "openrouter/nvidia-nemotron-3-nano-30b-a3b"
        content = await generate_full(prompt, model=model, nvidia_key=nvidia_key, openrouter_key=openrouter_key)
        lines = content.strip().split("\n")
        title = lines[0].lstrip("#").strip() if lines else req.topic
        return {"title": title, "content": content, "word_count": len(content.split()), "topic": req.topic, "mock": False}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/generate-paper")
async def generate_paper(req: PaperRequest, request: Request):
    nvidia_key = request.headers.get("x-nvidia-api-key", "")
    openrouter_key = request.headers.get("x-openrouter-api-key", "")
    prompt = f"""Write a formal academic research paper titled "{req.title}" in the domain of {req.domain}.
Keywords: {", ".join(req.keywords) if req.keywords else "AI, machine learning, neural networks"}

Use the following IEEE structural formatting:
- Roman numerals for main section headers (e.g., "# I. INTRODUCTION", "# II. RELATED WORK", "# III. METHODOLOGY", "# IV. EXPERIMENTAL RESULTS", "# V. DISCUSSION", "# VI. CONCLUSION", "# VII. REFERENCES").
- Alphabetical labels for subsections (e.g., "## A. Subsection Title").
- Include 2 detailed LaTeX mathematical equations using $$ ... $$.
- Include at least 1 Markdown table displaying experimental results comparing baseline models.
- Explicitly embed the following image hooks in the text:
  1. Methodology section: `![Figure 1: Hybrid Transformer-Mamba MoE Architecture](figure:architecture)`
  2. Experimental Results section: `![Figure 2: Performance and Throughput Comparison](figure:chart)`

Make the output extremely detailed, formal, and high-fidelity (at least 1200 words)."""

    has_nvidia = nvidia_key or (NVIDIA_API_KEY and not NVIDIA_API_KEY.startswith("nvapi-xxx") and NVIDIA_API_KEY != "")
    
    try:
        model = "nvidia/llama-3.1-nemotron-70b-instruct" if has_nvidia else "openrouter/nvidia-nemotron-3-nano-30b-a3b"
        content = await generate_full(prompt, model=model, nvidia_key=nvidia_key, openrouter_key=openrouter_key)
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
