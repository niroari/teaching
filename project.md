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
* **Unseen Text Practice (`/english/unseen-practice`):**
  * Implements an interactive strategy training game that teaches students how to solve reading comprehensions without reading the entire text first. Features a mix of question formats (Multiple Choice, Sentence Copying, and Open Text Answer) with custom check inputs.
  * Includes three difficulty levels: Easy, Medium, and Hard.
  * Dynamically blurs out non-target paragraphs to enforce focus.
  * **Gemini AI Dynamic Generation:** Integrates with a Next.js server API endpoint calling Gemini (`gemini-2.5-flash`) to generate custom, on-demand readings, multiple-choice, open-answer, and sentence-copying questions, along with Hebrew explanations.
  * Built-in Comfort Reading Mode switch persisting choices.
* **Adjectives (שמות תואר) (`/english/adjectives`):**
  * Embeds an interactive presentation about adjectives using Gamma.app. Includes responsive layouts and custom loading states.
* **Simone Biles Present Tenses (`/english/simone-biles`):**
  * Grammar practice on Present Simple and Present Progressive tailored for 7th grade, themed around Simone Biles, utilizing a Gamma.app interactive embed.

### 2. Enrichment Lessons (`/enrichment`)
* **Evolution (`/enrichment/evolution`):** High-quality science lesson interface.
* **Human History (`/enrichment/human-history`):** Historical timeline/lesson guide including specific route parameters for deep-dives (`/enrichment/human-history/[lesson]`).

### 3. Earth Sciences & Space (`/earth-sciences`)
* **Main Dashboard (`/earth-sciences`):**
  * Lists curriculum units: Unit 1 (Astronomy - Active), Unit 2 (Weather & Climate - Under Dev), Unit 3 (Geosphere - Under Dev), and Unit 4 (Natural Resources - Under Dev).
  * Features text search across lessons, objectives, and misconceptions, annual progress tracking, tab filters, and Comfort Reading Mode toggle.
  * In-progress units display a `"בתהליך פיתוח 🛠️"` badge and disable completion toggles.
* **Interactive Slide Presentation & Lesson Viewer (`/earth-sciences/[unit]/[lesson]`):**
  * Intercepts Units 2, 3, and 4 paths to display a glassmorphic "Under Construction" placeholder page.
  * For Unit 1 lessons, displays three tabs:
    1. *Classroom Presentation:* Features keyboard navigation, Cinema Mode (full screen), auto-fit media scaling (`object-contain`), local looping GIFs, YouTube video players, and a floating **Notebook Concepts (מושגי מחברת)** panel listing definitions.
    2. *Interactive Widget:* Renders simulators or the 10-question Earth Explorer Trivia Quiz covering all units.
    3. *Teacher Guide:* Direct teacher guidelines, time constraints, objectives, and misconceptions.
* **Completed & Refined Lessons:**
  * *Lesson 0: Intro to Earth Science (`intro-overview`):* Hook slide with paragraph-separated questions, looping local James Webb deep field GIF, and customized welcome title.
  * *Lesson 1: The 4 Spheres & Interactions (`intro-spheres`):* Features 8 detailed slides covering individual spheres with engaging student-facing trivia (such as the "mycelium internet" and "meteor shield"), detailed interaction definitions, and a White Island volcano image.
  * *Lesson 2: Universe & Solar System (`universe-solar-system`):* Slide 2 features a YouTube video about universe scale, Slide 3 holds a looping solar system orbit GIF, Slide 4 shows a planets comparison image, and Slide 5 shows a local gravity concept illustration.
  * *Lesson 3: Earth & Moon Movements (`earth-moon-movements`):* Embeds local earth rotation, season orbit, and moon orbit GIFs. Slide 5 features a physical "Human Planetarium" classroom roleplay demonstration task.

### 4. Interactive Classroom Games
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
