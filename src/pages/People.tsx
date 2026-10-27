import { Check, Globe, Lock, Send } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { Avatar, Pill, PlaceImage, Segmented } from '../components/ui'
import { places, users, vibeLabel } from '../data/seed'
import { shareInvite } from '../services/share'
import { invitedStore, moodStore, settingsStore, todayKey, toggleIn } from '../services/store'
import { usePageTitle } from '../components/usePageTitle'

type Tab = 'friends' | 'community'

export function People() {
  usePageTitle('People')
  const [tab, setTab] = useState<Tab>('friends')
  return (
    <div className="pb-4 pt-12">
      <h1 className="display text-3xl leading-tight">Your people</h1>
      <p className="mt-1 text-sm text-muted">Friends you go out with, and locals sharing their spots.</p>
      <div className="mt-5">
        <Segmented<Tab> label="Show" value={tab} onChange={setTab} options={[{ id: 'friends', label: 'Friends' }, { id: 'community', label: 'Community' }]} />
      </div>
      {tab === 'friends' ? <Friends /> : <Community />}
    </div>
  )
}

function Note({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <div className="flex items-start gap-3 rounded-md bg-[#f6ebe0] p-4 text-sm leading-6">
      <span className="mt-1 shrink-0 text-accent-ink">{icon}</span>
      <div>{children}</div>
    </div>
  )
}

function Friends() {
  const nav = useNavigate()
  const mood = moodStore.use()
  const settings = settingsStore.use()
  const invited = invitedStore.use()
  const [inviteStatus, setInviteStatus] = useState('')
  const myVibe = mood?.date === todayKey() ? mood.vibe : null
  const friends = users.filter(u => u.isFriend).sort((a, b) => Number(b.vibe === myVibe) - Number(a.vibe === myVibe))
  const planKey = (id: string) => `today:${id}`

  async function invite() {
    const result = await shareInvite()
    setInviteStatus(result === 'copied' ? 'Invite link copied' : result === 'shared' ? 'Invite shared' : 'Could not share the link')
  }

  return (
    <section className="stagger mt-5">
      <Note icon={<Lock size={15} />}>
        Only friends see each other’s vibe.{' '}
        {settings.moodVisibleTo === 'nobody' ? 'Yours is hidden right now.' : myVibe ? `They see yours: ${vibeLabel(myVibe).toLowerCase()}.` : 'You haven’t picked one today.'}{' '}
        <button onClick={() => nav('/settings')} className="font-semibold text-accent-ink underline underline-offset-2">Privacy settings</button>
      </Note>

      <ul className="mt-4 space-y-2">
        {friends.map(f => {
          const same = !!myVibe && f.vibe === myVibe
          const done = invited.includes(planKey(f.id))
          return (
            <li key={f.id} className="card-shadow flex items-center gap-3 rounded-md bg-card p-4">
              <Avatar name={f.name} size={46} />
              <div className="min-w-0 flex-1">
                <p className="font-semibold">{f.name}</p>
                <div className="mt-1 flex flex-wrap gap-1">
                  {f.vibe ? <Pill tone="gem">{vibeLabel(f.vibe)}</Pill> : <span className="text-xs text-muted">No vibe shared today</span>}
                  {same && <Pill tone="light">Same as you</Pill>}
                </div>
              </div>
              <button
                onClick={() => invitedStore.set(toggleIn(invited, planKey(f.id)))}
                className={`flex shrink-0 items-center gap-1 rounded-full px-4 py-2 text-xs font-semibold ${done ? 'bg-honey text-[#8a5f14]' : 'bg-ink text-white'}`}
              >
                {done ? <><Check size={13} /> Invited</> : 'Invite out'}
              </button>
            </li>
          )
        })}
      </ul>
      <p className="mt-2 px-1 text-xs text-faint">Demo only: invitations are not actually sent. To invite someone to a specific place, open the place.</p>

      <button onClick={invite} className="card-shadow mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-card px-5 py-4 text-sm font-semibold">
        <Send size={16} /> Invite friends to PLACE
      </button>
      {inviteStatus && <p role="status" className="mt-2 text-center text-xs text-muted">{inviteStatus}</p>}
    </section>
  )
}

function Community() {
  const nav = useNavigate()
  const contributors = users
    .map(u => ({ user: u, shared: places.filter(p => p.addedBy === u.id && p.visibility === 'public') }))
    .filter(c => c.shared.length > 0)

  return (
    <section className="stagger mt-5">
      <Note icon={<Globe size={15} />}>Places people have shared publicly. Vibes, locations and friends-only places stay private.</Note>

      <ul className="mt-4 space-y-3">
        {contributors.map(({ user, shared }) => (
          <li key={user.id} className="card-shadow rounded-md bg-card p-4">
            <div className="flex items-center gap-3">
              <Avatar name={user.name} size={40} />
              <div className="flex-1">
                <p className="flex items-center gap-2 font-semibold">{user.name}{user.isFriend && <Pill tone="light">Friend</Pill>}</p>
                <p className="text-xs text-muted">{shared.length} {shared.length === 1 ? 'place' : 'places'} shared</p>
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              {shared.map(p => (
                <button key={p.id} onClick={() => nav(`/place/${p.id}`)} className="relative h-32 flex-1 overflow-hidden rounded-md text-left">
                  <PlaceImage place={p} className="absolute inset-0 h-full w-full" />
                  <span className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <span className="absolute inset-x-3 bottom-3 text-sm font-semibold text-white">{p.name}</span>
                </button>
              ))}
            </div>
          </li>
        ))}
      </ul>

      <button onClick={() => nav('/add-place')} className="mt-6 w-full rounded-full bg-ink py-4 text-sm font-semibold text-white">Share a place with the community</button>
    </section>
  )
}
