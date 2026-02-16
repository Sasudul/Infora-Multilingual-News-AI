# Infora – Multilingual Conversational AI for News Retrieval and Government Service Guidance (Sri Lanka)

A cross‑platform conversational assistant for Sri Lankan users, delivering verified local news and step‑by‑step guidance for common government services — in Sinhala (සිංහල) and English — with a unified, pixel‑perfect UI across Mobile (Android/iOS) and Web. Built end‑to‑end on Firebase.

<p align="center">
  <a href="https://expo.dev"><img alt="Expo" src="https://img.shields.io/badge/Expo-managed workflow-000000?logo=expo&logoColor=white"></a>
  <a href="https://reactnative.dev/"><img alt="React Native" src="https://img.shields.io/badge/React%20Native-mobile-61DAFB?logo=react&logoColor=white"></a>
  <a href="https://nextjs.org/"><img alt="Next.js" src="https://img.shields.io/badge/Next.js-14-000000?logo=nextdotjs&logoColor=white"></a>
  <a href="https://tailwindcss.com/"><img alt="Tailwind CSS" src="https://img.shields.io/badge/TailwindCSS-web-06B6D4?logo=tailwindcss&logoColor=white"></a>
  <a href="https://firebase.google.com/"><img alt="Firebase" src="https://img.shields.io/badge/Firebase-backend-FFCA28?logo=firebase&logoColor=black"></a>
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-Node.js Functions-3178C6?logo=typescript&logoColor=white">
</p>

---

## Table of Contents

- Overview
- Core Features
- Tech Stack
- System Architecture
- Data Model (Firestore)
- Assistant Behavior: Language & Interaction
- Functional Flows
  - News Retrieval
  - Government Services Guidance
- UI/UX Principles
- Project Structure (suggested)
- Getting Started
  - Prerequisites
  - Firebase Setup
  - Firestore Rules
  - Environment Variables
  - Mobile App (Expo/React Native)
  - Web App (Next.js 14)
  - Cloud Functions
  - Seeding Data
- Development & Deployment
- Security & Privacy
- Limitations & Future Work
- Contributing
- License
- Acknowledgements

---

## Overview

Infora is a friendly Sri Lankan AI assistant (“Lanka Assistant”) that:
- Retrieves verified Sri Lankan news with source citations and links.
- Guides users through government service processes one step at a time.
- Automatically detects Sinhala or English, replies in the user’s language, and remembers conversation context.
- Runs on mobile (Android/iOS via Expo) and web (Next.js 14) with consistent UI/UX.
- Uses Firebase exclusively for backend: Authentication, Firestore, Cloud Functions (TypeScript), and Storage.

---

## Core Features

- Multilingual Conversations: Sinhala (සිංහල) and English with automatic detection.
- News: District, time, and topic extraction; returns 3–5 curated cards with source citations and links. No hallucinations.
- Government Services: Step‑by‑step guidance for Passport, e‑Sevai, Birth Certificate, NIC — with documents to bring, common mistakes, and a final disclaimer.
- Context Awareness: Remembers chat session context across steps.
- Unified UX: Matching look and feel across mobile and web using Tailwind/NativeWind.
- Firebase‑Only Backend: Simple infra, low latency for Sri Lankan users.

---

## Tech Stack (STRICT – DO NOT CHANGE)

Mobile App
- React Native
- Expo (managed workflow)
- NativeWind (Tailwind for RN)
- Reanimated 3 (animations)

Web App
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Firebase Hosting

Backend (Firebase ONLY)
- Firebase Authentication
- Cloud Firestore
- Firebase Cloud Functions (Node.js / TypeScript)
- Firebase Storage

---

## System Architecture

```text
┌──────────────────────┐        ┌──────────────────────┐
│  Mobile (Expo RN)    │        │  Web (Next.js 14)    │
│  - NativeWind UI     │        │  - Tailwind UI       │
│  - Reanimated 3      │        │  - App Router        │
└─────────▲────────────┘        └─────────▲────────────┘
          │                                 │
          │        Firebase SDKs (Auth, Firestore, Storage)
          │                                 │
          ▼                                 ▼
     ┌───────────────────────────────────────────────────┐
     │                  Firebase Backend                  │
     │  - Authentication                                  │
     │  - Cloud Firestore (users, chatSessions, newsCache,│
     │    govServices)                                    │
     │  - Cloud Functions (TypeScript)                    │
     │     • News ingestion/cache updates                 │
     │     • NLP intent/district/time parsing             │
     │     • Conversational orchestration                 │
     │  - Storage (images, assets)                        │
     └───────────────────────────────────────────────────┘
```

