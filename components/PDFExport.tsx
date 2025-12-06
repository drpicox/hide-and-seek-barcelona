'use client'

interface PDFExportProps {
  mode: 'small' | 'verySmall'
}

export default function PDFExport({ mode }: PDFExportProps) {
  const handlePrint = () => {
    window.print()
  }

  // Questions filtered by mode
  const matchingQuestions = [
    'Commercial Airport', 'Transit Line', "Station's Name Length", 'Street or Path',
    '1st Admin. Division', '2nd Admin. Division', '3rd Admin. Division', '4th Admin. Division',
    'Mountain', 'Landmass', 'Park', 'Amusement Park', 'Zoo', 'Aquarium',
    'Golf Course', 'Museum', 'Movie Theater', 'Hospital', 'Library', 'Foreign Consulate'
  ]

  const measuringQuestions = [
    'A Commercial Airport', 'A High Speed Train Line', 'A Rail Station', 'An International Border',
    'A 1st Admin. Div. Border', 'A 2nd Admin. Div. Border', 'Sea Level', 'A Body of Water',
    'A Coastline', 'A Mountain', 'A Park', 'An Amusement Park', 'A Zoo', 'An Aquarium',
    'A Golf Course', 'A Museum', 'A Movie Theater', 'A Hospital', 'A Library', 'A Foreign Consulate'
  ]

  const thermometerQuestions = mode === 'verySmall' 
    ? ['200 m', '500 m', '1 km']
    : ['1 km', '5 km']

  const radarQuestions = mode === 'verySmall'
    ? ['200 m', '500 m', '1 km', '2 km']
    : ['500 m', '1 km', '2 km', '5 km', '10 km', '15 km']

  const photos = [
    { name: 'A Tree', desc: 'Arbre complet' },
    { name: 'The Sky', desc: 'Tel. al terra' },
    { name: 'You', desc: 'Selfie braç estès' },
    { name: 'Widest Street', desc: 'Dos costats' },
    { name: 'Tallest Structure', desc: 'Des de perspectiva' },
    { name: 'Building from Station', desc: 'Fora entrada' }
  ]

  return (
    <>
      <button
        onClick={handlePrint}
        className="px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors print:hidden"
      >
        📄 PDF ({mode === 'small' ? 'Small' : 'Very Small'})
      </button>

      <div className="hidden print:block print-content">
        <style jsx global>{`
          @media print {
            @page {
              size: A4;
              margin: 8mm;
            }
            
            body {
              print-color-adjust: exact;
              -webkit-print-color-adjust: exact;
            }
            
            .print-content {
              display: block !important;
              font-size: 7.5pt;
              line-height: 1.15;
            }
            
            .no-print, header, nav, .bottom-nav {
              display: none !important;
            }
          }
        `}</style>

        <div className="w-full">
          {/* Header */}
          <div className="mb-2 pb-1 border-b-2 border-gray-800">
            <h1 className="text-lg font-bold">
              Hide and Seek - Barcelona
            </h1>
            <p className="text-[8pt] text-gray-600">
              Mode: {mode === 'small' ? 'Small (≤25km)' : 'Very Small (≤3km)'} | Hider: _______________________
            </p>
          </div>

          {/* Two-column layout */}
          <div className="grid grid-cols-2 gap-2.5 text-[7.5pt]">
            {/* Left Column */}
            <div className="space-y-1.5">
              {/* Matching */}
              <div>
                <h2 className="font-bold text-[9pt] mb-0.5 px-1 py-0.5 bg-gray-200">
                  Matching (20)
                </h2>
                <div className="space-y-0">
                  {matchingQuestions.map((q, i) => (
                    <div key={i} className="flex items-start gap-1">
                      <span className="inline-block w-3 h-3 border border-gray-400 mt-0.5 flex-shrink-0" />
                      <span className="flex-1 leading-tight text-[7pt]">{q}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Thermometer */}
              <div>
                <h2 className="font-bold text-[9pt] mb-0.5 px-1 py-0.5 bg-gray-200">
                  Thermometer ({thermometerQuestions.length})
                </h2>
                <div className="space-y-0">
                  {thermometerQuestions.map((q, i) => (
                    <div key={i} className="flex items-start gap-1">
                      <span className="inline-block w-3 h-3 border border-gray-400 mt-0.5 flex-shrink-0" />
                      <span className="flex-1 leading-tight text-[7pt]">{q}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Photos */}
              <div>
                <h2 className="font-bold text-[9pt] mb-0.5 px-1 py-0.5 bg-gray-200">
                  Photos (6)
                </h2>
                <div className="space-y-0">
                  {photos.map((p, i) => (
                    <div key={i} className="flex items-start gap-1">
                      <span className="inline-block w-3 h-3 border border-gray-400 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <span className="leading-tight font-medium text-[7pt]">{p.name}</span>
                        <span className="text-[6pt] text-gray-500 ml-1">({p.desc})</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-1.5">
              {/* Measuring */}
              <div>
                <h2 className="font-bold text-[9pt] mb-0.5 px-1 py-0.5 bg-gray-200">
                  Measuring (20)
                </h2>
                <div className="space-y-0">
                  {measuringQuestions.map((q, i) => (
                    <div key={i} className="flex items-start gap-1">
                      <span className="inline-block w-3 h-3 border border-gray-400 mt-0.5 flex-shrink-0" />
                      <span className="flex-1 leading-tight text-[7pt]">{q}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Radar */}
              <div>
                <h2 className="font-bold text-[9pt] mb-0.5 px-1 py-0.5 bg-gray-200">
                  Radar ({radarQuestions.length})
                </h2>
                <div className="space-y-0">
                  {radarQuestions.map((q, i) => (
                    <div key={i} className="flex items-start gap-1">
                      <span className="inline-block w-3 h-3 border border-gray-400 mt-0.5 flex-shrink-0" />
                      <span className="flex-1 leading-tight text-[7pt]">{q}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes section */}
              <div className="mt-1 p-1 border border-gray-400">
                <h3 className="font-bold text-[8pt] mb-0.5">Notes:</h3>
                <div className="space-y-0.5">
                  <div className="h-5 border-b border-gray-300"></div>
                  <div className="h-5 border-b border-gray-300"></div>
                  <div className="h-5 border-b border-gray-300"></div>
                  <div className="h-5 border-b border-gray-300"></div>
                  <div className="h-5"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-1.5 pt-0.5 border-t text-[6pt] text-gray-500 text-center">
            Hide and Seek Barcelona - {new Date().toLocaleDateString()}
          </div>
        </div>
      </div>
    </>
  )
}

