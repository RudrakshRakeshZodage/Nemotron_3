'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  Zap, Bot, Code, Cpu, Globe, BookOpen, ArrowRight,
  ChevronRight, GitBranch, Share2, Star, Check, Users,
  Layers, BarChart2, Shield, Rocket, Sparkles, Terminal
} from 'lucide-react'
import ThemeToggle from '@/components/ThemeToggle'

// ── Navbar ──────────────────────────────────────────────────────────────────
function Navbar() {
  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: 'rgba(3,7,18,0.8)', backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      padding: '0 40px', height: 64,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between'
    }}>
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
        <div style={{
          width: 34, height: 34, borderRadius: 9,
          background: 'linear-gradient(135deg, #76b900, #a3e635)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 14px rgba(118,185,0,0.45)'
        }}>
          <Zap size={17} color="#000" strokeWidth={2.5} />
        </div>
        <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#f8fafc', letterSpacing: '-0.03em' }}>
          Nemo<span style={{ color: '#76b900' }}>Core</span> AI
        </span>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        {['Features', 'How It Works', 'Use Cases', 'Pricing'].map(item => (
          <a key={item} href={`#${item.toLowerCase().replace(/ /g, '-')}`} className="btn-ghost" style={{ fontSize: '0.85rem' }}>{item}</a>
        ))}
        <ThemeToggle />
        <Link href="/login" className="btn-ghost" style={{ fontSize: '0.85rem' }}>Log in</Link>
        <Link href="/signup" className="btn-primary" style={{ padding: '9px 20px', fontSize: '0.85rem' }}>
          Get Started <ArrowRight size={14} />
        </Link>
      </div>
    </nav>
  )
}

