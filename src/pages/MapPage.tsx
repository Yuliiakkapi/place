import { Bookmark, ChevronRight, Gem, Leaf, Plus, Search, UsersRound, X, type LucideIcon } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Marker, type MapRef } from 'react-map-gl/maplibre'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { categoryStyle } from '../components/category'
import { AutumnLeaves } from '../components/AutumnLeaves'
import { Pin, PlaceMap } from '../components/PlaceMap'
import { Chip, PlaceImage, Pill } from '../components/ui'
import { interests, secretTriggers, userById } from '../data/seed'
import { useVisiblePlaces } from '../services/recommendationService'
import { savedStore, secretStore } from '../services/store'
import type { Place } from '../types'
import { usePageTitle } from '../components/usePageTitle'

type Filter = { id: string; label: string; icon?: LucideIcon; test: (p: Place, saved: string[]) => boolean }

const filters: Filter[] = [
  { id: 'all', label: 'All', test: () => true },
  { id: 'hidden', label: 'Hidden gems', icon: Gem, test: p => p.hidden },
  { id: 'community', label: 'Shared by people', icon: UsersRound, test: p => !!p.addedBy },
  { id: 'saved', label: 'Saved', icon: Bookmark, test: (p, saved) => saved.includes(p.id) },
  ...interests.map(i => ({ id: i.id, label: i.label, icon: categoryStyle[i.id].icon, test: (p: Place) => p.interests.includes(i.id) })),
]

const CARD = 296
const GAP = 12
const mapPadding = { top: 220, bottom: 250, left: 40, right: 40 }

