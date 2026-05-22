export interface Project {
  id: string
  title: string
  description: string
  type: 'chat' | 'blog' | 'paper' | 'agent'
  content: string
  createdAt: string
}

const STORAGE_KEY = 'nemocore_projects'

const defaultProjects: Project[] = [
  { id: '1', title: 'Python Web Scraper Agent', description: 'Built a full async web scraper using BeautifulSoup4 with rate limiting and proxy support.', type: 'agent', content: '# Python Web Scraper\n\nFull async implementation using BeautifulSoup4...', createdAt: '2026-04-07' },
  { id: '2', title: 'NVIDIA Nemotron 3 Blog', description: 'Comprehensive blog post about Nemotron 3 architecture and use cases.', type: 'blog', content: '# NVIDIA Nemotron 3: The Future of AI\n\n...', createdAt: '2026-04-06' },
  { id: '3', title: 'LLM Efficiency Research Paper', description: 'Academic paper on Mixture-of-Experts and multi-token prediction.', type: 'paper', content: '# LLM Efficiency Research\n\n**Abstract**: ...', createdAt: '2026-04-05' },
  { id: '4', title: 'React Dashboard Chat', description: 'AI chat session exploring React architecture patterns.', type: 'chat', content: '# Chat: React Architecture\n\nUser: Explain useCallback vs useMemo...', createdAt: '2026-04-04' },
  { id: '5', title: 'ML Pipeline for NLP', description: 'End-to-end ML pipeline for sentiment analysis on social media data.', type: 'agent', content: '# ML Pipeline\n\nStep 1: Data collection...', createdAt: '2026-04-03' },
]

export function getLocalProjects(): Project[] {
  if (typeof window === 'undefined') return []
  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultProjects))
    return defaultProjects
  }
  try {
    return JSON.parse(stored)
  } catch (e) {
    return defaultProjects
  }
}

export function saveLocalProject(project: Omit<Project, 'id' | 'createdAt'> & { id?: string; createdAt?: string }) {
  if (typeof window === 'undefined') return null
  const projects = getLocalProjects()
  const newProject: Project = {
    id: project.id || Date.now().toString(),
    title: project.title,
    description: project.description,
    type: project.type,
    content: project.content,
    createdAt: project.createdAt || new Date().toISOString().split('T')[0]
  }

  // Update if exists, otherwise prepend
  const idx = projects.findIndex(p => p.id === newProject.id)
  if (idx !== -1) {
    projects[idx] = newProject
  } else {
    projects.unshift(newProject)
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects))
  return newProject
}

export function deleteLocalProject(id: string) {
  if (typeof window === 'undefined') return
  const projects = getLocalProjects()
  const filtered = projects.filter(p => p.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
}