---

## Data Model (Cloud Firestore)

Collections and fields:

```json
users (collection)
└─ userId (doc)
   ├─ name: string
   ├─ email: string
   ├─ preferredLanguage: "si" | "en"
   ├─ createdAt: Timestamp

chatSessions (collection)
└─ sessionId (doc)
   ├─ userId: string
   ├─ language: "si" | "en"
   ├─ messages: Message[]
       ├─ role: "user" | "assistant" | "system"
       ├─ content: string
       ├─ type: "text" | "card" | "step" | "link"
       ├─ timestamp: Timestamp
       ├─ metadata: object

newsCache (collection)
└─ newsId (doc)
   ├─ title_si: string
   ├─ title_en: string
   ├─ summary_si: string
   ├─ summary_en: string
   ├─ source: "Ada Derana" | "Daily Mirror" | "News 1st" | string
   ├─ url: string
   ├─ imageUrl: string
   ├─ publishedAt: Timestamp
   ├─ district: string
   ├─ category: string

govServices (collection)
└─ serviceId (doc)
   ├─ name_si: string
   ├─ name_en: string
   ├─ steps: Step[]
```

---

## Assistant Behavior: Language & Interaction

- Persona: “Lanka Assistant” — friendly, helpful, Sri Lankan tone.
- Language Rules:
  - Auto‑detect user language.
  - Respond in Sinhala or English; Sinhala should be simple and rural‑friendly.
  - Maintain session context across steps.
- Capabilities:
  - News Retrieval:
    - Understand queries like:
      - “අද කොළඹ අනතුරු”
      - “Accidents in Kalutara today”
    - Extract intent=news, district, time, topic.
    - Fetch from `newsCache`, return 3–5 cards, cite source, provide link.
    - End: “Sources from Ada Derana, Daily Mirror, etc.”
    - Never hallucinate news.
  - Government Services:
    - Supported: Passport, e‑Sevai, Birth Certificate, NIC.
    - Behavior: One step at a time. Ask: “Next step?” Include required documents + common mistakes.
    - Disclaimer: “This is guidance only. Always check official government websites.”

---

## Functional Flows

### News Retrieval Flow

1. Parse user query → intent=news, district, time, topic.
2. Query `newsCache` with filters (district + recency + category/topic).
3. Return 3–5 cards with:
   - Title (localized), summary (localized), image (optional), source, link, publishedAt, district.
4. Footer:
   - “Sources from Ada Derana, Daily Mirror, etc.”
5. No results:
   - Apologize, offer broader query or recent top stories.

Example Queries:
- Sinhala: “අද ගාල්ලේ තත්වය” / “කළුතරේ විපත්ති අද”
- English: “Colombo traffic updates today” / “Accidents in Kalutara this morning”

### Government Services Guidance Flow

1. Detect service (Passport / e‑Sevai / Birth certificate / NIC).
2. Start step‑by‑step guidance:
   - One step per message.
   - Include documents needed, fees, locations, common mistakes.
   - Ask: “Next step?”
3. End:
   - “This is guidance only. Always check official government websites.”
4. Allow branching:
   - e.g., Passport: new vs renewal; NIC: first issue vs lost card.

---

## UI/UX Principles

- Pixel‑perfect and consistent across mobile and web.
- Use Tailwind (web) and NativeWind (mobile) design tokens.
- Clear card layout for news; simple step list for services.
- Sinhala content uses simple, accessible phrasing.
- Animations via Reanimated 3 for subtle interactions (mobile).

Suggested assets:
- Screenshots: `docs/screenshots/{home,news,service}.png`
- Demo: `docs/demo/demo.mp4` or an online link.

---

## Project Structure (suggested)

