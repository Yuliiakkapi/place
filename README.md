# PLACE: find your third place

A mobile-first React + TypeScript + Tailwind prototype for discovering hidden-gem "third places" in Aarhus.

## Run locally

```bash
npm install
npm run dev
```

Open the local Vite URL shown in the terminal. To start over, go to Profile → Settings → **Reset demo data**.

## What's in the prototype

- Onboarding: name, kinds of places you like, who you go out with, hidden gems or popular spots, favourite spots, invite friends
- Home: a daily mood (can be changed anytime) and personalised suggestions that explain why they were picked
- Map: filters, community and curated pins, a preview card when you tap a pin, and adding your own place by tapping the map
- Place pages: save, invite a friend, directions, and anonymous tips from visitors
- People: Friends (moods, invites) and Community (publicly shared places)
- Profile and privacy settings: location sharing with chosen friends only, mood visibility, anonymous tips by default

See [CHANGES.md](CHANGES.md) for how each change maps to the user-testing feedback.

## Structure

- `src/pages/`: one file per screen
- `src/components/ui.tsx`: shared building blocks (option buttons, place rows, badges)
- `src/data/seed.ts`: places, people, tips and option lists
- `src/services/store.ts`: localStorage-backed state
- `src/services/recommendationService.ts`: deterministic recommendation scoring
- `public/places/`: place photos (Wikimedia Commons, credits in `src/data/photoCredits.json`)

## Next steps

1. Add accounts and a backend (for example Supabase) so shared places, tips and friend lists are real.
2. Moderate places that people submit.
3. Explore optional business listings (B2B) without making recommendations less trustworthy.
