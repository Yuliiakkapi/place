import { House, Map, UserRound, Users } from 'lucide-react'
import { NavLink } from 'react-router-dom'

const items = [
  ['/today', 'Home', House],
  ['/map', 'Map', Map],
  ['/people', 'People', Users],
  ['/profile', 'Profile', UserRound],
] as const

export function BottomNav() {
  return (
    <nav aria-label="Main" className="fixed bottom-0 left-0 right-0 z-[1000] mx-auto max-w-md border-t border-line bg-paper/95 px-3 pb-[max(10px,env(safe-area-inset-bottom))] pt-2 backdrop-blur-xl">
      <div className="flex justify-around">
        {items.map(([to, label, Icon]) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `flex min-w-16 flex-col items-center gap-1 rounded-2xl px-3 py-1.5 text-[11px] font-medium transition ${isActive ? 'text-rust' : 'text-faint hover:text-ink'}`}
          >
            <Icon size={21} strokeWidth={1.8} />
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
