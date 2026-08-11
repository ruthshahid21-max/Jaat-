'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import { Timer, Target, Zap, RotateCcw } from 'lucide-react'

const WORDS = [
  'adventure', 'galaxy', 'dragon', 'puzzle', 'wizard', 'castle', 'robot', 'planet',
  'rocket', 'treasure', 'mystery', 'ocean', 'forest', 'crystal', 'phoenix', 'knight',
  'diamond', 'thunder', 'rainbow', 'shadow', 'falcon', 'bridge', 'tower', 'shield',
  'compass', 'lantern', 'harmony', 'cascade', 'horizon', 'journey', 'miracle', 'nebula'
]

export default function TypingMaster() {
  const [words, setWords] = useState<string[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [input, setInput] = useState('')
  const [timeLeft, setTimeLeft] = useState(60)
  const [isActive, setIsActive] = useState(false)
  const [isFinished, setIsFinished] = useState(false)
  const [correctChars, setCorrectChars] = useState(0)
  const [totalChars, setTotalChars] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const initGame = useCallback(() => {
    const shuffled = [...WORDS].sort(() => Math.random() - 0.5).slice(0, 20)
    setWords(shuffled)
    setCurrentIndex(0)
    setInput('')
    setTimeLeft(60)
    setIsActive(false)
    setIsFinished(false)
    setCorrectChars(0)
    setTotalChars(0)
    setTimeout(() => inputRef.current?.focus(), 100)
  }, [])

  useEffect(() => { initGame() }, [initGame])

  useEffect(() => {
    if (!isActive || isFinished) return
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsFinished(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [isActive, isFinished])

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isFinished) return
    if (!isActive && e.target.value.length > 0) setIsActive(true)

    const val = e.target.value
    const currentWord = words[currentIndex]

    if (val.endsWith(' ')) {
      const typed = val.trim()
      if (typed === currentWord) {
        setCorrectChars((prev) => prev + currentWord.length)
      }
      setTotalChars((prev) => prev + currentWord.length)
      setCurrentIndex((prev) => prev + 1)
      setInput('')
      if (currentIndex >= words.length - 1) {
        setIsFinished(true)
      }
    } else {
      setInput(val)
    }
  }

  const wpm = isFinished || timeLeft < 60 ? Math.round((correctChars / 5) / ((60 - timeLeft) / 60)) : 0
  const accuracy = totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 0

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-black text-steam-blue mb-2">Typing Master</h1>
        <p className="text-steam-dim">Type the words as fast and accurately as you can!</p>
      </div>

      <div className="steam-card rounded-xl p-8 mb-6">
        <div className="flex justify-center gap-8 mb-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 text-steam-dim mb-1">
              <Timer className="w-4 h-4" /> Time
            </div>
            <div className="text-3xl font-bold text-white">{timeLeft}s</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 text-steam-dim mb-1">
              <Zap className="w-4 h-4" /> WPM
            </div>
            <div className="text-3xl font-bold text-steam-blue">{wpm || 0}</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 text-steam-dim mb-1">
              <Target className="w-4 h-4" /> Accuracy
            </div>
            <div className="text-3xl font-bold text-emerald-400">{accuracy}%</div>
          </div>
        </div>

        <div className="bg-steam-dark rounded-lg p-6 mb-6 min-h-[120px] flex flex-wrap gap-3 items-center justify-center text-xl leading-relaxed">
          {words.map((word, i) => (
            <span key={i} className={
              i < currentIndex ? 'text-emerald-400' :
              i === currentIndex ? 'text-white bg-steam-light px-2 py-1 rounded' :
              'text-steam-dim'
            }>
              {word}
            </span>
          ))}
        </div>

        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={handleInput}
          disabled={isFinished}
          className="w-full bg-steam-dark border-2 border-steam-light rounded-lg px-4 py-3 text-xl text-center text-white placeholder-steam-dim focus:border-steam-blue focus:outline-none disabled:opacity-50"
          placeholder={isFinished ? "Game Over!" : "Start typing..."}
        />

        {isFinished && (
          <div className="mt-6 text-center">
            <div className="text-2xl font-bold text-white mb-4">
              {wpm > 40 ? '🏆 Amazing!' : wpm > 25 ? '⭐ Great Job!' : '💪 Keep Practicing!'}
            </div>
            <button onClick={initGame} className="steam-btn inline-flex items-center gap-2">
              <RotateCcw className="w-4 h-4" /> Play Again
            </button>
          </div>
        )}
      </div>
    </div>
  )
}