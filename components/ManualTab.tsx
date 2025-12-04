import { useState, useEffect } from 'react'
import { markdownToHTML, extractSections } from '@/lib/markdown'

export default function ManualTab() {
  const [manualContent, setManualContent] = useState('')
  const [htmlContent, setHtmlContent] = useState('')
  const [sections, setSections] = useState<Array<{ id: string; title: string; level: number }>>([])
  const [showTOC, setShowTOC] = useState(false)

  useEffect(() => {
    // Load manual content
    fetch('/manual-content.md')
      .then(res => res.text())
      .then(content => {
        setManualContent(content)
        setHtmlContent(markdownToHTML(content))
        setSections(extractSections(content))
      })
      .catch(err => console.error('Error loading manual:', err))
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setShowTOC(false)
    }
  }

  if (!htmlContent) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-gray-600">Cargando manual...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-4">
      {/* TOC Toggle Button */}
      <button
        onClick={() => setShowTOC(!showTOC)}
        className="mb-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
        {showTOC ? 'Ocultar' : 'Mostrar'} Tabla de Contenidos
      </button>

      {/* Table of Contents */}
      {showTOC && (
        <div className="mb-6 bg-white rounded-lg shadow-md p-4">
          <h3 className="text-lg font-bold text-purple-900 mb-3">Tabla de Contenidos</h3>
          <nav className="space-y-1">
            {sections.map(section => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={`block w-full text-left px-2 py-1 rounded hover:bg-purple-50 transition-colors ${
                  section.level === 1 ? 'font-bold text-purple-900' :
                  section.level === 2 ? 'pl-4 font-semibold text-purple-800' :
                  'pl-8 text-gray-700'
                }`}
              >
                {section.title}
              </button>
            ))}
          </nav>
        </div>
      )}

      {/* Manual Content */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div
          className="prose prose-purple max-w-none manual-content"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </div>

      <style jsx global>{`
        .manual-content h1 {
          font-size: 2rem;
          font-weight: bold;
          color: #581c87;
          margin-top: 2rem;
          margin-bottom: 1rem;
        }
        .manual-content h2 {
          font-size: 1.5rem;
          font-weight: bold;
          color: #6b21a8;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
        }
        .manual-content h3 {
          font-size: 1.25rem;
          font-weight: 600;
          color: #7c3aed;
          margin-top: 1.25rem;
          margin-bottom: 0.5rem;
        }
        .manual-content h4 {
          font-size: 1.1rem;
          font-weight: 600;
          color: #8b5cf6;
          margin-top: 1rem;
          margin-bottom: 0.5rem;
        }
        .manual-content p {
          margin-bottom: 0.75rem;
          line-height: 1.6;
          color: #374151;
        }
        .manual-content ul,
        .manual-content ol {
          margin-left: 1.5rem;
          margin-bottom: 1rem;
        }
        .manual-content ul {
          list-style-type: disc;
        }
        .manual-content ol {
          list-style-type: decimal;
        }
        .manual-content li {
          margin-bottom: 0.25rem;
          line-height: 1.6;
        }
        .manual-content strong {
          font-weight: 600;
          color: #111827;
        }
        .manual-content em {
          font-style: italic;
        }
        .manual-content hr {
          margin: 2rem 0;
          border: 0;
          border-top: 2px solid #e5e7eb;
        }
      `}</style>
    </div>
  )
}
