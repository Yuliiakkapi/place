import { ArrowLeft, Check, ChevronRight, Gem, Lock, MapPin, UsersRound } from 'lucide-react'
import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { userById } from '../data/seed'
import type { Place } from '../types'

export function BackButton({ label = 'Back' }: { label?: string }) {
  const nav = useNavigate()
  return (
    <button onClick={() => nav(-1)} className="flex items-center gap-1.5 rounded-full py-2 pr-3 text-sm text-muted hover:text-ink">
      <ArrowLeft size={18} /> {label}
    </button>
  )
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="text-xs font-medium uppercase tracking-[.16em] text-rust">{children}</p>
}

export function SectionTitle({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <h2 className="text-lg font-medium">{children}</h2>
      {action}
    </div>
  )
}

export function TextLink({ onClick, children }: { onClick: () => void; children: ReactNode }) {
  return <button onClick={onClick} className="text-sm font-medium text-rust underline-offset-4 hover:underline">{children}</button>
}

export function OptionButton({ selected, onClick, label, hint }: { selected: boolean; onClick: () => void; label: string; hint?: string }) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-2xl border px-4 py-3.5 text-left transition ${selected ? 'border-ink bg-ink text-white' : 'border-line bg-card hover:border-ink/40'}`}
    >
      <span className="flex-1">
        <span className="block text-[15px] font-medium">{label}</span>
        {hint && <span className={`mt-0.5 block text-xs ${selected ? 'text-white/70' : 'text-muted'}`}>{hint}</span>}
      </span>
      <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${selected ? 'border-white bg-white text-ink' : 'border-ink/25'}`}>
        {selected && <Check size={13} strokeWidth={3} />}
      </span>
    </button>
  )
}

export function Segmented<T extends string>({ value, options, onChange, label }: { value: T; options: { id: T; label: string }[]; onChange: (v: T) => void; label: string }) {
  return (
    <div role="radiogroup" aria-label={label} className="flex rounded-full bg-black/5 p-1">
      {options.map(o => (
        <button
          key={o.id}
          role="radio"
          aria-checked={value === o.id}
          onClick={() => onChange(o.id)}
          className={`flex-1 rounded-full px-3 py-2 text-sm transition ${value === o.id ? 'bg-card font-medium shadow-sm' : 'text-muted'}`}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

export function Avatar({ name, size = 40 }: { name: string; size?: number }) {
  return (
    <span style={{ width: size, height: size }} className="flex shrink-0 items-center justify-center rounded-full bg-sage text-sm font-medium text-moss">
      {name.slice(0, 1).toUpperCase()}
    </span>
  )
}

export function PlaceBadges({ place }: { place: Place }) {
  const contributor = place.addedBy === 'me' ? 'you' : userById(place.addedBy)?.name
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
      {place.hidden && <span className="flex items-center gap-1 text-rust"><Gem size={12} /> Hidden gem</span>}
      {contributor && <span className="flex items-center gap-1"><UsersRound size={12} /> Shared by {contributor}</span>}
      {place.visibility === 'friends' && <span className="flex items-center gap-1"><Lock size={12} /> Friends only</span>}
    </div>
  )
}

export function PlaceImage({ place, className }: { place: Place; className: string }) {
  if (!place.image) {
    return (
      <div className={`${className} flex items-center justify-center bg-sage text-moss`}>
        <MapPin size={28} strokeWidth={1.5} />
      </div>
    )
  }
  return <img src={place.image} alt="" loading="lazy" className={`${className} object-cover`} />
}

export function PlaceRow({ place, detail, onClick }: { place: Place; detail?: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex w-full items-center gap-3 rounded-2xl border border-line bg-card p-2.5 text-left shadow-[0_2px_10px_rgba(55,44,32,.04)] transition hover:border-ink/30 active:scale-[.99]">
      <PlaceImage place={place} className="h-16 w-16 shrink-0 rounded-xl" />
      <span className="min-w-0 flex-1">
        <span className="block truncate font-medium">{place.name}</span>
        <span className="mt-0.5 block truncate text-xs text-muted">{detail ?? `${place.category} · ${place.area}`}</span>
      </span>
      <ChevronRight size={18} className="shrink-0 text-faint" />
    </button>
  )
}

export function EmptyNote({ children }: { children: ReactNode }) {
  return <p className="rounded-2xl border border-dashed border-ink/15 px-4 py-5 text-sm text-muted">{children}</p>
}
