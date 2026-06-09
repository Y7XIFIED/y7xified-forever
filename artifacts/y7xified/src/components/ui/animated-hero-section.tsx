import { useEffect, useRef } from "react"

const COLOR = "#FFFFFF"
const HIT_COLOR = "#333333"
const BACKGROUND_COLOR = "#000000"
const BALL_COLOR = "#FFFFFF"
const PADDLE_COLOR = "#FFFFFF"
const LETTER_SPACING = 1
const WORD_SPACING = 3

const PIXEL_MAP = {
  Y: [
    [1, 0, 0, 0, 1],
    [0, 1, 0, 1, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
  ],
  "7": [
    [1, 1, 1, 1],
    [0, 0, 0, 1],
    [0, 0, 1, 0],
    [0, 1, 0, 0],
    [0, 1, 0, 0],
  ],
  X: [
    [1, 0, 0, 0, 1],
    [0, 1, 0, 1, 0],
    [0, 0, 1, 0, 0],
    [0, 1, 0, 1, 0],
    [1, 0, 0, 0, 1],
  ],
  I: [
    [1, 1, 1],
    [0, 1, 0],
    [0, 1, 0],
    [0, 1, 0],
    [1, 1, 1],
  ],
  F: [
    [1, 1, 1, 1],
    [1, 0, 0, 0],
    [1, 1, 1, 0],
    [1, 0, 0, 0],
    [1, 0, 0, 0],
  ],
  E: [
    [1, 1, 1, 1],
    [1, 0, 0, 0],
    [1, 1, 1, 1],
    [1, 0, 0, 0],
    [1, 1, 1, 1],
  ],
  D: [
    [1, 1, 1, 0],
    [1, 0, 0, 1],
    [1, 0, 0, 1],
    [1, 0, 0, 1],
    [1, 1, 1, 0],
  ],
  O: [
    [1, 1, 1, 1],
    [1, 0, 0, 1],
    [1, 0, 0, 1],
    [1, 0, 0, 1],
    [1, 1, 1, 1],
  ],
  R: [
    [1, 1, 1, 1],
    [1, 0, 0, 1],
    [1, 1, 1, 1],
    [1, 0, 1, 0],
    [1, 0, 0, 1],
  ],
  V: [
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0],
    [0, 0, 1, 0, 0],
  ],
  "<": [
    [0, 0, 1],
    [0, 1, 0],
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1],
  ],
  "3": [
    [1, 1, 1, 1],
    [0, 0, 0, 1],
    [0, 1, 1, 1],
    [0, 0, 0, 1],
    [1, 1, 1, 1],
  ],
}

interface Pixel {
  x: number
  y: number
  size: number
  hit: boolean
}

interface Ball {
  x: number
  y: number
  dx: number
  dy: number
  radius: number
}

interface Paddle {
  x: number
  y: number
  width: number
  height: number
  targetY: number
  isVertical: boolean
}

