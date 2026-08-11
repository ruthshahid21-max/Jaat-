import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'

export const metadata: Metadata = {
  title: 'KidzSteam - Fun Games for Kids',
  description: 'Safe and fun gaming platform for kids aged 10-15',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-steam-dark">
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  )
}