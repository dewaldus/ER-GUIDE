# Miniature Earth Globe Spec

## Purpose

This document captures the current ERGuide globe element as a rebuild-ready specification before any full reimplementation.

It records:

- the countries used by the current site
- the exact animation order
- the current visual language and colors
- how the element behaves at runtime
- how that behavior maps to the `miniature.earth` API
- the recommended rebuild approach

## Current Scope

The current globe is a hero-section visual mounted in `#myearth` inside the hero layout.

Relevant files:

- [`/Users/dewald/Documents/Code/ER GUIDE/New Website/index.html`](/Users/dewald/Documents/Code/ER GUIDE/New Website/index.html)
- [`/Users/dewald/Documents/Code/ER GUIDE/New Website/css/style.css`](/Users/dewald/Documents/Code/ER GUIDE/New Website/css/style.css)
- [`/Users/dewald/Documents/Code/ER GUIDE/New Website/js/globe/colors.js`](/Users/dewald/Documents/Code/ER GUIDE/New Website/js/globe/colors.js)
- [`/Users/dewald/Documents/Code/ER GUIDE/New Website/js/globe/earth-config.js`](/Users/dewald/Documents/Code/ER GUIDE/New Website/js/globe/earth-config.js)
- [`/Users/dewald/Documents/Code/ER GUIDE/New Website/js/globe/countries.js`](/Users/dewald/Documents/Code/ER GUIDE/New Website/js/globe/countries.js)
- [`/Users/dewald/Documents/Code/ER GUIDE/New Website/js/globe/controller.js`](/Users/dewald/Documents/Code/ER GUIDE/New Website/js/globe/controller.js)
- [`/Users/dewald/Documents/Code/ER GUIDE/New Website/js/globe-entry.js`](/Users/dewald/Documents/Code/ER GUIDE/New Website/js/globe-entry.js)
- [`/Users/dewald/Documents/Code/ER GUIDE/New Website/js/miniature.earth.js`](/Users/dewald/Documents/Code/ER GUIDE/New Website/js/miniature.earth.js)

## Important Clarification

The current implementation does not use a true Miniature Earth `Sprite` for the country highlight.

It uses:

- `addImage()` for each country silhouette highlight
- `addLine()` for the animated route between countries
- `addOverlay()` for the country-name label card

So when we refer to the "sprite" in project language, the current site behavior is really a sequence of fading country images plus a traveling route line.

If the rebuild needs a true screen-facing beacon or moving dot, that should use Miniature Earth `addSprite()` explicitly.

## Globe Baseline

Current globe setup:

- centered on Africa
- `location: { lat: -2, lng: 22 }`
- `zoom: 1.4`
- `light: 'sun'`
- `lightColor: '#ffffff'`
- `lightIntensity: 0.6`
- `lightAmbience: 0.7`
- `transparent: true`
- `autoRotate: true`
- `autoRotateSpeed: 0.2`
- `autoRotateDelay: 300`
- `autoRotateStart: 3000`
- `draggable: true`

Map treatment:

- custom hologram-style map image
- equirectangular SVG texture
- green stroke/fill treatment embedded in the map SVG

## Country Inventory

These are the countries currently used by the site and the order in which they are animated.

| Order | Country |
| --- | --- |
| 1 | South Africa |
| 2 | Zambia |
| 3 | Uganda |
| 4 | Tanzania |
| 5 | Mauritius |
| 6 | Malawi |
| 7 | Kenya |
| 8 | Ghana |
| 9 | Ethiopia |
| 10 | Democratic Republic of the Congo |
| 11 | Namibia |
| 12 | Angola |
| 13 | Eswatini |
| 14 | Lesotho |
| 15 | Botswana |
| 16 | Nigeria |
| 17 | Mozambique |

## Current Country Data Model

Each country currently has:

- `name`
- `location`
- `image`
- scale metadata used to derive highlight size

Current rebuild-safe country registry fields should be:

- `id`
- `name`
- `order`
- `lat`
- `lng`
- `assetPath`
- `areaKm2`
- `scaleAdjust`
- `computedScale`
- optional `anchorOffsetLat`
- optional `anchorOffsetLng`
- optional `notes`

## Current Country Coordinates And Scale Inputs

These values represent the current working dataset in the project and should be treated as the baseline for any rebuild calibration.

| Country | Lat | Lng | Area km2 | Scale Adjust |
| --- | ---: | ---: | ---: | ---: |
| South Africa | -28.816624 | 24.991639 | 1221037 | 1.03 |
| Zambia | -14.518912 | 27.558988 | 752612 | 1.05 |
| Uganda | 1.533355 | 32.216658 | 241550 | 1.08 |
| Tanzania | -6.524712 | 35.787844 | 945087 | 1.02 |
| Mauritius | -20.275945 | 57.570357 | 2040 | 1.15 |
| Malawi | -13.268720 | 33.930196 | 118484 | 1.05 |
| Kenya | 1.441968 | 38.431398 | 580367 | 1.06 |
| Ghana | 8.030028 | -1.080027 | 238533 | 1.02 |
| Ethiopia | 10.211670 | 38.652120 | 1104300 | 1.02 |
| Democratic Republic of the Congo | -2.981434 | 23.822264 | 2344858 | 0.95 |
| Namibia | -23.233550 | 17.323111 | 825615 | 1.00 |
| Angola | -11.877577 | 17.569124 | 1246700 | 0.98 |
| Eswatini | -26.562481 | 31.399132 | 17364 | 1.10 |
| Lesotho | -29.603927 | 28.335019 | 30355 | 1.10 |
| Botswana | -23.168178 | 24.592874 | 582000 | 0.98 |
| Nigeria | 9.600036 | 7.999972 | 923768 | 1.00 |
| Mozambique | -19.302233 | 34.914498 | 801590 | 0.98 |

