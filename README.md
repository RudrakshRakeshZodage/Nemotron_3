# NemoCore AI – Agentic AI Platform powered by NVIDIA Nemotron 3

A production-grade AI SaaS platform built for the NVIDIA Nemotron 3 Workshop.

![NemoCore AI](https://img.shields.io/badge/Powered%20by-NVIDIA%20Nemotron%203-76b900?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Frontend-Next.js%2014-black?style=for-the-badge)
![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?style=for-the-badge)
![Supabase](https://img.shields.io/badge/Database-Supabase-3ECF8E?style=for-the-badge)

---

## 🚀 Features

| Feature | Description |
|---|---|
| 🏠 **Landing Page** | Premium hero, features, pricing, testimonials |
| 🔐 **Auth System** | Supabase email/password + demo bypass |
| 📊 **Dashboard** | Stats, quick actions, GPU metrics |
| 💬 **AI Chat** | Streaming, markdown, voice input, model selector |
| 🤖 **Agent Studio** | Agentic task decomposition with step timeline |
| 📂 **Projects** | Save, search, filter, download projects |
| 📝 **Blog Generator** | Topic → full SEO blog with tone/length control |
| 📄 **Paper Generator** | Academic papers with citations |
| 📊 **Analytics** | Recharts: queries, tokens, latency, model usage |
| ⚙️ **Settings** | Profile, API key, theme, notifications |

---

## 📁 Folder Structure

```
NemoCore_3/
├── frontend/                  # Next.js 14 App
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx       # Landing page
│   │   │   ├── (auth)/        # Login, Signup
│   │   │   └── (dashboard)/   # All dashboard pages
│   │   ├── components/        # Sidebar, MarkdownRenderer, DashboardShell
│   │   └── lib/               # API client, Supabase, utils
│   └── .env.local             # Frontend environment variables
│
├── backend/                   # FastAPI
│   ├── main.py                # All routes + NVIDIA Nemotron integration
│   ├── requirements.txt
│   └── .env                   # Backend environment variables
│
└── README.md
```

---

## ⚡ Quick Start

### 1. Clone & Install

```bash
# Frontend
cd frontend
npm install
cp .env.local.example .env.local   # fill in your keys

# Backend
cd backend
python -m venv venv
.\venv\Scripts\activate             # Windows
pip install -r requirements.txt
cp .env.example .env               # fill in your keys
```

### 2. Set Environment Variables

**Frontend** `frontend/.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_API_URL=http://localhost:8000
```

**Backend** `backend/.env`:
```env
NVIDIA_API_KEY=nvapi-xxxxxxxxxxxxxxxxxxxx
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key
```

> **Without API keys**: The app runs in **demo/mock mode** — all features work with simulated responses.

### 3. Start Servers

```bash
# Terminal 1 – Backend
cd backend
.\venv\Scripts\activate
uvicorn main:app --reload --port 8000

# Terminal 2 – Frontend
cd frontend
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🔑 Getting API Keys

### NVIDIA Nemotron 3
1. Go to [https://build.nvidia.com](https://build.nvidia.com)
2. Sign up / log in
3. Navigate to **API Keys** → Create key
4. Copy the `nvapi-...` key into `backend/.env`

### Supabase
1. Go to [https://supabase.com](https://supabase.com)
2. Create a new project
3. Settings → API → copy URL + anon key + service_role key

---

## 🗄️ Supabase Database Setup

Run these SQL commands in Supabase SQL Editor:

```sql
-- Users profiles
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  full_name TEXT,
  api_key TEXT,
  theme TEXT DEFAULT 'dark',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Chats
CREATE TABLE chats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  title TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Messages
CREATE TABLE messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  chat_id UUID REFERENCES chats,
  role TEXT CHECK (role IN ('user', 'assistant')),
  content TEXT,
  tokens INT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Projects
CREATE TABLE projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  title TEXT NOT NULL,
  description TEXT,
  content TEXT,
  type TEXT DEFAULT 'chat',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Analytics
CREATE TABLE analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  date DATE DEFAULT CURRENT_DATE,
  queries INT DEFAULT 0,
  tokens_used INT DEFAULT 0,
  avg_response_ms INT DEFAULT 0
);
```

---

## 🚀 Deployment

### Frontend → Vercel
```bash
cd frontend
npx vercel --prod
```

### Backend → Render / Railway
1. Push `backend/` to GitHub
2. Create Render Web Service → set env vars → deploy

### Environment on Vercel
Add all `NEXT_PUBLIC_*` variables in Vercel Dashboard → Settings → Environment Variables

---

## 🧠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14, TypeScript, Tailwind CSS, Framer Motion |
| Backend | FastAPI, Python, httpx (async) |
| AI | NVIDIA Nemotron 3 via build.nvidia.com |
| Auth | Supabase Auth |
| Database | Supabase (PostgreSQL) |
| Charts | Recharts |
| Markdown | react-markdown + react-syntax-highlighter |
| Icons | Lucide React |

---

## 📸 Pages

- `/` — Landing page
- `/login` — Sign in
- `/signup` — Register  
- `/dashboard` — Home with stats
- `/dashboard/chat` — AI Chat (streaming)
- `/dashboard/agent` — Agent Studio
- `/dashboard/projects` — Project manager
- `/dashboard/blog` — Blog generator
- `/dashboard/paper` — Research paper generator
- `/dashboard/analytics` — Usage charts
- `/dashboard/settings` — Account settings

---

Built for the **NVIDIA Nemotron 3 Workshop 2026** 🟩
