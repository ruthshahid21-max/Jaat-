'use client'
import { useState, useCallback } from 'react'
import { RotateCcw, Crown } from 'lucide-react'

type PieceType = 'p' | 'r' | 'n' | 'b' | 'q' | 'k'
type Color = 'w' | 'b'
interface Piece { type: PieceType; color: Color }

const INITIAL_BOARD: (Piece | null)[][] = [
  [{type:'r',color:'b'},{type:'n',color:'b'},{type:'b',color:'b'},{type:'q',color:'b'},{type:'k',color:'b'},{type:'b',color:'b'},{type:'n',color:'b'},{type:'r',color:'b'}],
  Array(8).fill(null).map(() => ({type:'p',color:'b'} as Piece)),
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill(null).map(() => ({type:'p',color:'w'} as Piece)),
  [{type:'r',color:'w'},{type:'n',color:'w'},{type:'b',color:'w'},{type:'q',color:'w'},{type:'k',color:'w'},{type:'b',color:'w'},{type:'n',color:'w'},{type:'r',color:'w'}],
]

const PIECE_SYMBOLS: Record<string, string> = {
  'pw':'♙','rw':'♖','nw':'♘','bw':'♗','qw':'♕','kw':'♔',
  'pb':'♟','rb':'♜','nb':'♞','bb':'♝','qb':'♛','kb':'♚'
}

export default function ChessGame() {
  const [board, setBoard] = useState<(Piece | null)[][]>(JSON.parse(JSON.stringify(INITIAL_BOARD)))
  const [selected, setSelected] = useState<[number, number] | null>(null)
  const [turn, setTurn] = useState<Color>('w')
  const [message, setMessage] = useState("White's turn")
  const [captured, setCaptured] = useState<Piece[]>([])

  const isPathClear = (fromR: number, fromC: number, toR: number, toC: number, piece: Piece) => {
    if (piece.type === 'n') return true
    const dr = Math.sign(toR - fromR)
    const dc = Math.sign(toC - fromC)
    let r = fromR + dr, c = fromC + dc
    while (r !== toR || c !== toC) {
      if (board[r][c]) return false
      r += dr; c += dc
    }
    return true
  }

  const isValidMove = (fromR: number, fromC: number, toR: number, toC: number): boolean => {
    const piece = board[fromR][fromC]
    const target = board[toR][toC]
    if (!piece) return false
    if (target && target.color === piece.color) return false

    const dr = toR - fromR
    const dc = toC - fromC
    const absDr = Math.abs(dr)
    const absDc = Math.abs(dc)

    switch (piece.type) {
      case 'p':
        const dir = piece.color === 'w' ? -1 : 1
        const startRow = piece.color === 'w' ? 6 : 1
        if (dc === 0 && !target) {
          if (dr === dir) return true
          if (fromR === startRow && dr === dir * 2 && !board[fromR + dir][fromC]) return true
        }
        if (Math.abs(dc) === 1 && dr === dir && target) return true
        return false
      case 'r':
        return (dr === 0 || dc === 0) && isPathClear(fromR, fromC, toR, toC, piece)
      case 'b':
        return absDr === absDc && isPathClear(fromR, fromC, toR, toC, piece)
      case 'q':
        return (dr === 0 || dc === 0 || absDr === absDc) && isPathClear(fromR, fromC, toR, toC, piece)
      case 'n':
        return (absDr === 2 && absDc === 1) || (absDr === 1 && absDc === 2)
      case 'k':
        return absDr <= 1 && absDc <= 1
      default: return false
    }
  }

  const handleSquareClick = (row: number, col: number) => {
    if (selected) {
      const [sr, sc] = selected
      if (sr === row && sc === col) {
        setSelected(null)
        return
      }
      if (isValidMove(sr, sc, row, col)) {
        const newBoard = board.map(r => [...r])
        const movingPiece = newBoard[sr][sc]!
        const targetPiece = newBoard[row][col]

        if (targetPiece) {
          setCaptured(prev => [...prev, targetPiece])
          if (targetPiece.type === 'k') {
            setMessage(`${movingPiece.color === 'w' ? 'White' : 'Black'} wins! 👑`)
          }
        }

        newBoard[row][col] = movingPiece
        newBoard[sr][sc] = null
        setBoard(newBoard)
        setSelected(null)

        if (!targetPiece || targetPiece.type !== 'k') {
          const nextTurn = turn === 'w' ? 'b' : 'w'
          setTurn(nextTurn)
          setMessage(`${nextTurn === 'w' ? 'White' : 'Black'}'s turn`)
        }
      } else {
        setSelected(null)
      }
    } else {
      const piece = board[row][col]
      if (piece && piece.color === turn) {
        setSelected([row, col])
      }
    }
  }

  const reset = useCallback(() => {
    setBoard(JSON.parse(JSON.stringify(INITIAL_BOARD)))
    setSelected(null)
    setTurn('w')
    setMessage("White's turn")
    setCaptured([])
  }, [])

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-black text-steam-blue mb-2">Chess Academy</h1>
        <p className="text-steam-dim">Click a piece, then click where to move it. Capture the enemy King to win!</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6 items-start justify-center">
        <div className="steam-card p-4 rounded-xl">
          <div className="grid grid-cols-8 gap-0 border-2 border-steam-light">
            {board.map((row, r) => row.map((piece, c) => {
              const isDark = (r + c) % 2 === 1
              const isSelected = selected?.[0] === r && selected?.[1] === c
              return (
                <button
                  key={`${r}-${c}`}
                  onClick={() => handleSquareClick(r, c)}
                  className={`w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-2xl transition-all
                    ${isDark ? 'bg-[#b58863]' : 'bg-[#f0d9b5]'}
                    ${isSelected ? 'ring-2 ring-steam-blue z-10' : ''}
                    hover:brightness-110
                  `}
                >
                  {piece && <span className={piece.color === 'w' ? 'text-white drop-shadow-md' : 'text-black'}>
                    {PIECE_SYMBOLS[piece.type + piece.color]}
                  </span>}
                </button>
              )
            }))}
          </div>
        </div>

        <div className="steam-card rounded-xl p-6 w-full md:w-64">
          <div className="flex items-center gap-2 mb-4">
            <Crown className="w-5 h-5 text-yellow-400" />
            <h3 className="font-bold text-steam-text">Game Info</h3>
          </div>

          <div className="mb-4">
            <div className={`inline-block px-3 py-1 rounded-full text-sm font-bold mb-2
              ${turn === 'w' ? 'bg-white text-black' : 'bg-black text-white border border-steam-light'}`}>
              {message}
            </div>
          </div>

          {captured.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-bold text-steam-dim mb-2">Captured Pieces</h4>
              <div className="flex flex-wrap gap-1 text-lg">
                {captured.map((p, i) => (
                  <span key={i}>{PIECE_SYMBOLS[p.type + p.color]}</span>
                ))}
              </div>
            </div>
          )}

          <button onClick={reset} className="steam-btn w-full flex items-center justify-center gap-2">
            <RotateCcw className="w-4 h-4" /> New Game
          </button>
        </div>
      </div>
    </div>
  )
}