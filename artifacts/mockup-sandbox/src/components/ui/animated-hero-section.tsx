import { useEffect, useRef } from "react"

const COLOR = "#FFFFFF"
const HIT_COLOR = "#333333"
const BACKGROUND_COLOR = "#000000"
const BALL_COLOR = "#FFFFFF"
const PADDLE_COLOR = "#FFFFFF"
const LETTER_SPACING = 1
const WORD_SPACING = 3

const PIXEL_MAP: Record<string, number[][]> = {
  P: [[1,1,1,1],[1,0,0,1],[1,1,1,1],[1,0,0,0],[1,0,0,0]],
  R: [[1,1,1,1],[1,0,0,1],[1,1,1,1],[1,0,1,0],[1,0,0,1]],
  O: [[1,1,1,1],[1,0,0,1],[1,0,0,1],[1,0,0,1],[1,1,1,1]],
  M: [[1,0,0,0,1],[1,1,0,1,1],[1,0,1,0,1],[1,0,0,0,1],[1,0,0,0,1]],
  T: [[1,1,1,1,1],[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0]],
  I: [[1,1,1],[0,1,0],[0,1,0],[0,1,0],[1,1,1]],
  N: [[1,0,0,0,1],[1,1,0,0,1],[1,0,1,0,1],[1,0,0,1,1],[1,0,0,0,1]],
  G: [[1,1,1,1,1],[1,0,0,0,0],[1,0,1,1,1],[1,0,0,0,1],[1,1,1,1,1]],
  S: [[1,1,1,1],[1,0,0,0],[1,1,1,1],[0,0,0,1],[1,1,1,1]],
  A: [[0,1,1,0],[1,0,0,1],[1,1,1,1],[1,0,0,1],[1,0,0,1]],
  L: [[1,0,0,0],[1,0,0,0],[1,0,0,0],[1,0,0,0],[1,1,1,1]],
  Y: [[1,0,0,0,1],[0,1,0,1,0],[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0]],
  U: [[1,0,0,1],[1,0,0,1],[1,0,0,1],[1,0,0,1],[1,1,1,1]],
  D: [[1,1,1,0],[1,0,0,1],[1,0,0,1],[1,0,0,1],[1,1,1,0]],
  E: [[1,1,1,1],[1,0,0,0],[1,1,1,1],[1,0,0,0],[1,1,1,1]],
  "7": [[1,1,1,1],[0,0,0,1],[0,0,1,0],[0,1,0,0],[0,1,0,0]],
  X: [[1,0,0,0,1],[0,1,0,1,0],[0,0,1,0,0],[0,1,0,1,0],[1,0,0,0,1]],
  F: [[1,1,1,1],[1,0,0,0],[1,1,1,0],[1,0,0,0],[1,0,0,0]],
  V: [[1,0,0,0,1],[1,0,0,0,1],[0,1,0,1,0],[0,1,0,1,0],[0,0,1,0,0]],
  "3": [[1,1,1,1],[0,0,0,1],[0,1,1,1],[0,0,0,1],[1,1,1,1]],
  "<": [[0,0,1],[0,1,0],[1,0,0],[0,1,0],[0,0,1]],
}

interface Pixel { x: number; y: number; size: number; hit: boolean; opacity: number }
interface Ball { x: number; y: number; dx: number; dy: number; radius: number; trail: {x: number; y: number}[] }
interface Paddle { x: number; y: number; width: number; height: number; targetY: number; isVertical: boolean }

