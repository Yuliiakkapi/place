import { ArrowRight, Bookmark, ChevronRight, Coffee, Compass, Gem, Leaf, Moon, Plus, Users, Wind, type LucideIcon } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Avatar, AvatarStack, OptionButton, PhotoCard, Pill, PlaceImage, SectionTitle, SeeAll, Sheet } from '../components/ui'
import { users, vibeLabel, vibes } from '../data/seed'
import { recommend, useVisiblePlaces } from '../services/recommendationService'
import { moodStore, profileStore, savedStore, todayKey, toggleIn } from '../services/store'
import type { Vibe } from '../types'
import { usePageTitle } from '../components/usePageTitle'
import { AutumnLeaves } from '../components/AutumnLeaves'

const vibeIcons: Record<Vibe, LucideIcon> = { calm: Moon, outdoors: Wind, company: Users, new: Compass, cozy: Coffee }

function greeting() {
  const h = new Date().getHours()
  return h < 5 ? 'Good evening' : h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening'
}

export function Today() {
  usePageTitle('Explore')
  const nav = useNavigate()
  const profile = profileStore.use()
  const storedMood = moodStore.use()
  const saved = savedStore.use()
  const places = useVisiblePlaces()
  const vibe = storedMood?.date === todayKey() ? storedMood.vibe : null
  const [sheetOpen, setSheetOpen] = useState(false)
  const VibeIcon = vibe ? vibeIcons[vibe] : Leaf

  const picks = useMemo(() => recommend(places, profile, vibe), [places, profile, vibe])
  const [top, ...rest] = picks
  const friendShares = places.filter(p => p.addedBy && users.find(u => u.id === p.addedBy)?.isFriend)
  const friendNames = [...new Set(friendShares.map(p => users.find(u => u.id === p.addedBy)!.name))]

  function chooseVibe(id: Vibe) {
    moodStore.set(id === vibe ? null : { vibe: id, date: todayKey() })
    setSheetOpen(false)
  }

  return (
    <div className="pb-4">
      <header className="relative -mx-5 overflow-hidden bg-gradient-to-b from-card via-[#fdfbf7] to-paper px-5 pb-4 pt-12">
        <AutumnLeaves count={9} pace={0.45} />
        <div className="relative flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-muted">{greeting()}{profile?.name ? `, ${profile.name}` : ''}</p>
            <h1 className="display mt-1 text-3xl">Where to today?</h1>
          </div>
          <button onClick={() => nav('/profile')} aria-label="Your profile" className="rounded-full">
            <Avatar name={profile?.name || 'You'} size={44} ring />
          </button>
        </div>

        <button
          onClick={() => setSheetOpen(true)}
          className="glass relative mt-6 flex w-full items-center gap-3 rounded-full p-2 pr-3 text-left active:scale-[.98]"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-peach text-accent-ink">
            <VibeIcon size={18} />
          </span>
          <span className="min-w-0 flex-1">
            {vibe ? (
              <>
                <span className="block text-xs text-muted">Today’s vibe</span>
                <span className="block truncate text-base font-semibold">{vibeLabel(vibe)}</span>
              </>
            ) : (
              <span className="block text-base text-muted">What’s your vibe today?</span>
            )}
          </span>
          <span className="rounded-full bg-black/[.05] px-3 py-2 text-xs font-medium">{vibe ? 'Change' : 'Choose'}</span>
        </button>
      </header>

      {top && (
        <section className="mt-5">
          <article className="relative transition-[scale] duration-200 ease-out has-[.card-link:active]:scale-[.98]">
            <div className="relative h-64 overflow-hidden rounded-lg">
              <PlaceImage place={top.place} className="absolute inset-0 h-full w-full" />
              <span className="absolute inset-0 bg-gradient-to-b from-[#3d2a20]/25 via-transparent to-[#3d2a20]/35" />
              <span className="absolute left-4 top-4"><Pill tone="solid"><Leaf size={12} /> Picked for you</Pill></span>
            </div>

            <div className="card-shadow relative mx-3 -mt-16 rounded-md bg-card p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="display text-2xl">{top.place.name}</h2>
                  <p className="mt-1 truncate text-sm text-muted">{top.place.category} · {top.place.area}</p>
                </div>
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ink text-card"><ArrowRight size={18} /></span>
              </div>
              <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted">{top.place.summary}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {top.reasons.map(r => r === 'Hidden gem' ? <Pill key={r} tone="gem"><Gem size={12} /> {r}</Pill> : <Pill key={r} tone="honey">{r}</Pill>)}
              </div>
            </div>

            <button onClick={() => nav(`/place/${top.place.id}`)} aria-label={`View ${top.place.name}`} className="card-link absolute inset-0 z-10 rounded-lg" />
            <button
              onClick={() => savedStore.set(toggleIn(saved, top.place.id))}
              aria-pressed={saved.includes(top.place.id)}
              aria-label={saved.includes(top.place.id) ? `Remove ${top.place.name} from saved` : `Save ${top.place.name}`}
              className={`card-shadow absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full ${saved.includes(top.place.id) ? 'bg-ink text-card' : 'bg-card text-ink'}`}
            >
              <Bookmark size={17} fill={saved.includes(top.place.id) ? 'currentColor' : 'none'} />
            </button>
          </article>
        </section>
      )}

      <section className="mt-8">
        <SectionTitle action={<SeeAll onClick={() => nav('/map')}>Map</SeeAll>}>More for you</SectionTitle>
        <div className="no-scrollbar -mx-5 mt-3 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-5 px-5 pb-2">
          {rest.slice(0, 6).map(r => (
            <PhotoCard
              key={r.place.id}
              place={r.place}
              tags={[r.place.hidden ? 'Hidden gem' : r.place.indoor ? 'Indoors' : 'Outdoors']}
              onClick={() => nav(`/place/${r.place.id}`)}
            />
          ))}
        </div>
      </section>

      {friendShares.length > 0 && (
        <section className="mt-7">
          <SectionTitle>Your people shared</SectionTitle>
          <button onClick={() => nav('/people')} className="card-shadow mt-3 flex w-full items-center gap-3 rounded-md bg-card p-4 text-left">
            <AvatarStack names={friendNames} size={36} />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-semibold">{friendNames.join(', ')}</span>
              <span className="block text-xs text-muted">{friendShares.length} {friendShares.length === 1 ? 'place' : 'places'} for friends</span>
            </span>
            <span className="relative mr-1 h-12 w-16 shrink-0">
              {friendShares.slice(0, 2).map((p, i) => (
                <PlaceImage key={p.id} place={p} className={`absolute top-0 h-12 w-12 rounded-sm border-2 border-white card-shadow ${i ? 'right-0 rotate-6' : 'left-0 -rotate-6'}`} />
              ))}
            </span>
            <ChevronRight size={18} className="shrink-0 text-faint" />
          </button>
        </section>
      )}

      <section className="mt-7 overflow-hidden rounded-lg bg-peach p-5">
        <h2 className="display text-2xl">Know a hidden gem?</h2>
        <p className="mt-2 text-sm leading-6 text-muted">Put it on the map. You choose if everyone or only friends can see it.</p>
        <button onClick={() => nav('/add-place')} className="mt-4 flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-semibold text-card">
          <Plus size={17} /> Share a place
        </button>
      </section>

      <Sheet open={sheetOpen} onClose={() => setSheetOpen(false)} title="What’s your vibe today?">
        <p className="-mt-2 mb-4 text-sm text-muted">Pick one. You can change it anytime, and tapping it again clears it.</p>
        <div className="space-y-2">
          {vibes.map(v => <OptionButton key={v.id} label={v.label} hint={v.hint} selected={vibe === v.id} onClick={() => chooseVibe(v.id)} />)}
        </div>
      </Sheet>
    </div>
  )
}
