'use client'
import { useEffect, useRef, useState, useCallback } from 'react'
import { Heart, Trophy, RotateCcw } from 'lucide-react'

interface Entity {
  x: number
  y: number
  width: number
  height: number
  speed: number
}

interface Bullet extends Entity {}
interface Enemy extends Entity {
  hp: number
}
interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  color: string
}

export default function SpaceShooter() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(3)
  const [gameOver, setGameOver] = useState(false)
  const [started, setStarted] = useState(false)

  const gameState = useRef({
    player: { x: 375, y: 520, width: 40, height: 40 },
    bullets: [] as Bullet[],
    enemies: [] as Enemy[],
    particles: [] as Particle[],
    keys: {} as Record<string, boolean>,
    lastShot: 0,
    enemyTimer: 0,
    score: 0,
    lives: 3,
    animId: 0
  })

  const resetGame = useCallback(() => {
    const state = gameState.current
    state.player = { x: 375, y: 520, width: 40, height: 40 }
    state.bullets = []
    state.enemies = []
    state.particles = []
    state.score = 0
    state.lives = 3
    state.enemyTimer = 0
    setScore(0)
    setLives(3)
    setGameOver(false)
    setStarted(true)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const state = gameState.current

    const handleKey = (e: KeyboardEvent, down: boolean) => {
      state.keys[e.key] = down
      if (e.key === ' ' && down) e.preventDefault()
    }
    window.addEventListener('keydown', (e) => handleKey(e, true))
    window.addEventListener('keyup', (e) => handleKey(e, false))

    const createParticles = (x: number, y: number, color: string) => {
      for (let i = 0; i < 8; i++) {
        state.particles.push({
          x, y,
          vx: (Math.random() - 0.5) * 6,
          vy: (Math.random() - 0.5) * 6,
          life: 30,
          color
        })
      }
    }

    const gameLoop = (time: number) => {
      if (!started || gameOver) {
        state.animId = requestAnimationFrame(gameLoop)
        return
      }

      ctx.fillStyle = '#0a0e1a'
      ctx.fillRect(0, 0, 800, 600)

      for (let i = 0; i < 50; i++) {
        const sx = (i * 73 + time * 0.01) % 800
        const sy = (i * 37) % 600
        ctx.fillStyle = `rgba(255,255,255,${0.3 + (i % 3) * 0.2})`
        ctx.fillRect(sx, sy, 2, 2)
      }

      if (state.keys['ArrowLeft'] && state.player.x > 0) state.player.x -= 5
      if (state.keys['ArrowRight'] && state.player.x < 760) state.player.x += 5
      if (state.keys['ArrowUp'] && state.player.y > 0) state.player.y -= 5
      if (state.keys['ArrowDown'] && state.player.y < 560) state.player.y += 5

      if (state.keys[' '] && time - state.lastShot > 250) {
        state.bullets.push({
          x: state.player.x + 18,
          y: state.player.y,
          width: 4,
          height: 12,
          speed: 8
        })
        state.lastShot = time
      }

      state.enemyTimer++
      if (state.enemyTimer > 60) {
        state.enemies.push({
          x: Math.random() * 760,
          y: -30,
          width: 35,
          height: 35,
          speed: 2 + Math.random() * 2,
          hp: 1
        })
        state.enemyTimer = 0
      }

      state.bullets = state.bullets.filter(b => {
        b.y -= b.speed
        return b.y > -20
      })

      state.enemies = state.enemies.filter(e => {
        e.y += e.speed
        if (e.y > 600) {
          state.lives--
          setLives(state.lives)
          if (state.lives <= 0) setGameOver(true)
          return false
        }
        return true
      })

      state.bullets.forEach((b, bi) => {
        state.enemies.forEach((e, ei) => {
          if (b.x < e.x + e.width && b.x + b.width > e.x &&
              b.y < e.y + e.height && b.y + b.height > e.y) {
            state.bullets.splice(bi, 1)
            state.enemies.splice(ei, 1)
            state.score += 10
            setScore(state.score)
            createParticles(e.x + e.width/2, e.y + e.height/2, '#66c0f4')
          }
        })
      })

      state.enemies.forEach((e, ei) => {
        if (e.x < state.player.x + state.player.width && e.x + e.width > state.player.x &&
            e.y < state.player.y + state.player.height && e.y + e.height > state.player.y) {
          state.enemies.splice(ei, 1)
          state.lives--
          setLives(state.lives)
          createParticles(state.player.x + 20, state.player.y + 20, '#ff4444')
          if (state.lives <= 0) setGameOver(true)
        }
      })

      ctx.fillStyle = '#66c0f4'
      ctx.beginPath()
      ctx.moveTo(state.player.x + 20, state.player.y)
      ctx.lineTo(state.player.x, state.player.y + 40)
      ctx.lineTo(state.player.x + 40, state.player.y + 40)
      ctx.closePath()
      ctx.fill()

      ctx.fillStyle = '#8fd1f7'
      state.bullets.forEach(b => ctx.fillRect(b.x, b.y, b.width, b.height))

      state.enemies.forEach(e => {
        ctx.fillStyle = '#e74c3c'
        ctx.fillRect(e.x, e.y, e.width, e.height)
        ctx.fillStyle = '#c0392b'
        ctx.fillRect(e.x + 8, e.y + 8, 6, 6)
        ctx.fillRect(e.x + 21, e.y + 8, 6, 6)
      })

      state.particles = state.particles.filter(p => {
        p.x += p.vx
        p.y += p.vy
        p.life--
        ctx.fillStyle = p.color
        ctx.globalAlpha = p.life / 30
        ctx.fillRect(p.x, p.y, 4, 4)
        ctx.globalAlpha = 1
        return p.life > 0
      })

      state.animId = requestAnimationFrame(gameLoop)
    }

    state.animId = requestAnimationFrame(gameLoop)
    return () => cancelAnimationFrame(state.animId)
  }, [started, gameOver])

  return (
    <div className="max-w-4xl mx-auto text-center">
      <h1 className="text-3xl font-black text-steam-blue mb-2">Space Defender</h1>
      <p className="text-steam-dim mb-6">Use Arrow Keys to move • Spacebar to shoot</p>

      <div className="flex justify-center gap-8 mb-4">
        <div className="flex items-center gap-2 text-steam-text">
          <Trophy className="w-5 h-5 text-yellow-400" /> Score: {score}
        </div>
        <div className="flex items-center gap-2 text-steam-text">
          <Heart className="w-5 h-5 text-red-400" /> Lives: {lives}
        </div>
      </div>

      <div className="relative inline-block">
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          className="border-2 border-steam-light rounded-lg bg-steam-dark max-w-full"
        />
        {!started && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 rounded-lg">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Defend?</h2>
            <button onClick={resetGame} className="steam-btn text-lg">Start Game</button>
          </div>
        )}
        {gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 rounded-lg">
            <h2 className="text-3xl font-bold text-red-400 mb-2">Game Over</h2>
            <p className="text-xl text-white mb-4">Final Score: {score}</p>
            <button onClick={resetGame} className="steam-btn inline-flex items-center gap-2">
              <RotateCcw className="w-4 h-4" /> Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  )
}