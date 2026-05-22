'use client'

import React from 'react'

interface CustomFigureProps {
  type: string
  caption?: string
}

export default function CustomFigure({ type, caption }: CustomFigureProps) {
  return (
    <div style={{
      margin: '24px 0',
      padding: '16px',
      background: 'rgba(15, 23, 42, 0.6)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      borderRadius: '12px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
      backdropFilter: 'blur(8px)',
      color: '#fff'
    }}>
      <div style={{ width: '100%', maxWidth: '640px', display: 'flex', justifyContent: 'center' }}>
        {renderFigure(type)}
      </div>
      {caption && (
        <div style={{
          marginTop: '12px',
          fontSize: '0.78rem',
          color: 'var(--text-muted, #94a3b8)',
          textAlign: 'center',
          fontStyle: 'italic',
          fontFamily: 'system-ui, sans-serif'
        }}>
          {caption}
        </div>
      )}
    </div>
  )
}

function renderFigure(type: string) {
  switch (type) {
    case 'architecture':
      return <ArchitectureDiagram />
    case 'chart':
      return <PerformanceChart />
    case 'blog-banner':
      return <BlogBanner />
    case 'blog-chart':
      return <BlogChart />
    default:
      return (
        <div style={{ padding: '20px', color: '#f87171', fontSize: '0.9rem' }}>
          Unknown figure type: {type}
        </div>
      )
  }
}