## Current Behaviors

### 1. Load and fade-in

Behavior:

- the globe container starts hidden
- when Miniature Earth emits `ready`, the element gets the `.earth-ready` class
- CSS then fades the globe in

Current CSS behavior:

- `#myearth` starts at `opacity: 0`
- `#myearth.earth-ready` transitions to `opacity: 1`

### 2. Auto-rotation

Behavior:

- globe auto-rotates slowly after load
- drag interaction pauses auto-rotation
- auto-rotation resumes 2.5 seconds after drag ends

### 3. Country highlight lifecycle

Behavior:

- all country highlights are created up front as hidden `Image` elements
- the next route line is drawn from the current source country to the next destination
- once the line animation completes, the destination country highlight fades in
- after the highlight appears, the country-name overlay is shown
- the highlight remains visible briefly, then fades out
- the system advances to the next route/country pair and repeats

### 4. Overlay label behavior

Behavior:

- overlay is hidden on startup
- when a country becomes active, the overlay moves to the country location
- the overlay displays the country name
- if the user rotates the globe too far away from the current active country, the overlay is closed

Current threshold:

- overlay closes if the angle between the globe location and the active country exceeds `45`

### 5. Route line behavior

Behavior:

- line travels from `source` to `destination`
- line is clipped from `0` to `1` over time
- old line fades away before the next line is added
- after the final country, the sequence loops back to the first country

Current timing:

- line fade-out before replacement: `500ms`
- line draw animation: `2000ms`
- country image fade-in: `1000ms`
- country image fade-out: `5000ms`

## Current Visual System

### Primary accent colors

- Brand/theme green: `#019540`
- Route line and country-name text green: `#02e67f`
- Country silhouette SVG fill green: `#009640`

### Hologram map colors

The custom map image uses translucent green treatments including:

- `RGBA(1,149,64,0.10)` for fill
- `RGBA(1,149,64,0.95)` for strokes
- `RGBA(1,149,64,0.40)` for grid lines

### Overlay card style

Current country-name card:

- background: `rgba(0, 0, 0, 0.6)`
- border: `1px solid rgba(173, 172, 172, 0.29)`
- border radius: `6px`
- padding: `4px 10px`
- backdrop blur: `4px`
- text color: `#02e67f`
- text size: `0.8em`
- text weight: `500`

### Theme summary

The overall visual direction is:

- dark transparent overlay surfaces
- luminous neon green accents
- a hologram/grid world map
- subtle glow and route movement
- compliance-tech / enterprise-tech hero aesthetic

## Current API Mapping To Miniature Earth

### `Earth()`

Used for:

- globe creation
- camera position
- lighting
- interaction
- autorotation

### `addImage()`

Used for:

- country silhouette highlights

Notes:

- this is surface-aligned imagery
- it does not face the screen like a true sprite
- lat/lng anchors the image plane, so asset centering matters

### `addLine()`

Used for:

- animated route connection between countries

Current line config:

- `color: '#02e67f'`
- `width: 0.3`
- `offset: -0.3`
- `offsetFlow: 2`
- `clip` animates from `0` to `1`

### `addOverlay()`

Used for:

- country-name card

Current overlay config:

- HTML content string
- starts hidden
- `containerScale: 1`
- `depthScale: 0`

## Rebuild Recommendations

### Recommended structure

If we rebuild, split the implementation into these parts:

1. `globe-config`
2. `country-registry`
3. `highlight-renderer`
4. `route-animator`
5. `overlay-controller`
6. `lifecycle-and-interaction`

### Recommended data source

Move all country metadata out of inline base64-heavy JS objects into a cleaner registry file.

Preferred structure:

- one structured JS or JSON module for country metadata
- individual SVG assets stored in `assets/globe/`
- no large base64 strings embedded directly in the control logic

### Recommended implementation decisions

Decision A:

- keep flat country silhouette highlights with `addImage()`

Decision B:

- add a true moving beacon with `addSprite()` if the redesign should visibly show a traveling marker rather than only a traveling line

Decision C:

- preserve the current green hologram palette as the default visual system unless design intentionally changes

Decision D:

- preserve the exact country order listed above unless business/product wants a new narrative route

## Proposed Rebuild Workflow

### Step 1

Freeze this spec as the reference behavior.

### Step 2

Create a clean country registry module with:

- country name
- order
- coordinates
- asset path
- scale inputs
- optional offsets

### Step 3

Replace inline base64 country images with file-based SVG references.

### Step 4

Build a dedicated globe controller around Miniature Earth:

- setup
- ready state
- route sequencing
- overlay management
- drag/autorotate management

### Step 5

Verify every country visually against the hologram map and adjust only small residual offsets.

### Step 6

If needed, add a true animated `Sprite` beacon as a separate layer so the route has both:

- a moving path
- a moving beacon

## Open Decisions Before Rebuild

1. Do we preserve the current hologram look exactly, or refresh it?
2. Do we keep `addImage()` country highlights only, or add a true moving `Sprite` beacon?
3. Do we preserve the current route sequence exactly, or revise the story/order?
4. Do we want the country names to remain label-only, or show richer cards with icons or metadata?

## Summary

The current globe is best understood as:

- an Africa-centered Miniature Earth globe
- a hologram-style custom map texture
- a sequence of 17 country highlights
- an animated green route line moving country to country
- a floating dark label card naming the active country

This spec should be treated as the baseline reference before any full reimplementation.
