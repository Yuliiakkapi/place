export type Mood = 'cozy' | 'quiet' | 'lowEnergy' | 'needAir' | 'wantCompany' | 'wantToDisappear' | 'curious' | 'explore'
export type Need = 'alone' | 'people' | 'move' | 'slow' | 'explore' | 'talk'
export type Season = 'spring' | 'summer' | 'autumn' | 'winter'
export type Weather = 'rain' | 'sunny' | 'cold' | 'cloudy'

export interface MoodProfile { energy: number; social: number; environment: string; activity: string }
export interface Place { id:string; name:string; category:string; city:string; lat:number; lng:number; seasons:Season[]; moods:Mood[]; situations:string[]; description:string; image:string; autumn:string[]; traces:string[] }
export interface Activity { id:string; title:string; description:string; duration:number; environment:string; socialType:string; moods:Mood[] }
export interface User { id:string; name:string; avatar:string; city:string; friends:string[]; currentMoods:Mood[]; needs:Need[] }
export interface MoodCheckIn { id:string; userId:string; date:string; moods:Mood[]; needs:Need[] }
export interface SocialPlan { id:string; creatorId:string; placeId:string; activity:string; date:string; participants:string[] }
export interface JournalEntry { id:string; date:string; mood:string; placeId:string; activity:string; person?:string }