// ── Hero ─────────────────────────────────────────────────────────────────────
function HeroSection() {
  return (
    <section style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      position: 'relative', overflow: 'hidden', paddingTop: 64,
      background: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(118,185,0,0.15) 0%, transparent 60%), var(--bg-primary)'
    }}>
      {/* Grid lines */}
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.025,
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)',
        backgroundSize: '60px 60px'
      }} />

      {/* Glow orbs */}
      <div style={{ position: 'absolute', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(118,185,0,0.08) 0%, transparent 70%)', top: '10%', left: '-10%', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,212,255,0.06) 0%, transparent 70%)', bottom: '10%', right: '5%', pointerEvents: 'none' }} />

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px', textAlign: 'center', position: 'relative', zIndex: 1 }}>
        {/* Badge */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <span className="badge" style={{ marginBottom: 28, display: 'inline-flex' }}>
            <Zap size={10} /> Powered by NVIDIA Nemotron 3
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
          style={{ fontSize: 'clamp(2.8rem, 7vw, 5.5rem)', fontWeight: 900, lineHeight: 1.05, letterSpacing: '-0.04em', marginBottom: 24 }}
        >
          Build Smarter AI Agents with{' '}
          <span className="gradient-text">NVIDIA Nemotron 3</span>
        </motion.h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
          style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', maxWidth: 640, margin: '0 auto 40px', lineHeight: 1.7 }}
        >
          NemoCore AI delivers GPU-accelerated agentic AI workflows with multi-token prediction, Latent MoE, and 5x throughput — all in one unified platform.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.35 }}
          style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}
        >
          <Link href="/signup" className="btn-primary" style={{ fontSize: '1rem', padding: '14px 32px' }}>
            Get Started Free <ArrowRight size={16} />
          </Link>
          <Link href="/dashboard/chat" className="btn-secondary" style={{ fontSize: '1rem', padding: '14px 32px' }}>
            Try Demo <Zap size={16} />
          </Link>
        </motion.div>

        {/* Social proof */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
          style={{ display: 'flex', alignItems: 'center', gap: 20, justifyContent: 'center', marginTop: 48, flexWrap: 'wrap' }}
        >
          {[
            { label: '10K+ Users', icon: Users },
            { label: '50M Tokens/day', icon: Zap },
            { label: '5x GPU Throughput', icon: Cpu },
          ].map(({ label, icon: Icon }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              <Icon size={14} color="var(--nemo-green)" />
              {label}
            </div>
          ))}
        </motion.div>

        {/* Hero terminal */}
        <motion.div
          initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.5 }}
          style={{ marginTop: 64, borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 40px 100px rgba(0,0,0,0.6), 0 0 0 1px rgba(118,185,0,0.1)' }}
        >
          <div style={{ background: '#1a1a2e', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 8, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            {['#ff5f57', '#febc2e', '#28c840'].map(c => <div key={c} style={{ width: 12, height: 12, borderRadius: '50%', background: c }} />)}
            <span style={{ marginLeft: 8, fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace' }}>nemocore-ai — bash</span>
          </div>
          <div style={{ background: '#0d1117', padding: 24, textAlign: 'left', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.82rem', lineHeight: 1.8, minHeight: 200 }}>
            <div><span style={{ color: '#76b900' }}>$</span> <span style={{ color: '#7dd3fc' }}>nemocore</span> <span style={{ color: '#f8fafc' }}>chat</span> <span style={{ color: '#fbbf24' }}>&quot;Build a web scraper with Python&quot;</span></div>
            <div style={{ color: '#94a3b8', marginTop: 8 }}>🧠 <span style={{ color: '#76b900' }}>Nemotron 3</span> analyzing task...</div>
            <div style={{ color: '#94a3b8' }}>📋 Step 1: Research → Planning scraping strategy</div>
            <div style={{ color: '#94a3b8' }}>💻 Step 2: Code → Writing BeautifulSoup4 scraper</div>
            <div style={{ color: '#94a3b8' }}>⚡ Step 3: Optimize → Adding async + rate limiting</div>
            <div style={{ color: '#94a3b8' }}>✅ Step 4: Done → Production-ready scraper generated</div>
            <div style={{ marginTop: 8 }}><span style={{ color: '#a3e635' }}>✓</span> <span style={{ color: '#f8fafc' }}>Completed in</span> <span style={{ color: '#76b900' }}>2.1s</span> <span style={{ color: '#f8fafc' }}>· Tokens: </span><span style={{ color: '#76b900' }}>1,847</span></div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// ── Features ─────────────────────────────────────────────────────────────────
const features = [
  { icon: Bot, title: 'Agentic AI Workflows', desc: 'Decompose complex tasks into structured steps. Nemotron plans, codes, and optimizes autonomously.', color: '#76b900' },
  { icon: Sparkles, title: 'Multi-Token Prediction', desc: 'Predict multiple tokens simultaneously for 5x faster inference without sacrificing accuracy.', color: '#00d4ff' },
  { icon: Cpu, title: 'GPU-Accelerated Inference', desc: 'Built on NVIDIA hardware with Tensor Core optimization for enterprise-grade throughput.', color: '#7c3aed' },
  { icon: Code, title: 'Code Generation', desc: 'Generate production-ready code in 50+ languages with automated testing and documentation.', color: '#ec4899' },
  { icon: BookOpen, title: 'Research & Writing', desc: 'Create academic papers, technical reports, and comprehensive blogs with proper citations.', color: '#f59e0b' },
  { icon: Layers, title: 'Latent MoE Architecture', desc: 'Hybrid Transformer + Mamba with Mixture-of-Experts routing for optimal parameter efficiency.', color: '#10b981' },
]

function FeaturesSection() {
  return (
    <section id="features" style={{ padding: '120px 24px', background: 'var(--bg-secondary)' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <span className="badge" style={{ marginBottom: 16, display: 'inline-flex' }}>Features</span>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 16 }}>
            Everything you need to build <span className="gradient-green">production AI</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: 560, margin: '0 auto' }}>
            From agentic workflows to GPU-accelerated inference — NemoCore AI has every tool in one platform.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
          {features.map((f, i) => {
            const Icon = f.icon
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="glass-card"
                style={{ padding: 28, cursor: 'default', transition: 'all 0.2s' }}
                whileHover={{ y: -4, boxShadow: `0 20px 60px ${f.color}15` }}
              >
                <div style={{
                  width: 48, height: 48, borderRadius: 12, marginBottom: 18,
                  background: `${f.color}15`, border: `1px solid ${f.color}30`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <Icon size={22} color={f.color} />
                </div>
                <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: 10, color: 'var(--text-primary)' }}>{f.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.7 }}>{f.desc}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// ── How It Works ──────────────────────────────────────────────────────────────
const steps = [
  { step: '01', title: 'Enter Your Prompt', desc: 'Describe your task in natural language. NemoCore understands complex, multi-part requests.', icon: Terminal },
  { step: '02', title: 'Nemotron Processes', desc: 'MoE routing, multi-token prediction, and reasoning chains work in parallel to plan your solution.', icon: Sparkles },
  { step: '03', title: 'Get Structured Output', desc: 'Receive step-by-step results with code, explanations, citations, and ready-to-deploy artifacts.', icon: Rocket },
]

function HowItWorksSection() {
  return (
    <section id="how-it-works" style={{ padding: '120px 24px' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <span className="badge" style={{ marginBottom: 16, display: 'inline-flex' }}>How It Works</span>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, letterSpacing: '-0.03em' }}>
            From prompt to <span className="gradient-text">production in seconds</span>
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 32, position: 'relative' }}>
          {steps.map((s, i) => {
            const Icon = s.icon
            return (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                style={{ textAlign: 'center', padding: '32px 24px' }}
              >
                <div style={{ position: 'relative', display: 'inline-block', marginBottom: 24 }}>
                  <div style={{
                    width: 72, height: 72, borderRadius: '50%',
                    background: 'linear-gradient(135deg, rgba(118,185,0,0.15), rgba(0,212,255,0.1))',
                    border: '2px solid rgba(118,185,0,0.3)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 0 30px rgba(118,185,0,0.1)'
                  }}>
                    <Icon size={28} color="var(--nemo-green)" />
                  </div>
                  <div style={{
                    position: 'absolute', top: -8, right: -8,
                    width: 26, height: 26, borderRadius: '50%',
                    background: 'var(--nemo-green)', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.65rem', fontWeight: 800, color: '#000'
                  }}>{i + 1}</div>
                </div>
                <h3 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: 10 }}>{s.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.7 }}>{s.desc}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// ── Use Cases ─────────────────────────────────────────────────────────────────
const useCases = [
  { title: 'Developers', desc: 'Generate production code, review PRs, debug errors, and write documentation in any language.', tags: ['Code Gen', 'Debug', 'Docs'], icon: Code, gradient: 'linear-gradient(135deg, #76b900, #a3e635)' },
  { title: 'Students', desc: 'Research papers, citations, summaries, and concept explanations across every academic domain.', tags: ['Papers', 'Research', 'Citations'], icon: BookOpen, gradient: 'linear-gradient(135deg, #00d4ff, #7c3aed)' },
  { title: 'Startups', desc: 'Build AI agents for customer support, data analysis, and automated business intelligence workflows.', tags: ['Agents', 'Automation', 'BI'], icon: Rocket, gradient: 'linear-gradient(135deg, #7c3aed, #ec4899)' },
  { title: 'Content Creators', desc: 'Generate SEO-optimized blogs, social posts, scripts, and multi-format content at scale.', tags: ['Blogs', 'Scripts', 'SEO'], icon: Globe, gradient: 'linear-gradient(135deg, #ec4899, #f59e0b)' },
]

function UseCasesSection() {
  return (
    <section id="use-cases" style={{ padding: '120px 24px', background: 'var(--bg-secondary)' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <span className="badge" style={{ marginBottom: 16, display: 'inline-flex' }}>Use Cases</span>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, letterSpacing: '-0.03em' }}>
            Built for <span className="gradient-text">every creator</span>
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
          {useCases.map((uc, i) => {
            const Icon = uc.icon
            return (
              <motion.div
                key={uc.title}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="glass-card" style={{ padding: 28, overflow: 'hidden', position: 'relative' }}
                whileHover={{ y: -4 }}
              >
                <div style={{ width: 4, height: 40, background: uc.gradient, borderRadius: 2, marginBottom: 20 }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                  <Icon size={20} color="var(--text-primary)" />
                  <h3 style={{ fontWeight: 700, fontSize: '1rem' }}>{uc.title}</h3>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.7, marginBottom: 16 }}>{uc.desc}</p>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {uc.tags.map(tag => (
                    <span key={tag} style={{
                      padding: '3px 10px', fontSize: '0.7rem', fontWeight: 600,
                      background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)',
                      borderRadius: 100, color: 'var(--text-secondary)'
                    }}>{tag}</span>
                  ))}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// ── Nemotron Explainer ────────────────────────────────────────────────────────
function NemotronSection() {
  return (
    <section style={{ padding: '120px 24px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <span className="badge" style={{ marginBottom: 20, display: 'inline-flex' }}>Architecture</span>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 20 }}>
              Why <span className="gradient-green">Nemotron 3</span> is different
            </h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 32 }}>
              NVIDIA Nemotron 3 introduces a revolutionary hybrid architecture combining the global attention of Transformers with the efficiency of Mamba state-space models, topped with Latent Mixture-of-Experts routing.
            </p>
            {[
              { label: 'Transformer + Mamba Hybrid', desc: 'Global context via attention + linear-time local modeling via SSMs' },
              { label: 'Latent MoE Routing', desc: 'Dynamic expert assignment reduces active params by 60% at inference' },
              { label: '5x Throughput', desc: 'Multi-token prediction generates 5 tokens per forward pass vs 1' },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', gap: 14, marginBottom: 18 }}>
                <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'rgba(118,185,0,0.15)', border: '1px solid rgba(118,185,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                  <Check size={12} color="var(--nemo-green)" strokeWidth={3} />
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: 3 }}>{item.label}</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <div className="glass-card neon-border" style={{ padding: 32 }}>
              <h4 style={{ fontWeight: 700, marginBottom: 24, color: 'var(--nemo-green)', fontSize: '0.85rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Architecture Layers</h4>
              {[
                { label: 'Input Tokens', sub: 'Tokenized + embedded', color: '#475569', width: '100%' },
                { label: 'Transformer Attention', sub: 'Global context modeling', color: '#7c3aed', width: '90%' },
                { label: 'Mamba SSM Layers', sub: 'Linear-time local modeling', color: '#00d4ff', width: '80%' },
                { label: 'Latent MoE Router', sub: '60% param reduction at inference', color: '#f59e0b', width: '70%' },
                { label: 'Multi-Token Prediction', sub: '5x throughput vs standard', color: '#76b900', width: '100%' },
                { label: 'Structured Output', sub: 'JSON / Markdown / Code', color: '#ec4899', width: '85%' },
              ].map((layer, i) => (
                <motion.div
                  key={layer.label}
                  initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                  style={{ marginBottom: 14 }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)' }}>{layer.label}</span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{layer.sub}</span>
                  </div>
                  <div style={{ height: 6, background: 'rgba(255,255,255,0.05)', borderRadius: 3 }}>
                    <motion.div
                      initial={{ width: 0 }} whileInView={{ width: layer.width }}
                      viewport={{ once: true }} transition={{ duration: 0.8, delay: i * 0.1 }}
                      style={{ height: '100%', background: layer.color, borderRadius: 3, boxShadow: `0 0 8px ${layer.color}60` }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// ── Testimonials ──────────────────────────────────────────────────────────────
const testimonials = [
  { name: 'Priya Sharma', role: 'ML Engineer @ NVIDIA', text: 'NemoCore AI cut our inference time by 5x. The agentic workflows are genuinely impressive — it plans and executes like a senior engineer.', avatar: 'PS' },
  { name: 'Alex Chen', role: 'Startup Founder', text: 'We built our entire AI pipeline on NemoCore in a weekend. The blog generator alone is worth it — our content team is 10x faster.', avatar: 'AC' },
  { name: 'Dr. Ananya Patel', role: 'Research Scientist', text: 'The paper generator with citation formatting is unbelievably accurate. Saves me hours per publication draft.', avatar: 'AP' },
]

function TestimonialsSection() {
  return (
    <section style={{ padding: '120px 24px', background: 'var(--bg-secondary)' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <span className="badge" style={{ marginBottom: 16, display: 'inline-flex' }}>Testimonials</span>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, letterSpacing: '-0.03em' }}>
            Loved by <span className="gradient-text">AI builders</span>
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
          {testimonials.map((t, i) => (
            <motion.div key={t.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="glass-card" style={{ padding: 28 }}>
              <div style={{ display: 'flex', gap: 2, marginBottom: 16 }}>
                {[...Array(5)].map((_, j) => <Star key={j} size={14} fill="var(--nemo-green)" color="var(--nemo-green)" />)}
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.7, marginBottom: 20 }}>&quot;{t.text}&quot;</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #76b900, #00d4ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, color: '#000' }}>{t.avatar}</div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{t.name}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Pricing ───────────────────────────────────────────────────────────────────
const plans = [
  { name: 'Free', price: '$0', period: '/month', features: ['100K tokens/month', '5 projects', 'AI Chat', 'Basic Analytics'], cta: 'Get Started', highlight: false },
  { name: 'Pro', price: '$29', period: '/month', features: ['10M tokens/month', 'Unlimited projects', 'Agent Studio', 'Blog & Paper Generator', 'Priority GPU access', 'Advanced Analytics'], cta: 'Start Free Trial', highlight: true },
  { name: 'Enterprise', price: 'Custom', period: '', features: ['Unlimited tokens', 'Dedicated GPU cluster', 'Custom models', 'SSO + SAML', 'SLA guarantee', 'White-label'], cta: 'Contact Sales', highlight: false },
]

function PricingSection() {
  return (
    <section id="pricing" style={{ padding: '120px 24px' }}>
      <div style={{ maxWidth: 1050, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <span className="badge" style={{ marginBottom: 16, display: 'inline-flex' }}>Pricing</span>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, letterSpacing: '-0.03em' }}>
            Simple, <span className="gradient-green">transparent pricing</span>
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, alignItems: 'start' }}>
          {plans.map((plan, i) => (
            <motion.div key={plan.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className={plan.highlight ? 'glass-card neon-border' : 'glass-card'}
              style={{ padding: 32, position: 'relative', transform: plan.highlight ? 'scale(1.03)' : 'none' }}
            >
              {plan.highlight && <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg, #76b900, #a3e635)', color: '#000', fontSize: '0.72rem', fontWeight: 800, padding: '4px 16px', borderRadius: 100, whiteSpace: 'nowrap', letterSpacing: '0.05em' }}>MOST POPULAR</div>}
              <div style={{ marginBottom: 24 }}>
                <h3 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: 8 }}>{plan.name}</h3>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                  <span style={{ fontSize: '2.4rem', fontWeight: 900, color: plan.highlight ? 'var(--nemo-green)' : 'var(--text-primary)' }}>{plan.price}</span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{plan.period}</span>
                </div>
              </div>
              <div style={{ marginBottom: 28 }}>
                {plan.features.map(f => (
                  <div key={f} style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 10 }}>
                    <Check size={14} color="var(--nemo-green)" strokeWidth={3} />
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{f}</span>
                  </div>
                ))}
              </div>
              <Link href="/signup" className={plan.highlight ? 'btn-primary' : 'btn-secondary'} style={{ width: '100%', justifyContent: 'center', boxSizing: 'border-box' }}>
                {plan.cta}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Footer ────────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{ borderTop: '1px solid var(--border-color)', padding: '60px 40px 40px', background: 'var(--bg-secondary)' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 40, marginBottom: 48 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, #76b900, #a3e635)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Zap size={15} color="#000" strokeWidth={2.5} />
              </div>
              <span style={{ fontWeight: 800, fontSize: '1rem' }}>Nemo<span style={{ color: '#76b900' }}>Core</span> AI</span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.7, maxWidth: 280, marginBottom: 20 }}>
              Agentic AI Platform powered by NVIDIA Nemotron 3. Built for the NVIDIA AI Workshop 2026.
            </p>
            <div style={{ display: 'flex', gap: 12 }}>
              <a href="https://github.com" target="_blank" className="btn-ghost" style={{ padding: 8, border: '1px solid var(--border-color)', borderRadius: 8 }}><GitBranch size={16} /></a>
              <a href="https://twitter.com" target="_blank" className="btn-ghost" style={{ padding: 8, border: '1px solid var(--border-color)', borderRadius: 8 }}><Share2 size={16} /></a>
            </div>
          </div>
          {[
            { title: 'Product', links: ['Features', 'Agent Studio', 'Blog Generator', 'Pricing', 'Changelog'] },
            { title: 'Resources', links: ['Documentation', 'API Reference', 'NVIDIA Workshop', 'GitHub', 'Blog'] },
            { title: 'Company', links: ['About', 'Contact', 'Privacy Policy', 'Terms of Service'] },
          ].map(col => (
            <div key={col.title}>
              <h4 style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: 16, color: 'var(--text-primary)' }}>{col.title}</h4>
              {col.links.map(link => (
                <a key={link} href="#" style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: 10, textDecoration: 'none', transition: 'color 0.15s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--nemo-green)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
                >{link}</a>
              ))}
            </div>
          ))}
        </div>
        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>© 2026 NemoCore AI. Built for NVIDIA Nemotron 3 Workshop.</span>
          <span className="badge" style={{ fontSize: '0.7rem' }}>⚡ NVIDIA Nemotron 3 Powered</span>
        </div>
      </div>
    </footer>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <UseCasesSection />
      <NemotronSection />
      <TestimonialsSection />
      <PricingSection />
      <Footer />
    </>
  )
}
