# NemoCore AI – Agentic AI Platform powered by NVIDIA Nemotron 3

A production-grade AI SaaS platform built for the NVIDIA Nemotron 3 Workshop.

![NemoCore AI](https://img.shields.io/badge/Powered%20by-NVIDIA%20Nemotron%203-76b900?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Frontend-Next.js%2016-black?style=for-the-badge)
![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?style=for-the-badge)
![Vercel](https://img.shields.io/badge/Hosted%20on-Vercel-000000?style=for-the-badge)
![Render](https://img.shields.io/badge/API%20on-Render-46E3B7?style=for-the-badge)

---

## 📽️ Visual Demo

<div align="center">
  <h3>📽️ Full Platform Walkthrough</h3>
  <video src="./1.mp4" width="100%" controls muted autoplay loop>
    Your browser does not support the video tag. <a href="./1.mp4">Watch the video here</a>.
  </video>
  <p><i>If the video doesn't load, <a href="./1.mp4">click here to watch it directly.</a></i></p>
  <br/>
  <img src="./1.png" width="100%" alt="Landing Page" />
  <br/><br/>
  <img src="./11.png" width="49%" alt="Dashboard Home" />
  <img src="./22.png" width="49%" alt="Agent Studio" />
</div>

---

## 🏗️ System Architecture

```mermaid
flowchart TD
    subgraph CLIENT["🌐 Client Browser"]
        direction TB
        LS["🔑 localStorage\nnemocore_nvidia_key\nnemocore_openrouter_key\nnemocore_demo_mode"]
        UI["⚛️ Next.js App\n(Vercel CDN)"]
        MODAL["💎 ApiKeyModal\n(first-visit prompt)"]
    end

    subgraph PAGES["📄 Pages / Routes"]
        direction LR
        LAND["/ Landing Page"]
        DASH["Dashboard /dashboard"]
        CHAT["/dashboard/chat"]
        AGENT["/dashboard/agent"]
        BLOG["/dashboard/blog"]
        PAPER["/dashboard/paper"]
        SETTINGS["/dashboard/settings"]
    end

    subgraph API_LIB["📡 api.ts — API Client"]
        HEADERS["getApiHeaders()\nReads keys from localStorage\nInjects x-nvidia-api-key\nx-openrouter-api-key headers"]
        STREAM["streamChat()"]
        AGENT_FN["runAgent()"]
        BLOG_FN["generateBlog()"]
        PAPER_FN["generatePaper()"]
    end

    subgraph BACKEND["🐍 FastAPI Backend (Render)"]
        direction TB
        CORS["CORS Middleware\nAllows *.vercel.app\n+ FRONTEND_URL"]
        
        subgraph ROUTES["Routes"]
            R_CHAT["POST /chat"]
            R_AGENT["POST /agent"]
            R_BLOG["POST /generate-blog"]
            R_PAPER["POST /generate-paper"]
            R_HEALTH["GET /health"]
        end

        subgraph HELPERS["Helpers"]
            STREAM_FN["stream_chat()\nnvidia_key / openrouter_key"]
            GEN_FN["generate_full()\nnvidia_key / openrouter_key"]
        end

        MOCK{"Mock Mode?\nNo valid key\nin headers or env"}
    end

    subgraph AI_PROVIDERS["🤖 AI Providers"]
        NVIDIA["NVIDIA NIM API\nbuild.nvidia.com\nnvidia/llama-3.1-nemotron-70b"]
        OPENROUTER["OpenRouter API\nopenrouter.ai\nnvidia/nemotron-3-nano-30b"]
        MOCK_RESP["📦 Mock Response\nSimulated stream\n(demo mode)"]
    end

    %% User flow
    UI -->|"first load"| MODAL
    MODAL -->|"save keys"| LS
    MODAL -->|"demo mode"| LS
    LS -->|"read on every request"| HEADERS
    UI --> PAGES
    LAND -->|"Get Started click"| DASH
    SETTINGS -->|"Save Changes"| LS

    %% API calls
    CHAT --> STREAM
    AGENT --> AGENT_FN
    BLOG --> BLOG_FN
    PAPER --> PAPER_FN
    STREAM --> HEADERS
    AGENT_FN --> HEADERS
    BLOG_FN --> HEADERS
    PAPER_FN --> HEADERS

    %% Backend flow
    HEADERS -->|"HTTPS + headers"| CORS
    CORS --> ROUTES
    R_CHAT --> STREAM_FN
    R_AGENT --> GEN_FN
    R_BLOG --> GEN_FN
    R_PAPER --> GEN_FN
    STREAM_FN --> MOCK
    GEN_FN --> MOCK

    %% Provider routing
    MOCK -->|"nvidia/ model + valid key"| NVIDIA
    MOCK -->|"openrouter/ model + valid key"| OPENROUTER
    MOCK -->|"no valid key"| MOCK_RESP

    %% Response back
    NVIDIA -->|"SSE stream"| R_CHAT
    OPENROUTER -->|"SSE stream"| R_CHAT
    MOCK_RESP -->|"SSE stream"| R_CHAT

    %% Styling
    classDef clientBox fill:#0f1420,stroke:#76b900,stroke-width:2px,color:#f8fafc
    classDef backendBox fill:#0f1420,stroke:#00d4ff,stroke-width:2px,color:#f8fafc
    classDef aiBox fill:#0f1420,stroke:#7c3aed,stroke-width:2px,color:#f8fafc
    classDef mockNode fill:#1a1a2e,stroke:#f59e0b,stroke-width:2px,color:#fbbf24
    classDef nvidiaNode fill:#1a1a2e,stroke:#76b900,stroke-width:2px,color:#76b900

    class UI,LS,MODAL clientBox
    class CORS,ROUTES,HELPERS,STREAM_FN,GEN_FN backendBox
    class NVIDIA,OPENROUTER nvidiaNode
    class MOCK,MOCK_RESP mockNode
```

---

## 🔄 Deployment Architecture

This diagram illustrates how changes pushed to GitHub trigger independent builds on Vercel (frontend) and Render (backend).

```mermaid
flowchart TD
    subgraph DEV_PC["💻 Developer Machine"]
        GIT_PUSH["1. git push origin main"]
    end

    subgraph CLOUD["☁️ GitHub Repository"]
        REPO["GitHub Repo\n(Root: .python-version, render.yaml)"]
    end

    subgraph VERCEL["⚡ Vercel (Frontend Hosting)"]
        V_BUILD["Vercel Build Engine\n(rootDir: frontend)"]
        V_CDN["Vercel Edge Network / CDN\n(Serves Next.js Static Pages & Hydrated UI)"]
    end

    subgraph RENDER["🐍 Render (Backend Hosting)"]
        R_BUILD["Render Build/Deploy\n(Python 3.11 from root .python-version)"]
        R_SVC["FastAPI App Service\n(Runs Uvicorn on $PORT)"]
    end

    %% Deployment Workflow
    GIT_PUSH --> REPO
    REPO -->|"Deploy Trigger"| V_BUILD
    REPO -->|"Deploy Trigger"| R_BUILD
    V_BUILD --> V_CDN
    R_BUILD --> R_SVC

    %% Styling
    classDef git fill:#1e293b,stroke:#f43f5e,stroke-width:2px,color:#fff
    classDef vercel fill:#000,stroke:#fff,stroke-width:2px,color:#fff
    classDef render fill:#0f172a,stroke:#00f5d4,stroke-width:2px,color:#fff

    class DEV_PC,GIT_PUSH,REPO,CLOUD git
    class VERCEL,V_BUILD,V_CDN vercel
    class RENDER,R_BUILD,R_SVC render
```

---

## ⚡ Request & Content Generation Dataflow

This diagram represents the step-by-step dataflow of generating content (Blog, Research Paper, Agent Plan, Chat) and persisting it locally without database requirements.

```mermaid
flowchart TD
    subgraph CLIENT_BROWSER["🌐 User Client Browser (Next.js)"]
        CLIENT_UI["NemoCore App UI\n(Dashboard, Chat, Agent, Blog, Paper)"]
        STORE["📦 projectsStore\n(localStorage Persistence)"]
        IEEE_ENGINE["📄 IEEE Layout Engine\n(Dual-column, Times New Roman, LaTeX Math)"]
        FIG_INJECT["🖼️ Figure Injection\n(Transforms figure:xxx to rich cards)"]
        LS["🔑 API Keys Storage\n(localStorage)"]
    end

    subgraph BACKEND["🐍 FastAPI Backend (Render)"]
        CORS["🛡️ CORS Middleware\n(Allows *.vercel.app)"]
        ROUTES["🚀 Routers\n(/chat, /agent, /generate-blog, /generate-paper)"]
        MOCK_GEN["📦 Mock Response Templates\n(Rich, structured markdown & latex)"]
        LIVE_CLIENT["📡 Async HTTPX Client\n(Connects to LLM endpoints)"]
        KEY_CHECK{"🔑 Key Verification?\nChecks headers for x-nvidia-api-key"}
    end

    subgraph PROVIDERS["🤖 AI Providers (NIMs)"]
        NVIDIA_API["NVIDIA NIM API\n(llama-3.1-nemotron-70b-instruct)"]
        OR_API["OpenRouter API\n(nemotron-3-nano-30b-a3b)"]
    end

    %% Generation and Save Dataflow
    CLIENT_UI -->|"1. Fetch keys"| LS
    CLIENT_UI -->|"2. Dispatch POST with x-nvidia-api-key"| CORS
    CORS --> ROUTES
    ROUTES --> KEY_CHECK
    
    KEY_CHECK -->|"Valid Key Present"| LIVE_CLIENT
    KEY_CHECK -->|"No Key (Demo Mode)"| MOCK_GEN
    
    LIVE_CLIENT -->|"3. Query NIM API"| NVIDIA_API
    LIVE_CLIENT -->|"3. Query OpenRouter"| OR_API
    
    NVIDIA_API -->|"4. Text/SSE Response"| ROUTES
    OR_API -->|"4. Text/SSE Response"| ROUTES
    MOCK_GEN -->|"4. Static Markdown Payload"| ROUTES
    
    ROUTES -->|"5. Return Generated Content"| CLIENT_UI
    
    %% Post-processing
    CLIENT_UI -->|"Render visual figures"| FIG_INJECT
    CLIENT_UI -->|"Format Paper"| IEEE_ENGINE
    CLIENT_UI -->|"6. Click 'Save to Projects'"| STORE
    STORE -->|"Read/Write"| LS

    %% Styling
    classDef client fill:#0f172a,stroke:#76b900,stroke-width:2px,color:#fff
    classDef render fill:#0f172a,stroke:#00f5d4,stroke-width:2px,color:#fff
    classDef provider fill:#0f172a,stroke:#a855f7,stroke-width:2px,color:#fff

    class CLIENT_BROWSER,CLIENT_UI,STORE,IEEE_ENGINE,FIG_INJECT,LS client
    class BACKEND,CORS,ROUTES,MOCK_GEN,LIVE_CLIENT,KEY_CHECK render
    class PROVIDERS,NVIDIA_API,OR_API provider
```

---

## 🔑 API Key Flow (No Login Required)

```mermaid
sequenceDiagram
    actor User
    participant Browser as Browser (localStorage)
    participant Modal as ApiKeyModal
    participant Settings as Settings Page
    participant API as api.ts
    participant Backend as FastAPI (Render)
    participant NVIDIA as NVIDIA NIM API

    User->>Browser: Visit /dashboard (first time)
    Browser->>Modal: No keys found → show modal
    User->>Modal: Enter NVIDIA API key
    Modal->>Browser: localStorage.setItem('nemocore_nvidia_key', key)
    Modal->>User: Redirect to dashboard

    User->>Browser: Send chat message
    Browser->>API: streamChat(messages)
    API->>Browser: getApiHeaders() → reads localStorage
    API->>Backend: POST /chat + x-nvidia-api-key header
    Backend->>Backend: Extract header key → override env key
    Backend->>NVIDIA: Authenticated API call
    NVIDIA-->>Backend: SSE token stream
    Backend-->>Browser: Proxied SSE stream
    Browser-->>User: Live streaming response

    User->>Settings: Update key in Settings page
    Settings->>Browser: localStorage.setItem(new key)
    Note over Browser,NVIDIA: Next request auto-uses new key
```

---

## 🚀 Features

| Feature | Description |
|---|---|
| 🏠 **Landing Page** | Premium hero, features, pricing, testimonials |
| 🔑 **No-Login API Key Setup** | Keys stored in localStorage, injected per-request |
| 💎 **API Key Modal** | Glassmorphic first-visit modal with live validation |
| 📊 **Dashboard** | Stats, quick actions, GPU metrics |
| 💬 **AI Chat** | Streaming, markdown, voice input, model selector |
| 🤖 **Agent Studio** | Agentic task decomposition with step timeline |
| 📂 **Projects** | Save, search, filter, download projects |
| 📝 **Blog Generator** | Topic → full SEO blog with tone/length control |
| 📄 **Paper Generator** | Academic papers with citations |
| 📊 **Analytics** | Recharts: queries, tokens, latency, model usage |
| ⚙️ **Settings** | Profile, API key (synced to localStorage), theme |

---

## 📁 Folder Structure

```
Nemotron_3/
├── frontend/                   # Next.js 16 App (→ Vercel)
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx        # Landing page
│   │   │   ├── (auth)/         # Login, Signup (redirect → /dashboard)
│   │   │   └── (dashboard)/    # All dashboard pages
│   │   ├── components/
│   │   │   ├── ApiKeyModal.tsx  # First-visit API key prompt
│   │   │   ├── DashboardShell.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── MarkdownRenderer.tsx
│   │   └── lib/
│   │       ├── api.ts          # All fetch calls + localStorage key injection
│   │       └── utils.ts
│   ├── .env.production         # NEXT_PUBLIC_API_URL (committed, no secrets)
│   └── vercel.json             # Vercel deployment config
│
├── backend/                    # FastAPI (→ Render)
│   ├── main.py                 # Routes + NVIDIA/OpenRouter integration
│   ├── requirements.txt
│   ├── render.yaml             # Render deployment config
│   └── .env                   # Local secrets (never committed)
│
└── README.md
```

---

## ⚡ Quick Start (Local)

### 1. Clone & Install

```bash
# Frontend
cd frontend
npm install

# Backend
cd backend
python -m venv venv
.\venv\Scripts\activate        # Windows
pip install -r requirements.txt
cp .env.example .env
```

### 2. Run Servers

```bash
# Terminal 1 – Backend
cd backend && .\venv\Scripts\activate
uvicorn main:app --reload --port 8000

# Terminal 2 – Frontend
cd frontend
npm run dev -- --port 3001
```

Open **[http://localhost:3001](http://localhost:3001)** → the API key modal appears on first visit.

> **No API keys?** Click **"Use Demo Mode"** — all features work with simulated mock responses.

---

## 🔑 Getting API Keys

### NVIDIA Nemotron 3
1. Go to [https://build.nvidia.com](https://build.nvidia.com)
2. Sign in → **API Keys** → Create key
3. Enter the `nvapi-...` key in the modal or Settings page

### OpenRouter (Free Alternative)
1. Go to [https://openrouter.ai](https://openrouter.ai)
2. Sign in → **API Keys** → Create key
3. Enter the `sk-or-...` key in the modal or Settings page
4. Select the **Nemotron 3 Nano 30B A3B** model (free tier)

---

## 🚀 Deployment

### Frontend → Vercel

1. Push repo to GitHub
2. Import project on [vercel.com](https://vercel.com) → set **Root Directory** to `frontend`
3. Add env var: `NEXT_PUBLIC_API_URL` = `https://your-render-url.onrender.com`
4. Deploy ✅

### Backend → Render

1. Import repo on [render.com](https://render.com) → **New Web Service**
2. Set **Root Directory** to `backend`
3. Build: `pip install -r requirements.txt`
4. Start: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Add env vars: `NVIDIA_API_KEY`, `OPENROUTER_API_KEY`, `FRONTEND_URL` (your Vercel URL)
6. Deploy ✅

---

## 🧠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16, TypeScript, Framer Motion, Vanilla CSS |
| Backend | FastAPI, Python 3.11, httpx (async streaming) |
| AI | NVIDIA NIM API (Nemotron 70B/8B/3B) + OpenRouter |
| Key Storage | Browser localStorage (no server-side auth required) |
| Hosting | Vercel (frontend) + Render (backend) |
| Charts | Recharts |
| Markdown | react-markdown + react-syntax-highlighter |
| Icons | Lucide React |

---

## 📸 Pages

| Route | Description |
|---|---|
| `/` | Landing page |
| `/login` | Auto-redirects → `/dashboard` |
| `/signup` | Auto-redirects → `/dashboard` |
| `/dashboard` | Home with stats + API key modal |
| `/dashboard/chat` | AI Chat (streaming SSE) |
| `/dashboard/agent` | Agent Studio (4-step planner) |
| `/dashboard/projects` | Project manager |
| `/dashboard/blog` | Blog generator |
| `/dashboard/paper` | Research paper generator |
| `/dashboard/analytics` | Usage charts |
| `/dashboard/settings` | API keys + theme + notifications |

---

Built for the **NVIDIA Nemotron 3 Workshop 2026** 🟩
