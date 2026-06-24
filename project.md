# Teaching & Learning Site - Project Documentation

This document serves as a comprehensive index of the site's architecture, pages, integrations, and the recent enhancements.

---

## 🚀 Tech Stack
* **Framework:** Next.js (App Router), React, TypeScript
* **Styling:** Tailwind CSS (Custom design tokens configured in `app/globals.css`)
* **Backend:** Firebase (Authentication, Cloud Firestore, Realtime Database)
* **Hosting:** Next.js Server Components / Client Components architecture

---

## 🔑 User Authentication & Synchronization
* **Global Auth Layer:** Managed via `AuthProvider` React Context (`lib/context/AuthContext.tsx`), exposing `user` state and handles login/logout.
* **Sleek Login Page:** Located at `/login`, containing email/password registration/login and a **Google Sign-In** option.
* **Automatic Cloud Sync:** Logged-in users have their vocabulary lists and masteries synced to Cloud Firestore (`users/{uid}/words`).
* **Offline Fallback & Migration:** Unauthenticated users save vocabulary to `localStorage`. Upon logging in, a banner prompts them to merge local words to their cloud account.

---

## 📚 Features & Pages

### 1. English Hub (`/english`)
* **Vocabulary Practice Tool (`/english/vocab-trainer`):**
  * Supports custom word banks with Firestore backup.
  * **Comfort Reading Mode:** Allows users to toggle between a deep space-dark theme and a high-contrast soft light theme. Saves theme state in `localStorage` under `teaching-site-comfort-mode`.
  * **Typographic Readability:** Large typography for English terms (`text-lg`), Hebrew translations (`text-base`), and contextual examples (`text-sm`) with soft contrast color palettes to reduce eye strain.
  * **Modes of Practice:**
    * *Manage Words:* Search, filter, add, edit, delete, and mark terms as mastered.
    * *Flashcards:* Clean flip cards with key layouts.
    * *Quiz:* Multiple-choice word exercises.
    * *Spelling:* Audio dictation matching and verification.
    * *Match Game:* Fast-paced tile correlation grid.
* **Adjectives (שמות תואר) (`/english/adjectives`):**
  * Embeds an interactive presentation about adjectives using Gamma.app. Includes responsive layouts and custom loading states.
* **Simone Biles Present Tenses (`/english/simone-biles`):**
  * Grammar practice on Present Simple and Present Progressive tailored for 7th grade, themed around Simone Biles, utilizing a Gamma.app interactive embed.

### 2. Enrichment Lessons (`/enrichment`)
* **Evolution (`/enrichment/evolution`):** High-quality science lesson interface.
* **Human History (`/enrichment/human-history`):** Historical timeline/lesson guide including specific route parameters for deep-dives (`/enrichment/human-history/[lesson]`).

### 3. Interactive Classroom Games
* **Values Auction (`/values-auction`):** Interactive group game bidding on different core values using Firebase Realtime Database.
* **English Auction (`/english-auction` & `/english-auction/game`):** Auction-based grammar and vocab group activities.
* **Shelach Workshops (`/shelach` & `/shelach/[workshop]`):** Classroom guides for Land of Israel Studies/field activities.
* **Snakes Game (`/snakes`):** Interactive learning widget/game interface.

---

## 🛠 Project Rules & Design Guidelines

As defined in the project's [AGENTS.md](file:///Users/nirozari/Projects/Teaching%20Site/AGENTS.md):
1. **Comfort Reading Mode:** Any newly added tool or page must implement a Comfort Reading Mode theme toggle (Dark Space Theme vs. Soft Light Theme) with persistent choice stored in `localStorage`.
2. **Framework Alignment:** Always build pages using the Next.js **App Router** (`app/` directory). Do not use the Pages Router (`pages/` directory).
3. **Database Security:** Cloud Firestore reads/writes must enforce token authentication checking that the logged-in user only interacts with their own records, as configured in `firestore.rules`.