function ArchitectureDiagram() {
  return (
    <svg viewBox="0 0 600 360" width="100%" height="auto" style={{ background: '#090d16', borderRadius: '8px' }}>
      <defs>
        <linearGradient id="nemo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#76b900" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
        <linearGradient id="attn-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#1d4ed8" />
        </linearGradient>
        <linearGradient id="mamba-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ec4899" />
          <stop offset="100%" stopColor="#be185d" />
        </linearGradient>
        <linearGradient id="glow-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#76b900" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#76b900" stopOpacity="0" />
        </linearGradient>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Grid Background */}
      <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
      </pattern>
      <rect width="100%" height="100%" fill="url(#grid)" />

      {/* Connection lines */}
      <path d="M 300 45 L 300 70" stroke="rgba(255,255,255,0.2)" strokeWidth="2" fill="none" />
      <path d="M 300 70 L 160 70 L 160 100" stroke="rgba(255,255,255,0.2)" strokeWidth="2" fill="none" />
      <path d="M 300 70 L 440 70 L 440 100" stroke="rgba(255,255,255,0.2)" strokeWidth="2" fill="none" />
      
      <path d="M 160 140 L 160 170 L 300 170" stroke="rgba(255,255,255,0.2)" strokeWidth="2" fill="none" />
      <path d="M 440 140 L 440 170 L 300 170" stroke="rgba(255,255,255,0.2)" strokeWidth="2" fill="none" />
      <path d="M 300 170 L 300 195" stroke="rgba(255,255,255,0.2)" strokeWidth="2" fill="none" />
      
      <path d="M 300 235 L 300 260" stroke="rgba(255,255,255,0.2)" strokeWidth="2" fill="none" />
      <path d="M 300 300 L 300 325" stroke="#76b900" strokeWidth="2" fill="none" filter="url(#glow)" />

      {/* Input Stage */}
      <rect x="200" y="15" width="200" height="30" rx="6" fill="#1e293b" stroke="rgba(255,255,255,0.15)" />
      <text x="300" y="34" fill="#f8fafc" fontSize="11" fontWeight="600" textAnchor="middle" fontFamily="system-ui">Input Token Sequence</text>

      {/* Parallel Layer 1: Transformer Attention */}
      <rect x="60" y="100" width="200" height="40" rx="8" fill="url(#attn-grad)" stroke="#2563eb" strokeWidth="1.5" />
      <text x="160" y="120" fill="#ffffff" fontSize="12" fontWeight="700" textAnchor="middle" fontFamily="system-ui">Transformer Attention</text>
      <text x="160" y="133" fill="rgba(255,255,255,0.7)" fontSize="9" textAnchor="middle" fontFamily="system-ui">Global Context Encoding</text>

      {/* Parallel Layer 2: Mamba SSM */}
      <rect x="340" y="100" width="200" height="40" rx="8" fill="url(#mamba-grad)" stroke="#db2777" strokeWidth="1.5" />
      <text x="440" y="120" fill="#ffffff" fontSize="12" fontWeight="700" textAnchor="middle" fontFamily="system-ui">Mamba SSM</text>
      <text x="440" y="133" fill="rgba(255,255,255,0.7)" fontSize="9" textAnchor="middle" fontFamily="system-ui">Linear-Time Sequence Modeling</text>

      {/* MoE Gating / Router */}
      <rect x="180" y="195" width="240" height="40" rx="8" fill="#1e293b" stroke="#76b900" strokeWidth="2" filter="url(#glow)" />
      <text x="300" y="214" fill="#76b900" fontSize="12" fontWeight="800" textAnchor="middle" fontFamily="system-ui">Latent Mixture-of-Experts Router</text>
      <text x="300" y="228" fill="#94a3b8" fontSize="9" textAnchor="middle" fontFamily="system-ui">Dynamic Token Gating & Routing</text>

      {/* Experts Container */}
      <g transform="translate(100, 260)">
        {/* Expert 1 (Inactive) */}
        <rect x="0" y="0" width="90" height="40" rx="6" fill="#0f172a" stroke="rgba(255,255,255,0.1)" />
        <text x="45" y="20" fill="rgba(255,255,255,0.4)" fontSize="10" fontWeight="600" textAnchor="middle" fontFamily="system-ui">Expert 1</text>
        <text x="45" y="32" fill="rgba(255,255,255,0.2)" fontSize="8" textAnchor="middle" fontFamily="system-ui">Inactive</text>

        {/* Expert 2 (Active) */}
        <rect x="155" y="0" width="90" height="40" rx="6" fill="rgba(118, 185, 0, 0.15)" stroke="#76b900" strokeWidth="2" />
        <text x="200" y="20" fill="#76b900" fontSize="10" fontWeight="800" textAnchor="middle" fontFamily="system-ui">Expert 2</text>
        <text x="200" y="32" fill="#a3e635" fontSize="8" fontWeight="600" textAnchor="middle" fontFamily="system-ui">Active (NIM)</text>

        {/* Expert 3 (Inactive) */}
        <rect x="310" y="0" width="90" height="40" rx="6" fill="#0f172a" stroke="rgba(255,255,255,0.1)" />
        <text x="355" y="20" fill="rgba(255,255,255,0.4)" fontSize="10" fontWeight="600" textAnchor="middle" fontFamily="system-ui">Expert 3</text>
        <text x="355" y="32" fill="rgba(255,255,255,0.2)" fontSize="8" textAnchor="middle" fontFamily="system-ui">Inactive</text>
      </g>

      {/* Output Predictor */}
      <circle cx="300" cy="335" r="10" fill="#76b900" filter="url(#glow)" />
      <text x="320" y="339" fill="#76b900" fontSize="11" fontWeight="700" fontFamily="system-ui">Output Prediction Stream</text>
    </svg>
  )
}

