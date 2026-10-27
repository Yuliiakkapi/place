import type { Company, Discovery, Interest, Place, Tip, User, Vibe } from '../types'
import photoCredits from './photoCredits.json'

export const AARHUS: [number, number] = [56.1539, 10.2039]

export const vibes:{ id: Vibe; label: string; hint: string }[] = [
  { id: 'calm', label: 'Calm & quiet', hint: 'Somewhere peaceful to slow down' },
  { id: 'outdoors', label: 'Fresh air', hint: 'Get outside and move a little' },
  { id: 'company', label: 'Some company', hint: 'Be around people or meet a friend' },
  { id: 'new', label: 'Something new', hint: "Explore a place you haven't been" },
  { id: 'cozy', label: 'Warm & cozy', hint: 'Indoors, a hot drink, somewhere snug' },
]

export const interests: { id: Interest; label: string }[] = [
  { id: 'cafes', label: 'Cafés' },
  { id: 'nature', label: 'Parks & nature' },
  { id: 'water', label: 'By the water' },
  { id: 'creative', label: 'Creative spaces' },
  { id: 'culture', label: 'Art & culture' },
  { id: 'study', label: 'Places to read or work' },
]

export const companyOptions: { id: Company; label: string }[] = [
  { id: 'alone', label: 'On my own' },
  { id: 'friend', label: 'With a friend' },
  { id: 'group', label: 'In a group' },
]

export const discoveryOptions: { id: Discovery; label: string; hint: string }[] = [
  { id: 'hidden', label: 'Hidden gems', hint: 'Small places most people walk past' },
  { id: 'mix', label: 'A bit of both', hint: 'Local secrets and well-known spots' },
  { id: 'popular', label: 'Popular favourites', hint: 'The places everyone talks about' },
]

export const categoryOptions: { label: string; interest: Interest }[] = [
  { label: 'Café', interest: 'cafes' },
  { label: 'Park & nature', interest: 'nature' },
  { label: 'By the water', interest: 'water' },
  { label: 'Creative space', interest: 'creative' },
  { label: 'Art & culture', interest: 'culture' },
  { label: 'Read or work', interest: 'study' },
]

export const vibeLabel = (id: Vibe) => vibes.find(v => v.id === id)?.label ?? id
export const interestLabel = (id: Interest) => interests.find(i => i.id === id)?.label ?? id
const companyShort: Record<Company, string> = { alone: 'alone', friend: 'with a friend', group: 'in a group' }
export const companyList = (company: Company[]) => {
  const parts = company.map(c => companyShort[c])
  return parts.length > 1 ? `${parts.slice(0, -1).join(', ')} or ${parts.at(-1)}` : parts[0]
}
export const goodFor = (company: Company[]) => `Good ${companyList(company)}`

export const photoCredit = (id: string) => (photoCredits as Record<string, { author: string; license: string; source: string }>)[id]

const photo = (id: string) => `/places/${id}.jpg`

export const users: User[] = [
  { id: 'anna', name: 'Anna', isFriend: true, vibe: 'calm' },
  { id: 'marta', name: 'Marta', isFriend: true, vibe: 'outdoors' },
  { id: 'leo', name: 'Leo', isFriend: true, vibe: 'company' },
  { id: 'sofia', name: 'Sofia', isFriend: false },
  { id: 'noah', name: 'Noah', isFriend: false },
  { id: 'freja', name: 'Freja', isFriend: false },
  { id: 'emil', name: 'Emil', isFriend: false },
]

export const userById = (id?: string) => users.find(u => u.id === id)

