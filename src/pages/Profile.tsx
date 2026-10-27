import { Bookmark, Globe, Leaf, Lock, MapPinPlus, MessageSquareText, Plus, Settings } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Avatar, EmptyNote, Pill, PlaceImage, PlaceRow, SectionTitle, SeeAll } from '../components/ui'
import { interestLabel } from '../data/seed'
import { useVisiblePlaces } from '../services/recommendationService'
import { contributionsStore, profileStore, savedStore, secretStore, tipsStore } from '../services/store'
import { usePageTitle } from '../components/usePageTitle'
import { AutumnLeaves } from '../components/AutumnLeaves'

export function Profile() {
  usePageTitle('Profile')
  const nav = useNavigate()
  const profile = profileStore.use()!
  const saved = savedStore.use()
  const mine = contributionsStore.use()
  const tips = tipsStore.use()
  const leafSeeker = secretStore.use()
  const places = useVisiblePlaces()
  const savedPlaces = saved.map(id => places.find(p => p.id === id)).filter(p => !!p)
  const addedNames = new Set(mine.map(p => p.name.toLowerCase()))
  const favouritesToAdd = profile.favourites.filter(f => !addedNames.has(f.toLowerCase()))
  const name = profile.name || 'You'

  const stats = [
    { label: 'Saved', value: savedPlaces.length, icon: Bookmark },
    { label: 'Shared', value: mine.length, icon: MapPinPlus },
    { label: 'Tips', value: tips.length, icon: MessageSquareText },
  ]

  return (
    <div className="pb-4">
      <header className="relative -mx-5 overflow-hidden bg-gradient-to-b from-card via-[#fdfbf7] to-paper px-5 pb-2 pt-12">
        <AutumnLeaves count={7} pace={0.55} />
        <div className="relative flex justify-end">
          <button onClick={() => nav('/settings')} className="glass flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium">
            <Settings size={16} /> Settings
          </button>
        </div>
        <div className="relative flex flex-col items-center text-center">
          <Avatar name={name} size={84} ring />
          <h1 className="display mt-3 text-3xl leading-tight">{name}</h1>
          <p className="mt-1 text-sm text-muted">Aarhus · {profile.interests.map(interestLabel).join(', ')}</p>
          {leafSeeker && (
            <button onClick={() => nav('/place/golden-hour-bench')} className="mt-3" aria-label="Leaf seeker badge: open your secret spot">
              <Pill tone="honey"><Leaf size={12} /> Leaf seeker</Pill>
            </button>
          )}
          <button onClick={() => nav('/onboarding?edit=1')} className="glass mt-3 rounded-full px-4 py-2 text-xs font-semibold">Edit preferences</button>
        </div>
      </header>

      <dl className="mt-5 grid grid-cols-3 gap-2">
        {stats.map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-md bg-black/[.035] p-4">
            <dt className="flex items-center gap-2 text-xs text-muted"><Icon size={13} /> {label}</dt>
            <dd className="display mt-1 text-3xl">{value}</dd>
          </div>
        ))}
      </dl>

      <section className="mt-8">
        <SectionTitle action={savedPlaces.length > 0 ? <SeeAll onClick={() => nav('/map?filter=saved')}>On map</SeeAll> : undefined}>Saved places</SectionTitle>
        <div className="mt-3">
          {savedPlaces.length === 0 && <EmptyNote>Places you save show up here. Tap <strong>Save</strong> on any place.</EmptyNote>}
          <div className="grid grid-cols-2 gap-2">
            {savedPlaces.map(p => (
              <button key={p.id} onClick={() => nav(`/place/${p.id}`)} className="relative h-40 overflow-hidden rounded-md text-left active:scale-[.98]">
                <PlaceImage place={p} className="absolute inset-0 h-full w-full" />
                <span className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <span className="absolute inset-x-3 bottom-3 text-white">
                  <span className="block text-sm font-semibold leading-tight">{p.name}</span>
                  <span className="block text-xs text-white/75">{p.category}</span>
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-8">
        <SectionTitle action={<SeeAll onClick={() => nav('/add-place')}>Add</SeeAll>}>Places you shared</SectionTitle>
        <div className="mt-3 space-y-2">
          {mine.length === 0 && <EmptyNote>You haven’t shared any places yet.</EmptyNote>}
          {mine.map(p => (
            <PlaceRow key={p.id} place={p} detail={`${p.category} · ${p.visibility === 'public' ? 'Everyone' : 'Friends only'}`} onClick={() => nav(`/place/${p.id}`)} />
          ))}
        </div>
        {mine.length > 0 && (
          <p className="mt-2 flex items-center gap-3 px-1 text-xs text-faint">
            <span className="flex items-center gap-1"><Globe size={12} /> Everyone can see</span>
            <span className="flex items-center gap-1"><Lock size={12} /> Friends only</span>
          </p>
        )}
      </section>

      {favouritesToAdd.length > 0 && (
        <section className="mt-8 rounded-lg bg-peach p-5">
          <h2 className="display text-xl">Your favourite spots</h2>
          <p className="mt-1 text-sm text-muted">You mentioned these when you joined. Add them so others can find them.</p>
          <ul className="mt-4 space-y-2">
            {favouritesToAdd.map(f => (
              <li key={f} className="flex items-center justify-between gap-3 rounded-md bg-card py-2 pl-4 pr-2">
                <span className="truncate text-sm">{f}</span>
                <button onClick={() => nav(`/add-place?name=${encodeURIComponent(f)}`)} className="flex shrink-0 items-center gap-1 rounded-full bg-ink px-4 py-2 text-xs font-semibold text-card">
                  <Plus size={13} /> Add to map
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
