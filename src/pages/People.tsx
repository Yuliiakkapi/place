import { Check, Globe, Lock, Send } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Avatar, Eyebrow, Segmented, TextLink } from '../components/ui'
import { places, users, vibeLabel } from '../data/seed'
import { shareInvite } from '../services/share'
import { invitedStore, moodStore, settingsStore, todayKey, toggleIn } from '../services/store'

type Tab = 'friends' | 'community'

export function People() {
  const [tab, setTab] = useState<Tab>('friends')
  return (
    <div className="pt-9 pb-4">
      <Eyebrow>People</Eyebrow>
      <h1 className="mt-2 text-3xl font-light">Your people</h1>
      <div className="mt-6">
        <Segmented<Tab> label="Show" value={tab} onChange={setTab} options={[{ id: 'friends', label: 'Friends' }, { id: 'community', label: 'Community' }]} />
      </div>
      {tab === 'friends' ? <Friends /> : <Community />}
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
    <section className="float-in mt-5">
      <p className="flex items-start gap-2 text-sm leading-6 text-muted">
        <Lock size={15} className="mt-1 shrink-0" />
        <span>
          Only friends see each other’s mood.{' '}
          {settings.moodVisibleTo === 'nobody' ? 'Yours is currently hidden.' : myVibe ? `They see yours: ${vibeLabel(myVibe).toLowerCase()}.` : 'You haven’t set yours today.'}{' '}
          <TextLink onClick={() => nav('/settings')}>Privacy settings</TextLink>
        </span>
      </p>

      <ul className="mt-5 space-y-2">
        {friends.map(f => {
          const same = !!myVibe && f.vibe === myVibe
          const done = invited.includes(planKey(f.id))
          return (
            <li key={f.id} className="flex items-center gap-3 rounded-2xl border border-line bg-card p-3.5">
              <Avatar name={f.name} />
              <div className="min-w-0 flex-1">
                <p className="font-medium">{f.name}</p>
                <p className="mt-0.5 text-xs text-muted">
                  {f.vibe ? `In the mood for ${vibeLabel(f.vibe).toLowerCase()}` : 'No mood shared today'}
                </p>
                {same && <p className="mt-1 text-xs font-medium text-moss">Same mood as you</p>}
              </div>
              <button
                onClick={() => invitedStore.set(toggleIn(invited, planKey(f.id)))}
                className={`flex shrink-0 items-center gap-1 rounded-full px-4 py-2 text-xs font-medium ${done ? 'bg-sage text-moss' : 'bg-ink text-white'}`}
              >
                {done ? <><Check size={13} /> Invited</> : 'Invite out'}
              </button>
            </li>
          )
        })}
      </ul>
      <p className="mt-2 text-[11px] text-faint">Demo only: invitations are not actually sent. To invite someone to a specific place, open the place.</p>

      <button onClick={invite} className="mt-7 flex w-full items-center justify-center gap-2 rounded-full border border-ink px-5 py-3.5 text-sm font-medium">
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
    <section className="float-in mt-5">
      <p className="flex items-start gap-2 text-sm leading-6 text-muted">
        <Globe size={15} className="mt-1 shrink-0" />
        Here you see places people have shared publicly. Moods, locations and friends-only places stay private.
      </p>

      <ul className="mt-5 space-y-2">
        {contributors.map(({ user, shared }) => (
          <li key={user.id} className="rounded-2xl border border-line bg-card p-3.5">
            <div className="flex items-center gap-3">
              <Avatar name={user.name} />
              <div className="flex-1">
                <p className="font-medium">{user.name}{user.isFriend && <span className="ml-2 text-xs font-normal text-moss">Friend</span>}</p>
                <p className="mt-0.5 text-xs text-muted">{shared.length} {shared.length === 1 ? 'place' : 'places'} shared</p>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {shared.map(p => (
                <button key={p.id} onClick={() => nav(`/place/${p.id}`)} className="rounded-full border border-ink/20 px-3 py-1.5 text-sm hover:border-ink">
                  {p.name} →
                </button>
              ))}
            </div>
          </li>
        ))}
      </ul>

      <button onClick={() => nav('/add-place')} className="mt-7 w-full rounded-full bg-ink py-3.5 text-sm text-white">Share a place with the community</button>
    </section>
  )
}