function PerformanceChart() {
  return (
    <svg viewBox="0 0 600 320" width="100%" height="auto" style={{ background: '#090d16', borderRadius: '8px' }}>
      <defs>
        <linearGradient id="bar-grad-1" x1="0" y1="100%" x2="0" y2="0%">
          <stop offset="0%" stopColor="#475569" />
          <stop offset="100%" stopColor="#64748b" />
        </linearGradient>
        <linearGradient id="bar-grad-2" x1="0" y1="100%" x2="0" y2="0%">
          <stop offset="0%" stopColor="#2563eb" />
          <stop offset="100%" stopColor="#60a5fa" />
        </linearGradient>
        <linearGradient id="bar-grad-nemo" x1="0" y1="100%" x2="0" y2="0%">
          <stop offset="0%" stopColor="#4d7c0f" />
          <stop offset="80%" stopColor="#76b900" />
          <stop offset="100%" stopColor="#a3e635" />
        </linearGradient>
        <filter id="shadow">
          <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#76b900" floodOpacity="0.3" />
        </filter>
      </defs>

      {/* Gridlines */}
      <line x1="80" y1="50" x2="540" y2="50" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
      <line x1="80" y1="110" x2="540" y2="110" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
      <line x1="80" y1="170" x2="540" y2="170" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
      <line x1="80" y1="230" x2="540" y2="230" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
      
      {/* Base Line */}
      <line x1="80" y1="260" x2="540" y2="260" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />

      {/* Left Axis Labels */}
      <text x="65" y="54" fill="#64748b" fontSize="10" textAnchor="end" fontFamily="system-ui">250</text>
      <text x="65" y="114" fill="#64748b" fontSize="10" textAnchor="end" fontFamily="system-ui">180</text>
      <text x="65" y="174" fill="#64748b" fontSize="10" textAnchor="end" fontFamily="system-ui">100</text>
      <text x="65" y="234" fill="#64748b" fontSize="10" textAnchor="end" fontFamily="system-ui">40</text>
      <text x="65" y="264" fill="#64748b" fontSize="10" textAnchor="end" fontFamily="system-ui">0 (tok/s)</text>

      {/* GPT-4 Turbo Bar */}
      <rect x="130" y="222" width="60" height="38" rx="4" fill="url(#bar-grad-1)" />
      <text x="160" y="210" fill="#94a3b8" fontSize="11" fontWeight="700" textAnchor="middle" fontFamily="system-ui">45</text>
      <text x="160" y="280" fill="#64748b" fontSize="11" fontWeight="600" textAnchor="middle" fontFamily="system-ui">GPT-4 Turbo</text>

      {/* Llama 3.1 70B Bar */}
      <rect x="270" y="194" width="60" height="66" rx="4" fill="url(#bar-grad-2)" />
      <text x="300" y="182" fill="#60a5fa" fontSize="11" fontWeight="700" textAnchor="middle" fontFamily="system-ui">78</text>
      <text x="300" y="280" fill="#64748b" fontSize="11" fontWeight="600" textAnchor="middle" fontFamily="system-ui">Llama 3.1 70B</text>

      {/* Nemotron-3 (Ours) Bar */}
      <rect x="410" y="80" width="60" height="180" rx="4" fill="url(#bar-grad-nemo)" filter="url(#shadow)" />
      <text x="440" y="65" fill="#a3e635" fontSize="13" fontWeight="900" textAnchor="middle" fontFamily="system-ui">210 (5x 🔥)</text>
      <text x="440" y="280" fill="#76b900" fontSize="11" fontWeight="700" textAnchor="middle" fontFamily="system-ui">Nemotron 3</text>
    </svg>
  )
}

function BlogBanner() {
  return (
    <svg viewBox="0 0 600 240" width="100%" height="auto" style={{ background: 'linear-gradient(135deg, #090e1a, #030712)', borderRadius: '12px', border: '1px solid rgba(118,185,0,0.15)' }}>
      <defs>
        <radialGradient id="banner-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#76b900" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#76b900" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="100%" height="100%" fill="url(#banner-glow)" />

      {/* Geometric grid mesh */}
      <path d="M -10 60 L 610 60 M -10 120 L 610 120 M -10 180 L 610 180" stroke="rgba(255,255,255,0.02)" strokeWidth="1" />
      <path d="M 150 -10 L 150 250 M 300 -10 L 300 250 M 450 -10 L 450 250" stroke="rgba(255,255,255,0.02)" strokeWidth="1" />

      {/* Graphics */}
      <circle cx="500" cy="120" r="60" fill="none" stroke="rgba(118,185,0,0.2)" strokeWidth="2" />
      <circle cx="500" cy="120" r="40" fill="none" stroke="rgba(59,130,246,0.2)" strokeWidth="1.5" />
      <path d="M 500 80 L 500 160 M 460 120 L 540 120" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />

      <g transform="translate(50, 80)">
        <rect x="0" y="0" width="140" height="24" rx="12" fill="rgba(118, 185, 0, 0.12)" stroke="#76b900" strokeWidth="1" />
        <text x="12" y="16" fill="#76b900" fontSize="9" fontWeight="800" letterSpacing="0.08em" fontFamily="system-ui">NEMOCORE AI ENGINE</text>
        
        <text x="0" y="60" fill="#ffffff" fontSize="24" fontWeight="800" letterSpacing="-0.03em" fontFamily="system-ui">The Future of AI Automation</text>
        <text x="0" y="85" fill="#94a3b8" fontSize="12" fontFamily="system-ui">Harnessing NVIDIA Nemotron 3 Nimble Architecture</text>
      </g>
    </svg>
  )
}

