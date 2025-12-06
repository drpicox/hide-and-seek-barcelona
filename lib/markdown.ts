export function markdownToHTML(markdown: string): string {
  let html = markdown

  // Check if this section contains CONTENIDOS
  const hasContenidos = markdown.includes('## CONTENIDOS')

  // Escape HTML
  html = html.replace(/&/g, '&amp;')
  html = html.replace(/</g, '&lt;')
  html = html.replace(/>/g, '&gt;')

  // Headers with IDs
  html = html.replace(/^#### (.+)$/gm, (_, title) => `<h4 id="${slugify(title)}">${title}</h4>`)
  html = html.replace(/^### (.+)$/gm, (_, title) => `<h3 id="${slugify(title)}">${title}</h3>`)
  html = html.replace(/^## (.+)$/gm, (_, title) => `<h2 id="${slugify(title)}">${title}</h2>`)
  html = html.replace(/^# (.+)$/gm, (_, title) => `<h1 id="${slugify(title)}">${title}</h1>`)

  // Bold and italic
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>')

  // Lists - Handle numbered and bulleted separately
  // Add toc-link class if this is the CONTENIDOS section
  const liClass = hasContenidos ? 'ul-item toc-link' : 'ul-item'
  html = html.replace(/^- (.+)$/gm, `<li class="${liClass}">$1</li>`)
  html = html.replace(/^\d+\. (.+)$/gm, '<li class="ol-item">$1</li>')

  // Wrap lists in proper tags
  html = html.replace(/(<li class="[^"]*ul-item[^"]*">.*?<\/li>\n?)+/g, function(match) {
    return '<ul>' + match.replace(/ class="[^"]*ul-item[^"]*"/g, function(classMatch) {
      return classMatch.includes('toc-link') ? ' class="toc-link"' : ''
    }) + '</ul>'
  })
  html = html.replace(/(<li class="ol-item">.*?<\/li>\n?)+/g, function(match) {
    return '<ol>' + match.replace(/ class="ol-item"/g, '') + '</ol>'
  })

  // Paragraphs - only wrap if not already in a tag
  html = html.replace(/^(?!<[hulo]|<\/|<li)(.+)$/gm, '<p>$1</p>')

  // Horizontal rule
  html = html.replace(/^---$/gm, '<hr />')

  // Line breaks
  html = html.replace(/\n/g, '')

  // Clean up consecutive tags
  html = html.replace(/<\/p><p>/g, '</p>\n<p>')
  html = html.replace(/<\/h(\d)>/g, '</h$1>\n')
  html = html.replace(/<\/ul>/g, '</ul>\n')
  html = html.replace(/<\/ol>/g, '</ol>\n')
  html = html.replace(/<hr \/>/g, '<hr />\n')

  return html
}

export function extractSections(markdown: string): Array<{ id: string; title: string; level: number }> {
  const sections: Array<{ id: string; title: string; level: number }> = []
  const lines = markdown.split('\n')

  for (const line of lines) {
    const h1Match = line.match(/^# (.+)$/)
    const h2Match = line.match(/^## (.+)$/)
    const h3Match = line.match(/^### (.+)$/)

    if (h1Match) {
      sections.push({
        id: slugify(h1Match[1]),
        title: h1Match[1],
        level: 1
      })
    } else if (h2Match) {
      sections.push({
        id: slugify(h2Match[1]),
        title: h2Match[1],
        level: 2
      })
    } else if (h3Match) {
      sections.push({
        id: slugify(h3Match[1]),
        title: h3Match[1],
        level: 3
      })
    }
  }

  return sections
}

export interface Section {
  id: string
  title: string
  level: number
  content: string
}

export function splitIntoSections(markdown: string): Section[] {
  const lines = markdown.split('\n')
  const sections: Section[] = []
  let currentSection: Section | null = null
  let currentContent: string[] = []

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const h1Match = line.match(/^# (.+)$/)
    const h2Match = line.match(/^## (.+)$/)
    const h3Match = line.match(/^### (.+)$/)

    // Start a new section on h1, h2, or h3
    if (h1Match || h2Match || h3Match) {
      // Special handling: keep CONTENIDOS with intro
      const isContentSection = h2Match && h2Match[1] === 'CONTENIDOS'
      const isFirstMainSection = h2Match && h2Match[1].includes('SECCIÓN 1')

      // For first main section, include first subsection
      if (isFirstMainSection) {
        if (currentSection) {
          currentSection.content = currentContent.join('\n')
          sections.push(currentSection)
        }

        currentSection = {
          id: slugify(h2Match![1]),
          title: h2Match![1],
          level: 2,
          content: ''
        }
        currentContent = [line]

        // Include content until second h3
        i++
        let h3Count = 0
        while (i < lines.length) {
          const nextLine = lines[i]
          const nextH3 = nextLine.match(/^### (.+)$/)

          if (nextH3) {
            h3Count++
            if (h3Count >= 2) {
              i--
              break
            }
          }

          currentContent.push(nextLine)
          i++
        }
        continue
      }

      // Keep CONTENIDOS with title
      if (isContentSection) {
        if (currentSection) {
          currentContent.push(line)
        } else {
          currentSection = {
            id: 'intro',
            title: 'HIDE+SEEK - Índex',
            level: 1,
            content: ''
          }
          currentContent = [line]
        }
        continue
      }

      // Save previous section
      if (currentSection) {
        currentSection.content = currentContent.join('\n')
        sections.push(currentSection)
      }

      const title = h1Match ? h1Match[1] : h2Match ? h2Match[1] : h3Match![1]
      const level = h1Match ? 1 : h2Match ? 2 : 3

      currentSection = {
        id: slugify(title),
        title,
        level,
        content: ''
      }
      currentContent = [line]
    } else if (currentSection) {
      currentContent.push(line)
    } else {
      if (line.trim()) {
        currentSection = {
          id: 'intro',
          title: 'HIDE+SEEK - Índex',
          level: 1,
          content: ''
        }
        currentContent = [line]
      }
    }
  }

  if (currentSection) {
    currentSection.content = currentContent.join('\n')
    sections.push(currentSection)
  }

  return sections
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[áàäâ]/g, 'a')
    .replace(/[éèëê]/g, 'e')
    .replace(/[íìïî]/g, 'i')
    .replace(/[óòöô]/g, 'o')
    .replace(/[úùüû]/g, 'u')
    .replace(/ñ/g, 'n')
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
