'use client'

import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { copyToClipboard } from '@/lib/utils'
import CustomFigure from './CustomFigure'

export default function MarkdownRenderer({ content }: { content: string }) {
  return (
    <div style={{ lineHeight: 1.7, fontSize: '0.9rem' }}>
      <ReactMarkdown
        components={{
          code({ node, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || '')
            const inline = !match
            return !inline ? (
              <CodeBlock language={match?.[1] || 'text'} value={String(children).replace(/\n$/, '')} />
            ) : (
              <code style={{
                background: 'rgba(118,185,0,0.15)', color: 'var(--nemo-green)',
                padding: '2px 6px', borderRadius: 4, fontFamily: 'JetBrains Mono, monospace', fontSize: '0.85em'
              }} {...props}>{children}</code>
            )
          },
          img: ({ src, alt }) => {
            if (src?.startsWith('figure:')) {
              const figType = src.replace('figure:', '')
              return <CustomFigure type={figType} caption={alt} />
            }
            return (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={src} alt={alt} style={{ maxWidth: '100%', borderRadius: 8, margin: '16px 0' }} />
            )
          },
          h1: ({ children }) => <h1 style={{ fontSize: '1.4rem', fontWeight: 700, margin: '20px 0 10px', color: 'var(--text-primary)' }}>{children}</h1>,
          h2: ({ children }) => <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '18px 0 8px', color: 'var(--text-primary)' }}>{children}</h2>,
          h3: ({ children }) => <h3 style={{ fontSize: '1.05rem', fontWeight: 600, margin: '14px 0 6px', color: 'var(--text-primary)' }}>{children}</h3>,
          p: ({ children }) => <p style={{ margin: '8px 0', color: 'var(--text-secondary)' }}>{children}</p>,
          ul: ({ children }) => <ul style={{ paddingLeft: 20, margin: '8px 0' }}>{children}</ul>,
          ol: ({ children }) => <ol style={{ paddingLeft: 20, margin: '8px 0' }}>{children}</ol>,
          li: ({ children }) => <li style={{ margin: '4px 0', color: 'var(--text-secondary)' }}>{children}</li>,
          strong: ({ children }) => <strong style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{children}</strong>,
          blockquote: ({ children }) => (
            <blockquote style={{
              borderLeft: '3px solid var(--nemo-green)', paddingLeft: 16,
              margin: '12px 0', color: 'var(--text-muted)', fontStyle: 'italic'
            }}>{children}</blockquote>
          ),
          table: ({ children }) => (
            <div style={{ overflowX: 'auto', margin: '12px 0' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>{children}</table>
            </div>
          ),
          th: ({ children }) => (
            <th style={{ padding: '8px 12px', background: 'rgba(118,185,0,0.1)', borderBottom: '1px solid var(--border-color)', textAlign: 'left', fontWeight: 600, color: 'var(--nemo-green)' }}>{children}</th>
          ),
          td: ({ children }) => (
            <td style={{ padding: '8px 12px', borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>{children}</td>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}

function CodeBlock({ language, value }: { language: string; value: string }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = () => {
    copyToClipboard(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <div style={{ position: 'relative', margin: '12px 0', borderRadius: 10, overflow: 'hidden', border: '1px solid var(--border-color)' }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '8px 14px', background: '#1a1a2e', borderBottom: '1px solid rgba(255,255,255,0.08)'
      }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--nemo-green)', fontFamily: 'JetBrains Mono, monospace', fontWeight: 600 }}>
          {language}
        </span>
        <button onClick={handleCopy} className="btn-ghost" style={{ padding: '4px 10px', fontSize: '0.75rem', gap: 4 }}>
          {copied ? <><Check size={12} /> Copied</> : <><Copy size={12} /> Copy</>}
        </button>
      </div>
      <SyntaxHighlighter
        language={language}
        style={oneDark}
        customStyle={{ margin: 0, borderRadius: 0, background: '#0d1117', fontSize: '0.82rem', lineHeight: 1.6 }}
        showLineNumbers={value.split('\n').length > 3}
      >
        {value}
      </SyntaxHighlighter>
    </div>
  )
}
