# Phase 2 Architecture Specification
## Google Sheets Backend

## Purpose

Replace static JSON with a lightweight backend using Google Sheets and Google Apps Script.

Frontend architecture should remain unchanged.

---

# Overall Architecture

```
Frontend

↓

State Manager

↓

API Client

↓

Google Apps Script

↓

Google Sheets
```

Apps Script functions only as an API layer.

Business logic remains in the frontend.

---

# Google Sheets Structure

## Players

| Field | Description |
|--------|-------------|
| Player ID | Unique identifier |
| Name | Display name |
| Active Maven | Current character |

---

## Mavens

| Field | Description |
|--------|-------------|
| Maven ID | Unique ID |
| Campaign ID | Parent campaign |
| Player ID | Owner |
| Name | Character |
| Stats | Serialized object |
| Conditions | Array |
| Crowns | Array |
| XP | Integer |

---

## Campaigns

Campaign metadata.

---

## Mysteries

Contains

- Complexity
- Status
- Current mystery

---

## Clues

Contains

- Description
- Revealed flag
- Void flag

---

## Suspects

Contains

- Description
- Revealed flag

---

## Locations

Contains

- Description
- Revealed flag

---

## Session Events

Append-only log.

Every action becomes an event.

---

# API Endpoints

## GET /campaign

Returns current campaign.

---

## GET /player/{id}

Returns player state.

---

## GET /maven/{id}

Returns character sheet.

---

## GET /investigation

Returns only public clues.

---

## GET /keeper

Returns full campaign state.

Keeper authentication required.

---

## POST /player/update

Updates

- Conditions
- XP
- Inventory
- Notes

Supports batched updates.

---

## POST /keeper/update

Updates

- Revealed clues
- Revealed suspects
- Timeline
- Secrets

Requires Keeper authentication.

---

# Authentication

## Players

Workflow

Campaign Code

↓

Select Maven

↓

Play

No accounts required.

---

## Keeper

Workflow

Campaign

↓

Keeper PIN

↓

Keeper Dashboard

Authentication token stored only for session.

---

# Data Filtering Rules

Player API may return

- Character
- Public clues
- Public suspects
- Public locations

Never return

- Void clues
- Hidden clues
- Keeper notes
- Dark Conspiracy

Filtering occurs server-side.

Never rely on frontend hiding.

---

# Synchronization

Uses optimistic UI.

Workflow

User Action

↓

Immediate UI update

↓

Background API request

↓

Retry on failure

---

# Performance Strategy

Batch updates whenever practical.

Cache static reference data.

Only request changing game state from API.

---

# Future Migration

Google Sheets is the initial persistence layer.

Future backends

- Firebase
- Supabase
- PostgreSQL

Frontend should require minimal changes.