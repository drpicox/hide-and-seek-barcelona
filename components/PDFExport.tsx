'use client'

interface PDFExportProps {
  mode: 'small' | 'verySmall'
}

export default function PDFExport({ mode }: PDFExportProps) {
  const handlePrint = () => {
    const printWindow = window.open('', '_blank')
    if (!printWindow) return

    const matchingQuestions = [
      'Commercial Airport', 'Transit Line', "Station's Name Length", 'Street or Path',
      '1st Admin. Division', '2nd Admin. Division', '3rd Admin. Division', '4th Admin. Division',
      'Mountain', 'Landmass', 'Park', 'Amusement Park', 'Zoo', 'Aquarium',
      'Golf Course', 'Museum', 'Movie Theater', 'Hospital', 'Library', 'Foreign Consulate'
    ]

    const measuringQuestions = [
      'Commercial Airport', 'High Speed Train', 'Rail Station', 'International Border',
      '1st Admin. Border', '2nd Admin. Border', 'Sea Level', 'Body of Water',
      'Coastline', 'Mountain', 'Park', 'Amusement Park', 'Zoo', 'Aquarium',
      'Golf Course', 'Museum', 'Movie Theater', 'Hospital', 'Library', 'Foreign Consulate'
    ]

    const thermometerQuestions = mode === 'verySmall'
      ? ['200 m', '500 m', '1 km']
      : ['1 km', '5 km']

    const radarQuestions = mode === 'verySmall'
      ? ['200 m', '500 m', '1 km', '2 km']
      : ['500 m', '1 km', '2 km', '5 km', '10 km', '15 km']

    const photos = [
      { name: 'A Tree', desc: 'Full tree visible' },
      { name: 'The Sky', desc: 'Phone flat on ground' },
      { name: 'You', desc: 'Selfie, arm extended' },
      { name: 'Widest Street', desc: 'Both sides visible' },
      { name: 'Tallest Structure', desc: 'From your perspective' },
      { name: 'Building from Station', desc: 'Outside entrance' }
    ]

    const html = `
<!DOCTYPE html>
<html lang="ca">
<head>
  <meta charset="UTF-8">
  <title>Hide and Seek - ${mode === 'small' ? 'Small' : 'Very Small'}</title>
  <style>
    @page { size: A4; margin: 6mm; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 8pt;
      line-height: 1.3;
      color: #000;
    }
    .page { width: 100%; max-width: 198mm; margin: 0 auto; }
    
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 3mm;
    }
    .mode-badge {
      background: #000;
      color: #fff;
      padding: 1mm 3mm;
      font-size: 7pt;
      font-weight: bold;
    }
    .hider-box {
      font-size: 9pt;
    }
    .hider-line {
      display: inline-block;
      width: 45mm;
      border-bottom: 1pt solid #000;
      margin-left: 2mm;
    }
    
    .content { display: flex; gap: 4mm; }
    .col { flex: 1; display: flex; flex-direction: column; gap: 3mm; }
    
    .section {
      border: 1.5pt solid #000;
      break-inside: avoid;
    }
    .section-header {
      background: #e0e0e0;
      padding: 1.5mm 2mm;
      font-weight: bold;
      font-size: 8pt;
      border-bottom: 1pt solid #000;
    }
    .section-hint {
      font-weight: normal;
      font-size: 6pt;
      color: #444;
      display: block;
      margin-top: 0.5mm;
    }
    .section-body { padding: 2mm; }
    
    .q-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5mm 3mm; }
    .q-grid.single-col { grid-template-columns: 1fr; }
    
    .q-item { display: flex; align-items: flex-start; gap: 1.5mm; }
    .checkbox {
      width: 3.5mm;
      height: 3.5mm;
      border: 1pt solid #000;
      flex-shrink: 0;
      margin-top: 0.3mm;
    }
    .q-text { font-size: 7pt; line-height: 1.3; }
    .q-desc { font-size: 6pt; color: #666; }
    
    .photo-item {
      display: flex;
      align-items: flex-start;
      gap: 1.5mm;
      padding: 1.5mm 0;
      border-bottom: 0.5pt dotted #aaa;
    }
    .photo-item:last-child { border-bottom: none; }
    
    .notes-section { flex: 1; min-height: 35mm; }
    .notes-lines { padding-top: 1.5mm; }
    .note-line {
      height: 6mm;
      border-bottom: 0.5pt solid #ccc;
    }
    
    .quick-notes {
      margin-top: 2mm;
      padding: 1.5mm;
      border: 1pt dashed #999;
      min-height: 12mm;
    }
    .quick-notes-title {
      font-size: 6pt;
      color: #666;
      margin-bottom: 0.5mm;
    }
  </style>
</head>
<body>
  <div class="page">
    <div class="header">
      <div class="hider-box">Hider: <span class="hider-line"></span></div>
      <div class="mode-badge">${mode === 'small' ? 'SMALL ≤25km' : 'VERY SMALL ≤3km'}</div>
    </div>
    
    <div class="content">
      <div class="col">
        <div class="section">
          <div class="section-header">
            MATCHING (20)
            <span class="section-hint">Is your nearest ___ the same as mine?</span>
          </div>
          <div class="section-body">
            <div class="q-grid">
              ${matchingQuestions.map(q => `
                <div class="q-item">
                  <div class="checkbox"></div>
                  <div class="q-text">${q}</div>
                </div>
              `).join('')}
            </div>
            <div class="quick-notes">
              <div class="quick-notes-title">Notes:</div>
            </div>
          </div>
        </div>
        
        <div class="section">
          <div class="section-header">
            THERMOMETER (${thermometerQuestions.length})
            <span class="section-hint">I traveled ___. Am I hotter or colder?</span>
          </div>
          <div class="section-body">
            <div class="q-grid single-col">
              ${thermometerQuestions.map(q => `
                <div class="q-item">
                  <div class="checkbox"></div>
                  <div class="q-text">${q}</div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
        
        <div class="section">
          <div class="section-header">
            PHOTOS (6)
            <span class="section-hint">Send a photo of...</span>
          </div>
          <div class="section-body">
            ${photos.map(p => `
              <div class="photo-item">
                <div class="checkbox"></div>
                <div>
                  <div class="q-text">${p.name}</div>
                  <div class="q-desc">${p.desc}</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
      
      <div class="col">
        <div class="section">
          <div class="section-header">
            MEASURING (20)
            <span class="section-hint">Are you closer or further from ___?</span>
          </div>
          <div class="section-body">
            <div class="q-grid">
              ${measuringQuestions.map(q => `
                <div class="q-item">
                  <div class="checkbox"></div>
                  <div class="q-text">${q}</div>
                </div>
              `).join('')}
            </div>
            <div class="quick-notes">
              <div class="quick-notes-title">Notes:</div>
            </div>
          </div>
        </div>
        
        <div class="section">
          <div class="section-header">
            RADAR (${radarQuestions.length})
            <span class="section-hint">Are you within ___ of me?</span>
          </div>
          <div class="section-body">
            <div class="q-grid single-col">
              ${radarQuestions.map(q => `
                <div class="q-item">
                  <div class="checkbox"></div>
                  <div class="q-text">${q}</div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
        
        <div class="section notes-section">
          <div class="section-header">GENERAL NOTES</div>
          <div class="section-body">
            <div class="notes-lines">
              <div class="note-line"></div>
              <div class="note-line"></div>
              <div class="note-line"></div>
              <div class="note-line"></div>
              <div class="note-line"></div>
              <div class="note-line"></div>
              <div class="note-line"></div>
              <div class="note-line"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <script>window.onload = function() { window.print(); };</script>
</body>
</html>`

    printWindow.document.write(html)
    printWindow.document.close()
  }

  return (
    <button
      onClick={handlePrint}
      className="px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
    >
      📄 PDF ({mode === 'small' ? 'Small' : 'Very Small'})
    </button>
  )
}
