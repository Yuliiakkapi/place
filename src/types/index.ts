export type Vibe = 'calm' | 'outdoors' | 'company' | 'new' | 'cozy'
export type Interest = 'cafes' | 'nature' | 'water' | 'creative' | 'culture' | 'study'
export type Company = 'alone' | 'friend' | 'group'
export type Discovery = 'hidden' | 'mix' | 'popular'
export type Visibility = 'public' | 'friends'

export interface Place {
  id: string
  name: string
  category: string
  area: string
  lat: number
  lng: number
  interests: Interest[]
  vibes: Vibe[]
  company: Company[]
  indoor: boolean
  hidden: boolean
  summary: string
  whyGo: string[]
  image?: string
  addedBy?: string
  visibility: Visibility
}

export interface Tip {
  id: string
  placeId: string
  text: string
  authorId?: string
  createdAt: string
}

export interface User {
  id: string
  name: string
  isFriend: boolean
  vibe?: Vibe
}

export interface Profile {
  name: string
  interests: Interest[]
  company: Company[]
  discovery: Discovery
  favourites: string[]
}

export interface Settings {
  locationSharing: 'off' | 'selected'
  locationFriends: string[]
  moodVisibleTo: 'friends' | 'nobody'
  anonymousTips: boolean
}

export interface TodayMood {
  vibe: Vibe
  date: string
}
