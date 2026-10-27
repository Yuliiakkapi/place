import { ArrowRight, ChevronRight, Plus } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { OptionButton, PlaceBadges, PlaceImage, PlaceRow, SectionTitle, TextLink } from '../components/ui'
import { vibeLabel, vibes } from '../data/seed'
import { recommend, useVisiblePlaces } from '../services/recommendationService'
import { moodStore, profileStore, savedStore, todayKey } from '../services/store'
import type { Vibe } from '../types'

function greeting() {
  const h = new Date().getHours()
  return h < 5 ? 'Good evening' : h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening'
}

export function Today() {
  const nav = useNavigate()
  const profile = profileStore.use()
  const storedMood = moodStore.use()
  const saved = savedStore.use()
  const places = useVisiblePlaces()
  const vibe = storedMood?.date === todayKey() ? storedMood.vibe : null
  const [picking, setPicking] = useState(false)

  const picks = useMemo(() => recommend(places, profile, vibe, saved), [places, profile, vibe, saved])
  const [top, ...rest] = picks

  function chooseVibe(id: Vibe) {
    if (id === vibe) moodStore.set(null)
    else moodStore.set({ vibe: id, date: todayKey() })
    setPicking(false)
  }

  const showPicker = picking || !vibe

  return (
    <div className="pt-9 pb-4">
      <header>
        <p className="text-sm text-muted">{greeting()}{profile?.name ? `, ${profile.name}` : ''}</p>
        <h1 className="mt-1 text-3xl font-light tracking-[-.02em]">Where to today?</h1>
      </header>

      <section aria-labelledby="mood-title" className="mt-7">
        {showPicker ? (
          <>
            <div className="flex items-baseline justify-between">
              <h2 id="mood-title" className="font-medium">What are you in the mood for?</h2>
              {picking && <TextLink onClick={() => setPicking(false)}>Cancel</TextLink>}
            </div>
            <p className="mt-1 text-sm text-muted">Pick one. You can change it anytime.</p>
            <div className="mt-4 space-y-2">
              {vibes.map(v => <OptionButton key={v.id} label={v.label} hint={v.hint} selected={vibe === v.id} onClick={() => chooseVibe(v.id)} />)}
            </div>
          </>
        ) : (
          <div className="flex items-center justify-between border-y border-line py-3.5">
            <p id="mood-title" className="text-sm text-muted">
              Today you’re in the mood for <span className="font-medium text-ink">{vibeLabel(vibe!).toLowerCase()}</span>
            </p>
            <TextLink onClick={() => setPicking(true)}>Change</TextLink>
          </div>
        )}
      </section>

      {top && (
        <section className="mt-8">
          <SectionTitle>Picked for you</SectionTitle>
          <button
            onClick={() => nav(`/place/${top.place.id}`)}
            className="mt-3 w-full overflow-hidden rounded-[24px] border border-line bg-card text-left shadow-[0_10px_30px_rgba(55,44,32,.08)] transition hover:border-ink/30 active:scale-[.99]"
          >
            <PlaceImage place={top.place} className="h-48 w-full" />
            <div className="p-5">
              <PlaceBadges place={top.place} />
              <h3 className="mt-2 text-2xl font-light">{top.place.name}</h3>
              <p className="mt-1 text-sm leading-6 text-muted">{top.place.summary}</p>
              <div className="mt-4 flex items-center justify-between gap-3 border-t border-line pt-3">
                <p className="text-xs text-faint">{top.reasons.join(' · ') || top.place.category}</p>
                <span className="flex shrink-0 items-center gap-1 text-sm font-medium text-rust">View <ChevronRight size={16} /></span>
              </div>
            </div>
          </button>
        </section>
      )}

      <section className="mt-9">
        <SectionTitle action={<TextLink onClick={() => nav('/map')}>See all on map</TextLink>}>Also worth a visit</SectionTitle>
        <div className="mt-3 space-y-2">
          {rest.slice(0, 3).map(r => (
            <PlaceRow key={r.place.id} place={r.place} detail={r.reasons[0] ? `${r.place.category} · ${r.reasons[0]}` : undefined} onClick={() => nav(`/place/${r.place.id}`)} />
          ))}
        </div>
      </section>

      <section className="mt-9 rounded-[24px] bg-sand p-5">
        <h2 className="font-medium">Know a spot most people miss?</h2>
        <p className="mt-1 text-sm leading-6 text-muted">Add it to the map. You choose whether everyone or only friends can see it.</p>
        <button onClick={() => nav('/add-place')} className="mt-4 flex w-full items-center justify-between rounded-full bg-ink px-5 py-3.5 text-sm text-white">
          <span className="flex items-center gap-2"><Plus size={17} /> Share a place</span>
          <ArrowRight size={17} />
        </button>
      </section>
    </div>
  )
}