export function PromptingIsAllYouNeed() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pixelsRef = useRef<Pixel[]>([])
  const ballsRef = useRef<Ball[]>([])
  const paddlesRef = useRef<Paddle[]>([])
  const scaleRef = useRef(1)
  const startedRef = useRef(false)
  const gameStartTimeRef = useRef(0)
  const hitCountRef = useRef(0)
  const totalPixelsRef = useRef(0)
  const baseBallSpeedRef = useRef(6)
  const secondBallSpawnedRef = useRef(false)
  const audioCtxRef = useRef<AudioContext | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const playBeep = (freq: number) => {
      try {
        if (!audioCtxRef.current) audioCtxRef.current = new AudioContext()
        const ac = audioCtxRef.current
        const osc = ac.createOscillator()
        const gain = ac.createGain()
        osc.connect(gain)
        gain.connect(ac.destination)
        osc.type = "square"
        osc.frequency.value = freq
        gain.gain.setValueAtTime(0.08, ac.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.06)
        osc.start(ac.currentTime)
        osc.stop(ac.currentTime + 0.06)
      } catch { /* silent */ }
    }

    const initializeGame = () => {
      const scale = scaleRef.current
      const LARGE_PIXEL_SIZE = 8 * scale
      const SMALL_PIXEL_SIZE = 4 * scale
      const BALL_SPEED = 6 * scale
      baseBallSpeedRef.current = BALL_SPEED
      hitCountRef.current = 0
      secondBallSpawnedRef.current = false
      pixelsRef.current = []

      const words = ["Y7XIFIED", "FOREVER <3"]

      const calcWidth = (word: string, ps: number) =>
        word.split("").reduce((w, l) => w + (PIXEL_MAP[l]?.[0]?.length ?? 0) * ps + LETTER_SPACING * ps, 0) - LETTER_SPACING * ps

      const totalWidthLarge = calcWidth(words[0], LARGE_PIXEL_SIZE)
      const totalWidthSmall = words[1].split(" ").reduce((w, word, i) =>
        w + calcWidth(word, SMALL_PIXEL_SIZE) + (i > 0 ? WORD_SPACING * SMALL_PIXEL_SIZE : 0), 0)
      const totalWidth = Math.max(totalWidthLarge, totalWidthSmall)
      const sf = (canvas.width * 0.8) / totalWidth

      const aLarge = LARGE_PIXEL_SIZE * sf
      const aSmall = SMALL_PIXEL_SIZE * sf

      const largeH = 5 * aLarge
      const smallH = 5 * aSmall
      const gap = 5 * aLarge
      const totalH = largeH + gap + smallH
      let startY = (canvas.height - totalH) / 2

      words.forEach((word, wi) => {
        const ps = wi === 0 ? aLarge : aSmall
        const tw = wi === 0
          ? calcWidth(word, aLarge)
          : words[1].split(" ").reduce((w, sw, i) => w + calcWidth(sw, aSmall) + (i > 0 ? WORD_SPACING * aSmall : 0), 0)
        let startX = (canvas.width - tw) / 2

        if (wi === 1) {
          word.split(" ").forEach(subWord => {
            subWord.split("").forEach(letter => {
              const pm = PIXEL_MAP[letter]; if (!pm) return
              for (let i = 0; i < pm.length; i++)
                for (let j = 0; j < pm[i].length; j++)
                  if (pm[i][j]) pixelsRef.current.push({ x: startX + j * ps, y: startY + i * ps, size: ps, hit: false, opacity: 0 })
              startX += (pm[0].length + LETTER_SPACING) * ps
            })
            startX += WORD_SPACING * aSmall
          })
        } else {
          word.split("").forEach(letter => {
            const pm = PIXEL_MAP[letter]; if (!pm) return
            for (let i = 0; i < pm.length; i++)
              for (let j = 0; j < pm[i].length; j++)
                if (pm[i][j]) pixelsRef.current.push({ x: startX + j * ps, y: startY + i * ps, size: ps, hit: false, opacity: 0 })
            startX += (pm[0].length + LETTER_SPACING) * ps
          })
        }
        startY += wi === 0 ? largeH + gap : 0
      })

      totalPixelsRef.current = pixelsRef.current.length

      const paddleWidth = aLarge
      const paddleLength = 6 * aLarge

      ballsRef.current = [{
        x: canvas.width * 0.9,
        y: canvas.height * 0.1,
        dx: -BALL_SPEED,
        dy: BALL_SPEED,
        radius: aLarge / 2,
        trail: [],
      }]

      paddlesRef.current = [
        { x: 0, y: canvas.height / 2 - paddleLength / 2, width: paddleWidth, height: paddleLength, targetY: canvas.height / 2 - paddleLength / 2, isVertical: true },
        { x: canvas.width - paddleWidth, y: canvas.height / 2 - paddleLength / 2, width: paddleWidth, height: paddleLength, targetY: canvas.height / 2 - paddleLength / 2, isVertical: true },
        { x: canvas.width / 2 - paddleLength / 2, y: 0, width: paddleLength, height: paddleWidth, targetY: canvas.width / 2 - paddleLength / 2, isVertical: false },
        { x: canvas.width / 2 - paddleLength / 2, y: canvas.height - paddleWidth, width: paddleLength, height: paddleWidth, targetY: canvas.width / 2 - paddleLength / 2, isVertical: false },
      ]
    }

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      scaleRef.current = Math.min(canvas.width / 1000, canvas.height / 1000)
      initializeGame()
    }

    const updateGame = () => {
      if (!startedRef.current) return

      const elapsed = Date.now() - gameStartTimeRef.current
      const speedMult = Math.min(1 + (elapsed / 60000) * 0.6, 2.2)

      // Spawn second ball after 10s
      if (elapsed > 10000 && !secondBallSpawnedRef.current) {
        secondBallSpawnedRef.current = true
        const sp = baseBallSpeedRef.current
        ballsRef.current.push({
          x: canvas.width * 0.1,
          y: canvas.height * 0.85,
          dx: sp,
          dy: -sp * 0.8,
          radius: ballsRef.current[0].radius,
          trail: [],
        })
      }

      ballsRef.current.forEach(ball => {
        // Trail
        ball.trail.push({ x: ball.x, y: ball.y })
        if (ball.trail.length > 12) ball.trail.shift()

        // Move
        ball.x += ball.dx * speedMult
        ball.y += ball.dy * speedMult

        // Wall bounce
        if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) ball.dy = -ball.dy
        if (ball.x - ball.radius < 0 || ball.x + ball.radius > canvas.width) ball.dx = -ball.dx

        // Paddle collision
        paddlesRef.current.forEach(paddle => {
          if (paddle.isVertical) {
            if (ball.x - ball.radius < paddle.x + paddle.width && ball.x + ball.radius > paddle.x && ball.y > paddle.y && ball.y < paddle.y + paddle.height)
              ball.dx = -ball.dx
          } else {
            if (ball.y - ball.radius < paddle.y + paddle.height && ball.y + ball.radius > paddle.y && ball.x > paddle.x && ball.x < paddle.x + paddle.width)
              ball.dy = -ball.dy
          }
        })

        // Pixel collision
        pixelsRef.current.forEach(pixel => {
          if (!pixel.hit && ball.x + ball.radius > pixel.x && ball.x - ball.radius < pixel.x + pixel.size && ball.y + ball.radius > pixel.y && ball.y - ball.radius < pixel.y + pixel.size) {
            pixel.hit = true
            pixel.opacity = 1.0
            hitCountRef.current++
            playBeep(180 + Math.random() * 500)
            const cx = pixel.x + pixel.size / 2, cy = pixel.y + pixel.size / 2
            if (Math.abs(ball.x - cx) > Math.abs(ball.y - cy)) ball.dx = -ball.dx
            else ball.dy = -ball.dy
          }
        })
      })

      // Fade hit pixels
      pixelsRef.current.forEach(pixel => {
        if (pixel.hit) pixel.opacity = Math.max(0, pixel.opacity - 0.018)
      })

      // Update paddles (track primary ball)
      const pb = ballsRef.current[0]
      paddlesRef.current.forEach(paddle => {
        if (paddle.isVertical) {
          paddle.targetY = pb.y - paddle.height / 2
          paddle.targetY = Math.max(0, Math.min(canvas.height - paddle.height, paddle.targetY))
          paddle.y += (paddle.targetY - paddle.y) * 0.22
        } else {
          paddle.targetY = pb.x - paddle.width / 2
          paddle.targetY = Math.max(0, Math.min(canvas.width - paddle.width, paddle.targetY))
          paddle.x += (paddle.targetY - paddle.x) * 0.22
        }
      })

      // Loop when all pixels fully faded
      const allFaded = pixelsRef.current.length > 0 && pixelsRef.current.every(p => p.hit && p.opacity <= 0)
      if (allFaded) {
        pixelsRef.current.forEach(p => { p.hit = false; p.opacity = 0 })
        hitCountRef.current = 0
        secondBallSpawnedRef.current = false
        if (ballsRef.current.length > 1) ballsRef.current.splice(1)
      }
    }

    const drawGame = () => {
      ctx.fillStyle = BACKGROUND_COLOR
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Pixels
      pixelsRef.current.forEach(pixel => {
        if (pixel.hit) {
          if (pixel.opacity <= 0) return
          ctx.globalAlpha = pixel.opacity
          ctx.fillStyle = HIT_COLOR
        } else {
          ctx.globalAlpha = 1
          ctx.fillStyle = COLOR
        }
        ctx.fillRect(pixel.x, pixel.y, pixel.size, pixel.size)
      })
      ctx.globalAlpha = 1

      // Trails
      ballsRef.current.forEach(ball => {
        ball.trail.forEach((pos, i) => {
          ctx.globalAlpha = (i / ball.trail.length) * 0.35
          ctx.fillStyle = BALL_COLOR
          ctx.beginPath()
          ctx.arc(pos.x, pos.y, ball.radius * 0.65, 0, Math.PI * 2)
          ctx.fill()
        })
      })
      ctx.globalAlpha = 1

      // Balls
      ballsRef.current.forEach(ball => {
        ctx.fillStyle = BALL_COLOR
        ctx.beginPath()
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2)
        ctx.fill()
      })

      // Paddles
      ctx.fillStyle = PADDLE_COLOR
      paddlesRef.current.forEach(p => ctx.fillRect(p.x, p.y, p.width, p.height))

      // Hit counter
      const fs = Math.max(11, 12 * scaleRef.current)
      ctx.globalAlpha = 0.45
      ctx.fillStyle = "#FFFFFF"
      ctx.font = `${fs}px monospace`
      ctx.textAlign = "right"
      ctx.fillText(`${hitCountRef.current} / ${totalPixelsRef.current}`, canvas.width - 16, canvas.height - 16)
      ctx.globalAlpha = 1

      // Press any key prompt
      if (!startedRef.current) {
        const t = Date.now() / 1000
        ctx.globalAlpha = 0.5 + 0.4 * Math.sin(t * 2.5)
        ctx.fillStyle = "#FFFFFF"
        ctx.font = `${Math.max(12, 13 * scaleRef.current)}px monospace`
        ctx.textAlign = "center"
        ctx.fillText("CLICK OR PRESS ANY KEY TO START", canvas.width / 2, canvas.height - 36)
        ctx.globalAlpha = 1
      }
    }

    const handleStart = () => {
      if (!startedRef.current) {
        startedRef.current = true
        gameStartTimeRef.current = Date.now()
        // Unlock AudioContext on user gesture
        try { audioCtxRef.current = new AudioContext() } catch { /* silent */ }
      }
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)
    window.addEventListener("keydown", handleStart)
    canvas.addEventListener("click", handleStart)

    let animFrameId: number
    const gameLoop = () => {
      updateGame()
      drawGame()
      animFrameId = requestAnimationFrame(gameLoop)
    }
    gameLoop()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      window.removeEventListener("keydown", handleStart)
      canvas.removeEventListener("click", handleStart)
      cancelAnimationFrame(animFrameId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="block w-full cursor-pointer"
      style={{ height: "100vh", display: "block" }}
      aria-label="Y7XIFIED interactive pong hero"
    />
  )
}

export default PromptingIsAllYouNeed
