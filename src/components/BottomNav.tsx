import { Map, Sparkles, UserRound, Users } from 'lucide-react'
import { NavLink } from 'react-router-dom'

const items=[['/today','Today',Sparkles],['/map','Map',Map],['/people','People',Users],['/journal','My',UserRound]] as const
export function BottomNav(){return <nav className="fixed bottom-0 left-0 right-0 z-50 mx-auto max-w-md border-t border-black/8 bg-[#f7f2ea]/95 px-3 pb-[max(10px,env(safe-area-inset-bottom))] pt-2 backdrop-blur-xl"><div className="flex justify-around">{items.map(([to,label,Icon])=><NavLink key={to} to={to} className={({isActive})=>`flex min-w-16 flex-col items-center gap-1 rounded-2xl px-3 py-2 text-[10px] font-medium tracking-wide transition ${isActive?'text-[#9d5638]':'text-[#817b72]'}`}><Icon size={20} strokeWidth={1.7}/><span>{label}</span></NavLink>)}</div></nav>}