function BlogChart() {
  return (
    <svg viewBox="0 0 600 260" width="100%" height="auto" style={{ background: '#090d16', borderRadius: '8px' }}>
      <defs>
        <linearGradient id="area-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#76b900" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#76b900" stopOpacity="0" />
        </linearGradient>
        <filter id="blur-glow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Grid lines */}
      <line x1="60" y1="50" x2="540" y2="50" stroke="rgba(255,255,255,0.04)" />
      <line x1="60" y1="100" x2="540" y2="100" stroke="rgba(255,255,255,0.04)" />
      <line x1="60" y1="150" x2="540" y2="150" stroke="rgba(255,255,255,0.04)" />
      <line x1="60" y1="200" x2="540" y2="200" stroke="rgba(255,255,255,0.04)" />

      {/* X and Y Axes */}
      <line x1="60" y1="210" x2="540" y2="210" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />

      {/* Labels */}
      <text x="50" y="214" fill="#64748b" fontSize="9" textAnchor="end" fontFamily="system-ui">0%</text>
      <text x="50" y="154" fill="#64748b" fontSize="9" textAnchor="end" fontFamily="system-ui">30%</text>
      <text x="50" y="104" fill="#64748b" fontSize="9" textAnchor="end" fontFamily="system-ui">60%</text>
      <text x="50" y="54" fill="#64748b" fontSize="9" textAnchor="end" fontFamily="system-ui">100%</text>

      {/* Line area */}
      <path d="M 60 190 Q 180 150 300 100 T 540 60 L 540 210 L 60 210 Z" fill="url(#area-grad)" />

      {/* Growth Trend Line */}
      <path d="M 60 190 Q 180 150 300 100 T 540 60" fill="none" stroke="#76b900" strokeWidth="3.5" filter="url(#blur-glow)" />

      {/* Data points */}
      <circle cx="60" cy="190" r="5" fill="#1e293b" stroke="#76b900" strokeWidth="2.5" />
      <circle cx="180" cy="162" r="5" fill="#1e293b" stroke="#76b900" strokeWidth="2.5" />
      <circle cx="300" cy="100" r="5" fill="#1e293b" stroke="#76b900" strokeWidth="2.5" />
      <circle cx="540" cy="60" r="6" fill="#76b900" filter="url(#blur-glow)" />

      {/* Text Annotations */}
      <text x="60" y="232" fill="#64748b" fontSize="10" textAnchor="middle" fontFamily="system-ui">2023</text>
      <text x="180" y="232" fill="#64748b" fontSize="10" textAnchor="middle" fontFamily="system-ui">2024</text>
      <text x="300" y="232" fill="#64748b" fontSize="10" textAnchor="middle" fontFamily="system-ui">2025</text>
      <text x="540" y="232" fill="#76b900" fontSize="10" fontWeight="700" textAnchor="middle" fontFamily="system-ui">2026 (Now)</text>

      <text x="540" y="44" fill="#76b900" fontSize="11" fontWeight="800" textAnchor="middle" fontFamily="system-ui">95% Growth</text>
    </svg>
  )
}
