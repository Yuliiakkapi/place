import type { CSSProperties } from 'react'

const colors = ['#e9a77c', '#d9b26a', '#cf8a6a', '#c9a98a', '#e4bf95']

const shapes = [
  'M12 2C6.5 6.5 4 10.5 4 14.5A8 8 0 0 0 20 14.5C20 10.5 17.5 6.5 12 2Z',
  'M12 2l1.6 4.2 3.9-1.8-1.2 4.3 4.3 1-3.4 2.8 2.6 3.6-4.4-.4.2 4.5L12 17l-3.6 2.8.2-4.5-4.4.4 2.6-3.6L3.4 9.3l4.3-1-1.2-4.3 3.9 1.8z',
]

export function AutumnLeaves({ count = 10 }: { count?: number }) {
  return (
    <div aria-hidden className="autumn-leaves pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: count }, (_, i) => {
        const size = 12 + ((i * 7) % 12)
        const style = {
          left: `${(i * 37 + 8) % 96}%`,
          '--fall': `${13 + ((i * 5) % 9)}s`,
          '--delay': `-${(i * 2.3) % 15}s`,
          '--sway': `${(i % 2 ? 1 : -1) * (14 + ((i * 11) % 22))}px`,
          '--spin': `${(i % 2 ? 1 : -1) * (120 + ((i * 53) % 200))}deg`,
        } as CSSProperties
        return (
          <span key={i} className="leaf-track" style={style}>
            <svg className="leaf" width={size} height={size} viewBox="0 0 24 24">
              <path d={shapes[i % 3 === 0 ? 1 : 0]} fill={colors[i % colors.length]} />
              {i % 3 !== 0 && <path d="M12 5v15" stroke="rgba(255,255,255,.55)" strokeWidth="1" />}
            </svg>
          </span>
        )
      })}
    </div>
  )
}
