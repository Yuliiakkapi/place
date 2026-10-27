import { activities } from '../data/seed'
import { allPlaces } from './community'
import type { Mood, Need, Place, Activity } from '../types'

export function getRecommendation(moods: Mood[], needs: Need[], weather: 'rain'|'sunny'|'cold'|'cloudy'='cloudy') {
  const activity = [...activities].sort((a,b)=>scoreActivity(b,moods,needs,weather)-scoreActivity(a,moods,needs,weather))[0]
  const recommendedPlaces = allPlaces().sort((a,b)=>scorePlace(b,moods,needs,weather)-scorePlace(a,moods,needs,weather)).slice(0,3)
  return { activity, places: recommendedPlaces }
}

function scoreActivity(a: Activity,moods:Mood[],needs:Need[],weather:string) {
  let s=a.moods.filter(m=>moods.includes(m)).length*5
  if(needs.includes('move') && a.environment==='outdoors') s+=3
  if(needs.includes('people') && a.socialType==='social') s+=4
  if(weather==='rain' && a.environment==='indoors') s+=3
  return s
}
function scorePlace(p:Place,moods:Mood[],needs:Need[],weather:string) {
  let s=p.moods.filter(m=>moods.includes(m)).length*5
  if(needs.includes('alone') && p.situations.includes('alone')) s+=3
  if(needs.includes('people') && p.situations.includes('with-friend')) s+=3
  if(weather==='rain' && p.situations.includes('indoor')) s+=3
  if(weather==='sunny' && p.situations.includes('outdoor')) s+=3
  return s
}
