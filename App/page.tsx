import GameCard from '@/components/GameCard'
import { Zap, Target, Brain, Keyboard } from 'lucide-react'

const games = [
  {
    title: 'Typing Master',
    category: 'Education',
    rating: 5,
    color: 'bg-gradient-to-br from-emerald-600 to-teal-800',
    href: '/games/typing-master',
    description: 'Race against the clock to improve your typing speed and accuracy!'
  },
  {
    title: 'Space Defender',
    category: 'Action',
    rating: 4,
    color: 'bg-gradient-to-br from-purple-600 to-indigo-900',
    href: '/games/space-shooter',
    description: 'Defend Earth from alien invaders in this classic arcade shooter!'
  },
  {
    title: 'Chess Academy',
    category: 'Strategy',
    rating: 5,
    color: 'bg-gradient-to-br from-amber-700 to-orange-900',
    href: '/games/chess',
    description: 'Learn and play chess with friends. Capture the enemy king to win!'
  },
  {
    title: 'Word Scramble',
    category: 'Puzzle',
    rating: 4,
    color: 'bg-gradient-to-br from-rose-600 to-pink-800',
    href: '/games/wordplay',
    description: 'Unscramble letters to find hidden words across different categories!'
  }
]

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="relative rounded-xl overflow-hidden mb-10 bg-gradient-to-r from-steam-light to-steam-card border border-steam-light">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMSIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIvPjwvc3ZnPg==')] opacity-30" />
        <div className="relative px-8 py-12 md:py-16">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
            Welcome to <span className="text-steam-blue">KidzSteam</span>
          </h1>
          <p className="text-lg text-steam-dim max-w-2xl mb-6">
            A safe gaming platform designed for kids aged 10-15. Play, learn, and compete in our collection of browser-based games. No downloads required!
          </p>
          <div className="flex gap-4 text-sm">
            <div className="flex items-center gap-2 text-steam-blue">
              <Keyboard className="w-4 h-4" /> Learn Skills
            </div>
            <div className="flex items-center gap-2 text-steam-blue">
              <Target className="w-4 h-4" /> Challenge Friends
            </div>
            <div className="flex items-center gap-2 text-steam-blue">
              <Brain className="w-4 h-4" /> Train Your Brain
            </div>
            <div className="flex items-center gap-2 text-steam-blue">
              <Zap className="w-4 h-4" /> Quick Play
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-steam-text">Featured Games</h2>
        <span className="text-sm text-steam-dim">4 games available</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {games.map((game) => (
          <GameCard key={game.title} {...game} />
        ))}
      </div>
    </div>
  )
}