export const places: Place[] = [
  {
    id: 'riis-skov', name: 'Riis Skov', category: 'Forest', area: 'Risskov', lat: 56.1778, lng: 10.225,
    interests: ['nature'], vibes: ['calm', 'outdoors'], company: ['alone', 'friend'], indoor: false, hidden: true,
    summary: 'A beech forest on the slopes north of the centre, a few minutes from the city.',
    whyGo: ['Steep, winding paths down to the bay', 'Feels far from the city without leaving it', 'Beautiful when the leaves turn'],
    image: photo('riis-skov'), visibility: 'public',
  },
  {
    id: 'den-permanente', name: 'Den Permanente', category: 'Sea bath & beach', area: 'Risskov', lat: 56.1747, lng: 10.231,
    interests: ['water', 'nature'], vibes: ['calm', 'outdoors'], company: ['alone', 'friend'], indoor: false, hidden: true,
    summary: 'A historic sea bath and small beach at the edge of Riis Skov.',
    whyGo: ['Quiet beach just outside the centre', 'Easy to combine with a forest walk', 'Calmest on weekday mornings'],
    image: photo('den-permanente'), visibility: 'public',
  },
  {
    id: 'uni-park', name: 'University Park', category: 'Park', area: 'Universitetsparken', lat: 56.168, lng: 10.203,
    interests: ['nature', 'study'], vibes: ['calm', 'outdoors'], company: ['alone', 'friend', 'group'], indoor: false, hidden: true,
    summary: 'Rolling hills, old oaks and a small lake between the yellow-brick university buildings.',
    whyGo: ['Sloping lawns made for sitting', 'Students around, but never crowded', 'A good place to read outside'],
    image: photo('uni-park'), visibility: 'public',
  },
  {
    id: 'vennelyst', name: 'Vennelystparken', category: 'Park', area: 'Nørrebro', lat: 56.165, lng: 10.2075,
    interests: ['nature'], vibes: ['calm'], company: ['alone', 'friend'], indoor: false, hidden: true,
    summary: 'A small neighbourhood park near the university that most visitors never find.',
    whyGo: ['Rarely busy', 'Benches under big trees', 'A short detour on the way home'],
    image: photo('vennelyst'), addedBy: 'emil', visibility: 'public',
  },
  {
    id: 'molleparken', name: 'Mølleparken', category: 'Pocket park', area: 'City centre', lat: 56.1556, lng: 10.2046,
    interests: ['nature', 'water'], vibes: ['calm', 'company'], company: ['alone', 'friend'], indoor: false, hidden: true,
    summary: 'A small green pocket along the Aarhus River, right in the middle of the city.',
    whyGo: ['Sit by the river between errands', 'People around, but relaxed', 'Close to cafés and the art centre'],
    image: photo('molleparken'), addedBy: 'freja', visibility: 'public',
  },
  {
    id: 'kunsthal', name: 'Kunsthal Aarhus', category: 'Contemporary art', area: 'City centre', lat: 56.1551, lng: 10.202,
    interests: ['culture', 'creative'], vibes: ['new', 'calm', 'cozy'], company: ['alone', 'friend'], indoor: true, hidden: true,
    summary: 'A small contemporary art centre with experimental, changing exhibitions.',
    whyGo: ['Smaller and calmer than the big museums', 'Something different every few months', 'Good for an hour on your own'],
    image: photo('kunsthal'), visibility: 'public',
  },
  {
    id: 'godsbanen', name: 'Godsbanen', category: 'Creative space', area: 'Aarhus K', lat: 56.1535, lng: 10.1947,
    interests: ['creative', 'culture', 'cafes'], vibes: ['company', 'new', 'cozy'], company: ['friend', 'group', 'alone'], indoor: true, hidden: true,
    summary: 'A former freight yard turned cultural centre, with workshops, stages and a sloping roof terrace.',
    whyGo: ['Sit on the sloping roof terrace', 'Workshops, events and small exhibitions', 'Relaxed, creative crowd'],
    image: photo('godsbanen'), visibility: 'public',
  },
  {
    id: 'latin-quarter', name: 'Latin Quarter', category: 'Old streets & cafés', area: 'City centre', lat: 56.159, lng: 10.209,
    interests: ['cafes', 'culture'], vibes: ['cozy', 'company'], company: ['alone', 'friend', 'group'], indoor: false, hidden: false,
    summary: 'The oldest streets in the city, with small cafés, independent shops and cobblestones.',
    whyGo: ['Lots of small cafés to choose from', 'Nice for an unplanned wander', 'Warm and lively in the evening'],
    image: photo('latin-quarter'), visibility: 'public',
  },
  {
    id: 'ingerslev', name: 'Ingerslevs Boulevard', category: 'Market & boulevard', area: 'Frederiksbjerg', lat: 56.1446, lng: 10.195,
    interests: ['cafes'], vibes: ['company', 'outdoors'], company: ['alone', 'friend', 'group'], indoor: false, hidden: true,
    summary: 'A tree-lined boulevard in Frederiksbjerg with a local market on Wednesdays and Saturdays.',
    whyGo: ['Neighbourhood market atmosphere', 'Bakeries and cafés on the side streets', 'Feels local, not touristy'],
    image: photo('ingerslev'), addedBy: 'marta', visibility: 'public',
  },
  {
    id: 'tangkrogen', name: 'Tangkrogen', category: 'Waterfront', area: 'Marselisborg', lat: 56.1386, lng: 10.2102,
    interests: ['water', 'nature'], vibes: ['outdoors', 'calm'], company: ['alone', 'friend', 'group'], indoor: false, hidden: true,
    summary: 'A waterfront lawn by the marina, with small fishing huts and wide views over the bay.',
    whyGo: ['Fishermen’s huts and boats to look at', 'Space to sit even on busy days', 'Great evening light'],
    image: photo('tangkrogen'), addedBy: 'anna', visibility: 'friends',
  },
  {
    id: 'mindeparken', name: 'Mindeparken', category: 'Park', area: 'Marselisborg', lat: 56.1294, lng: 10.2072,
    interests: ['nature'], vibes: ['outdoors', 'calm'], company: ['alone', 'friend', 'group'], indoor: false, hidden: true,
    summary: 'Wide lawns with a view over the bay, next to Marselisborg Palace.',
    whyGo: ['Open space and big skies', 'Good for a long walk or a picnic', 'Easy to continue into the forest'],
    image: photo('mindeparken'), visibility: 'public',
  },
  {
    id: 'varna', name: 'Varna Palæet', category: 'Café in the forest', area: 'Marselisborg Forests', lat: 56.1248, lng: 10.2163,
    interests: ['cafes', 'nature', 'water'], vibes: ['cozy', 'outdoors'], company: ['friend', 'group'], indoor: true, hidden: true,
    summary: 'A white-columned venue in the forest, overlooking the bay. Worth the walk.',
    whyGo: ['A warm drink halfway through a forest walk', 'Terrace with a view of the water', 'Feels like a small escape'],
    image: photo('varna'), addedBy: 'sofia', visibility: 'public',
  },
  {
    id: 'ballehage', name: 'Ballehage', category: 'Small beach', area: 'Marselisborg Forests', lat: 56.1206, lng: 10.2269,
    interests: ['water', 'nature'], vibes: ['calm', 'outdoors'], company: ['alone', 'friend'], indoor: false, hidden: true,
    summary: 'A small beach with a jetty, tucked below the forest south of the city.',
    whyGo: ['Quiet outside summer weekends', 'Walk out on the jetty', 'Forest right behind the beach'],
    image: photo('ballehage'), addedBy: 'noah', visibility: 'public',
  },
  {
    id: 'botanical', name: 'Botanical Garden', category: 'Garden & greenhouses', area: 'City centre', lat: 56.1606, lng: 10.1908,
    interests: ['nature', 'study'], vibes: ['calm', 'cozy', 'outdoors'], company: ['alone', 'friend'], indoor: false, hidden: false,
    summary: 'Paths, ponds and tropical greenhouses right next to the city centre.',
    whyGo: ['Warm greenhouses on cold days', 'Quiet paths and benches', 'Free to visit'],
    image: photo('botanical'), visibility: 'public',
  },
  {
    id: 'dokk1', name: 'Dokk1', category: 'Library & culture house', area: 'Harbour', lat: 56.1535, lng: 10.2141,
    interests: ['study', 'culture', 'water'], vibes: ['calm', 'cozy', 'company'], company: ['alone', 'friend'], indoor: true, hidden: false,
    summary: 'A waterfront library with plenty of space to sit, read or work.',
    whyGo: ['Free and open to everyone', 'Big windows over the harbour', 'Be around people without having to talk'],
    image: photo('dokk1'), visibility: 'public',
  },
  {
    id: 'den-gamle-by', name: 'Den Gamle By', category: 'Open-air museum', area: 'City centre', lat: 56.1592, lng: 10.1908,
    interests: ['culture'], vibes: ['new', 'cozy'], company: ['alone', 'friend', 'group'], indoor: false, hidden: false,
    summary: 'An open-air museum of old Danish town houses, shops and workshops.',
    whyGo: ['Historic streets to wander at your own pace', 'Small interiors to duck into', 'Next to the Botanical Garden'],
    image: photo('den-gamle-by'), visibility: 'public',
  },
  {
    id: 'aros', name: 'ARoS', category: 'Art museum', area: 'City centre', lat: 56.1539, lng: 10.1996,
    interests: ['culture'], vibes: ['new', 'cozy'], company: ['alone', 'friend', 'group'], indoor: true, hidden: false,
    summary: 'A large art museum crowned by a walkable rainbow panorama.',
    whyGo: ['Views over the city from the rainbow', 'Changing exhibitions', 'A reliable rainy-day plan'],
    image: photo('aros'), visibility: 'public',
  },
  {
    id: 'moesgaard', name: 'Moesgaard Museum', category: 'Museum', area: 'Højbjerg', lat: 56.087, lng: 10.2263,
    interests: ['culture', 'nature'], vibes: ['new', 'outdoors'], company: ['friend', 'group'], indoor: true, hidden: false,
    summary: 'An archaeology museum with a sloping grass roof, surrounded by forest.',
    whyGo: ['Walk up the grass roof for the view', 'Forest paths nearby', 'A good half-day trip'],
    image: photo('moesgaard'), visibility: 'public',
  },
  {
    id: 'marselisborg', name: 'Marselisborg Forests', category: 'Forest', area: 'South Aarhus', lat: 56.1, lng: 10.2333,
    interests: ['nature'], vibes: ['outdoors', 'calm'], company: ['alone', 'friend', 'group'], indoor: false, hidden: false,
    summary: 'A large forest along the bay, south of the city.',
    whyGo: ['Long walks with no fixed route', 'Streams and forest paths', 'Bay views between the trees'],
    image: photo('marselisborg'), visibility: 'public',
  },
  {
    id: 'aarhus-o', name: 'Aarhus Ø', category: 'Harbour district', area: 'Harbour', lat: 56.1656, lng: 10.2314,
    interests: ['water'], vibes: ['outdoors', 'new'], company: ['alone', 'friend', 'group'], indoor: false, hidden: false,
    summary: 'A new harbour district with bold architecture, wind and wide views.',
    whyGo: ['Walk along the water', 'Interesting buildings', 'Beautiful late light'],
    image: photo('aarhus-o'), visibility: 'public',
  },
]

