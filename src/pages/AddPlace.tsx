import { ImagePlus, LoaderCircle, Lock, Globe, X } from 'lucide-react'
import { useState } from 'react'
import { Marker } from 'react-map-gl/maplibre'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { categoryStyle } from '../components/category'
import { PlaceMap } from '../components/PlaceMap'
import { BackButton, OptionButton } from '../components/ui'
import { categoryOptions } from '../data/seed'
import { contributionsStore } from '../services/store'
import type { Visibility } from '../types'
import { usePageTitle } from '../components/usePageTitle'

function resizeImage(file: File, maxSize = 900): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      const scale = Math.min(1, maxSize / Math.max(img.width, img.height))
      const canvas = document.createElement('canvas')
      canvas.width = Math.round(img.width * scale)
      canvas.height = Math.round(img.height * scale)
      canvas.getContext('2d')!.drawImage(img, 0, 0, canvas.width, canvas.height)
      URL.revokeObjectURL(url)
      resolve(canvas.toDataURL('image/jpeg', 0.75))
    }
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Could not read image')) }
    img.src = url
  })
}

export function AddPlace() {
  usePageTitle('Share a place')
  const nav = useNavigate()
  const [params] = useSearchParams()
  const [name, setName] = useState(params.get('name') ?? '')
  const [summary, setSummary] = useState('')
  const [category, setCategory] = useState(categoryOptions[0])
  const [position, setPosition] = useState<[number, number] | null>(null)
  const [visibility, setVisibility] = useState<Visibility>('public')
  const [image, setImage] = useState<string>()
  const [error, setError] = useState('')
  const [processing, setProcessing] = useState(false)

  async function pickPhoto(file?: File) {
    if (!file) return
    setProcessing(true)
    try { setImage(await resizeImage(file)) } catch { setError('That photo could not be used. Try a different one.') } finally { setProcessing(false) }
  }

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !summary.trim() || !position) {
      setError(!position ? 'Tap the map to mark where the place is.' : 'Add a name and a short description.')
      return
    }
    const id = `mine-${Date.now()}`
    contributionsStore.set(all => [{
      id, name: name.trim(), summary: summary.trim(), category: category.label, area: 'Aarhus',
      lat: position[0], lng: position[1], interests: [category.interest], vibes: ['new'],
      company: ['alone', 'friend'], indoor: category.interest === 'cafes' || category.interest === 'study',
      hidden: true, whyGo: [], image, addedBy: 'me', visibility,
    }, ...all])
    nav(`/place/${id}`, { replace: true })
  }

  return (
    <form onSubmit={submit} className="pb-8 pt-12" noValidate>
      <BackButton />
      <h1 className="display mt-5 text-3xl leading-tight">Share a place</h1>
      <p className="mt-2 text-sm leading-6 text-muted">Small, local, a little hidden: the spots you’d tell a friend about.</p>

      <label className="mt-7 block text-sm font-semibold" htmlFor="place-name">Name</label>
      <input id="place-name" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. The bench behind the library"
        className="mt-2 w-full card-shadow rounded-md bg-card px-4 py-4 outline-none focus:ring-2 focus:ring-accent/40" />

      <label className="mt-6 block text-sm font-semibold" htmlFor="place-summary">Why is it worth a visit?</label>
      <textarea id="place-summary" value={summary} onChange={e => setSummary(e.target.value)} maxLength={200} placeholder="One or two sentences is enough."
        className="mt-2 h-24 w-full resize-none card-shadow rounded-md bg-card px-4 py-4 outline-none focus:ring-2 focus:ring-accent/40" />

      <p className="mt-6 text-sm font-semibold">What kind of place is it?</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {categoryOptions.map(c => {
          const { icon: Icon, color } = categoryStyle[c.interest]
          const on = category === c
          return (
            <button type="button" key={c.label} aria-pressed={on} onClick={() => setCategory(c)}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium ${on ? 'bg-ink text-white' : 'card-shadow bg-card'}`}>
              <Icon size={14} style={{ color: on ? '#fff' : color }} />
              {c.label}
            </button>
          )
        })}
      </div>

      <p className="mt-6 text-sm font-semibold">Where is it?</p>
      <p className="mt-1 text-xs text-muted">{position ? 'Pin placed. Tap elsewhere or drag it to adjust.' : 'Tap the map to drop a pin.'}</p>
      <div className="card-shadow mt-2 h-60 overflow-hidden rounded-md">
        <PlaceMap zoom={12.5} onClick={e => { setPosition([e.lngLat.lat, e.lngLat.lng]); setError('') }}>
          {position && (
            <Marker latitude={position[0]} longitude={position[1]} anchor="bottom" draggable onDragEnd={e => setPosition([e.lngLat.lat, e.lngLat.lng])}>
              <span className="flex flex-col items-center float-drop">
                <span className="block h-7 w-7 rounded-full border-[3px] border-white" style={{ background: categoryStyle[category.interest].color }} />
                <span className="-mt-px h-0 w-0 border-x-[6px] border-t-[8px] border-x-transparent border-t-white" />
              </span>
            </Marker>
          )}
        </PlaceMap>
      </div>

      <p className="mt-6 text-sm font-semibold">Photo <span className="font-normal text-faint">(optional)</span></p>
      {image ? (
        <div className="relative mt-2">
          <img src={image} alt="Your photo" className="h-44 w-full rounded-md object-cover" />
          <button type="button" onClick={() => setImage(undefined)} aria-label="Remove photo" className="absolute right-2 top-2 rounded-full bg-card p-2 card-shadow"><X size={16} /></button>
        </div>
      ) : (
        <label className="mt-2 flex cursor-pointer items-center justify-center gap-2 rounded-md border-[1.5px] border-dashed border-ink/15 bg-card py-6 text-sm text-muted hover:border-ink/50">
          {processing ? <><LoaderCircle size={18} className="animate-spin" /> Preparing photo…</> : <><ImagePlus size={18} /> Add a photo</>}
          <input type="file" accept="image/*" className="sr-only" onChange={e => pickPhoto(e.target.files?.[0])} />
        </label>
      )}

      <p className="mt-6 text-sm font-semibold">Who can see it?</p>
      <div className="mt-2 space-y-2">
        <OptionButton label="Everyone" hint="Shown on the community map" selected={visibility === 'public'} onClick={() => setVisibility('public')} />
        <OptionButton label="Only my friends" hint="Hidden from people you don’t know" selected={visibility === 'friends'} onClick={() => setVisibility('friends')} />
      </div>
      <p className="mt-3 flex items-center gap-2 text-xs text-faint">
        {visibility === 'public' ? <Globe size={13} /> : <Lock size={13} />}
        Demo: places are saved on this device only.
      </p>

      {error && <p role="alert" className="mt-5 text-sm text-red-700">{error}</p>}
      <button type="submit" className="mt-6 w-full rounded-full bg-ink py-4 font-semibold text-white">Add to map</button>
    </form>
  )
}
