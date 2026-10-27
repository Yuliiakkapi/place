import { Bookmark, Check, Navigation, UserPlus } from 'lucide-react'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Avatar, BackButton, EmptyNote, PlaceBadges, PlaceImage, SectionTitle } from '../components/ui'
import { goodFor, photoCredit, seedTips, userById, users } from '../data/seed'
import { useVisiblePlaces } from '../services/recommendationService'
import { invitedStore, savedStore, settingsStore, tipsStore, toggleIn } from '../services/store'

export function PlaceDetail() {
  const { id = '' } = useParams()
  const nav = useNavigate()
  const place = useVisiblePlaces().find(p => p.id === id)
  const saved = savedStore.use()
  const invited = invitedStore.use()
  const myTips = tipsStore.use()
  const settings = settingsStore.use()
  const [inviteOpen, setInviteOpen] = useState(false)
  const [tip, setTip] = useState('')
  const [anonymous, setAnonymous] = useState(settings.anonymousTips)

  if (!place) {
    return (
      <div className="pt-8">
        <BackButton />
        <p className="mt-8 text-lg">This place isn’t available.</p>
        <p className="mt-1 text-sm text-muted">It may be friends-only or no longer shared.</p>
        <button onClick={() => nav('/map')} className="mt-5 rounded-full bg-ink px-5 py-3 text-sm text-white">Back to the map</button>
      </div>
    )
  }

  const isSaved = saved.includes(place.id)
  const tips = [...myTips.filter(t => t.placeId === place.id).reverse(), ...seedTips.filter(t => t.placeId === place.id)]
  const credit = photoCredit(place.id)
  const friends = users.filter(u => u.isFriend)
  const inviteKey = (userId: string) => `${place.id}:${userId}`

  function postTip() {
    const text = tip.trim()
    if (!text) return
    tipsStore.set(all => [...all, { id: `tip-${Date.now()}`, placeId: place!.id, text, authorId: anonymous ? undefined : 'me', createdAt: new Date().toISOString() }])
    setTip('')
  }

  return (
    <div className="pb-6 pt-5">
      <BackButton />

      <figure className="mt-3">
        <PlaceImage place={place} className="h-64 w-full rounded-[24px]" />
        {credit && (
          <figcaption className="mt-1.5 text-[10px] text-faint">
            Photo: <a href={credit.source} target="_blank" rel="noreferrer" className="underline">{credit.author || 'Wikimedia Commons'}</a>, {credit.license}
          </figcaption>
        )}
      </figure>

      <div className="mt-5">
        <PlaceBadges place={place} />
        <h1 className="mt-2 text-4xl font-light tracking-tight">{place.name}</h1>
        <p className="mt-1 text-sm text-muted">{place.category} · {place.area}</p>
        <p className="mt-4 text-base leading-7">{place.summary}</p>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-2">
        <button
          onClick={() => savedStore.set(toggleIn(saved, place.id))}
          aria-pressed={isSaved}
          className={`flex items-center justify-center gap-2 rounded-full border py-3 text-sm font-medium transition ${isSaved ? 'border-ink bg-ink text-white' : 'border-ink/20 bg-card'}`}
        >
          <Bookmark size={16} fill={isSaved ? 'currentColor' : 'none'} /> {isSaved ? 'Saved' : 'Save'}
        </button>
        <button
          onClick={() => setInviteOpen(o => !o)}
          aria-expanded={inviteOpen}
          className="flex items-center justify-center gap-2 rounded-full border border-ink/20 bg-card py-3 text-sm font-medium"
        >
          <UserPlus size={16} /> Invite a friend
        </button>
      </div>

      {inviteOpen && (
        <div className="float-in mt-3 rounded-2xl border border-line bg-card p-2">
          {friends.map(f => {
            const done = invited.includes(inviteKey(f.id))
            return (
              <div key={f.id} className="flex items-center gap-3 p-2">
                <Avatar name={f.name} size={34} />
                <span className="flex-1 text-sm">{f.name}</span>
                <button
                  onClick={() => invitedStore.set(toggleIn(invited, inviteKey(f.id)))}
                  className={`flex items-center gap-1 rounded-full px-3.5 py-1.5 text-xs font-medium ${done ? 'bg-sage text-moss' : 'bg-ink text-white'}`}
                >
                  {done ? <><Check size={13} /> Invited</> : 'Invite'}
                </button>
              </div>
            )
          })}
          <p className="px-2 pb-1 pt-2 text-[11px] text-faint">Demo only: invitations are not actually sent.</p>
        </div>
      )}

      <section className="mt-9">
        <SectionTitle>{place.whyGo.length ? 'Why go' : 'Good to know'}</SectionTitle>
        <ul className="mt-3 space-y-2.5 empty:hidden">
          {place.whyGo.map(w => (
            <li key={w} className="flex gap-3 text-[15px] leading-6">
              <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-rust" />{w}
            </li>
          ))}
        </ul>
        <p className="mt-5 text-sm text-muted">
          {goodFor(place.company)} · {place.indoor ? 'Indoors' : 'Outdoors'}
        </p>
        <a
          href={`https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lng}`}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-rust underline-offset-4 hover:underline"
        >
          <Navigation size={15} /> Get directions
        </a>
      </section>

      <section className="mt-10">
        <SectionTitle>Tips from visitors</SectionTitle>
        <div className="mt-3 space-y-2">
          {tips.length === 0 && <EmptyNote>No tips yet. Be the first to share one.</EmptyNote>}
          {tips.map(t => (
            <figure key={t.id} className="border-l-2 border-sand py-1 pl-4">
              <blockquote className="text-[15px] leading-6">{t.text}</blockquote>
              <figcaption className="mt-1 text-xs text-faint">{t.authorId === 'me' ? 'You' : userById(t.authorId)?.name ?? 'Anonymous'}</figcaption>
            </figure>
          ))}
        </div>

        <div className="mt-6 rounded-2xl border border-line bg-card p-3">
          <label htmlFor="tip" className="px-1 text-sm font-medium">Share a tip</label>
          <textarea
            id="tip"
            value={tip}
            onChange={e => setTip(e.target.value)}
            maxLength={280}
            placeholder="What should someone know before they go?"
            className="mt-2 h-20 w-full resize-none rounded-xl bg-paper p-3 text-sm outline-none focus:ring-1 focus:ring-ink"
          />
          <div className="mt-2 flex items-center justify-between gap-3">
            <label className="flex items-center gap-2 px-1 text-sm text-muted">
              <input type="checkbox" checked={anonymous} onChange={e => setAnonymous(e.target.checked)} className="h-4 w-4 accent-[#292722]" />
              Post anonymously
            </label>
            <button onClick={postTip} disabled={!tip.trim()} className="rounded-full bg-ink px-5 py-2.5 text-sm text-white disabled:opacity-30">Post</button>
          </div>
        </div>
      </section>
    </div>
  )
}
