import { BookOpen, Coffee, Landmark, Leaf, Palette, Trees, Waves, type LucideIcon } from 'lucide-react'
import type { Interest, Place } from '../types'

export const categoryStyle: Record<Interest, { color: string; tint: string; icon: LucideIcon }> = {
  cafes: { color: '#c39238', tint: '#f5ead2', icon: Coffee },
  nature: { color: '#5f8261', tint: '#e2eadb', icon: Trees },
  water: { color: '#6f8fb3', tint: '#e2e9f1', icon: Waves },
  creative: { color: '#e07a45', tint: '#f8e4d5', icon: Palette },
  culture: { color: '#a95c45', tint: '#f2e0d8', icon: Landmark },
  study: { color: '#7a5468', tint: '#f0e3ea', icon: BookOpen },
}

const secretStyle = { color: '#d39a2c', tint: '#f6e7c4', icon: Leaf }

export const placeStyle = (place: Place) => (place.secret ? secretStyle : categoryStyle[place.interests[0] ?? 'nature'])
