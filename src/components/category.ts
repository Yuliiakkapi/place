import { BookOpen, Coffee, Landmark, Palette, Trees, Waves, type LucideIcon } from 'lucide-react'
import type { Interest, Place } from '../types'

export const categoryStyle: Record<Interest, { color: string; tint: string; icon: LucideIcon }> = {
  cafes: { color: '#c39238', tint: '#f5ead2', icon: Coffee },
  nature: { color: '#5f8261', tint: '#e2eadb', icon: Trees },
  water: { color: '#6f8fb3', tint: '#e2e9f1', icon: Waves },
  creative: { color: '#e07a45', tint: '#f8e4d5', icon: Palette },
  culture: { color: '#a95c45', tint: '#f2e0d8', icon: Landmark },
  study: { color: '#46706c', tint: '#dde8e5', icon: BookOpen },
}

export const placeStyle = (place: Place) => categoryStyle[place.interests[0] ?? 'nature']
