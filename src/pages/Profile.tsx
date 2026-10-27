import { Globe, Lock, Plus, Settings } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Avatar, EmptyNote, Eyebrow, PlaceRow, SectionTitle, TextLink } from '../components/ui'
import { interestLabel } from '../data/seed'
import { useVisiblePlaces } from '../services/recommendationService'
import { contributionsStore, profileStore, savedStore, tipsStore } from '../services/store'

export function Profile() {
  const nav = useNavigate()
  const profile = profileStore.use()!
  const saved = savedStore.use()
  const mine = contributionsStore.use()
  const tips = tipsStore.use()
  const places = useVisiblePlaces()
  const savedPlaces = saved.map(id => places.find(p => p.id === id)).filter(p => !!p)
  const addedNames = new Set(mine.map(p => p.name.toLowerCase()))
  const favouritesToAdd = profile.favourites.filter(f => !addedNames.has(f.toLowerCase()))

  return (
    <div className="pt-9 pb-4">
      <div className="flex items-start justify-between">
        <div>
          <Eyebrow>Profile</Eyebrow>
          <h1 className="mt-2 text-3xl font-light">{profile.name || 'You'}</h1>
        </div>
        <button onClick={() => nav('/settings')} className="flex items-center gap-1.5 rounded-full border border-line bg-card px-3.5 py-2 text-sm">
          <Settings size={16} /> Settings
        </button>
      </div>

      <section className="mt-6 flex items-center gap-4">
        <Avatar name={profile.name || 'You'} size={56} />
        <div className="min-w-0 flex-1">
          <p className="text-sm text-muted">Aarhus</p>
          <p className="mt-0.5 text-sm">{profile.interests.map(interestLabel).join(' · ')}</p>
        </div>
      </section>
      <div className="mt-3"><TextLink onClick={() => nav('/onboarding?edit=1')}>Edit preferences</TextLink></div>

      <dl className="mt-6 grid grid-cols-3 border-y border-line py-4 text-center">
        <div><dt className="text-xs text-muted">Saved</dt><dd className="mt-1 text-2xl font-light">{savedPlaces.length}</dd></div>
        <div><dt className="text-xs text-muted">Shared</dt><dd className="mt-1 text-2xl font-light">{mine.length}</dd></div>
        <div><dt className="text-xs text-muted">Tips</dt><dd className="mt-1 text-2xl font-light">{tips.length}</dd></div>
      </dl>

      <section className="mt-8">
        <SectionTitle>Saved places</SectionTitle>
        <div className="mt-3 space-y-2">
          {savedPlaces.length === 0 && <EmptyNote>Places you save will show up here. Tap <strong>Save</strong> on any place.</EmptyNote>}
          {savedPlaces.map(p => <PlaceRow key={p.id} place={p} onClick={() => nav(`/place/${p.id}`)} />)}
        </div>
      </section>

      <section className="mt-9">
        <SectionTitle action={<TextLink onClick={() => nav('/add-place')}>Add a place</TextLink>}>Places you shared</SectionTitle>
        <div className="mt-3 space-y-2">
          {mine.length === 0 && <EmptyNote>You haven’t shared any places yet.</EmptyNote>}
          {mine.map(p => (
            <PlaceRow
              key={p.id}
              place={p}
              detail={`${p.category} · ${p.visibility === 'public' ? 'Everyone' : 'Friends only'}`}
              onClick={() => nav(`/place/${p.id}`)}
            />
          ))}
        </div>
        {mine.length > 0 && (
          <p className="mt-2 flex items-center gap-3 text-[11px] text-faint">
            <span className="flex items-center gap-1"><Globe size={12} /> Everyone can see</span>
            <span className="flex items-center gap-1"><Lock size={12} /> Friends only</span>
          </p>
        )}
      </section>

      {favouritesToAdd.length > 0 && (
        <section className="mt-9 rounded-[24px] bg-sand p-5">
          <h2 className="font-medium">Your favourite spots</h2>
          <p className="mt-1 text-sm text-muted">You mentioned these when you joined. Add them to the map so others can find them.</p>
          <ul className="mt-4 space-y-2">
            {favouritesToAdd.map(f => (
              <li key={f} className="flex items-center justify-between gap-3">
                <span className="truncate text-sm">{f}</span>
                <button onClick={() => nav(`/add-place?name=${encodeURIComponent(f)}`)} className="flex shrink-0 items-center gap-1 rounded-full bg-ink px-3.5 py-1.5 text-xs text-white">
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
