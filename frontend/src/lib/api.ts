const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export async function* streamChat(messages: { role: string; content: string }[], model?: string): AsyncGenerator<string> {
  const response = await fetch(`${API_URL}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, model: model || 'nvidia/llama-3.1-nemotron-70b-instruct' }),
  })

  if (!response.ok) throw new Error(`API error: ${response.statusText}`)

  const reader = response.body?.getReader()
  if (!reader) throw new Error('No response body')

  const decoder = new TextDecoder()
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    const chunk = decoder.decode(value)
    const lines = chunk.split('\n')
    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = line.slice(6).trim()
        if (data === '[DONE]') return
        try {
          const parsed = JSON.parse(data)
          const content = parsed?.choices?.[0]?.delta?.content
          if (content) yield content
        } catch {}
      }
    }
  }
}

export async function runAgent(task: string) {
  const res = await fetch(`${API_URL}/agent`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ task }),
  })
  if (!res.ok) throw new Error('Agent API error')
  return res.json()
}

export async function generateBlog(topic: string, tone = 'professional', length = 'medium') {
  const res = await fetch(`${API_URL}/generate-blog`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ topic, tone, length }),
  })
  if (!res.ok) throw new Error('Blog API error')
  return res.json()
}

export async function generatePaper(title: string, domain = 'Computer Science', keywords: string[] = []) {
  const res = await fetch(`${API_URL}/generate-paper`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, domain, keywords }),
  })
  if (!res.ok) throw new Error('Paper API error')
  return res.json()
}

export async function getAnalytics(userId: string) {
  const res = await fetch(`${API_URL}/analytics/${userId}`)
  if (!res.ok) throw new Error('Analytics API error')
  return res.json()
}

export async function saveProject(data: { user_id: string; title: string; description: string; content: string; type?: string }) {
  const res = await fetch(`${API_URL}/save-project`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Save project error')
  return res.json()
}
