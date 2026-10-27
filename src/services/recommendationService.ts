import { useMemo } from 'react'
import { goodFor, places as seedPlaces, secretPlace, userById, vibeLabel } from '../data/seed'
import type { Interest, Place, Profile, Vibe } from '../types'
import { contributionsStore, secretStore } from './store'

export function useVisiblePlaces() {
  const mine = contributionsStore.use()
  const secretFound = secretStore.use()
  return useMemo(() => [...mine, ...(secretFound ? [secretPlace] : []), ...seedPlaces.filter(canSee)], [mine, secretFound])
}

function canSee(place: Place) {
  if (place.visibility === 'public' || !place.addedBy) return true
  return userById(place.addedBy)?.isFriend ?? false
}

const interestReason: Record<Interest, string> = {
  cafes: 'You like cafés',
  nature: 'You like parks & nature',
  water: 'You like being by the water',
  creative: 'You like creative spaces',
  culture: 'You like art & culture',
  study: 'You like places to read',
}

export interface Recommendation {
  place: Place
  score: number
  reasons: string[]
}

export function recommend(places: Place[], profile: Profile | null, vibe: Vibe | null): Recommendation[] {
  return places
    .map(place => scorePlace(place, profile, vibe))
    .sort((a, b) => b.score - a.score)
}

function scorePlace(place: Place, profile: Profile | null, vibe: Vibe | null): Recommendation {
  let score = 0
  const reasons: string[] = []

  if (vibe && place.vibes.includes(vibe)) {
    score += place.vibes[0] === vibe ? 8 : 6
    reasons.push(`Fits your “${vibeLabel(vibe).toLowerCase()}” vibe`)
  }

  const sharedInterests = profile?.interests.filter(i => place.interests.includes(i)) ?? []
  if (sharedInterests.length) {
    score += sharedInterests.length * 3
    reasons.push(interestReason[sharedInterests[0]])
  }

  const discovery = profile?.discovery ?? 'mix'
  if (place.hidden) {
    score += discovery === 'hidden' ? 5 : discovery === 'mix' ? 2 : 0
    if (discovery !== 'popular') reasons.push('Hidden gem')
  } else if (discovery === 'popular') {
    score += 3
  }

  const company = profile?.company.find(c => place.company.includes(c))
  if (company) {
    score += 1
    if (reasons.length < 2) reasons.push(goodFor([company]))
  }

  if (place.addedBy && userById(place.addedBy)?.isFriend) {
    score += 2
    reasons.unshift(`Shared by ${userById(place.addedBy)!.name}`)
  }


  return { place, score, reasons: reasons.slice(0, 2) }
}