export function AnimatedHeroSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pixelsRef = useRef<Pixel[]>([])
  const ballRef = useRef<Ball>({ x: 0, y: 0, dx: 0, dy: 0, radius: 0 })
  const paddlesRef = useRef<Paddle[]>([])
  const scaleRef = useRef(1)
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

    const calculateWordWidth = (word: string, pixelSize: number) => {
      return (
        word.split("").reduce((width, letter) => {
          const letterWidth = PIXEL_MAP[letter as keyof typeof PIXEL_MAP]?.[0]?.length ?? 0
          return width + letterWidth * pixelSize + LETTER_SPACING * pixelSize
        }, 0) - LETTER_SPACING * pixelSize
      )
    }

    const buildPixels = () => {
      const scale = scaleRef.current
      const LARGE_PIXEL_SIZE = 8 * scale
      const SMALL_PIXEL_SIZE = 4 * scale

      pixelsRef.current = []
      const words = ["Y7XIFIED", "FOREVER <3"]

      const totalWidthLarge = calculateWordWidth(words[0], LARGE_PIXEL_SIZE)
      const totalWidthSmall = words[1].split(" ").reduce((width, word, index) => {
        return width + calculateWordWidth(word, SMALL_PIXEL_SIZE) + (index > 0 ? WORD_SPACING * SMALL_PIXEL_SIZE : 0)
      }, 0)
      const totalWidth = Math.max(totalWidthLarge, totalWidthSmall)
      const scaleFactor = (canvas.width * 0.8) / totalWidth

      const adjustedLargePixelSize = LARGE_PIXEL_SIZE * scaleFactor
      const adjustedSmallPixelSize = SMALL_PIXEL_SIZE * scaleFactor

      const largeTextHeight = 5 * adjustedLargePixelSize
      const smallTextHeight = 5 * adjustedSmallPixelSize
      const spaceBetweenLines = 5 * adjustedLargePixelSize
      const totalTextHeight = largeTextHeight + spaceBetweenLines + smallTextHeight

      let startY = (canvas.height - totalTextHeight) / 2

      words.forEach((word, wordIndex) => {
        const pixelSize = wordIndex === 0 ? adjustedLargePixelSize : adjustedSmallPixelSize
        const wordTotalWidth =
          wordIndex === 0
            ? calculateWordWidth(word, adjustedLargePixelSize)
            : words[1].split(" ").reduce((width, w, index) => {
                return width + calculateWordWidth(w, adjustedSmallPixelSize) + (index > 0 ? WORD_SPACING * adjustedSmallPixelSize : 0)
              }, 0)

        let startX = (canvas.width - wordTotalWidth) / 2

        if (wordIndex === 1) {
          word.split(" ").forEach((subWord) => {
            subWord.split("").forEach((letter) => {
              const pixelMap = PIXEL_MAP[letter as keyof typeof PIXEL_MAP]
              if (!pixelMap) return
              for (let row = 0; row < pixelMap.length; row++) {
                for (let col = 0; col < pixelMap[row].length; col++) {
                  if (pixelMap[row][col]) {
                    pixelsRef.current.push({ x: startX + col * pixelSize, y: startY + row * pixelSize, size: pixelSize, hit: false })
                  }
                }
              }
              startX += (pixelMap[0].length + LETTER_SPACING) * pixelSize
            })
            startX += WORD_SPACING * adjustedSmallPixelSize
          })
        } else {
          word.split("").forEach((letter) => {
            const pixelMap = PIXEL_MAP[letter as keyof typeof PIXEL_MAP]
            if (!pixelMap) return
            for (let row = 0; row < pixelMap.length; row++) {
              for (let col = 0; col < pixelMap[row].length; col++) {
                if (pixelMap[row][col]) {
                  pixelsRef.current.push({ x: startX + col * pixelSize, y: startY + row * pixelSize, size: pixelSize, hit: false })
                }
              }
            }
            startX += (pixelMap[0].length + LETTER_SPACING) * pixelSize
          })
        }

        startY += wordIndex === 0 ? largeTextHeight + spaceBetweenLines : 0
      })

      return { adjustedLargePixelSize }
    }

    const initializeGame = () => {
      const scale = scaleRef.current
      const BALL_SPEED = 5 * scale
      const { adjustedLargePixelSize } = buildPixels()

      const paddleWidth = adjustedLargePixelSize
      const paddleLength = 6 * adjustedLargePixelSize

      ballRef.current = {
        x: canvas.width * 0.9,
        y: canvas.height * 0.1,
        dx: -BALL_SPEED,
        dy: BALL_SPEED,
        radius: adjustedLargePixelSize / 2,
      }

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
      const ball = ballRef.current

      ball.x += ball.dx
      ball.y += ball.dy

      if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) ball.dy = -ball.dy
      if (ball.x - ball.radius < 0 || ball.x + ball.radius > canvas.width) ball.dx = -ball.dx

      paddlesRef.current.forEach((paddle) => {
        if (paddle.isVertical) {
          if (
            ball.x - ball.radius < paddle.x + paddle.width &&
            ball.x + ball.radius > paddle.x &&
            ball.y > paddle.y &&
            ball.y < paddle.y + paddle.height
          ) {
            ball.dx = -ball.dx
          }
        } else {
          if (
            ball.y - ball.radius < paddle.y + paddle.height &&
            ball.y + ball.radius > paddle.y &&
            ball.x > paddle.x &&
            ball.x < paddle.x + paddle.width
          ) {
            ball.dy = -ball.dy
          }
        }
      })

      pixelsRef.current.forEach((pixel) => {
        if (
          !pixel.hit &&
          ball.x + ball.radius > pixel.x &&
          ball.x - ball.radius < pixel.x + pixel.size &&
          ball.y + ball.radius > pixel.y &&
          ball.y - ball.radius < pixel.y + pixel.size
        ) {
          pixel.hit = true
          playBeep(180 + Math.random() * 500)
          const pixelCenterX = pixel.x + pixel.size / 2
          const pixelCenterY = pixel.y + pixel.size / 2
          if (Math.abs(ball.x - pixelCenterX) > Math.abs(ball.y - pixelCenterY)) {
            ball.dx = -ball.dx
          } else {
            ball.dy = -ball.dy
          }
        }
      })

      // Loop: reset all pixels when every one has been hit
      if (pixelsRef.current.length > 0 && pixelsRef.current.every((p) => p.hit)) {
        pixelsRef.current.forEach((p) => { p.hit = false })
      }

      paddlesRef.current.forEach((paddle) => {
        if (paddle.isVertical) {
          paddle.targetY = ball.y - paddle.height / 2
          paddle.targetY = Math.max(0, Math.min(canvas.height - paddle.height, paddle.targetY))
          paddle.y += (paddle.targetY - paddle.y) * 0.1
        } else {
          paddle.targetY = ball.x - paddle.width / 2
          paddle.targetY = Math.max(0, Math.min(canvas.width - paddle.width, paddle.targetY))
          paddle.x += (paddle.targetY - paddle.x) * 0.1
        }
      })
    }

    const drawGame = () => {
      ctx.fillStyle = BACKGROUND_COLOR
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      pixelsRef.current.forEach((pixel) => {
        ctx.fillStyle = pixel.hit ? HIT_COLOR : COLOR
        ctx.fillRect(pixel.x, pixel.y, pixel.size, pixel.size)
      })

      const ball = ballRef.current
      ctx.fillStyle = BALL_COLOR
      ctx.beginPath()
      ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2)
      ctx.fill()

      ctx.fillStyle = PADDLE_COLOR
      paddlesRef.current.forEach((p) => ctx.fillRect(p.x, p.y, p.width, p.height))
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Unlock AudioContext on first interaction
    const unlock = () => {
      try { audioCtxRef.current = new AudioContext() } catch { /* silent */ }
    }
    window.addEventListener("click", unlock, { once: true })
    window.addEventListener("keydown", unlock, { once: true })

    let animFrameId: number
    const gameLoop = () => {
      updateGame()
      drawGame()
      animFrameId = requestAnimationFrame(gameLoop)
    }
    gameLoop()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animFrameId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{ display: "block", width: "100%", height: "100vh" }}
      aria-label="Y7XIFIED interactive pong hero"
    />
  )
}

export default AnimatedHeroSection
