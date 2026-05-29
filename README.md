# NemoCore AI – Agentic AI Platform powered by NVIDIA Nemotron 3

A production-grade AI SaaS platform built for the NVIDIA Nemotron 3 Workshop. NemoCore AI showcases how to construct agentic systems, document generators, research assistants, and live telemetry platforms utilizing high-performance NVIDIA NIMs.

> [!TIP]
> 🚀 **Live Demo:** **[https://nemotron-3.vercel.app](https://nemotron-3.vercel.app)**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-nemotron--3.vercel.app-76b900?style=for-the-badge&logo=vercel)](https://nemotron-3.vercel.app)
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

## 🚀 Key Features Breakdown

- 🏠 **Premium Hub Landing Page**: Complete landing page experience featuring an interactive pricing matrix, live showcase, testimonials, and glassmorphic card grids.
- 🔑 **Decentralized API Key Architecture**: Safe design architecture where user keys (`nvapi-...` or `sk-or-...`) are managed completely on the client-side (`localStorage`). The FastAPI backend proxies requests without retaining logs of keys, guaranteeing full confidentiality.
- 💬 **Advanced AI Chat Room**: Implements real-time Server-Sent Events (SSE) streaming, deep markdown syntax parsing (via `react-markdown`), LaTeX formula compilation, and custom syntax themes for code block rendering.
- 🤖 **Agent Studio**: Generates dynamic execution flows decomposing heavy user prompts into a 4-step interactive pipeline. Displays stateful completion badges and live outputs.
- 📄 **IEEE Layout Academic Engine**: Adapts structural LaTeX, multi-column simulation grids, Times New Roman standard styling, and custom figure integrations (`figure:architecture`, `figure:chart`) into clean academic formats.
- 📝 **SEO Content Blog Suite**: Interactive generator accepting topic, length, and tone inputs. Automatically inserts image hooks (`figure:blog-banner` and `figure:blog-chart`) that the UI displays as high-fidelity visual cards.
- 📊 **Telemetry & Analytics**: Uses Recharts to visualize real-time simulated platform query throughput, latency, token ingestion rates, and LLM distribution metrics.

---

## 🛠️ API Reference (FastAPI Backend)

All endpoints accept client-passed override API keys in request headers. If no keys are specified, the API gracefully defaults to its server env keys. If those are absent, it routes to **Demo Mode (Mock Response Generation)**.

### Custom Headers

| Header | Description |
|---|---|
| `x-nvidia-api-key` | Client's custom NVIDIA NIM API Key |
| `x-openrouter-api-key` | Client's custom OpenRouter API Key |

### Endpoints

#### 1. Chat Stream
* **URL:** `/chat`
* **Method:** `POST`
* **Payload:**
```json
{
  "messages": [
    {"role": "user", "content": "Explain Mamba vs Transformers"}
  ],
  "model": "nvidia/llama-3.1-nemotron-70b-instruct",
  "temperature": 0.7,
  "max_tokens": 1024
}
```
* **Response:** Server-Sent Events (SSE) stream (`text/event-stream`).

#### 2. Agent Workflow Planner
* **URL:** `/agent`
* **Method:** `POST`
* **Payload:**
```json
{
  "task": "Create a secure user login system in Node.js",
  "model": "nvidia/llama-3.1-nemotron-70b-instruct"
}
```
* **Response:**
```json
{
  "task": "Create a secure user login system in Node.js",
  "mock": false,
  "steps": [
    {
      "step": 1,
      "title": "Establish DB Connection & Schema",
      "description": "Initialize postgres db and layout user credentials table with schema validation.",
      "output": "Database schema finalized."
    }
    // ... total 4 steps
  ]
}
```

#### 3. Blog Post Suite
* **URL:** `/generate-blog`
* **Method:** `POST`
* **Payload:**
```json
{
  "topic": "The Future of Edge AI Computing",
  "tone": "professional",
  "length": "medium"
}
```
* **Response:**
```json
{
  "title": "The Future of Edge AI Computing",
  "content": "... Markdown with embedded figure tags ...",
  "word_count": 850,
  "topic": "The Future of Edge AI Computing",
  "mock": false
}
```

#### 4. IEEE Research Assistant
* **URL:** `/generate-paper`
* **Method:** `POST`
* **Payload:**
```json
{
  "title": "Latent Mixture-of-Experts with Multi-Token Predictors",
  "domain": "Computer Science",
  "keywords": ["Transformers", "MoE", "NVIDIA NIM"]
}
```
* **Response:**
```json
{
  "title": "Latent Mixture-of-Experts with Multi-Token Predictors",
  "content": "... Full IEEE Academic styled text with sections (I, II, III etc.) ...",
  "domain": "Computer Science",
  "mock": false
}
```

---

## 📁 Detailed Folder Structure

```
Nemotron_3/
├── frontend/                   # Next.js 16 App (→ Vercel)
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx        # Responsive Landing Hub
│   │   │   ├── (auth)/         # Shell auth pathways (redirects to dashboard)
│   │   │   └── (dashboard)/    # Dashboard layout enclosing:
│   │   │       ├── page.tsx    # Telemetry metrics + welcome card
│   │   │       ├── chat/       # Chat view with SSE streamer
│   │   │       ├── agent/      # Agent Studio layout
│   │   │       ├── blog/       # SEO Blog Post compiler
│   │   │       ├── paper/      # LaTeX and IEEE formatting grid
│   │   │       ├── projects/   # localStorage project cache browser
│   │   │       ├── analytics/  # Recharts usage dashboard
│   │   │       └── settings/   # localStorage API credentials settings
│   │   ├── components/
│   │   │   ├── ApiKeyModal.tsx # First-visit modal overlay
│   │   │   ├── Sidebar.tsx     # Collapsible navigation drawer
│   │   │   └── MarkdownRenderer.tsx # Contextual figure inject & parser
│   │   └── lib/
│   │       ├── api.ts          # API Client + custom headers payload
│   │       └── utils.ts        # Style and tailwind mixers
│   ├── .env.production         # Next production target endpoints
│   └── vercel.json             # Vercel deployment directives
│
├── backend/                    # FastAPI App (→ Render)
│   ├── main.py                 # Router logic, stream yielders & fallback mocks
│   ├── requirements.txt        # Backend dependencies
│   ├── render.yaml             # Render infrastructure blueprint
│   └── .env                    # Local environmental overrides (ignored by Git)
│
└── README.md                   # System Documentation
```

---

## ⚡ Quick Start (Local Setup)

### Prerequisites
* **Node.js**: v18 or newer (v20+ recommended)
* **Python**: v3.11.x

### 1. Configure the Backend

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
.\venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create local environment config
cp .env.example .env
```

Edit the `.env` file to supply credentials if you have them:
```env
NVIDIA_API_KEY=nvapi-your-key-here
OPENROUTER_API_KEY=sk-or-your-key-here
FRONTEND_URL=http://localhost:3000
```

### 2. Configure the Frontend

```bash
# Navigate to frontend directory
cd ../frontend

# Install node dependencies
npm install
```

### 3. Spin Up Development Servers

Run the backend API service (Terminal 1):
```bash
cd backend
# Make sure your virtual environment is active!
uvicorn main:app --reload --port 8000
```

Run the Next.js dev server (Terminal 2):
```bash
cd frontend
npm run dev -- --port 3001
```

Access the UI at **[http://localhost:3001](http://localhost:3001)**. 

* **No Credentials?** Select **"Use Demo Mode"** in the initial setup prompt to experience the platform features using simulated streams.

---

## 🔑 Fetching NIM / API Credentials

### NVIDIA Nemotron NIMs
1. Register on the [NVIDIA Build Portal](https://build.nvidia.com).
2. Browse to any supported model (e.g. `llama-3.1-nemotron-70b-instruct`).
3. Click **Get API Key** and generate an token starting with `nvapi-`.

### OpenRouter (Alternative Gateway)
1. Join [OpenRouter.ai](https://openrouter.ai).
2. Go to keys settings and create a new key (`sk-or-`).
3. Deposit minimal balance for paid models, or use free tier models (e.g. `nvidia/nemotron-3-nano-30b-a3b`).

---

## 🚀 Deployment Instructions

### Frontend → Vercel Deployment

1. Initialize a Git repository and push your project to GitHub.
2. Link the repository to your [Vercel account](https://vercel.com).
3. Set the **Root Directory** field to `frontend`.
4. Configure the Production Environment Variables:
   * `NEXT_PUBLIC_API_URL`: `https://your-backend-api.onrender.com` (Your Render deployment URL)
5. Hit **Deploy**.

### Backend → Render Deployment

1. Register on [Render](https://render.com).
2. Connect your GitHub repository and select **New Web Service**.
3. Set the **Root Directory** to `backend`.
4. Fill configuration details:
   * **Runtime**: `Python`
   * **Build Command**: `pip install -r requirements.txt`
   * **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Click **Advanced** and fill the Environment Variables:
   * `NVIDIA_API_KEY`: `nvapi-xxx`
   * `OPENROUTER_API_KEY`: `sk-or-xxx`
   * `FRONTEND_URL`: `https://your-frontend-deployment.vercel.app`
6. Click **Deploy Web Service**.

---

## 🧠 Technological Blueprint

| Category | Tools & Libraries |
|---|---|
| **Core Layout** | Next.js 16 (App Router), TypeScript, Tailwind CSS |
| **Motion Physics** | Framer Motion (Transitions, orchestrations) |
| **Microservices** | FastAPI, Python 3.11, httpx client |
| **Integrations** | NVIDIA NIM API Gateway, OpenRouter Router |
| **UI Telemetry** | Recharts (Responsive Line, Bar and Pie configurations) |
| **Renderers** | react-markdown, react-syntax-highlighter (Prism themes) |
| **Local Cache** | Browser localStorage (JSON-serialized local state store) |

---

Built for the **NVIDIA Nemotron 3 Workshop 2026** 🟩

