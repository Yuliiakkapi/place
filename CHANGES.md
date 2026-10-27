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

## Not built yet
- B2B or business listings were noted as future work and not included.
- Everything is stored in the browser's localStorage. There are no accounts or backend, invitations are not sent, and no real GPS location is used.
