import { Compass, Map, UserRound, Users } from 'lucide-react'
import { NavLink } from 'react-router-dom'

const items = [
  ['/today', 'Explore', Compass],
  ['/map', 'Map', Map],
  ['/people', 'People', Users],
  ['/profile', 'Profile', UserRound],
] as const

export function BottomNav() {
  return (
    <nav aria-label="Main" className="pointer-events-none fixed inset-x-0 bottom-0 z-[1000] flex justify-center px-4 pb-[max(14px,env(safe-area-inset-bottom))]">
      <div className="pointer-events-auto flex items-center gap-1 rounded-full bg-card/95 p-2 float-shadow backdrop-blur-xl">
        {items.map(([to, label, Icon]) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `flex w-[72px] flex-col items-center gap-1 rounded-full py-2 text-xs font-medium ${isActive ? 'bg-ink text-white' : 'text-muted hover:text-ink'}`}
          >
            <Icon size={19} strokeWidth={1.9} />
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