export const secretTriggers = ['autumn', 'fall', 'leaves', 'hygge', 'efterår', 'efteraar']

export const secretPlace: Place = {
  id: 'golden-hour-bench', name: 'Golden Hour Bench', category: 'Secret spot', area: 'Riis Skov', lat: 56.1762, lng: 10.2236,
  interests: ['nature'], vibes: ['calm', 'cozy'], company: ['alone', 'friend'], indoor: false, hidden: true,
  summary: 'A bench on the forest slope where the beech leaves turn gold first. You found it by looking for autumn.',
  whyGo: ['The first trees in the city to turn golden', 'A view of the bay through the branches', 'Best around sunset in October'],
  image: photo('riis-skov'), visibility: 'public', secret: true,
}

export const seedTips: Tip[] = [
  { id: 't1', placeId: 'riis-skov', text: 'Take the stairs down to the water and walk back along the shore.', createdAt: '2026-10-12' },
  { id: 't2', placeId: 'riis-skov', text: 'Bring a thermos. There is a bench near the bottom with a view of the bay.', authorId: 'marta', createdAt: '2026-10-18' },
  { id: 't3', placeId: 'uni-park', text: 'The slope facing the lake gets the last sun of the day.', createdAt: '2026-10-03' },
  { id: 't4', placeId: 'godsbanen', text: 'Check the event board inside, there is often something free in the evening.', authorId: 'leo', createdAt: '2026-10-20' },
  { id: 't5', placeId: 'dokk1', text: 'The quiet tables by the window upstairs are the best.', createdAt: '2026-09-28' },
  { id: 't6', placeId: 'varna', text: 'Walk there through the forest from Mindeparken, about 20 minutes.', authorId: 'sofia', createdAt: '2026-10-09' },
  { id: 't7', placeId: 'tangkrogen', text: 'Sit by the fishing huts at sunset, it is never crowded there.', authorId: 'anna', createdAt: '2026-10-22' },
  { id: 't8', placeId: 'ingerslev', text: 'Go early on Saturday before the market gets busy.', createdAt: '2026-10-05' },
  { id: 't9', placeId: 'kunsthal', text: 'Small enough to see everything in an hour.', createdAt: '2026-10-14' },
  { id: 't10', placeId: 'botanical', text: 'The tropical greenhouse is the warmest place in the city on a grey day.', createdAt: '2026-10-11' },
]
