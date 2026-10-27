import type { Activity, JournalEntry, MoodProfile, Place, User } from '../types'

export const moodProfiles: Record<string, MoodProfile> = {
  cozy:{energy:1,social:1,environment:'calm',activity:'slow'}, quiet:{energy:0,social:0,environment:'calm',activity:'slow'}, lowEnergy:{energy:0,social:0,environment:'calm',activity:'slow'}, needAir:{energy:2,social:1,environment:'outdoor',activity:'walking'}, wantCompany:{energy:2,social:3,environment:'social',activity:'meetup'}, wantToDisappear:{energy:0,social:0,environment:'calm',activity:'hideaway'}, curious:{energy:2,social:1,environment:'inspiring',activity:'explore'}, explore:{energy:3,social:1,environment:'inspiring',activity:'explore'}
}

export const activities: Activity[] = [
 {id:'walk',title:'Take the long way home',description:'Walk through a nearby green space, get something warm and notice three autumn details.',duration:15,environment:'outdoors',socialType:'alone',moods:['quiet','lowEnergy','needAir']},
 {id:'coffee',title:'Find a window seat',description:'Pick a warm drink and give yourself 30 quiet minutes with a view.',duration:30,environment:'indoors',socialType:'alone',moods:['cozy','quiet','wantToDisappear']},
 {id:'museum',title:'Wander somewhere new',description:'Choose one room you have never really looked at and stay until something catches you.',duration:45,environment:'indoors',socialType:'flexible',moods:['curious','explore','lowEnergy']},
 {id:'friend',title:'Make an easy plan',description:'Invite someone for a small walk. No big evening required.',duration:40,environment:'outdoors',socialType:'social',moods:['wantCompany','needAir']}
]

export const places: Place[] = [
 {id:'den-gamle-by',name:'Den Gamle By',category:'Open-air museum',city:'Aarhus',lat:56.1587,lng:10.1908,seasons:['autumn','winter','spring','summer'],moods:['cozy','quiet','curious'],situations:['alone','with-friend','after-work','outdoor'],description:'A good place for a slow afternoon when you want to be around people without having to talk.',image:'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1000&q=80',autumn:['Warm lights in old windows','Quiet courtyards after rain','Great for a slow afternoon'],traces:['Best place to watch the rain.','The light here at 17:00 is beautiful.']},
 {id:'botanical',name:'Aarhus Botanical Garden',category:'Garden',city:'Aarhus',lat:56.1583,lng:10.1932,seasons:['autumn','spring','summer'],moods:['needAir','quiet','lowEnergy','cozy'],situations:['alone','with-friend','cheap','outdoor'],description:'Paths, glasshouses and enough space to feel outside without going far.',image:'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1000&q=80',autumn:['Fallen leaves on the paths','Warm glasshouse air','Best on crisp mornings'],traces:['Come here when you need to clear your head.']},
 {id:'aros',name:'ARoS Aarhus Art Museum',category:'Museum',city:'Aarhus',lat:56.1539,lng:10.1999,seasons:['autumn','winter','spring','summer'],moods:['curious','explore','wantToDisappear'],situations:['alone','with-friend','after-work','indoor'],description:'A bright, absorbing place to disappear into colour, people and ideas for an hour.',image:'https://images.unsplash.com/photo-1561214115-f2f134cc4912?auto=format&fit=crop&w=1000&q=80',autumn:['Rainbow views over the city','Warm indoor escape','Good rainy-day ritual'],traces:['Perfect after a long day.']},
 {id:'dokk1',name:'Dokk1',category:'Library & culture',city:'Aarhus',lat:56.1531,lng:10.2134,seasons:['autumn','winter','spring','summer'],moods:['quiet','curious','cozy','wantCompany'],situations:['alone','study','after-work','indoor'],description:'A place to be around other people without needing to participate.',image:'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1000&q=80',autumn:['Rain-friendly','Long tables and warm light','Good for a quiet reset'],traces:['You can be alone without feeling lonely here.']},
 {id:'marselisborg',name:'Marselisborg Forests',category:'Forest',city:'Aarhus',lat:56.1185,lng:10.2154,seasons:['autumn','winter','spring','summer'],moods:['needAir','explore','quiet'],situations:['alone','with-friend','outdoor','cheap'],description:'A long exhale outside the city, especially when the leaves start changing.',image:'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1000&q=80',autumn:['Copper-coloured paths','Fresh air after rain','Best with no destination'],traces:['The walk back feels shorter than the walk in.']},
 {id:'godsbanen',name:'Godsbanen',category:'Culture & creative space',city:'Aarhus',lat:56.1535,lng:10.1947,seasons:['autumn','winter','spring','summer'],moods:['curious','explore','wantCompany','cozy'],situations:['with-friend','after-work','indoor','outdoor'],description:'For days when you want a little movement, people and something unexpected.',image:'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1000&q=80',autumn:['Creative corners','Small events and exhibitions','Good for spontaneous plans'],traces:['Always feels like something is about to happen.']},
 {id:'moesgaard',name:'Moesgaard Museum',category:'Museum',city:'Aarhus',lat:56.0892,lng:10.2277,seasons:['autumn','winter','spring','summer'],moods:['curious','explore','quiet'],situations:['with-friend','alone','outdoor','indoor'],description:'A whole afternoon destination when you want to leave the usual city rhythm behind.',image:'https://images.unsplash.com/photo-1564399579883-451a5d44ec08?auto=format&fit=crop&w=1000&q=80',autumn:['Golden roof views','Forest paths nearby','A good half-day escape'],traces:['Go when you want the day to feel longer.']},
 {id:'aarhus-o',name:'Aarhus Ø',category:'Waterfront',city:'Aarhus',lat:56.1612,lng:10.2206,seasons:['autumn','winter','spring','summer'],moods:['needAir','explore','wantCompany'],situations:['alone','with-friend','outdoor','after-work'],description:'Wind, water and city lights. Good when you need to change the scenery quickly.',image:'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80',autumn:['Windy waterfront walks','Big skies','Beautiful late light'],traces:['The wind makes everything feel less important.']}
]

