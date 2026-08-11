'use client'
import Link from 'next/link'
import { Star, Play } from 'lucide-react'

interface GameCardProps {
  title: string
  category: string
  rating: number
  color: string
  href: string
  description: string
}

export default function GameCard({ title, category, rating, color, href, description }: GameCardProps) {
  return (
    <div className="steam-card rounded-lg overflow-hidden group">
      <div className={`h-40 ${color} relative flex items-center justify-center`}>
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
        <span className="text-4xl font-black text-white/90 drop-shadow-lg">{title[0]}</span>
        <div className="absolute top-2 right-2 bg-black/60 px-2 py-1 rounded text-xs font-bold text-steam-blue">
          {category}
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold text-steam-text mb-1">{title}</h3>
        <p className="text-sm text-steam-dim mb-3 line-clamp-2">{description}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-steam-light'}`} />
            ))}
          </div>
          <Link href={href} className="steam-btn text-sm flex items-center gap-1">
            <Play className="w-3 h-3 fill-current" /> Play
          </Link>
        </div>
      </div>
    </div>
  )
}