```text
Infora-Multilingual-News-AI/
├─ apps/
│  ├─ mobile/                  # Expo React Native app
│  │  ├─ app/                  # Screens (Expo Router or Stack)
│  │  ├─ components/
│  │  ├─ hooks/
│  │  ├─ lib/                  # Firebase client init, helpers
│  │  ├─ styles/               # NativeWind theme
│  │  ├─ i18n/                 # Language detection & strings
│  │  ├─ package.json
│  │  └─ app.json / eas.json
│  └─ web/                     # Next.js 14 (App Router)
│     ├─ app/                  # Route segments
│     ├─ components/
│     ├─ lib/                  # Firebase client init, helpers
│     ├─ styles/               # Tailwind config & CSS
│     ├─ i18n/
│     ├─ package.json
│     └─ next.config.js / tailwind.config.js
├─ functions/                  # Firebase Cloud Functions (TypeScript)
│  ├─ src/
│  │  ├─ index.ts              # Function entry
│  │  ├─ news/                 # Ingestion, caching, NLP parsing
│  │  ├─ chat/                 # Conversation orchestration
│  │  ├─ services/             # Gov service steps handlers
│  ├─ package.json
│  └─ tsconfig.json
├─ firestore.rules             # Security rules
├─ storage.rules               # Optional storage rules
├─ firebase.json               # Firebase config
├─ .firebaserc                 # Project alias
├─ docs/
│  ├─ screenshots/
│  └─ demo/
└─ README.md
```

---

## Getting Started

### Prerequisites

- Node.js LTS (>=18) and npm or yarn
- Expo CLI (`npm i -g expo-cli`) or use `npx expo`
- Firebase account + project
- Optional: EAS CLI for Expo builds (`npm i -g eas-cli`)

### Firebase Setup

1. Create a Firebase project (console).
2. Enable:
   - Authentication (Email/Password or OAuth providers as needed)
   - Cloud Firestore (Production mode)
   - Cloud Functions
   - Storage
3. Create Web app credentials for web and mobile (you can reuse in both or create separate).
4. Note down config: apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId.

### Firestore Rules (baseline)

```firebase name=firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isSignedIn() {
      return request.auth != null;
    }

    match /users/{userId} {
      allow read, write: if isSignedIn() && request.auth.uid == userId;
    }

    match /chatSessions/{sessionId} {
      allow read, write: if isSignedIn();
    }

    match /newsCache/{newsId} {
      allow read: if true;        // Publicly readable news
      allow write: if false;      // Writes only via Cloud Functions
    }

    match /govServices/{serviceId} {
      allow read: if true;        // Publicly readable guidance
      allow write: if false;      // Managed via admin/Functions
    }
  }
}
```

### Environment Variables

Create `.env` files for mobile and web.

Mobile (Expo):
```env name=apps/mobile/.env
EXPO_PUBLIC_FIREBASE_API_KEY=xxxxx
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=xxxxx.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=xxxxx
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=xxxxx.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=xxxxx
EXPO_PUBLIC_FIREBASE_APP_ID=xxxxx
EXPO_PUBLIC_DEFAULT_LANGUAGE=si
```

Web (Next.js 14):
```env name=apps/web/.env.local
NEXT_PUBLIC_FIREBASE_API_KEY=xxxxx
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=xxxxx.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=xxxxx
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=xxxxx.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=xxxxx
NEXT_PUBLIC_FIREBASE_APP_ID=xxxxx
NEXT_PUBLIC_DEFAULT_LANGUAGE=si
```

Functions:
```env name=functions/.env
NEWS_FEEDS="https://www.adaderana.lk/rss.php,https://www.dailymirror.lk/rss"
DEFAULT_DISTRICT="Colombo"
ALLOW_NEWS_SOURCES="Ada Derana,Daily Mirror,News 1st"
```

### Mobile App (Expo/React Native)

1. Install dependencies:
   ```bash
   cd apps/mobile
   npm install
   ```
2. Configure NativeWind:
   - `tailwind.config.js` with RN presets and your design tokens.
3. Firebase client init (`lib/firebase.ts`):
   - Use `EXPO_PUBLIC_*` env vars.
4. Run:
   ```bash
   npx expo start
   ```