export function MapPage() {
  usePageTitle('Map')
  const nav = useNavigate()
  const places = useVisiblePlaces()
  const saved = savedStore.use()
  const mapRef = useRef<MapRef>(null)
  const railRef = useRef<HTMLDivElement>(null)
  const [loaded, setLoaded] = useState(false)
  const [params] = useSearchParams()
  const [filterId, setFilterId] = useState(() => filters.some(f => f.id === params.get('filter')) ? params.get('filter')! : 'all')
  const [query, setQuery] = useState('')
  const [index, setIndex] = useState(0)
  const [celebrate, setCelebrate] = useState(false)
  const secretQuery = secretTriggers.includes(query.trim().toLowerCase())

  useEffect(() => {
    if (!celebrate) return
    const t = setTimeout(() => setCelebrate(false), 6500)
    return () => clearTimeout(t)
  }, [celebrate])

  function onSearch(value: string) {
    setQuery(value)
    if (secretTriggers.includes(value.trim().toLowerCase()) && !secretStore.get()) {
      secretStore.set(true)
      setCelebrate(true)
    }
  }

  const filter = filters.find(f => f.id === filterId)!
  const shown = useMemo(() => {
    if (secretQuery) return places.filter(p => p.secret)
    const q = query.trim().toLowerCase()
    return places.filter(p => filter.test(p, saved) && (!q || `${p.name} ${p.category} ${p.area}`.toLowerCase().includes(q)))
  }, [places, filter, saved, query, secretQuery])
  const selected = shown[index] ?? shown[0]

  const fitAll = useCallback((list: Place[]) => {
    const map = mapRef.current
    if (!map || list.length === 0) return
    if (list.length === 1) return void map.easeTo({ center: [list[0].lng, list[0].lat], zoom: 14, padding: mapPadding })
    const lngs = list.map(p => p.lng)
    const lats = list.map(p => p.lat)
    map.fitBounds([[Math.min(...lngs), Math.min(...lats)], [Math.max(...lngs), Math.max(...lats)]], { padding: mapPadding, maxZoom: 14, duration: 600 })
  }, [])

  useEffect(() => {
    setIndex(0)
    railRef.current?.scrollTo({ left: 0 })
    if (loaded) fitAll(shown)
  }, [loaded, shown, fitAll])

  function onRailScroll() {
    const rail = railRef.current
    if (!rail) return
    const next = Math.max(0, Math.min(shown.length - 1, Math.round(rail.scrollLeft / (CARD + GAP))))
    if (next === index) return
    setIndex(next)
    const p = shown[next]
    const map = mapRef.current
    if (p && map) map.easeTo({ center: [p.lng, p.lat], zoom: Math.max(map.getZoom(), 13.5), padding: mapPadding, duration: 450 })
  }

  function focusPin(i: number) {
    railRef.current?.scrollTo({ left: i * (CARD + GAP), behavior: 'smooth' })
  }

  return (
    <div className="relative -mx-5 -mb-32 h-[100dvh] overflow-hidden bg-[#f1ebe0]">
      {celebrate && (
        <div className="pointer-events-none fixed inset-0 z-[1500]">
          <AutumnLeaves count={36} pace={0.22} burst />
        </div>
      )}
      {celebrate && (
        <div role="status" className="glass-thick float-in absolute inset-x-5 top-40 z-[700] flex items-center gap-3 rounded-md p-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-honey text-[#8a5f14]"><Leaf size={18} /></span>
          <span className="min-w-0">
            <span className="block text-sm font-semibold">You found a secret autumn spot</span>
            <span className="block text-xs text-muted">The Golden Hour Bench is now on your map.</span>
          </span>
        </div>
      )}
      <PlaceMap ref={mapRef} onLoad={() => setLoaded(true)}>
        {shown.map((p, i) => {
          const isSelected = p.id === selected?.id
          return (
            <Marker
              key={p.id}
              latitude={p.lat}
              longitude={p.lng}
              anchor={isSelected && p.image ? 'bottom' : 'center'}
              style={{ zIndex: isSelected ? 3 : p.addedBy ? 2 : 1 }}
              onClick={e => { e.originalEvent.stopPropagation(); focusPin(i) }}
            >
              <span role="button" aria-label={p.name}><Pin place={p} selected={isSelected} /></span>
            </Marker>
          )
        })}
      </PlaceMap>

      <div className="pointer-events-none absolute inset-x-0 top-0 z-[500] bg-gradient-to-b from-paper/60 via-paper/20 to-transparent px-5 pb-8 pt-12">
        <div className="pointer-events-auto flex items-center gap-2">
          <label className="glass flex flex-1 items-center gap-2 rounded-full px-4 py-3">
            <Search size={18} className="shrink-0 text-muted" />
            <input
              value={query}
              onChange={e => onSearch(e.target.value)}
              placeholder="Search places or seasons"
              aria-label="Search places"
              className="min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-faint"
            />
            {query && <button onClick={() => setQuery('')} aria-label="Clear search" className="text-faint"><X size={16} /></button>}
          </label>
          <button onClick={() => nav('/add-place')} className="glass-dark flex shrink-0 items-center gap-2 rounded-full px-4 py-3 text-sm font-semibold text-white">
            <Plus size={17} /> Add
          </button>
        </div>
        <div className="no-scrollbar pointer-events-auto -mx-5 mt-3 flex gap-2 overflow-x-auto px-5 pb-1">
          {filters.map(f => (
            <Chip key={f.id} selected={filterId === f.id} onClick={() => setFilterId(f.id)}>
              {f.icon && <f.icon size={14} />} {f.label}
            </Chip>
          ))}
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-[96px] z-[600]">
        {shown.length === 0 ? (
          <div className="glass-thick mx-5 rounded-md p-5 text-center text-sm text-muted">
            {filterId === 'saved' && !query ? 'No saved places yet. Tap the bookmark on any place to save it.' : 'No places match. Try another filter or search.'}
          </div>
        ) : (
          <div
            ref={railRef}
            onScroll={onRailScroll}
            className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto px-5 pb-2"
            style={{ gap: GAP, scrollPaddingLeft: 20 }}
          >
            {shown.map((p, i) => (
              <button
                key={p.id}
                onClick={() => (i === index ? nav(`/place/${p.id}`) : focusPin(i))}
                style={{ width: CARD }}
                className={`glass-flat flex shrink-0 snap-start gap-4 rounded-md p-2 text-left ${i === index ? '' : 'opacity-80'}`}
              >
                <PlaceImage place={p} className="h-24 w-24 shrink-0 rounded-sm" />
                <span className="flex min-w-0 flex-1 flex-col justify-between py-1 pr-2">
                  <span className="min-w-0">
                    <span className="block truncate font-semibold leading-6">{p.name}</span>
                    <span className="mt-1 block truncate text-xs text-muted">{p.category} · {p.area}</span>
                  </span>
                  <span className="flex items-center justify-between gap-2">
                    <span className="min-w-0 overflow-hidden">
                      {p.hidden ? <Pill tone="gem"><Gem size={12} /> Hidden gem</Pill> : p.addedBy ? <Pill>Shared by {p.addedBy === 'me' ? 'you' : userById(p.addedBy)?.name}</Pill> : <Pill>{p.indoor ? 'Indoors' : 'Outdoors'}</Pill>}
                    </span>
                    <span className="flex shrink-0 items-center text-xs font-semibold text-accent-ink">View <ChevronRight size={14} /></span>
                  </span>
                </span>
              </button>
            ))}
            <span aria-hidden style={{ flex: `0 0 calc(100% - ${CARD + GAP + 20}px)` }} />
          </div>
        )}
      </div>
    </div>
  )
}
