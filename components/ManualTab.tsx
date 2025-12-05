import { useState, useEffect, useRef } from 'react'
import { markdownToHTML, splitIntoSections, Section } from '@/lib/markdown'

const basePath = process.env.NODE_ENV === 'production' ? '/hide-and-seek-barcelona' : ''

export default function ManualTab() {
  const [sections, setSections] = useState<Section[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showTOC, setShowTOC] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Load manual content
    fetch(`${basePath}/manual-content.md`)
      .then(res => res.text())
      .then(content => {
        const parsedSections = splitIntoSections(content)
        setSections(parsedSections)
      })
      .catch(err => console.error('Error loading manual:', err))
  }, [])

  const goToSection = (index: number) => {
    setCurrentIndex(index)
    setShowTOC(false)
    // Scroll to top of content
    if (contentRef.current) {
      contentRef.current.scrollTop = 0
    }
  }

  const goToPrevious = () => {
    if (currentIndex > 0) {
      goToSection(currentIndex - 1)
    }
  }

  const goToNext = () => {
    if (currentIndex < sections.length - 1) {
      goToSection(currentIndex + 1)
    }
  }

  if (sections.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-gray-600">Cargando manual...</p>
      </div>
    )
  }

  const currentSection = sections[currentIndex]
  const prevSection = currentIndex > 0 ? sections[currentIndex - 1] : null
  const nextSection = currentIndex < sections.length - 1 ? sections[currentIndex + 1] : null

  const NavigationButtons = () => (
    <div className="flex items-center justify-between gap-2">
      {/* Previous Button */}
      <button
        onClick={goToPrevious}
        disabled={!prevSection}
        className={`flex-1 flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
          prevSection
            ? 'bg-purple-100 text-purple-700 hover:bg-purple-200'
            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
        }`}
      >
        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        <span className="truncate text-left">
          {prevSection ? prevSection.title : 'Inici'}
        </span>
      </button>

      {/* TOC Button */}
      <button
        onClick={() => setShowTOC(!showTOC)}
        className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex-shrink-0"
        title="Taula de Continguts"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Next Button */}
      <button
        onClick={goToNext}
        disabled={!nextSection}
        className={`flex-1 flex items-center justify-end gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
          nextSection
            ? 'bg-purple-100 text-purple-700 hover:bg-purple-200'
            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
        }`}
      >
        <span className="truncate text-right">
          {nextSection ? nextSection.title : 'Fi'}
        </span>
        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  )

  return (
    <div className="h-full flex flex-col container mx-auto px-4 py-4">
      {/* Top Navigation */}
      <div className="mb-4">
        <NavigationButtons />
      </div>

      {/* Table of Contents Modal */}
      {showTOC && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowTOC(false)}>
          <div
            className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[80vh] overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-4 bg-purple-600 text-white flex items-center justify-between">
              <h3 className="text-lg font-bold">Taula de Continguts</h3>
              <button onClick={() => setShowTOC(false)} className="p-1 hover:bg-purple-700 rounded">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <nav className="p-4 overflow-y-auto max-h-[60vh]">
              {sections.map((section, index) => (
                <button
                  key={section.id}
                  onClick={() => goToSection(index)}
                  className={`block w-full text-left px-3 py-2 rounded-lg mb-1 transition-colors ${
                    index === currentIndex
                      ? 'bg-purple-100 text-purple-900 font-semibold'
                      : 'hover:bg-gray-100 text-gray-700'
                  } ${section.level === 1 ? 'font-bold' : 'pl-6'}`}
                >
                  {section.title}
                </button>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Section Content */}
      <div
        ref={contentRef}
        className="flex-1 bg-white rounded-lg shadow-md p-6 overflow-y-auto"
      >
        {/* Section indicator */}
        <div className="text-sm text-purple-600 mb-2">
          {currentIndex + 1} / {sections.length}
        </div>

        <div
          className="prose prose-purple max-w-none manual-content"
          dangerouslySetInnerHTML={{ __html: markdownToHTML(currentSection.content) }}
        />
      </div>

      {/* Bottom Navigation */}
      <div className="mt-4">
        <NavigationButtons />
      </div>

      <style jsx global>{`
        .manual-content h1 {
          font-size: 2rem;
          font-weight: bold;
          color: #581c87;
          margin-top: 0.5rem;
          margin-bottom: 1rem;
        }
        .manual-content h2 {
          font-size: 1.5rem;
          font-weight: bold;
          color: #6b21a8;
          margin-top: 0.5rem;
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
