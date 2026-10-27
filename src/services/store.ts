import { useSyncExternalStore } from 'react'
import type { Place, Profile, Settings, Tip, TodayMood } from '../types'

const EVENT = 'place-store-change'
const cache = new Map<string, { raw: string | null; value: unknown }>()

function read<T>(key: string, fallback: T): T {
  let raw: string | null = null
  try { raw = localStorage.getItem(key) } catch { return fallback }
  const hit = cache.get(key)
  if (hit && hit.raw === raw) return hit.value as T
  let value: T = fallback
  try { if (raw !== null) value = JSON.parse(raw) as T } catch { /* corrupted entry falls back */ }
  cache.set(key, { raw, value })
  return value
}

function write<T>(key: string, value: T) {
  try { localStorage.setItem(key, JSON.stringify(value)) } catch { /* storage full or blocked */ }
  window.dispatchEvent(new Event(EVENT))
}

function subscribe(callback: () => void) {
  window.addEventListener(EVENT, callback)
  window.addEventListener('storage', callback)
  return () => {
    window.removeEventListener(EVENT, callback)
    window.removeEventListener('storage', callback)
  }
}

function createSlot<T>(key: string, fallback: T) {
  const get = () => read(key, fallback)
  return {
    get,
    set: (value: T | ((current: T) => T)) =>
      write(key, typeof value === 'function' ? (value as (current: T) => T)(get()) : value),
    use: () => useSyncExternalStore(subscribe, get),
  }
}

export const defaultSettings: Settings = {
  locationSharing: 'off',
  locationFriends: [],
  moodVisibleTo: 'friends',
  anonymousTips: true,
}

export const profileStore = createSlot<Profile | null>('place.profile.v3', null)
export const moodStore = createSlot<TodayMood | null>('place.mood.v3', null)
export const savedStore = createSlot<string[]>('place.saved.v3', [])
export const contributionsStore = createSlot<Place[]>('place.contributions.v3', [])
export const tipsStore = createSlot<Tip[]>('place.tips.v3', [])
export const settingsStore = createSlot<Settings>('place.settings.v3', defaultSettings)
export const invitedStore = createSlot<string[]>('place.invited.v3', [])

export function todayKey() {
  return new Date().toISOString().slice(0, 10)
}

export function toggleIn<T>(list: T[], item: T) {
  return list.includes(item) ? list.filter(x => x !== item) : [...list, item]
}

export function resetAll() {
  try {
    Object.keys(localStorage).filter(k => k.startsWith('place')).forEach(k => localStorage.removeItem(k))
  } catch { /* storage blocked */ }
  window.dispatchEvent(new Event(EVENT))
}
