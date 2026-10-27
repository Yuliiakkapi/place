import { places } from '../data/seed'
import type { Place } from '../types'
const key = 'place-community-v2'
export type Contribution = Place & { visibility: 'public' | 'friends'; submittedBy: string; niche: boolean }
export function contributions(): Contribution[] { try { const data = JSON.parse(localStorage.getItem(key) || '[]'); return Array.isArray(data) ? data : [] } catch { return [] } }
export function allPlaces(): Place[] { return [...contributions(), ...places] }
export function addPlace(place: Contribution) { localStorage.setItem(key, JSON.stringify([...contributions(), place])); window.dispatchEvent(new Event('place-updated')) }
export function reviews(id: string): string[] { try { const data = JSON.parse(localStorage.getItem('place-reviews-v2') || '{}'); return Array.isArray(data[id]) ? data[id] : [] } catch { return [] } }
export function addReview(id: string, review: string) { const data: Record<string,string[]> = {}; for(const place of allPlaces()) data[place.id] = reviews(place.id); data[id] = [...(data[id] || []), review]; localStorage.setItem('place-reviews-v2', JSON.stringify(data)) }
export function savedIds(): string[] { try { return JSON.parse(localStorage.getItem('place-saved-v2') || '[]') } catch { return [] } }
export function toggleSaved(id: string) { const next = savedIds().includes(id) ? savedIds().filter(x => x !== id) : [...savedIds(), id]; localStorage.setItem('place-saved-v2', JSON.stringify(next)); return next }