5. Test on Android Emulator/iOS Simulator or physical devices.

### Web App (Next.js 14)

1. Install dependencies:
   ```bash
   cd apps/web
   npm install
   ```
2. Configure Tailwind:
   - `tailwind.config.js` and `globals.css`.
3. Firebase client init in `lib/firebase.ts` using `NEXT_PUBLIC_*` env vars.
4. Run:
   ```bash
   npm run dev
   ```
5. Access: `http://localhost:3000`.

### Cloud Functions (TypeScript)

1. Install:
   ```bash
   cd functions
   npm install
   ```
2. Typical functions:
   - `news:ingestAndCache` — periodically fetch & parse trusted feeds → Firestore `newsCache`.
   - `chat:parseQuery` — NLP for intent, district, time, topic (rule‑based + simple models).
   - `services:getStep` — returns next step for selected government service (from `govServices`).
3. Deploy:
   ```bash
   firebase deploy --only functions
   ```

---

## Seeding Data

- `govServices`:
  - Seed documents for: Passport, e‑Sevai, Birth Certificate, NIC.
  - Each doc includes `name_si`, `name_en`, and ordered `steps[]`.
- `newsCache`:
  - Populated via Cloud Functions ingestion. Optionally seed sample docs for local testing.

Example Seed (Passport):
```json name=docs/seeds/govServices/passport.json
{
  "name_si": "පශ්චාත්පත්‍රය",
  "name_en": "Passport",
  "steps": [
    {
      "order": 1,
      "title_si": "ඇපල්‍රිකේශන් පෝරමය ලබාගන්න",
      "title_en": "Obtain the application form",
      "documents_si": ["NIC", "උපන් සහතිකය", "පැහැදිලි ඡායාරූප 2x2"],
      "documents_en": ["NIC", "Birth Certificate", "Clear 2x2 photos"],
      "notes_si": ["පෝරමය සරිලෙස පුරවන්න"],
      "notes_en": ["Fill the form correctly"]
    }
  ]
}
```

---

## Development & Deployment

### Local Development

- Mobile: `npx expo start`
- Web: `npm run dev` (Next.js 14)
- Functions: `npm run build && firebase emulators:start` (optional)

### Linting & Formatting

- TypeScript strict mode recommended.
- ESLint + Prettier configurations per app.

### Deployment

- Web → Firebase Hosting:
  ```bash
  cd apps/web
  npm run build
  firebase deploy --only hosting
  ```
- Mobile → Expo:
  - Development builds or EAS:
    ```bash
    cd apps/mobile
    eas build -p android
    eas build -p ios
    ```

---

## Security & Privacy

- Authentication enforced on user‑specific documents.
- Public read access for `newsCache` and `govServices`; writes controlled via Functions.
- No hallucinated news: Fetch only from trusted sources; store with citations.
- Minimal PII storage: Name, email, preferredLanguage, createdAt.
- Comply with local regulations; show disclaimers on guidance.

---

## Limitations & Future Work

- News coverage depends on source availability and feed freshness.
- NLP is rule‑based; future: improve Sinhala/English entity extraction.
- Add more government services (e.g., Vehicle Registration, Land Registry).
- Add offline caching and push notifications.

---

## License

MIT License (you may update this to your preferred license).

---

## Acknowledgements

- Sri Lankan news sources: Ada Derana, Daily Mirror, News 1st.
- Firebase, Expo, React Native, Next.js, Tailwind, NativeWind, Reanimated.

---

## Demo & Screenshots

- Demo video: Add link here (YouTube/Drive).
- Screenshots:
  - `docs/screenshots/home.png`
  - `docs/screenshots/news.png`
  - `docs/screenshots/services.png`

---

## Sinhala Example Interaction

User: “අද කොළඹ අනතුරු”

Assistant:
- Returns 3–5 news cards (Sinhala), each with title, summary, source, link.
- Ends with: “Sources from Ada Derana, Daily Mirror, etc.”

---

## English Example Interaction

User: “Accidents in Kalutara today”

Assistant:
- Returns curated news cards (English) with sources and links.
- Ends with: “Sources from Ada Derana, Daily Mirror, etc.”

---

“This is guidance only. Always check official government websites.”