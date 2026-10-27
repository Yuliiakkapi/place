import { Compass, Map, UserRound, Users } from 'lucide-react'
import { useLayoutEffect, useRef, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'

const items = [
  ['/today', 'Explore', Compass],
  ['/map', 'Map', Map],
  ['/people', 'People', Users],
  ['/profile', 'Profile', UserRound],
] as const

type Lens = { x: number; width: number; slide: boolean } | null

export function BottomNav() {
  const { pathname } = useLocation()
  const barRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<Record<string, HTMLAnchorElement | null>>({})
  const [lens, setLens] = useState<Lens>(null)
  const activeTo = items.find(([to]) => pathname.startsWith(to))?.[0]

  useLayoutEffect(() => {
    const measure = (slide: boolean) => {
      const el = activeTo ? itemRefs.current[activeTo] : null
      setLens(prev => (el ? { x: el.offsetLeft, width: el.offsetWidth, slide: slide && prev !== null } : null))
    }
    measure(true)
    const observer = new ResizeObserver(() => measure(false))
    if (barRef.current) observer.observe(barRef.current)
    return () => observer.disconnect()
  }, [activeTo])

  return (
    <nav aria-label="Main" className="pointer-events-none fixed inset-x-0 bottom-0 z-[1000] pb-[max(16px,env(safe-area-inset-bottom))]">
      <div className="mx-auto max-w-md px-5">
        <div ref={barRef} className="glass-thick pointer-events-auto relative flex items-center gap-1 rounded-full p-2">
          <span
            aria-hidden
            data-slide={lens?.slide || undefined}
            className="glass-lens absolute bottom-2 left-0 top-2 rounded-full"
            style={{ width: lens?.width ?? 0, translate: `${lens?.x ?? 0}px 0`, opacity: lens ? 1 : 0 }}
          />
          {items.map(([to, label, Icon]) => (
            <NavLink
              key={to}
              to={to}
              ref={el => { itemRefs.current[to] = el }}
              className={({ isActive }) => `relative z-10 flex flex-1 flex-col items-center gap-1 rounded-full py-2 text-xs ${isActive ? 'font-semibold text-ink' : 'font-medium text-muted hover:text-ink'}`}
            >
              <Icon size={19} strokeWidth={to === activeTo ? 2.2 : 1.9} />
              <span>{label}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  )
}
