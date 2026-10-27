import { useEffect, useMemo, useState } from 'react'
import { CircleMarker, MapContainer, TileLayer, useMap } from 'react-leaflet'
import { Check, Filter, Plus, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { allPlaces } from '../services/community'
import type { Place } from '../types'
import 'leaflet/dist/leaflet.css'

const aarhus: [number, number] = [56.1539, 10.2039]
const filters = [
  ['All', 'All places'], ['cozy', 'Cozy'], ['quiet', 'Quiet'], ['needAir', 'Fresh air'],
  ['wantCompany', 'Social'], ['alone', 'Alone'], ['outdoor', 'Outdoors'], ['indoor', 'Indoors'],
] as const

function FitPlaces({ visiblePlaces }: { visiblePlaces: Place[] }) {
  const map = useMap()
  useEffect(() => {
    if (visiblePlaces.length === 1) map.setView([visiblePlaces[0].lat, visiblePlaces[0].lng], 14, { animate: true })
    else if (visiblePlaces.length > 1) map.fitBounds(visiblePlaces.map(place => [place.lat, place.lng]), { padding: [36, 36], maxZoom: 13, animate: true })
  }, [map, visiblePlaces])
  return null
}

export function MapPage() {
  const [filter, setFilter] = useState('All')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const nav = useNavigate()
  const shown = useMemo(() => { const places = allPlaces(); return filter === 'All' ? places : places.filter(place => place.moods.includes(filter as never) || place.situations.includes(filter)) }, [filter])

  return <div className="relative -mx-5 -mb-28 h-[calc(100dvh-76px)] overflow-hidden bg-[#d8ded5]">
    <MapContainer center={aarhus} zoom={13} scrollWheelZoom className="h-full w-full" aria-label="Map of Aarhus places">
      <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
      <FitPlaces visiblePlaces={shown}/>
      {shown.map(place => <CircleMarker key={place.id} center={[place.lat, place.lng]} radius={10} pathOptions={{ color: '#fff', weight: 3, fillColor: '#9d5638', fillOpacity: 1 }} eventHandlers={{ click: () => nav(`/place/${place.id}`) }}/>) }
    </MapContainer>

    <div className="absolute inset-x-0 top-0 z-[500] flex items-start justify-between p-5"><div>
      <button onClick={() => setFiltersOpen(open => !open)} aria-expanded={filtersOpen} className="flex items-center gap-2 rounded-full bg-[#292722] px-5 py-3 text-sm text-white shadow-lg"><Filter size={16}/> Filter{filter !== 'All' && <span className="rounded-full bg-white/20 px-1.5 py-0.5 text-[10px]">1</span>}</button>
      {filtersOpen && <div className="mt-3 w-56 overflow-hidden rounded-2xl bg-[#f7f2ea] p-2 shadow-xl"><div className="flex items-center justify-between px-3 py-2"><span className="text-xs uppercase tracking-[.14em] text-[#817b72]">Show places</span><button onClick={() => setFiltersOpen(false)} aria-label="Close filters"><X size={16}/></button></div>{filters.map(([value, label]) => <button key={value} onClick={() => { setFilter(value); setFiltersOpen(false) }} className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm hover:bg-black/5"><span>{label}</span>{filter === value && <Check size={16} className="text-[#9d5638]"/>}</button>)}</div>}
    </div><button onClick={() => nav('/add-place')} className="flex items-center gap-2 rounded-full bg-[#292722] px-4 py-3 text-sm text-white shadow-lg"><Plus size={16}/> Add place</button></div>
  </div>
}
