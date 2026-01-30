# Implementation Plan: Animax

> Generated on: 2026-01-30
> Estimated Tasks: 8
> Estimated Completion: 2-3 hours

---

## 📋 Pre-Implementation Checklist

- [x] Signup redirect issue fixed
- [x] Firebase Authentication working
- [x] Firestore connected
- [x] PRD inferred and documented
- [ ] This plan reviewed and approved by user

---

## 🎯 Project Overview

**Application:** Animax
**Type:** Crypto/Cyber-Aesthetic Anime Streaming Platform
**Description:** A high-end anime streaming interface with auth, watchlist, and history tracking.

---

## 👥 User Roles & Permissions

### Role: Viewer
- **Description:** Standard user
- **Can Access:** Home, Search, Watch Page, My List
- **Cannot Access:** Admin Dashboard

---

## 🗃️ Database Schema

### Collection: `users`
```javascript
{
  uid: string,
  email: string,
  name: string,
  role: 'user' | 'admin',
  watchlist: string[], // Anime IDs
  history: string[],   // Episode IDs or Anime IDs
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### Collection: `anime` (or `content`)
```javascript
{
  id: string,
  title: string,
  description: string,
  rating: number,
  genres: string[],
  // ... other metadata
}
```

---

## 🚀 Implementation Tasks

### Phase A: Foundation

#### Task A1: Enhance Auth & User Profile
- **Priority:** HIGH
- **Description:** Ensure user document in Firestore matches the `User` interface in `types.ts`.
- **Files to Modify:**
  - `src/context/AuthContext.tsx`
- **Acceptance Criteria:**
  - [ ] User doc includes `watchlist` and `history` arrays on creation
  - [ ] TypeScript interfaces match Firestore data

#### Task A2: Content Service & Seed
- **Priority:** HIGH
- **Description:** Create service to fetch anime data. Since we have `MOCK_ANIME_CATALOG` in `constants.ts`, we will implement a script to SEED this data into Firestore for the "real" app experience, or create a service that can toggle between Mock/Firestore.
- **Files to Create:**
  - `src/services/contentService.ts`
  - `src/scripts/seedContent.ts` (if needed)
- **Acceptance Criteria:**
  - [ ] `getAnimeCatalog()` returns data
  - [ ] `getAnimeById(id)` works

---

### Phase B: Core Features

#### Task B1: Home Page & Hero Section
- **Priority:** HIGH
- **Description:** Polish the Home page to display the `MOCK_ANIME_CATALOG` or Firestore data.
- **Files to Modify:**
  - `src/pages/Home.tsx` (or equivalent)
  - `src/components/Hero.tsx`
- **Acceptance Criteria:**
  - [ ] Hero carousel works
  - [ ] "Trending" and "New" rows display anime cards

#### Task B2: Watchlist Functionality
- **Priority:** MEDIUM
- **Description:** Implement Add/Remove to Watchlist.
- **Files to Create:**
  - `src/services/userService.ts`
- **Files to Modify:**
  - `src/pages/Detail.tsx` (or equivalent)
- **Acceptance Criteria:**
  - [ ] Clicking "Add to List" updates Firestore `users/{uid}/watchlist`
  - [ ] UI updates to show "Added" state

#### Task B3: Anime Detail Page
- **Priority:** MEDIUM
- **Description:** Show full details for a selected anime.
- **Files to Create:**
  - `src/pages/AnimeDetail.tsx`
- **Acceptance Criteria:**
  - [ ] Routes to `/anime/:id`
  - [ ] Shows episodes list from `watchOrder`

---

### Phase C: Polish & AI

#### Task C1: AI Recommendations (Gemini)
- **Priority:** LOW (User Confirmation Required)
- **Description:** Use Gemini API to suggest anime based on watchlist.
- **Acceptance Criteria:**
  - [ ] "AI Picks" row on Home page

---

## ⚠️ AI Features (Requires Explicit Approval)

| Feature | Description | Implementation Complexity | Approved? |
|---------|-------------|---------------------------|-----------|
| **AI Recommendations** | Suggest anime based on user preferences | Medium | ⏳ Pending |
| **AI Chat** | Chat with an "Anime Expert" bot | Medium | ⏳ Pending |

---

## ✅ Final Checklist

- [ ] All features implemented
- [ ] Watchlist persists to Firestore
- [ ] User auth flow polished
