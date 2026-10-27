import { ArrowLeft, LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export function SettingsPage() {
  const nav = useNavigate()
  function logOut() {
    localStorage.removeItem('place-today-check-in-v1')
    nav('/onboarding', { replace: true })
  }
  return <div className="pt-9"><button onClick={() => nav(-1)} className="rounded-full bg-white/60 p-3"><ArrowLeft size={18}/></button><p className="mt-8 text-xs uppercase tracking-[.18em] text-[#9d5638]">Account</p><h1 className="mt-2 text-4xl font-light">Settings</h1><section className="mt-7 overflow-hidden rounded-[24px] bg-white/60"><button className="flex w-full items-center justify-between p-5 text-left text-sm"><span>Notifications</span><span className="text-xs text-[#817b72]">On</span></button><div className="mx-5 border-t border-black/10"/><button className="flex w-full items-center justify-between p-5 text-left text-sm"><span>Privacy</span><span className="text-xs text-[#817b72]">Friends</span></button></section><button onClick={logOut} className="mt-7 flex w-full items-center justify-between rounded-[22px] border border-[#b96e4d]/30 bg-[#ead9cb] px-5 py-4 text-sm text-[#8d3e25]"><span>Log out</span><LogOut size={18}/></button></div>
}
