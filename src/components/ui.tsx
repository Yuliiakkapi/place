import { ArrowLeft, Check, ChevronRight, Gem, Lock, X } from 'lucide-react'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { userById } from '../data/seed'
import type { Place } from '../types'
import { placeStyle } from './category'

export function BackButton({ floating }: { floating?: boolean }) {
  const nav = useNavigate()
  return (
    <button
      onClick={() => nav(-1)}
      aria-label="Back"
      className={`flex h-10 w-10 items-center justify-center rounded-full ${floating ? 'glass' : 'bg-card card-shadow'}`}
    >
      <ArrowLeft size={19} />
    </button>
  )
}

export function SectionTitle({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <h2 className="text-base font-semibold">{children}</h2>
      {action}
    </div>
  )
}

export function SeeAll({ onClick, children = 'See all' }: { onClick: () => void; children?: ReactNode }) {
  return (
    <button onClick={onClick} className="flex items-center gap-1 text-sm font-medium text-muted hover:text-ink">
      {children} <ChevronRight size={15} />
    </button>
  )
}

export function OptionButton({ selected, onClick, label, hint }: { selected: boolean; onClick: () => void; label: string; hint?: string }) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-md px-4 py-4 text-left ${selected ? 'bg-ink text-white' : 'bg-card card-shadow hover:bg-card/70'}`}
    >
      <span className="flex-1">
        <span className="block text-base font-medium">{label}</span>
        {hint && <span className={`mt-1 block text-xs ${selected ? 'text-white/65' : 'text-muted'}`}>{hint}</span>}
      </span>
      <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${selected ? 'bg-white text-ink' : 'border-[1.5px] border-ink/20'}`}>
        {selected && <Check size={13} strokeWidth={3} />}
      </span>
    </button>
  )
}

