import { useId, type CSSProperties } from 'react'

const palettes = [
  ['#f5bd68', '#d9822b'],
  ['#ec8a57', '#b9502d'],
  ['#efcd6c', '#c6952f'],
  ['#d4735a', '#93402f'],
  ['#f4cc8c', '#d99a52'],
]

const shapes = [
  {
    d: 'M12 1.5l1.3 3.6 2.6-1.4-.6 3.4 3.5-.9-1.6 3.1 3.3 1.2-3 2 1.6 2.6-3.6-.3.2 3.3-2.9-1.9L12 20l-.8-3.7-2.9 1.9.2-3.3-3.6.3 1.6-2.6-3-2 3.3-1.2-1.6-3.1 3.5.9-.6-3.4 2.6 1.4z',
    veins: 'M12 22.5V5M12 14l-5.5-4.5M12 14l5.5-4.5M12 16.5l-6.5 1M12 16.5l6.5 1',
  },
  {
    d: 'M12 2c1.6 1.2 1 2.6 2.4 3 1.4.4 2.4-.6 2.9.8.5 1.4-1.1 1.9-.6 3.1.5 1.2 2.2.9 2.2 2.4 0 1.5-1.8 1.4-2.1 2.7-.3 1.3 1.1 2.1.2 3.2-.9 1.1-2.1.1-3.1.8-.8.6-.4 2.2-1.9 2.2s-1.1-1.6-1.9-2.2c-1-.7-2.2.3-3.1-.8-.9-1.1.5-1.9.2-3.2-.3-1.3-2.1-1.2-2.1-2.7s1.7-1.2 2.2-2.4c.5-1.2-1.1-1.7-.6-3.1.5-1.4 1.5-.4 2.9-.8C11 4.6 10.4 3.2 12 2z',
    veins: 'M12 22V4M12 9l-3-2M12 9l3-2M12 13l-4-2M12 13l4-2M12 17l-3-1.5M12 17l3-1.5',
  },
  {
    d: 'M12 2C7.5 6 5.5 10 6 14.5c.4 3.6 3 6 6 7.5 3-1.5 5.6-3.9 6-7.5C18.5 10 16.5 6 12 2z',
    veins: 'M12 22V5M12 11l-3.5-2.5M12 11l3.5-2.5M12 15.5l-4-2.5M12 15.5l4-2.5',
  },
  {
    d: 'M12 1.5c-3 4.5-4 9-3 13.5.6 2.8 1.6 4.8 3 7 1.4-2.2 2.4-4.2 3-7 1-4.5 0-9-3-13.5z',
    veins: 'M12 22V4',
  },
]

const depths = [
  { size: [10, 13], peak: 0.35, blur: 1, fall: 24, tumble: 7 },
  { size: [16, 21], peak: 0.55, blur: 0, fall: 17, tumble: 5 },
  { size: [24, 32], peak: 0.7, blur: 0, fall: 12, tumble: 3.6 },
]

function rand(i: number, salt: number) {
  const x = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453
  return x - Math.floor(x)
}

export function AutumnLeaves({ count = 10, pace = 1, burst = false }: { count?: number; pace?: number; burst?: boolean }) {
  const uid = useId().replace(/:/g, '')
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 overflow-hidden ${burst ? 'leaf-burst' : '[mask-image:linear-gradient(to_bottom,black_65%,transparent)]'}`}>
      <svg width="0" height="0" className="absolute">
        <defs>
          {palettes.map(([light, dark], k) => (
            <linearGradient key={k} id={`${uid}-p${k}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor={light} />
              <stop offset="1" stopColor={dark} />
            </linearGradient>
          ))}
        </defs>
      </svg>

      {Array.from({ length: count }, (_, i) => {
        const depth = burst ? depths[1 + (i % 2)] : depths[i % 3]
        const shape = shapes[Math.floor(rand(i, 1) * shapes.length)]
        const palette = Math.floor(rand(i, 2) * palettes.length)
        const size = depth.size[0] + rand(i, 3) * (depth.size[1] - depth.size[0])
        const fall = (depth.fall + rand(i, 4) * 6) * pace
        const style = {
          left: `${4 + rand(i, 5) * 92}%`,
          '--fall': `${fall}s`,
          '--delay': burst ? `${rand(i, 6) * 0.9}s` : `-${rand(i, 6) * fall}s`,
          '--drift': `${12 + rand(i, 7) * 26}px`,
          '--drift-dur': `${2.8 + rand(i, 8) * 2.4}s`,
          '--tumble-dur': `${depth.tumble + rand(i, 9) * 2}s`,
          '--spin': `${(rand(i, 10) > 0.5 ? 1 : -1) * (160 + rand(i, 11) * 200)}deg`,
          '--flip': `${45 + rand(i, 12) * 35}deg`,
          '--peak': burst ? 0.95 : depth.peak,
          filter: depth.blur ? `blur(${depth.blur}px)` : undefined,
        } as CSSProperties
        return (
          <span key={i} className="leaf-track" style={style}>
            <span className="leaf-drift">
              <svg className="leaf-tumble" width={size} height={size} viewBox="0 0 24 24">
                <path d={shape.d} fill={`url(#${uid}-p${palette})`} />
                <path d={shape.veins} stroke="rgb(255 244 228 / .55)" strokeWidth=".7" strokeLinecap="round" fill="none" />
              </svg>
            </span>
          </span>
        )
      })}
    </div>
  )
}
