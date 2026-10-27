import { useNavigate } from 'react-router-dom'
import { Avatar, BackButton, OptionButton } from '../components/ui'
import { users } from '../data/seed'
import { resetAll, settingsStore, toggleIn } from '../services/store'
import type { Settings } from '../types'

export function SettingsPage() {
  const nav = useNavigate()
  const settings = settingsStore.use()
  const friends = users.filter(u => u.isFriend)
  const update = (patch: Partial<Settings>) => settingsStore.set({ ...settings, ...patch })

  function reset() {
    if (!window.confirm('Remove your profile, saved places, tips and shared places from this device?')) return
    resetAll()
    nav('/onboarding', { replace: true })
  }

  return (
    <div className="pb-8 pt-5">
      <BackButton />
      <h1 className="mt-4 text-3xl font-light">Privacy & settings</h1>
      <p className="mt-2 text-sm leading-6 text-muted">You decide what others see. Everything is private unless you choose to share it.</p>

      <section className="mt-8">
        <h2 className="font-medium">Share my location</h2>
        <p className="mt-1 text-sm text-muted">Your location is never shown publicly.</p>
        <div className="mt-3 space-y-2">
          <OptionButton label="Off" hint="Nobody sees where you are" selected={settings.locationSharing === 'off'} onClick={() => update({ locationSharing: 'off' })} />
          <OptionButton label="Only friends I choose" hint="Pick exactly who can see it" selected={settings.locationSharing === 'selected'} onClick={() => update({ locationSharing: 'selected' })} />
        </div>
        {settings.locationSharing === 'selected' && (
          <div className="float-in mt-3 rounded-2xl border border-line bg-card p-2">
            {friends.map(f => (
              <label key={f.id} className="flex cursor-pointer items-center gap-3 rounded-xl p-2 hover:bg-black/[.03]">
                <Avatar name={f.name} size={32} />
                <span className="flex-1 text-sm">{f.name}</span>
                <input
                  type="checkbox"
                  checked={settings.locationFriends.includes(f.id)}
                  onChange={() => update({ locationFriends: toggleIn(settings.locationFriends, f.id) })}
                  className="h-5 w-5 accent-[#292722]"
                />
              </label>
            ))}
            <p className="px-2 pb-1 pt-2 text-[11px] text-faint">
              {settings.locationFriends.length ? `Shared with ${settings.locationFriends.length} of ${friends.length} friends.` : 'Not shared with anyone yet.'} Demo: no real location is used.
            </p>
          </div>
        )}
      </section>

      <section className="mt-8">
        <h2 className="font-medium">Who can see my mood?</h2>
        <div className="mt-3 space-y-2">
          <OptionButton label="My friends" selected={settings.moodVisibleTo === 'friends'} onClick={() => update({ moodVisibleTo: 'friends' })} />
          <OptionButton label="Only me" hint="Still used for your own suggestions" selected={settings.moodVisibleTo === 'nobody'} onClick={() => update({ moodVisibleTo: 'nobody' })} />
        </div>
      </section>

      <section className="mt-8">
        <label className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-line bg-card px-4 py-3.5">
          <span>
            <span className="block text-[15px] font-medium">Post tips anonymously</span>
            <span className="mt-0.5 block text-xs text-muted">Your name won’t appear next to tips. You can change it on each tip.</span>
          </span>
          <input type="checkbox" checked={settings.anonymousTips} onChange={e => update({ anonymousTips: e.target.checked })} className="h-5 w-5 shrink-0 accent-[#292722]" />
        </label>
      </section>

      <section className="mt-10 border-t border-line pt-6">
        <button onClick={() => nav('/onboarding?edit=1')} className="block py-2 text-sm font-medium">Edit my preferences</button>
        <button onClick={reset} className="block py-2 text-sm text-red-700">Reset demo data</button>
        <p className="mt-3 text-xs leading-5 text-faint">
          Prototype: everything is stored only in this browser. There are no accounts, and nothing is sent to other people.
        </p>
      </section>
    </div>
  )
}
