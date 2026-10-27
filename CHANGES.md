# Iteration 2: changes from user testing

Each change below is linked to the feedback that led to it.

## Onboarding: simpler and more about the person
- **Feedback:** questions repeated, answers couldn't be removed, the app learned nothing about the user.
- Three short steps: name and favourite kinds of places, who you go out with and whether you prefer hidden gems or popular spots, then favourite spots and inviting friends.
- Every answer can be tapped again to remove it, and a check mark shows what is selected.
- Mood is no longer asked during onboarding, so it is only asked in one place.
- Favourite spots named during onboarding show up on Profile with an **Add to map** shortcut.

## Home: clearer, with less on screen
- **Feedback:** too much information, the leaf logo, emojis and extra buttons were confusing, mood was asked several times, the green block looked clickable.
- One mood question with five plain options, each with a one-line explanation. It is asked once a day, shows "You can change it anytime", and becomes a single line with **Change** once answered.
- One "Picked for you" place that explains why it was picked (for example "Fits calm & quiet · You like parks & nature"), followed by three more suggestions.
- Removed the leaf icon, all emojis, the "Mood weather" block and the Go alone / Find someone / Save buttons.
- Anything you can tap is a white card with a border and a chevron. Information that isn't tappable is plain text.

## Map: the main feature, now with places from people
- **Feedback:** testers liked the map most, wanted to add places, preferred niche spots and wanted to see what others had added.
- New map design: vector map from OpenFreeMap (free, no API key), recoloured to the PLACE palette with warm paper streets, sage parks and soft teal water, and without road-number badges. Styling is in `src/components/mapStyle.ts`.
- The selected place appears as a photo bubble on the map.
- Filter chips are always visible: All, Hidden gems, Shared by people, Saved, Indoors and Outdoors.
- Places shared by people have green pins and curated places have rust pins, with a legend.
- Tapping a pin opens a preview card instead of jumping straight to a new page.
- **Add a place:** tap the map to drop a pin (no coordinates to type), add an optional photo, and choose Everyone or Only my friends.
- 20 Aarhus places, 13 of them lesser-known spots such as Riis Skov, Den Permanente, Tangkrogen and Varna Palæet.

## Privacy: you choose who sees what
- **Feedback:** location only for selected people, no forced sharing of experiences or photos, keep public and private separate, allow anonymous reviews.
- Location sharing is off by default. It can be turned on for specific friends only.
- Mood can be visible to friends or to nobody.
- Tips are anonymous by default, and this can be changed for each tip.
- People is split into **Friends** (moods, invites) and **Community** (only publicly shared places).

## Place pages and Profile
- **Feedback:** the diary felt too personal, "Seasonal trace" was unclear, place cards were too busy, photos looked like placeholders.
- Removed the diary, timeline and "Your Autumn" statistics. Profile now shows saved places, places you shared and your favourite spots.
- "Seasonal traces" is now **Tips from visitors**.
- Place pages show a short summary, "Why go" (three points), Save, Invite a friend, Get directions and tips.
- All photos are real pictures of each place from Wikimedia Commons, with credit shown under the photo (`src/data/photoCredits.json`).

## Visual redesign
- New look based on reference app designs: Inter throughout (tight semibold headings), a warm cream background, deep forest-green buttons, and soft peach and sand autumn gradients. Orange is used only as a small accent.
- Gently falling leaves on the welcome screen, Explore and Profile (`src/components/AutumnLeaves.tsx`). They are turned off when the device asks for reduced motion.
- Each kind of place has its own muted autumn colour and icon (cafés, nature, water, creative, culture, read/work). These are used on map pins, chips and onboarding.
- The bottom navigation is now a floating pill. The active tab is black, and every tab keeps its label.
- Explore: your vibe is a single pill that opens a bottom sheet, followed by a "Picked for you" card with a tilted photo, swipeable photo cards and a "Your people shared" row.
- Map: brighter map colours, search, filter chips with icons, and pins coloured by category with a contributor badge. A swipeable card carousel stays in sync with the map, and the selected place shows as a photo pin.
- Place page: full-width photo with a white sheet overlapping it. Facts are on flat grey tiles, while buttons are white or black, so it stays clear what can be tapped.
- Profile: stat cards and a photo grid of saved places.

## Design system pass (anti-vibe-coded checklist)
- Spacing uses a strict 4px scale, with no half steps.
- There are three corner radii: 12px for small thumbnails, 20px for cards and inputs, 28px for hero cards and sheets. Pills are fully round.
- There are two shadow levels: `card-shadow` for resting cards and `float-shadow` / `float-drop` for floating elements like the nav, pins and photos.
- Text sizes come only from Tailwind's default scale. Headings share one line height through the `display` utility.
- Sparkle icons are replaced with an icon for each vibe, and the "why" line has a plain "Why:" label.
- Map pins no longer grow on hover.
- Loading states: a pulsing map placeholder while the map loads, a shimmer skeleton until each photo appears, and "Preparing photo…" when adding a photo.
- Every page sets its own title. Added a meta description and Open Graph / Twitter share tags.
- Profile's "On map" now opens the map filtered to saved places.

## Motion pass (emil-design-eng)
- Custom easing tokens: `--ease-out`, `--ease-in-out` and `--ease-drawer`. Buttons and links animate only `scale` and colours, not every property.
- Every button and link scales to 0.97 when pressed; large cards scale to 0.98.
- The bottom sheet slides in over 350ms on a drawer curve and slides out over 200ms. Pressing Escape closes it instantly, without animation.
- The selected map pin grows out of its anchor point instead of swapping in. The map camera moves faster (450–600ms).
- People lists appear with a 40ms stagger. Page entrances are 250ms.
- With reduced motion turned on, fades remain and all movement (slides, press scale, falling leaves) is removed.

## Not built yet
- B2B or business listings were noted as future work and not included.
- Everything is stored in the browser's localStorage. There are no accounts or backend, invitations are not sent, and no real GPS location is used.
