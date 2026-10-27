# PLACE — usability testing iteration

Updated onboarding, home discovery, map contribution entry, place detail, profile, community and privacy settings.

## Prototype limits
- Places, saved items, reviews and preferences are stored in browser localStorage. They are not shared across users or devices.
- Friends-only visibility is an illustrative selection only; there is no authentication or access-control backend. Do not enter sensitive information.
- Invitations are demonstration interactions and are not delivered.
- Photos are still externally hosted sample images and should be replaced with verified location photographs.
- The app does not request or broadcast GPS location.
- Coordinate entry is manual, and submitted locations are not moderated.

## Run
On your Mac: `npm install` then `npm run dev`. Build with `npm run build`.

## Validation
System TypeScript `tsc -b` passed in the editing environment. Full Vite build could not run because the uploaded node_modules contain macOS ARM native dependencies, while the editing environment is Linux. Reinstall dependencies on your Mac before building.
