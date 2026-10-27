import { Bookmark, Check, MapPin, Navigation, UserPlus, Users } from 'lucide-react'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { placeStyle } from '../components/category'
import { Avatar, BackButton, EmptyNote, PlaceBadges, PlaceImage, SectionTitle, Sheet } from '../components/ui'
import { companyList, photoCredit, seedTips, userById, users } from '../data/seed'
import { useVisiblePlaces } from '../services/recommendationService'
import { invitedStore, savedStore, settingsStore, tipsStore, toggleIn } from '../services/store'
import { usePageTitle } from '../components/usePageTitle'

export function PlaceDetail() {
  const { id = '' } = useParams()
  const nav = useNavigate()
  const place = useVisiblePlaces().find(p => p.id === id)
  usePageTitle(place?.name ?? 'Place not found')
  const saved = savedStore.use()
  const invited = invitedStore.use()
  const myTips = tipsStore.use()
  const settings = settingsStore.use()
  const [inviteOpen, setInviteOpen] = useState(false)
  const [tip, setTip] = useState('')
  const [anonymous, setAnonymous] = useState(settings.anonymousTips)

  if (!place) {
    return (
      <div className="pt-12">
        <BackButton />
        <h1 className="display mt-8 text-2xl">This place isn’t available</h1>
        <p className="mt-1 text-sm text-muted">It may be friends-only or no longer shared.</p>
        <button onClick={() => nav('/map')} className="mt-5 rounded-full bg-ink px-5 py-3 text-sm font-medium text-white">Back to the map</button>
      </div>
    )
  }

  const isSaved = saved.includes(place.id)
  const tips = [...myTips.filter(t => t.placeId === place.id).reverse(), ...seedTips.filter(t => t.placeId === place.id)]
  const credit = photoCredit(place.id)
  const friends = users.filter(u => u.isFriend)
  const inviteKey = (userId: string) => `${place.id}:${userId}`
  const { color, tint, icon: CategoryIcon } = placeStyle(place)

  function postTip() {
    const text = tip.trim()
    if (!text) return
    tipsStore.set(all => [...all, { id: `tip-${Date.now()}`, placeId: place!.id, text, authorId: anonymous ? undefined : 'me', createdAt: new Date().toISOString() }])
    setTip('')
  }

  return (
    <div className="pb-6">
      <div className="relative -mx-5 h-96">
        <PlaceImage place={place} className="h-full w-full" />
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/30 to-transparent" />
        <div className="absolute inset-x-5 top-12 flex justify-between">
          <BackButton floating />
          <button
            onClick={() => savedStore.set(toggleIn(saved, place.id))}
            aria-pressed={isSaved}
            aria-label={isSaved ? 'Remove from saved' : 'Save place'}
            className={`flex h-10 items-center gap-2 rounded-full px-4 text-sm font-medium float-shadow backdrop-blur ${isSaved ? 'bg-ink text-white' : 'bg-card/90'}`}
          >
            <Bookmark size={16} fill={isSaved ? 'currentColor' : 'none'} /> {isSaved ? 'Saved' : 'Save'}
          </button>
        </div>
      </div>

      <div className="relative -mx-5 -mt-10 rounded-t-lg bg-paper px-5 pt-6">
        <div className="flex items-start gap-3">
          <span style={{ background: tint, color }} className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md">
            <CategoryIcon size={22} />
          </span>
          <div className="min-w-0">
            <h1 className="display text-3xl">{place.name}</h1>
            <p className="mt-1 text-sm text-muted">{place.category} · {place.area}</p>
          </div>
        </div>
        <div className="mt-4"><PlaceBadges place={place} /></div>
        <p className="mt-4 text-base leading-7">{place.summary}</p>

        <div className="mt-5 grid grid-cols-2 gap-2">
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lng}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 rounded-full bg-ink py-4 text-sm font-semibold text-white"
          >
            <Navigation size={16} /> Directions
          </a>
          <button onClick={() => setInviteOpen(true)} className="card-shadow flex items-center justify-center gap-2 rounded-full bg-card py-4 text-sm font-semibold">
            <UserPlus size={16} /> Invite a friend
          </button>
        </div>

        <dl className="mt-6 grid grid-cols-2 gap-2">
          <div className="rounded-md bg-black/[.035] p-4">
            <dt className="flex items-center gap-2 text-xs text-muted"><Users size={13} /> Good for</dt>
            <dd className="mt-2 text-sm font-semibold first-letter:uppercase">{companyList(place.company)}</dd>
          </div>
          <div className="rounded-md bg-black/[.035] p-4">
            <dt className="flex items-center gap-2 text-xs text-muted"><MapPin size={13} /> Setting</dt>
            <dd className="mt-2 text-sm font-semibold">{place.indoor ? 'Indoors' : 'Outdoors'} · {place.area}</dd>
          </div>
        </dl>

        {place.whyGo.length > 0 && (
          <section className="mt-8">
            <SectionTitle>Why go</SectionTitle>
            <ul className="mt-3 space-y-3">
              {place.whyGo.map(w => (
                <li key={w} className="flex items-start gap-3 text-base leading-6">
                  <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-mint text-[#3f6b4a]"><Check size={12} strokeWidth={3} /></span>
                  {w}
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="mt-9">
          <SectionTitle>Tips from visitors</SectionTitle>
          <div className="mt-3 space-y-2">
            {tips.length === 0 && <EmptyNote>No tips yet. Be the first to share one.</EmptyNote>}
            {tips.map(t => {
              const author = t.authorId === 'me' ? 'You' : userById(t.authorId)?.name
              return (
                <figure key={t.id} className="rounded-md bg-black/[.035] p-4">
                  <blockquote className="text-base leading-6">“{t.text}”</blockquote>
                  <figcaption className="mt-3 flex items-center gap-2 text-xs text-muted">
                    {author ? <Avatar name={author} size={20} /> : <span className="h-5 w-5 rounded-full bg-black/10" />}
                    {author ?? 'Anonymous'}
                  </figcaption>
                </figure>
              )
            })}
          </div>

          <div className="card-shadow mt-4 rounded-md bg-card p-4">
            <label htmlFor="tip" className="text-sm font-semibold">Share a tip</label>
            <textarea
              id="tip"
              value={tip}
              onChange={e => setTip(e.target.value)}
              maxLength={280}
              placeholder="What should someone know before they go?"
              className="mt-2 h-20 w-full resize-none rounded-md bg-paper p-3 text-sm outline-none focus:ring-2 focus:ring-accent/40"
            />
            <div className="mt-2 flex items-center justify-between gap-3">
              <label className="flex items-center gap-2 text-sm text-muted">
                <input type="checkbox" checked={anonymous} onChange={e => setAnonymous(e.target.checked)} className="h-4 w-4 accent-[#1f2d25]" />
                Post anonymously
              </label>
              <button onClick={postTip} disabled={!tip.trim()} className="rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white disabled:opacity-25">Post</button>
            </div>
          </div>
        </section>

        {credit && (
          <p className="mt-8 text-xs text-faint">
            Photo: <a href={credit.source} target="_blank" rel="noreferrer" className="underline">{credit.author || 'Wikimedia Commons'}</a>, {credit.license}
          </p>
        )}
      </div>

      <Sheet open={inviteOpen} onClose={() => setInviteOpen(false)} title={`Invite to ${place.name}`}>
        <div className="space-y-2">
          {friends.map(f => {
            const done = invited.includes(inviteKey(f.id))
            return (
              <div key={f.id} className="card-shadow flex items-center gap-3 rounded-md bg-card p-3">
                <Avatar name={f.name} size={38} />
                <span className="flex-1 font-medium">{f.name}</span>
                <button
                  onClick={() => invitedStore.set(toggleIn(invited, inviteKey(f.id)))}
                  className={`flex items-center gap-1 rounded-full px-4 py-2 text-xs font-semibold ${done ? 'bg-mint text-[#3f6b4a]' : 'bg-ink text-white'}`}
                >
                  {done ? <><Check size={13} /> Invited</> : 'Invite'}
                </button>
              </div>
            )
          })}
        </div>
        <p className="mt-3 text-xs text-faint">Demo only: invitations are not actually sent.</p>
      </Sheet>
    </div>
  )
}