export const users: User[] = [
 {id:'me',name:'Yulia',avatar:'Y',city:'Aarhus',friends:['anna','marta','leo'],currentMoods:['quiet','wantCompany'],needs:['people','slow']},
 {id:'anna',name:'Anna',avatar:'A',city:'Aarhus',friends:['me'],currentMoods:['quiet'],needs:['people']},
 {id:'marta',name:'Marta',avatar:'M',city:'Aarhus',friends:['me'],currentMoods:['cozy','needAir'],needs:['move']},
 {id:'leo',name:'Leo',avatar:'L',city:'Aarhus',friends:['me'],currentMoods:['needAir'],needs:['move']},
 {id:'sofia',name:'Sofia',avatar:'S',city:'Aarhus',friends:[],currentMoods:['curious'],needs:['explore']},
 {id:'noah',name:'Noah',avatar:'N',city:'Aarhus',friends:[],currentMoods:['quiet'],needs:['alone']},
 {id:'freja',name:'Freja',avatar:'F',city:'Aarhus',friends:[],currentMoods:['cozy'],needs:['slow']},
 {id:'emil',name:'Emil',avatar:'E',city:'Aarhus',friends:[],currentMoods:['wantCompany'],needs:['people']}
]

export const journal: JournalEntry[] = [
 {id:'j1',date:'October 12',mood:'Quiet',placeId:'botanical',activity:'Slow walk',person:'Anna'},
 {id:'j2',date:'October 15',mood:'Curious',placeId:'aros',activity:'Museum wander'},
 {id:'j3',date:'October 18',mood:'Need air',placeId:'marselisborg',activity:'Forest walk'},
 {id:'j4',date:'October 21',mood:'Cozy',placeId:'dokk1',activity:'Coffee & reading',person:'Marta'},
 {id:'j5',date:'October 24',mood:'Want company',placeId:'godsbanen',activity:'Evening plan',person:'Leo'}
]
