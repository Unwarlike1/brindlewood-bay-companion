# Phase 1 Architecture Specification
## Interactive Frontend Prototype (v1.1)

## Purpose

Phase 1 validates the user experience before any backend work begins.

The application uses static JSON and mock data only. No Google Sheets or API integration exists in this phase.

---

# Goals

- Validate navigation
- Validate layout
- Validate mobile usability
- Validate Keeper dashboard workflow
- Validate game flow
- Validate visual design

---

# Design Principles

- Mobile-first
- Two taps maximum for common actions
- No horizontal scrolling
- Large touch targets
- Minimal visual clutter
- Native-app feel

---

# Color System

## Overall Theme

Inspired by cozy seaside towns and mystery television.

### Primary Background

Warm parchment

### Secondary Background

Soft cream

### Primary Accent

Coastal blue

### Success

Soft green

### Warning

Golden yellow

### Danger

Muted red

### Interactive

Slate blue

### Text

Dark charcoal

### Borders

Light gray

---

# Crown System

## Crown of the Queen

Crowns are earned sequentially.

Players may only activate the next available crown.

Example

```
□ □ □ □ □
```

After earning one:

```
✓ □ □ □ □
```

The remaining crowns remain inactive.

Unavailable crowns should appear visually disabled.

Example

```
✓ ☐ ☐ ☐ ☐
```

Disabled crowns use a muted gray appearance.

Previously earned crowns remain highlighted.

---

## Crown of the Void

Uses identical behavior.

Cannot skip ahead.

Must always be earned in order.

---

# Navigation

## Player Navigation

Tabs

- Character
- Moves
- Investigation
- Inventory
- Notes

Persistent bottom navigation on mobile.

---

## Keeper Navigation

Desktop dashboard

Sections

- Campaign
- Players
- Investigation
- Timeline
- Secrets
- Settings

No page switching required during gameplay.

---

# Player Components

## Character

Displays

- Stats
- Conditions
- XP
- Crowns
- Cozy Little Place

---

## Moves

Displays

- Maven Moves
- Day Move
- Night Move
- Meddling

Future location for integrated dice roller.

---

## Investigation

Displays only public information.

- Revealed clues
- Revealed suspects
- Revealed locations

---

## Inventory

Displays Cozy Little Place inventory.

Checkboxes only.

---

## Notes

Simple markdown-style session notes.

---

# Keeper Components

## Campaign Panel

Current campaign information.

---

## Player Roster

Displays

- Conditions
- Crowns
- XP

Live status indicators.

---

## Investigation Panel

Reveal controls for

- Clues
- Suspects
- Locations

---

## Timeline

Chronological session events.

---

## Secrets

Displays

- Void clues
- Dark Conspiracy
- Keeper notes

Never visible to players.

---

# Static Data

Phase 1 uses local JSON.

Example

```

players.json
mysteries.json
moves.json
clues.json

```

No persistence.

---

# Success Criteria

Phase 1 succeeds when:

- Navigation feels intuitive
- Mobile layout works well
- Keeper dashboard supports normal gameplay
- Visual hierarchy is clear
- Test users require little explanation
