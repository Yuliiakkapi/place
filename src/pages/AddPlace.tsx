import { ImagePlus, Lock, Globe, X } from 'lucide-react'
import { useState } from 'react'
import { CircleMarker, MapContainer, TileLayer, useMapEvents } from 'react-leaflet'
import { useNavigate, useSearchParams } from 'react-router-dom'
import 'leaflet/dist/leaflet.css'
import { BackButton, OptionButton } from '../components/ui'
import { AARHUS, categoryOptions } from '../data/seed'
import { contributionsStore } from '../services/store'
import type { Visibility } from '../types'

function PickLocation({ onPick }: { onPick: (pos: [number, number]) => void }) {
  useMapEvents({ click: e => onPick([e.latlng.lat, e.latlng.lng]) })
  return null
}

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
  const nav = useNavigate()
  const [params] = useSearchParams()
  const [name, setName] = useState(params.get('name') ?? '')
  const [summary, setSummary] = useState('')
  const [category, setCategory] = useState(categoryOptions[0])
  const [position, setPosition] = useState<[number, number] | null>(null)
  const [visibility, setVisibility] = useState<Visibility>('public')
  const [image, setImage] = useState<string>()
  const [error, setError] = useState('')

  async function pickPhoto(file?: File) {
    if (!file) return
    try { setImage(await resizeImage(file)) } catch { setError('That photo could not be used. Try a different one.') }
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
    <form onSubmit={submit} className="pb-8 pt-5" noValidate>
      <BackButton />
      <h1 className="mt-4 text-3xl font-light">Share a place</h1>
      <p className="mt-2 text-sm leading-6 text-muted">Small, local, a little hidden: the spots you’d tell a friend about.</p>

      <label className="mt-7 block text-sm font-medium" htmlFor="place-name">Name</label>
      <input id="place-name" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. The bench behind the library"
        className="mt-2 w-full rounded-2xl border border-line bg-card px-4 py-3.5 outline-none focus:border-ink" />

      <label className="mt-6 block text-sm font-medium" htmlFor="place-summary">Why is it worth a visit?</label>
      <textarea id="place-summary" value={summary} onChange={e => setSummary(e.target.value)} maxLength={200} placeholder="One or two sentences is enough."
        className="mt-2 h-24 w-full resize-none rounded-2xl border border-line bg-card px-4 py-3.5 outline-none focus:border-ink" />

      <p className="mt-6 text-sm font-medium">What kind of place is it?</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {categoryOptions.map(c => (
          <button type="button" key={c.label} aria-pressed={category === c} onClick={() => setCategory(c)}
            className={`rounded-full border px-3.5 py-2 text-sm ${category === c ? 'border-ink bg-ink text-white' : 'border-line bg-card'}`}>
            {c.label}
          </button>
        ))}
      </div>

      <p className="mt-6 text-sm font-medium">Where is it?</p>
      <p className="mt-0.5 text-xs text-muted">{position ? 'Pin placed. Tap again to move it.' : 'Tap the map to drop a pin.'}</p>
      <div className="mt-2 h-56 overflow-hidden rounded-2xl border border-line">
        <MapContainer center={AARHUS} zoom={13} className="h-full w-full" attributionControl={false}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <PickLocation onPick={pos => { setPosition(pos); setError('') }} />
          {position && <CircleMarker center={position} radius={10} pathOptions={{ color: '#fff', weight: 3, fillColor: '#4f6b5a', fillOpacity: 1 }} />}
        </MapContainer>
      </div>

      <p className="mt-6 text-sm font-medium">Photo <span className="font-normal text-faint">(optional)</span></p>
      {image ? (
        <div className="relative mt-2">
          <img src={image} alt="Your photo" className="h-40 w-full rounded-2xl object-cover" />
          <button type="button" onClick={() => setImage(undefined)} aria-label="Remove photo" className="absolute right-2 top-2 rounded-full bg-card p-1.5 shadow"><X size={16} /></button>
        </div>
      ) : (
        <label className="mt-2 flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-dashed border-ink/25 py-5 text-sm text-muted hover:border-ink/50">
          <ImagePlus size={18} /> Add a photo
          <input type="file" accept="image/*" className="sr-only" onChange={e => pickPhoto(e.target.files?.[0])} />
        </label>
      )}

      <p className="mt-6 text-sm font-medium">Who can see it?</p>
      <div className="mt-2 space-y-2">
        <OptionButton label="Everyone" hint="Shown on the community map" selected={visibility === 'public'} onClick={() => setVisibility('public')} />
        <OptionButton label="Only my friends" hint="Hidden from people you don’t know" selected={visibility === 'friends'} onClick={() => setVisibility('friends')} />
      </div>
      <p className="mt-3 flex items-center gap-1.5 text-xs text-faint">
        {visibility === 'public' ? <Globe size={13} /> : <Lock size={13} />}
        Demo: places are saved on this device only.
      </p>

      {error && <p role="alert" className="mt-5 text-sm text-red-700">{error}</p>}
      <button type="submit" className="mt-6 w-full rounded-full bg-ink py-4 text-white">Add to map</button>
    </form>
  )
}
