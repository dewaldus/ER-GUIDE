# Miniature Earth Globe Implementation Plan

## Goal

Rebuild the ERGuide globe element on top of `miniature.earth` with a cleaner structure while preserving the current baseline:

- the same 17 countries
- the same country order
- the same green hologram color direction
- the same route-line sequencing behavior
- the same country-name overlay concept

This plan is intentionally implementation-focused and should be used alongside the reference spec in:

- [`/Users/dewald/Documents/Code/ER GUIDE/New Website/docs/miniature-earth-globe-spec.md`](/Users/dewald/Documents/Code/ER GUIDE/New Website/docs/miniature-earth-globe-spec.md)

## Rebuild Strategy

### Recommendation

Rebuild the globe as a small component system rather than one large procedural script.

Recommended layers:

1. country data
2. visual config
3. globe bootstrap
4. route animation
5. highlight rendering
6. overlay rendering
7. interaction and lifecycle

### Why this structure

The current globe works, but its logic and asset data are tightly coupled.

A cleaner rebuild will make it much easier to:

- adjust a single country without touching animation logic
- swap between `Image` and `Sprite` behaviors
- tune timing without editing large blocks of setup code
- calibrate country positions and scales systematically

## Proposed File Structure

Recommended target structure:

- [`/Users/dewald/Documents/Code/ER GUIDE/New Website/js/globe/earth-config.js`](/Users/dewald/Documents/Code/ER GUIDE/New Website/js/globe/earth-config.js)
- [`/Users/dewald/Documents/Code/ER GUIDE/New Website/js/globe/countries.js`](/Users/dewald/Documents/Code/ER GUIDE/New Website/js/globe/countries.js)
- [`/Users/dewald/Documents/Code/ER GUIDE/New Website/js/globe/colors.js`](/Users/dewald/Documents/Code/ER GUIDE/New Website/js/globe/colors.js)
- [`/Users/dewald/Documents/Code/ER GUIDE/New Website/js/globe/highlights.js`](/Users/dewald/Documents/Code/ER GUIDE/New Website/js/globe/highlights.js)
- [`/Users/dewald/Documents/Code/ER GUIDE/New Website/js/globe/route-sequence.js`](/Users/dewald/Documents/Code/ER GUIDE/New Website/js/globe/route-sequence.js)
- [`/Users/dewald/Documents/Code/ER GUIDE/New Website/js/globe/overlay.js`](/Users/dewald/Documents/Code/ER GUIDE/New Website/js/globe/overlay.js)
- [`/Users/dewald/Documents/Code/ER GUIDE/New Website/js/globe/controller.js`](/Users/dewald/Documents/Code/ER GUIDE/New Website/js/globe/controller.js)
- [`/Users/dewald/Documents/Code/ER GUIDE/New Website/js/globe-entry.js`](/Users/dewald/Documents/Code/ER GUIDE/New Website/js/globe-entry.js)

If we want to keep it simpler, we can compress this into 3 files instead:

- `countries.js`
- `globe-controller.js`
- `globe-entry.js`

## Proposed Data Model

### Country registry

Each country should live in a structured registry entry.

Recommended shape:

```js
{
  id: 'south-africa',
  name: 'South Africa',
  order: 1,
  lat: -28.816624,
  lng: 24.991639,
  assetPath: 'assets/globe/south_africa.svg',
  areaKm2: 1221037,
  scaleAdjust: 1.03,
  anchorOffsetLat: 0,
  anchorOffsetLng: 0,
  notes: ''
}
```

### Derived fields

These should be computed, not hard-coded:

- `computedScale`
- `location`
- `nextCountryId`

### Why file-based assets

Use direct SVG file paths instead of embedding large base64 strings inline.

Benefits:

- much easier inspection and debugging
- easier asset swaps
- smaller control code
- cleaner diffs in git

## Visual Config

Create a single visual config module for all globe styling constants.

Recommended config:

```js
export const GLOBE_COLORS = {
  brandGreen: '#019540',
  neonGreen: '#02e67f',
  countryFill: '#009640',
  overlayBackground: 'rgba(0, 0, 0, 0.6)',
  overlayBorder: 'rgba(173, 172, 172, 0.29)'
};
```

Also define timing constants there:

```js
export const GLOBE_TIMINGS = {
  readyFadeMs: 1500,
  lineFadeMs: 500,
  lineDrawMs: 2000,
  countryFadeInMs: 1000,
  countryVisibleMs: 5000,
  autoRotateResumeDelayMs: 2500
};
```

## Rendering Decisions

### Country highlights

Recommended baseline:

- keep country silhouettes as `addImage()`

Why:

- this matches the current visual behavior
- the country shape itself is the focal object
- the mask should sit on the globe surface

### Moving marker

Recommended option:

- add a true `addSprite()` beacon only if we want a visible traveling marker

Why:

- Miniature Earth `Sprite` is screen-facing and sits above other objects
- this is ideal for a glowing beacon, dot, pin, or pulse marker
- it is not a replacement for the country silhouette mask