export function Chip({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-medium ${selected ? 'bg-ink text-white' : 'glass-flat'}`}
    >
      {children}
    </button>
  )
}

export function Segmented<T extends string>({ value, options, onChange, label }: { value: T; options: { id: T; label: string }[]; onChange: (v: T) => void; label: string }) {
  return (
    <div role="radiogroup" aria-label={label} className="flex rounded-full bg-black/[.05] p-1">
      {options.map(o => (
        <button
          key={o.id}
          role="radio"
          aria-checked={value === o.id}
          onClick={() => onChange(o.id)}
          className={`flex-1 rounded-full px-3 py-2 text-sm font-medium ${value === o.id ? 'bg-ink text-white' : 'text-muted'}`}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

const avatarTints = ['#f9cdb0', '#d6d3f3', '#d5e0c8', '#f0d9a0', '#f2c6c0', '#cdd6ee', '#e6dccb']

export function Avatar({ name, size = 40, ring }: { name: string; size?: number; ring?: boolean }) {
  const tint = avatarTints[name.charCodeAt(0) % avatarTints.length]
  return (
    <span
      style={{ width: size, height: size, background: tint, fontSize: size * 0.4 }}
      className={`flex shrink-0 items-center justify-center rounded-full font-semibold text-ink/75 ${ring ? 'ring-[2.5px] ring-card' : ''}`}
    >
      {name.slice(0, 1).toUpperCase()}
    </span>
  )
}

export function AvatarStack({ names, size = 30 }: { names: string[]; size?: number }) {
  return (
    <span className="flex -space-x-2">
      {names.map(n => <Avatar key={n} name={n} size={size} ring />)}
    </span>
  )
}

export function Pill({ children, tone = 'light' }: { children: ReactNode; tone?: 'light' | 'dark' | 'gem' | 'solid' | 'honey' }) {
  const tones = {
    light: 'bg-black/[.05] text-ink',
    dark: 'bg-ink text-white',
    gem: 'bg-peach text-accent-ink',
    solid: 'bg-card text-ink',
    honey: 'bg-honey text-[#8a5f14]',
  }
  return <span className={`inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium ${tones[tone]}`}>{children}</span>
}

export function PlaceBadges({ place }: { place: Place }) {
  const contributor = place.addedBy === 'me' ? 'you' : userById(place.addedBy)?.name
  return (
    <div className="flex flex-wrap items-center gap-2">
      {place.hidden && <Pill tone="gem"><Gem size={12} /> Hidden gem</Pill>}
      {contributor && <Pill>Shared by {contributor}</Pill>}
      {place.visibility === 'friends' && <Pill><Lock size={11} /> Friends only</Pill>}
    </div>
  )
}

export function PlaceImage({ place, className }: { place: Place; className: string }) {
  if (!place.image) {
    const { tint, color, icon: Icon } = placeStyle(place)
    return (
      <div className={`${className} flex items-center justify-center`} style={{ background: tint, color }}>
        <Icon size={28} strokeWidth={1.6} />
      </div>
    )
  }
  return <img src={place.image} alt="" loading="lazy" onLoad={e => { e.currentTarget.dataset.loaded = "" }} className={`${className} img-fade object-cover`} />
}

export function CategoryDot({ place, size = 28 }: { place: Place; size?: number }) {
  const { color, icon: Icon } = placeStyle(place)
  return (
    <span style={{ width: size, height: size, background: color }} className="flex shrink-0 items-center justify-center rounded-full text-white">
      <Icon size={size * 0.52} strokeWidth={2.2} />
    </span>
  )
}

export function PlaceRow({ place, detail, onClick }: { place: Place; detail?: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="card-shadow flex w-full items-center gap-3 rounded-md bg-card p-3 text-left active:scale-[.98]">
      <PlaceImage place={place} className="h-16 w-16 shrink-0 rounded-md" />
      <span className="min-w-0 flex-1">
        <span className="block truncate font-semibold">{place.name}</span>
        <span className="mt-1 block truncate text-xs text-muted">{detail ?? `${place.category} · ${place.area}`}</span>
      </span>
      <ChevronRight size={18} className="mr-1 shrink-0 text-faint" />
    </button>
  )
}

export function PhotoCard({ place, onClick, tags, width = 'w-64' }: { place: Place; onClick: () => void; tags?: string[]; width?: string }) {
  return (
    <button onClick={onClick} className={`relative h-56 ${width} shrink-0 snap-start overflow-hidden rounded-lg text-left active:scale-[.98]`}>
      <PlaceImage place={place} className="absolute inset-0 h-full w-full" />
      <span className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
      <span className="absolute inset-x-4 bottom-4 text-white">
        {tags && tags.length > 0 && (
          <span className="mb-2 flex gap-2">{tags.map(t => t === 'Hidden gem' ? <Pill key={t} tone="gem"><Gem size={12} /> {t}</Pill> : <Pill key={t} tone="solid">{t}</Pill>)}</span>
        )}
        <span className="display block text-xl leading-tight">{place.name}</span>
        <span className="mt-1 block text-xs text-white/80">{place.category} · {place.area}</span>
      </span>
    </button>
  )
}

export function EmptyNote({ children }: { children: ReactNode }) {
  return <p className="rounded-md border-[1.5px] border-dashed border-ink/10 px-4 py-5 text-sm text-muted">{children}</p>
}

export function Sheet({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: ReactNode }) {
  const [rendered, setRendered] = useState(open)
  const closeInstantly = useRef(false)
  if (open && !rendered) setRendered(true)

  useEffect(() => {
    if (open || !rendered) return
    if (closeInstantly.current) {
      closeInstantly.current = false
      setRendered(false)
      return
    }
    const t = setTimeout(() => setRendered(false), 200)
    return () => clearTimeout(t)
  }, [open, rendered])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      closeInstantly.current = true
      onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!rendered) return null
  const state = open ? 'open' : 'closing'
  return (
    <div
      data-state={state}
      className={`sheet-backdrop fixed inset-0 z-[2000] flex items-end justify-center bg-ink/35 backdrop-blur-[2px] ${open ? '' : 'pointer-events-none'}`}
      onClick={onClose}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-label={title}
        data-state={state}
        onClick={e => e.stopPropagation()}
        className="sheet-panel glass-sheet w-full max-w-md rounded-t-lg px-5 pb-[max(24px,env(safe-area-inset-bottom))] pt-3"
      >
        <div className="mx-auto h-1 w-10 rounded-full bg-ink/15" />
        <div className="mt-4 flex items-start justify-between gap-4">
          <h2 className="display text-2xl">{title}</h2>
          <button onClick={onClose} aria-label="Close" className="card-shadow -mt-1 rounded-full bg-card p-2"><X size={17} /></button>
        </div>
        <div className="mt-4">{children}</div>
      </section>
    </div>
  )
}
