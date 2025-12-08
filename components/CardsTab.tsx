'use client'

import { useState, useEffect, useRef } from 'react'
import { useLocalStorage } from '@/lib/hooks/useLocalStorage'
import type { DeckState, Card } from '@/lib/types'
import { createInitialDeck, shuffleDeck, getCardDefinition, formatCardText } from '@/lib/cards'

interface CardsTabProps {
  verySmall: boolean
}

export default function CardsTab({ verySmall }: CardsTabProps) {
  const [deckState, setDeckState] = useLocalStorage<DeckState>('hideAndSeekDeck', {
    deck: shuffleDeck(createInitialDeck()),
    hand: []
  })

  const [handLimit, setHandLimit] = useLocalStorage<number>('hideAndSeekHandLimit', 6)
  const [discardHistory, setDiscardHistory] = useState<Card[]>([])
  const [selectedCard, setSelectedCard] = useState<Card | null>(null)
  const [showNewGameModal, setShowNewGameModal] = useState(false)
  const [mathQuestion, setMathQuestion] = useState({ num1: 0, num2: 0, answer: 0 })
  const [mathInput, setMathInput] = useState('')
  const [mathError, setMathError] = useState(false)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // Scroll inicial per veure un trosset de les cartes (evitar clic accidental)
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 120 // Scroll 120px cap avall
    }
  }, [])

  // Generar nova pregunta matemàtica
  const generateMathQuestion = () => {
    const num1 = Math.floor(Math.random() * 31) + 10 // 10-40
    const num2 = Math.floor(Math.random() * 31) + 10 // 10-40
    setMathQuestion({ num1, num2, answer: num1 + num2 })
    setMathInput('')
    setMathError(false)
  }

  // Robar carta (del top del mazo a la mà)
  const handleDraw = () => {
    if (deckState.deck.length === 0) {
      alert('El mazo està buit!')
      return
    }

    const newDeck = [...deckState.deck]
    const drawnCard = newDeck.shift()! // Agafem la primera carta (top)

    setDeckState({
      deck: newDeck,
      hand: [...deckState.hand, drawnCard]
    })
  }

  // Descartar carta (de la mà al bottom del mazo)
  const handleDiscard = (card: Card) => {
    const newHand = deckState.hand.filter(c => c.id !== card.id)
    const newDeck = [...deckState.deck, card] // Afegim al final (bottom)

    // Afegir a historial per undo
    setDiscardHistory(prev => [...prev, card])

    setDeckState({
      deck: newDeck,
      hand: newHand
    })
  }

  // Undo de descartar (recuperar última carta descartada)
  const handleUndoDiscard = () => {
    if (discardHistory.length === 0) return

    const lastDiscarded = discardHistory[discardHistory.length - 1]
    const newHistory = discardHistory.slice(0, -1)

    // Treure la carta del mazo i tornar-la a la mà
    const newDeck = deckState.deck.filter(c => c.id !== lastDiscarded.id)
    const newHand = [...deckState.hand, lastDiscarded]

    setDiscardHistory(newHistory)
    setDeckState({
      deck: newDeck,
      hand: newHand
    })
  }

  // Nova partida amb confirmació matemàtica
  const handleNewGame = () => {
    generateMathQuestion()
    setShowNewGameModal(true)
  }

  const confirmNewGame = () => {
    const userAnswer = parseInt(mathInput)
    if (userAnswer === mathQuestion.answer) {
      // Correcte! Reiniciem
      setDeckState({
        deck: shuffleDeck(createInitialDeck()),
        hand: []
      })
      setDiscardHistory([])
      setShowNewGameModal(false)
      setMathError(false)
    } else {
      // Incorrecte
      setMathError(true)
      setMathInput('')
    }
  }

  // Ordenar mà: primer millores, després malediccions, finalment bonuses (cada secció alfabèticament)
  const sortedHand = [...deckState.hand].sort((a, b) => {
    const defA = getCardDefinition(a.cardKey)
    const defB = getCardDefinition(b.cardKey)
    if (!defA || !defB) return 0

    // Ordre de tipus: upgrade (1) < curse (2) < timeBonus (3)
    const typeOrder = { upgrade: 1, curse: 2, timeBonus: 3 }
    const orderA = typeOrder[a.type as keyof typeof typeOrder] || 99
    const orderB = typeOrder[b.type as keyof typeof typeOrder] || 99

    if (orderA !== orderB) {
      return orderA - orderB
    }

    // Dins del mateix tipus, ordenar alfabèticament
    return defA.title.localeCompare(defB.title)
  })

  // Calcular total de minuts dels time bonuses a la mà
  const calculateTotalMinutes = (): number => {
    return deckState.hand.reduce((total, card) => {
      if (card.type !== 'timeBonus') return total

      const def = getCardDefinition(card.cardKey)
      if (!def) return total

      // Extreure el valor segons verySmall
      const pattern = /\*\*V\s+(\d+(?:\.\d+)?)\s+\/\s+S\s+(\d+(?:\.\d+)?)\s+\/\s+M\s+(\d+(?:\.\d+)?)\s+\/\s+L\s+(\d+(?:\.\d+)?)\*\*/
      const match = def.text.match(pattern)

      if (match) {
        const value = verySmall ? parseFloat(match[1]) : parseFloat(match[4])
        return total + value
      }

      return total
    }, 0)
  }

  const totalMinutes = calculateTotalMinutes()

  // Obtenir color segons tipus de carta
  const getCardColor = (type: string) => {
    switch (type) {
      case 'curse':
        return 'bg-red-50 border-red-300 text-red-900'
      case 'upgrade':
        return 'bg-blue-50 border-blue-300 text-blue-900'
      case 'timeBonus':
        return 'bg-yellow-50 border-yellow-300 text-yellow-900'
      default:
        return 'bg-gray-50 border-gray-300 text-gray-900'
    }
  }

  const getCardBadgeColor = (type: string) => {
    switch (type) {
      case 'curse':
        return 'bg-red-500 text-white'
      case 'upgrade':
        return 'bg-blue-500 text-white'
      case 'timeBonus':
        return 'bg-yellow-500 text-white'
      default:
        return 'bg-gray-500 text-white'
    }
  }

  const getCardTypeLabel = (type: string) => {
    switch (type) {
      case 'curse':
        return 'Maldición'
      case 'upgrade':
        return 'Mejora'
      case 'timeBonus':
        return 'Bonus Tiempo'
      default:
        return type
    }
  }

  return (
    <div ref={scrollContainerRef} className="min-h-full bg-gray-50 pb-6 overflow-y-auto">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Botó robar carta FIX A DALT */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6 sticky top-0 z-10">
          <button
            onClick={handleDraw}
            disabled={deckState.deck.length === 0}
            className={`w-full py-4 rounded-lg font-semibold text-lg transition-colors ${
              deckState.deck.length === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-purple-600 text-white hover:bg-purple-700 active:bg-purple-800'
            }`}
          >
            🃏 Robar Carta del Mazo ({deckState.deck.length})
          </button>
        </div>
        {/* Mà de cartes */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-gray-800">La Mà</h3>
              {totalMinutes > 0 && (
                <p className="text-sm text-gray-600 mt-1">
                  ⏱️ Total bonuses: <span className="font-semibold text-yellow-600">{totalMinutes} min</span>
                </p>
              )}
            </div>
            <div className="flex items-center gap-3">
              {/* Botó Undo */}
              {discardHistory.length > 0 && (
                <button
                  onClick={handleUndoDiscard}
                  className="px-3 py-1.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium text-sm"
                >
                  ↶ Desfer
                </button>
              )}

              {/* Comptador de límit */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setHandLimit(Math.max(1, handLimit - 1))}
                  className="w-7 h-7 bg-gray-200 hover:bg-gray-300 rounded font-bold text-gray-700"
                >
                  −
                </button>
                <span className={`text-sm font-semibold ${
                  deckState.hand.length > handLimit ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {deckState.hand.length} / {handLimit}
                </span>
                <button
                  onClick={() => setHandLimit(handLimit + 1)}
                  className="w-7 h-7 bg-gray-200 hover:bg-gray-300 rounded font-bold text-gray-700"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {sortedHand.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No tens cartes a la mà. Roba una carta del mazo!</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {sortedHand.map(card => {
                const def = getCardDefinition(card.cardKey)
                if (!def) return null

                // Cartes verticals tipus carta de joc
                const isTimeBonus = card.type === 'timeBonus'

                return (
                  <div
                    key={card.id}
                    className={`relative border-2 rounded-xl ${getCardColor(card.type)} cursor-pointer hover:shadow-xl transition-all hover:scale-105 aspect-[2/3] flex flex-col`}
                    onClick={() => setSelectedCard(card)}
                  >
                    {/* Contingut de la carta */}
                    <div className="flex-1 p-4 flex flex-col justify-between overflow-hidden">
                      <div>
                        {/* Títol amb icona flotant */}
                        <div className="relative mb-2">
                          <span className={`float-right text-lg ml-2 ${getCardBadgeColor(card.type)} rounded-full w-7 h-7 flex items-center justify-center shadow-md`}>
                            {card.type === 'curse' ? '🔥' : card.type === 'upgrade' ? '⚡' : '⏱️'}
                          </span>
                          <h4 className="font-bold text-base leading-tight pr-1">{def.title}</h4>
                        </div>

                        {!isTimeBonus && (
                          <div className="text-sm opacity-60 line-clamp-4 clear-both">
                            {formatCardText(def.text, verySmall)}
                          </div>
                        )}
                        {isTimeBonus && (
                          <div className="text-xl font-black text-center mt-6 clear-both">
                            {formatCardText(def.text, verySmall)}
                          </div>
                        )}
                      </div>

                      {/* Botó descartar a baix */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDiscard(card)
                        }}
                        className="w-full px-2 py-1.5 bg-white bg-opacity-50 hover:bg-opacity-100 rounded text-xs font-medium transition-colors mt-2"
                      >
                        Descartar
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Header amb info del mazo (ABAIX DE TOT) */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Mazo de Cartes</h2>
              <p className="text-sm text-gray-600 mt-1">
                Cartes al mazo: <span className="font-semibold text-purple-600">{deckState.deck.length}</span>
              </p>
            </div>
            <button
              onClick={handleNewGame}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium text-sm"
            >
              Nova Partida
            </button>
          </div>
        </div>
      </div>

      {/* Modal per mostrar carta en pantalla completa */}
      {selectedCard && (
        <div
          className="fixed inset-0 bg-white flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedCard(null)}
        >
          <div
            className={`max-w-2xl w-full rounded-2xl p-8 ${getCardColor(selectedCard.type)} border-4 max-h-[90vh] overflow-y-auto shadow-2xl`}
            onClick={(e) => e.stopPropagation()}
          >
            {(() => {
              const def = getCardDefinition(selectedCard.cardKey)
              if (!def) return null

              return (
                <>
                  <div className="flex items-start justify-between mb-6">
                    <span className={`text-base px-4 py-2 rounded-full font-bold ${getCardBadgeColor(selectedCard.type)} shadow-lg`}>
                      {getCardTypeLabel(selectedCard.type)}
                    </span>
                    <button
                      onClick={() => setSelectedCard(null)}
                      className="text-3xl font-bold opacity-50 hover:opacity-100 transition-opacity w-10 h-10 flex items-center justify-center"
                    >
                      ✕
                    </button>
                  </div>

                  <h2 className="text-5xl font-bold mb-8">{def.title}</h2>

                  {def.cost && (
                    <div className="mb-8 p-6 bg-white bg-opacity-60 rounded-xl border-2 border-current border-opacity-20">
                      <p className="text-xl font-bold opacity-75 mb-3">Coste de jugar:</p>
                      <p className="text-xl leading-relaxed">{formatCardText(def.cost, verySmall)}</p>
                    </div>
                  )}

                  <div className="text-2xl leading-relaxed whitespace-pre-wrap mb-8">
                    {formatCardText(def.text, verySmall)}
                  </div>

                  <div className="mt-10 pt-8 border-t-2 border-current border-opacity-20 flex gap-4">
                    <button
                      onClick={() => setSelectedCard(null)}
                      className="flex-1 px-8 py-5 bg-white bg-opacity-60 hover:bg-opacity-100 rounded-xl font-bold text-xl transition-colors border-2 border-current border-opacity-20"
                    >
                      Tancar
                    </button>
                    <button
                      onClick={() => {
                        handleDiscard(selectedCard)
                        setSelectedCard(null)
                      }}
                      className="flex-1 px-8 py-5 bg-red-500 text-white hover:bg-red-600 rounded-xl font-bold text-xl transition-colors shadow-lg"
                    >
                      Descartar
                    </button>
                  </div>
                </>
              )
            })()}
          </div>
        </div>
      )}

      {/* Modal de Nova Partida amb verificació matemàtica */}
      {showNewGameModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-8 max-w-md w-full">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">⚠️ Nova Partida</h3>
            <p className="text-gray-600 mb-6">
              Això reiniciarà el mazo i buidarà la teva mà. Per confirmar, resol aquesta suma:
            </p>

            <div className="bg-purple-50 rounded-lg p-6 mb-6 text-center">
              <p className="text-4xl font-bold text-purple-600 mb-4">
                {mathQuestion.num1} + {mathQuestion.num2} = ?
              </p>
              <input
                type="number"
                value={mathInput}
                onChange={(e) => setMathInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') confirmNewGame()
                }}
                placeholder="Resposta"
                className={`w-full px-4 py-3 text-xl text-center border-2 rounded-lg ${
                  mathError
                    ? 'border-red-500 bg-red-50'
                    : 'border-purple-300 focus:border-purple-500'
                } focus:outline-none`}
                autoFocus
              />
              {mathError && (
                <p className="text-red-600 text-sm mt-2 font-medium">
                  Resposta incorrecta. Torna-ho a intentar!
                </p>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowNewGameModal(false)
                  setMathError(false)
                }}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Cancel·lar
              </button>
              <button
                onClick={confirmNewGame}
                className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

