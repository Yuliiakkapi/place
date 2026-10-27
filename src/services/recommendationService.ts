import { useMemo } from 'react'
import { goodFor, interestLabel, places as seedPlaces, userById, vibeLabel } from '../data/seed'
import type { Place, Profile, Vibe } from '../types'
import { contributionsStore } from './store'

export function useVisiblePlaces() {
  const mine = contributionsStore.use()
  return useMemo(() => [...mine, ...seedPlaces.filter(canSee)], [mine])
}

function canSee(place: Place) {
  if (place.visibility === 'public' || !place.addedBy) return true
  return userById(place.addedBy)?.isFriend ?? false
}

export interface Recommendation {
  place: Place
  score: number
  reasons: string[]
}

export function recommend(places: Place[], profile: Profile | null, vibe: Vibe | null, savedIds: string[]): Recommendation[] {
  return places
    .map(place => scorePlace(place, profile, vibe, savedIds))
    .sort((a, b) => b.score - a.score)
}

function scorePlace(place: Place, profile: Profile | null, vibe: Vibe | null, savedIds: string[]): Recommendation {
  let score = 0
  const reasons: string[] = []

  if (vibe && place.vibes.includes(vibe)) {
    score += place.vibes[0] === vibe ? 8 : 6
    reasons.push(`Fits “${vibeLabel(vibe).toLowerCase()}”`)
  }

  const sharedInterests = profile?.interests.filter(i => place.interests.includes(i)) ?? []
  if (sharedInterests.length) {
    score += sharedInterests.length * 3
    reasons.push(`You like ${interestLabel(sharedInterests[0]).toLowerCase()}`)
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

  if (savedIds.includes(place.id)) score -= 2

  return { place, score, reasons: reasons.slice(0, 2) }
}