### Recommended architecture choice

Best rebuild path:

- keep `addImage()` for country silhouette highlights
- keep `addLine()` for route animation
- optionally add one `addSprite()` as a separate moving beacon layer

This gives us:

- the current country-shape storytelling
- a cleaner visual sense of movement if desired

## Behavior Architecture

### Phase 1: Bootstrap

Responsibilities:

- wait for DOM ready
- wait for Miniature Earth availability
- create earth instance
- add `.earth-ready` on `ready`

### Phase 2: Asset registration

Responsibilities:

- create country highlight images
- create overlay instance
- optionally create beacon sprite

### Phase 3: Sequence engine

Responsibilities:

- track `sourceIndex`
- track `destinationIndex`
- draw route
- reveal destination highlight
- show overlay
- advance to next pair
- loop continuously

### Phase 4: Interaction handling

Responsibilities:

- stop auto-rotation on drag
- resume rotation after delay
- close overlay when globe is moved too far from active country
- destroy earth instance on cleanup

## Proposed Controller Flow

Recommended sequence:

1. create earth instance
2. create overlay
3. create all country highlight images at opacity `0`
4. optionally create moving sprite beacon at opacity `0`
5. start route loop
6. animate current route
7. animate current destination highlight
8. show overlay
9. optionally animate beacon
10. advance to next route

## Scale Strategy

### Recommended formula

Use one shared scale formula based on land area, then allow small overrides.

Recommended pattern:

```js
function getCountryScale(country) {
  const scale = Math.sqrt(country.areaKm2 / 100000) * 0.35 * (country.scaleAdjust || 1);
  return Math.max(0.3, Math.min(1.35, Number(scale.toFixed(2))));
}
```

### Why this is the right baseline

- large countries remain visually large
- small countries stay visible
- only small per-country nudges are needed
- future countries can be added consistently

## Coordinate Strategy

### Recommended baseline

Start from the current working coordinates already documented in the spec.

### Fine-tuning method

For each country:

1. render the country highlight on the hologram map
2. compare the visual center of the SVG shape to the visible country on the globe
3. add optional `anchorOffsetLat` and `anchorOffsetLng` only when needed
4. record the reason in `notes`

### Important rule

Do not hard-code silent coordinate hacks directly in control logic.

All per-country corrections should live in the registry.

## Overlay Plan

### Baseline

Preserve the current label card behavior:

- dark translucent card
- green country name
- shown only for the active country

### Recommended implementation

Keep overlay rendering isolated from sequencing logic.

Suggested methods:

- `createOverlay(earth)`
- `showOverlay(country)`
- `hideOverlay()`
- `updateOverlayLocation(country)`

## Beacon Decision

### Option A: Preserve current behavior only

Use:

- `addImage()`
- `addLine()`
- `addOverlay()`

Pros:

- closest to current site
- lowest implementation risk
- easiest calibration path

Cons:

- route motion is implied mostly by the line, not by a distinct moving object

### Option B: Add a true moving sprite beacon

Use:

- `addImage()` for country masks
- `addLine()` for path
- `addSprite()` for a traveling beacon
- `addOverlay()` for label

Pros:

- visually clearer motion
- makes "sprite" terminology literally true
- stronger premium / hologram effect

Cons:

- more animation logic
- requires movement choreography between countries

### Recommendation

Best path for the rebuild:

- implement Option A first as the parity target
- add Option B only as an enhancement layer after parity is verified

## Implementation Steps

### Step 1

Create the country registry in a dedicated file using the documented country order.

### Step 2

Create shared config modules for:

- colors
- timings
- earth defaults

### Step 3

Refactor globe setup into a controller with small functions:

- `initGlobe()`
- `createEarth()`
- `bindEarthEvents()`
- `startSequence()`

### Step 4

Create the country highlight renderer:

- build all `Image` instances
- set initial opacity
- compute scales from the registry

### Step 5

Create the route animator:

- draw line
- clip animation
- line replacement
- loop progression

### Step 6

Create the overlay controller:

- card creation
- text update
- location update
- close logic

### Step 7

Visually calibrate all countries and record any offsets in the registry.

### Step 8

Only after parity is confirmed, decide whether to add a real moving sprite beacon.

## Success Criteria

The rebuild is complete when:

- all 17 countries appear in the correct order
- the route loops smoothly
- highlight placement is visually aligned with the hologram map
- country sizes feel consistent relative to the map
- overlay cards appear and hide correctly
- drag/autorotate behavior matches the spec
- the visual system still reads as the ERGuide hologram globe

## Immediate Recommendation

The safest path forward is:

1. rebuild for parity first
2. keep the current countries, order, colors, and line behavior exactly
3. move the country data into a clean registry
4. switch the implementation to file-based assets
5. calibrate positions and scales cleanly
6. decide afterward whether a true moving sprite should be added

## Next Step

If we proceed to implementation, the first code task should be:

- create `countries.js`
- create `earth-config.js`
- replace inline country data in the current globe logic with the registry

That gives us the clean foundation without changing the visual story yet.
