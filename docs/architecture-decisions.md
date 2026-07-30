# Architecture Decision Records (ADR)

## 1. Use Google Sheets for MVP Backend
**Status:** Accepted
**Date:** July 29, 2026

**Decision:** Use Google Sheets as the initial data storage with Google Apps Script as API.

**Why:**
- Free and familiar to users
- No server setup required
- Easy for non-developers to understand
- Sufficient for small group (4-6 players)

**Alternatives Considered:**
- Firebase
- Supabase
- SQLite

**Tradeoffs:**
- Limited scalability
- Execution quotas
- Slower than dedicated database

**Future Implications:**
- Can migrate to Firebase/Supabase later without frontend changes
- Apps Script layer isolates frontend from storage

---

## 2. Optimistic UI
**Status:** Accepted
**Date:** July 29, 2026

**Decision:** UI updates instantly, syncs with backend in background.

**Why:**
- Better user experience
- Hides network latency
- Works offline temporarily

**Alternatives Considered:**
- Real-time sync with WebSockets
- Manual refresh

**Tradeoffs:**
- More complex error handling
- Need conflict resolution

**Future Implications:**
- Requires local state management
- Need retry logic for failed syncs

---

## 3. Campaign Code Instead of Accounts
**Status:** Accepted
**Date:** July 29, 2026

**Decision:** Use simple campaign passcode instead of user accounts.

**Why:**
- Simpler for hobby use
- No account management
- Faster to set up

**Alternatives Considered:**
- Full user accounts
- OAuth integration

**Tradeoffs:**
- Less secure
- No persistent user data

**Future Implications:**
- Passcode resets after each session
- Players join with campaign code