import { ArrowRight, MapPin, Plus, UsersRound } from 'lucide-react'
import { useState } from 'react'
import { users } from '../data/seed'
import type { User } from '../types'

export function People() {
  const me = users[0]
  const [plan, setPlan] = useState(false)
  function match(user: User) {
    return user.currentMoods.filter(mood => me.currentMoods.includes(mood)).length * 3 + user.needs.filter(need => me.needs.includes(need)).length * 2
  }
  const matches = users.filter(user => user.id !== 'me').sort((a, b) => match(b) - match(a))
  return <div className="pt-9"><p className="text-xs uppercase tracking-[.18em] text-[#9d5638]">Social layer</p><h1 className="mt-2 text-4xl font-light">Same weather</h1><p className="mt-2 max-w-sm text-sm leading-6 text-[#716a61]">People around you feeling something similar. No pressure, no performance.</p><section className="mt-7 space-y-3">{matches.slice(0, 5).map(user => <div key={user.id} className="rounded-[22px] bg-white/60 p-4"><div className="flex items-center gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#d8ded5] text-sm">{user.avatar}</div><div className="flex-1"><p className="font-medium">{user.name}</p><p className="mt-1 text-xs text-[#716a61]">{user.currentMoods.map(mood => mood === 'needAir' ? 'Needs air' : mood === 'wantCompany' ? 'Wants company' : mood[0].toUpperCase() + mood.slice(1)).join(' · ')}</p></div><button className="rounded-full bg-[#292722] px-4 py-2 text-xs text-white">Invite</button></div><p className="mt-4 flex items-center gap-2 text-xs text-[#8d8277]"><span className="h-1.5 w-1.5 rounded-full bg-[#9d5638]"/> You might like the same kind of afternoon.</p></div>)}</section><section className="mt-8 rounded-[26px] bg-[#ead9cb] p-5"><div className="flex items-center gap-2 text-sm"><MapPin size={17}/> Low-pressure plans</div><h2 className="mt-3 text-2xl font-light">I’m going somewhere</h2><p className="mt-2 text-sm leading-6 text-[#625d55]">Invite people into a plan without turning it into a big commitment.</p><button onClick={() => setPlan(true)} className="mt-5 flex w-full items-center justify-between rounded-full bg-[#292722] px-5 py-3 text-sm text-white">Create a plan <ArrowRight size={17}/></button>{plan && <div className="mt-4 rounded-2xl bg-white/60 p-4"><p className="text-sm font-medium">🍂 Walking through the park</p><p className="mt-1 text-xs text-[#716a61]">Today · 17:30 · 2 spots open</p><button className="mt-3 flex items-center gap-1 text-xs text-[#9d5638]"><Plus size={14}/> Add a place</button></div>}</section><div className="mt-7 flex items-center gap-2 text-xs text-[#8d8277]"><UsersRound size={15}/> Friends appear first when they share your current weather.</div></div>
}
