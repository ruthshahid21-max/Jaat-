import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function GameLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <Link href="/" className="inline-flex items-center gap-2 text-steam-dim hover:text-steam-blue transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" />
        Back to Store
      </Link>
      {children}
    </div>
  )
}