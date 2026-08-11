'use client'
import Link from 'next/link'
import { Gamepad2, Home, Trophy, User } from 'lucide-react'

export default function Navbar() {
  return (
    <nav className="bg-steam-card border-b border-steam-light sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <Gamepad2 className="w-8 h-8 text-steam-blue group-hover:scale-110 transition-transform" />
          <span className="text-2xl font-bold text-steam-blue tracking-tight">KidzSteam</span>
        </Link>

        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 text-steam-text hover:text-steam-blue transition-colors">
            <Home className="w-4 h-4" />
            <span className="hidden sm:inline">Store</span>
          </Link>
          <Link href="/" className="flex items-center gap-2 text-steam-text hover:text-steam-blue transition-colors">
            <Trophy className="w-4 h-4" />
            <span className="hidden sm:inline">Library</span>
          </Link>
          <div className="flex items-center gap-2 bg-steam-light px-3 py-1.5 rounded">
            <User className="w-4 h-4 text-steam-blue" />
            <span className="text-sm font-medium">Player 1</span>
          </div>
        </div>
      </div>
    </nav>
  )
}