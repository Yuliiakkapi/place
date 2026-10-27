# PLACE — Autumn social discovery prototype

A mobile-first React + TypeScript + Tailwind prototype based on the PLACE technical build brief.

## Run locally

```bash
npm install
npm run dev
```

Open the local Vite URL shown in the terminal.

## Current prototype

- Onboarding flow
- Today mood check-in
- Mood-based deterministic recommendation engine
- Aarhus demo places
- Seasonal map-style discovery UI
- Place details + seasonal layers
- Seasonal traces UI
- People + mood matching
- “I’m going somewhere” social-plan interaction
- Journal + Your Autumn retrospective
- Responsive mobile-first shell
- Reduced-motion-aware CSS

## Next implementation steps

1. Replace the map-style fallback with Leaflet tiles and real marker clustering.
2. Persist check-ins, saves, traces and plans with a local repository/localStorage layer.
3. Add a proper Personal Map.
4. Add weather service abstraction.
5. Add Supabase repository/auth/storage without changing the feature UI contracts.
6. Polish micro-interactions and real seasonal image transitions.
