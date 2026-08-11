'use client'
import { useState, useEffect, useCallback } from 'react'
import { Shuffle, Check, X, RotateCcw, Lightbulb } from 'lucide-react'

const CATEGORIES = {
  Animals: ['elephant', 'giraffe', 'penguin', 'dolphin', 'tiger', 'butterfly', 'kangaroo', 'octopus'],
  Countries: ['australia', 'brazil', 'canada', 'denmark', 'egypt', 'finland', 'germany', 'hawaii'],
  Space: ['asteroid', 'nebula', 'galaxy', 'comet', 'satellite', 'telescope', 'gravity', 'orbit']
}

type Category = keyof typeof CATEGORIES

export default function Wordplay() {
  const [category, setCategory] = useState<Category>('Animals')
  const [currentWord, setCurrentWord] = useState('')
  const [scrambled, setScrambled] = useState('')
  const [input, setInput] = useState('')
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [usedWords, setUsedWords] = useState<string[]>([])
  const [feedback, setFeedback] = useState<'idle' | 'correct' | 'wrong'>('idle')
  const [showHint, setShowHint] = useState(false)

  const scramble = (word: string) => {
    const arr = word.split('')
    let shuffled
    do {
      shuffled = [...arr].sort(() => Math.random() - 0.5)
    } while (shuffled.join('') === word && word.length > 1)
    return shuffled.join('')
  }

  const nextWord = useCallback(() => {
    const words = CATEGORIES[category].filter(w => !usedWords.includes(w))
    if (words.length === 0) {
      setUsedWords([])
      const newWord = CATEGORIES[category][Math.floor(Math.random() * CATEGORIES[category].length)]
      setCurrentWord(newWord)
      setScrambled(scramble(newWord))
    } else {
      const newWord = words[Math.floor(Math.random() * words.length)]
      setCurrentWord(newWord)
      setScrambled(scramble(newWord))
    }
    setInput('')
    setFeedback('idle')
    setShowHint(false)
  }, [category, usedWords])

  useEffect(() => { nextWord() }, [nextWord])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    if (input.toLowerCase() === currentWord) {
      setScore(s => s + 10 + streak * 2)
      setStreak(s => s + 1)
      setFeedback('correct')
      setUsedWords(prev => [...prev, currentWord])
      setTimeout(nextWord, 1200)
    } else {
      setStreak(0)
      setFeedback('wrong')
      setTimeout(() => setFeedback('idle'), 1000)
    }
  }

  const changeCategory = (cat: Category) => {
    setCategory(cat)
    setUsedWords([])
    setScore(0)
    setStreak(0)
  }

  return (
    <div className="max-w-2xl mx-auto text-center">
      <h1 className="text-3xl font-black text-steam-blue mb-2">Word Scramble</h1>
      <p className="text-steam-dim mb-8">Unscramble the letters to find the hidden word!</p>

      <div className="flex justify-center gap-2 mb-6">
        {(Object.keys(CATEGORIES) as Category[]).map(cat => (
          <button
            key={cat}
            onClick={() => changeCategory(cat)}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all
              ${category === cat ? 'bg-steam-blue text-steam-dark' : 'bg-steam-light text-steam-text hover:bg-steam-blue/20'}
            `}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="steam-card rounded-xl p-8 mb-6">
        <div className="flex justify-center gap-6 mb-6 text-sm">
          <div className="text-steam-text"><span className="text-steam-blue font-bold text-xl">{score}</span> Points</div>
          <div className="text-steam-text"><span className="text-yellow-400 font-bold text-xl">{streak}</span> Streak</div>
        </div>

        <div className="mb-2">
          <div className="flex items-center justify-center gap-3 text-4xl sm:text-5xl font-black tracking-widest text-white mb-4">
            {scrambled.split('').map((char, i) => (
              <span key={i} className="inline-block w-12 h-14 sm:w-14 sm:h-16 bg-steam-light rounded-lg flex items-center justify-center border border-steam-blue/30">
                {char.toUpperCase()}
              </span>
            ))}
          </div>
        </div>

        {showHint && (
          <div className="text-steam-blue text-sm mb-4 flex items-center justify-center gap-2">
            <Lightbulb className="w-4 h-4" /> 
            Starts with <strong>{currentWord[0].toUpperCase()}</strong> • {currentWord.length} letters
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex gap-3 justify-center mb-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={feedback === 'correct'}
            className={`bg-steam-dark border-2 rounded-lg px-4 py-3 text-xl text-center uppercase tracking-widest w-64 focus:outline-none transition-colors
              ${feedback === 'correct' ? 'border-emerald-500 text-emerald-400' : 
                feedback === 'wrong' ? 'border-red-500 text-red-400' : 'border-steam-light focus:border-steam-blue text-white'}
            `}
            placeholder="TYPE HERE"
            maxLength={currentWord.length}
          />
        </form>

        <div className="flex justify-center gap-3">
          <button 
            onClick={() => setShowHint(true)} 
            disabled={showHint}
            className="px-4 py-2 bg-steam-light rounded-lg text-sm font-bold text-steam-text hover:bg-steam-blue/20 disabled:opacity-50"
          >
            Hint (-3 pts)
          </button>
          <button 
            onClick={() => { setScore(s => Math.max(0, s - 5)); nextWord(); }}
            className="px-4 py-2 bg-steam-light rounded-lg text-sm font-bold text-steam-text hover:bg-steam-blue/20 flex items-center gap-2"
          >
            <Shuffle className="w-4 h-4" /> Skip
          </button>
        </div>

        {feedback === 'correct' && (
          <div className="mt-4 flex items-center justify-center gap-2 text-emerald-400 font-bold text-lg">
            <Check className="w-6 h-6" /> Correct! +{10 + (streak - 1) * 2} points
          </div>
        )}
        {feedback === 'wrong' && (
          <div className="mt-4 flex items-center justify-center gap-2 text-red-400 font-bold">
            <X className="w-5 h-5" /> Try again!
          </div>
        )}
      </div>

      <button onClick={() => { setScore(0); setStreak(0); setUsedWords([]); nextWord(); }} 
        className="text-steam-dim hover:text-steam-text flex items-center gap-2 mx-auto">
        <RotateCcw className="w-4 h-4" /> Reset Game
      </button>
    </div>
  )
}