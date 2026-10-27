import { ChevronRight, Plus, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { CircleMarker, MapContainer, TileLayer, useMap, useMapEvents } from 'react-leaflet'
import { useNavigate } from 'react-router-dom'
import 'leaflet/dist/leaflet.css'
import { PlaceBadges, PlaceImage } from '../components/ui'
import { AARHUS } from '../data/seed'
import { useVisiblePlaces } from '../services/recommendationService'
import { savedStore } from '../services/store'
import type { Place } from '../types'

const RUST = '#9d5638'
const MOSS = '#4f6b5a'

const filters: { id: string; label: string; test: (p: Place, saved: string[]) => boolean }[] = [
  { id: 'all', label: 'All', test: () => true },
  { id: 'hidden', label: 'Hidden gems', test: p => p.hidden },
  { id: 'community', label: 'Shared by people', test: p => !!p.addedBy },
  { id: 'saved', label: 'Saved', test: (p, saved) => saved.includes(p.id) },
  { id: 'indoor', label: 'Indoors', test: p => p.indoor },
  { id: 'outdoor', label: 'Outdoors', test: p => !p.indoor },
]

function FitPlaces({ places }: { places: Place[] }) {
  const map = useMap()
  useEffect(() => {
    if (places.length === 1) map.setView([places[0].lat, places[0].lng], 14, { animate: true })
    else if (places.length > 1) map.fitBounds(places.map(p => [p.lat, p.lng]), { padding: [40, 40], maxZoom: 14, animate: true })
  }, [map, places])
  return null
}

function ClearOnMapClick({ onClear }: { onClear: () => void }) {
  useMapEvents({ click: onClear })
  return null
}

export function MapPage() {
  const nav = useNavigate()
  const places = useVisiblePlaces()
  const saved = savedStore.use()
  const [filterId, setFilterId] = useState('all')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const filter = filters.find(f => f.id === filterId)!
  const shown = useMemo(() => places.filter(p => filter.test(p, saved)), [places, filter, saved])
  const selected = shown.find(p => p.id === selectedId)

  return (
    <div className="relative -mx-5 -mb-28 h-[calc(100dvh-68px)] overflow-hidden bg-sage">
      <MapContainer center={AARHUS} zoom={13} scrollWheelZoom zoomControl={false} className="h-full w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitPlaces places={shown} />
        <ClearOnMapClick onClear={() => setSelectedId(null)} />
        {shown.map(p => {
          const isSelected = p.id === selectedId
          return (
            <CircleMarker
              key={p.id}
              center={[p.lat, p.lng]}
              radius={isSelected ? 13 : 9}
              bubblingMouseEvents={false}
              pathOptions={{ color: isSelected ? '#292722' : '#fff', weight: 3, fillColor: p.addedBy ? MOSS : RUST, fillOpacity: 1 }}
              eventHandlers={{ click: () => setSelectedId(p.id) }}
            />
          )
        })}
      </MapContainer>

      <div className="pointer-events-none absolute inset-x-0 top-0 z-[500] bg-gradient-to-b from-paper/90 to-transparent px-4 pb-6 pt-5">
        <div className="pointer-events-auto flex items-center justify-between gap-3">
          <h1 className="text-2xl font-light">Map</h1>
          <button onClick={() => nav('/add-place')} className="flex items-center gap-1.5 rounded-full bg-ink px-4 py-2.5 text-sm text-white shadow-lg">
            <Plus size={16} /> Add a place
          </button>
        </div>
        <div role="radiogroup" aria-label="Filter places" className="pointer-events-auto -mx-4 mt-3 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none]">
          {filters.map(f => (
            <button
              key={f.id}
              role="radio"
              aria-checked={filterId === f.id}
              onClick={() => { setFilterId(f.id); setSelectedId(null) }}
              className={`shrink-0 rounded-full border px-3.5 py-2 text-sm shadow-sm transition ${filterId === f.id ? 'border-ink bg-ink text-white' : 'border-line bg-card'}`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {shown.length === 0 && (
        <div className="absolute inset-x-6 top-40 z-[500] rounded-2xl bg-card p-4 text-center text-sm text-muted shadow-lg">
          {filterId === 'saved' ? 'You haven’t saved any places yet. Tap the bookmark on a place to save it.' : 'No places match this filter yet.'}
        </div>
      )}

      {selected ? (
        <div className="absolute inset-x-3 bottom-[84px] z-[600] float-in">
          <div className="relative flex gap-3 rounded-[22px] bg-card p-3 shadow-xl">
            <PlaceImage place={selected} className="h-24 w-24 shrink-0 rounded-2xl" />
            <div className="min-w-0 flex-1 py-0.5 pr-6">
              <p className="truncate text-lg font-medium leading-tight">{selected.name}</p>
              <p className="mt-0.5 truncate text-xs text-muted">{selected.category} · {selected.area}</p>
              <div className="mt-1.5"><PlaceBadges place={selected} /></div>
              <button onClick={() => nav(`/place/${selected.id}`)} className="mt-2 flex items-center gap-0.5 text-sm font-medium text-rust">
                View place <ChevronRight size={16} />
              </button>
            </div>
            <button onClick={() => setSelectedId(null)} aria-label="Close preview" className="absolute right-2 top-2 rounded-full p-1.5 text-faint hover:bg-black/5 hover:text-ink">
              <X size={16} />
            </button>
          </div>
        </div>
      ) : (
        <div className="absolute bottom-[84px] left-3 z-[500] flex gap-3 rounded-full bg-card/95 px-3.5 py-2 text-xs text-muted shadow-md">
          <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full" style={{ background: RUST }} /> Curated</span>
          <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full" style={{ background: MOSS }} /> Shared by people</span>
          <span className="text-faint">· {shown.length} places</span>
        </div>
      )}
    </div>
  )
}
