# Infora – Multilingual Conversational AI for News Retrieval and Government Service Guidance (Sri Lanka)

A cross‑platform conversational assistant for Sri Lankan users, delivering verified local news and step‑by‑step guidance for common government services — in Sinhala (සිංහල) and English — with a unified, pixel‑perfect UI across Mobile (Android/iOS) and Web. Built end‑to‑end on Firebase.

<p align="center">
  <a href="https://expo.dev"><img alt="Expo" src="https://img.shields.io/badge/Expo-managed workflow-000000?logo=expo&logoColor=white"></a>
  <a href="https://reactnative.dev/"><img alt="React Native" src="https://img.shields.io/badge/React%20Native-mobile-61DAFB?logo=react&logoColor=white"></a>
  <a href="https://nextjs.org/"><img alt="Next.js" src="https://img.shields.io/badge/Next.js-14-000000?logo=nextdotjs&logoColor=white"></a>
  <a href="https://tailwindcss.com/"><img alt="Tailwind CSS" src="https://img.shields.io/badge/TailwindCSS-web-06B6D4?logo=tailwindcss&logoColor=white"></a>
  <a href="https://firebase.google.com/"><img alt="Firebase" src="https://img.shields.io/badge/Firebase-backend-FFCA28?logo=firebase&logoColor=black"></a>
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-Node.js Functions-3178C6?logo=typescript&logoColor=white">
  <img alt="npm workspaces" src="https://img.shields.io/badge/npm-workspaces-CB3837?logo=npm&logoColor=white">
</p>

---

## Table of Contents

- [Overview](#overview)
- [Mono-Repo Architecture](#mono-repo-architecture)
- [Tech Stack](#tech-stack)
- [System Architecture](#system-architecture)
- [Data Model (Firestore)](#data-model-cloud-firestore)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running Locally](#running-locally)
- [Firebase Configuration](#firebase-configuration)
- [Development & Deployment](#development--deployment)
- [Contributing](#contributing)
- [Security & Privacy](#security--privacy)
- [License](#license)
- [Acknowledgements](#acknowledgements)

---

## Overview

Infora is a friendly Sri Lankan AI assistant ("Lanka Assistant") that:
- Retrieves verified Sri Lankan news with source citations and links.
- Guides users through government service processes one step at a time.
- Automatically detects Sinhala or English, replies in the user's language, and remembers conversation context.
- Runs on mobile (Android/iOS via Expo) and web (Next.js 14) with consistent UI/UX.
- Uses Firebase exclusively for backend: Authentication, Firestore, Cloud Functions (TypeScript), and Storage.

---

## Mono-Repo Architecture

This project is structured as an **npm workspaces mono-repo** for clean separation of concerns with shared dependency management.

```text
Infora-Multilingual-News-AI/
│
├── apps/
│   ├── mobile/                   # 📱 Expo React Native app (managed)
│   │   ├── app/                  #    Screens (Expo Router)
│   │   ├── components/           #    Reusable UI components
│   │   ├── hooks/                #    Custom React hooks
│   │   ├── lib/                  #    Firebase client init, helpers
│   │   ├── styles/               #    NativeWind theme config
│   │   ├── i18n/                 #    Language detection & strings
│   │   ├── package.json          #    Workspace package
│   │   └── README.md
│   │
│   └── web/                      # 🌐 Next.js 14 web app (App Router)
│       ├── app/                  #    Route segments
│       ├── components/           #    Reusable UI components
│       ├── lib/                  #    Firebase client init, helpers
│       ├── styles/               #    Tailwind config & global CSS
│       ├── i18n/                 #    Language detection & strings
│       ├── public/               #    Static assets
│       ├── package.json          #    Workspace package
│       └── README.md
│
├── functions/                    # ⚡ Firebase Cloud Functions (TypeScript)
│   ├── src/                      #    Function source code
│   ├── tsconfig.json             #    TypeScript config
│   ├── package.json              #    Workspace package
│   └── README.md
│
├── docs/                         # 📚 Documentation & assets
│   ├── screenshots/              #    UI screenshots
│   ├── demo/                     #    Demo videos / GIFs
│   ├── seeds/                    #    Sample Firestore seed data
│   └── README.md
│
├── firestore.rules               # 🔒 Firestore security rules
├── storage.rules                 # 🔒 Storage security rules
├── firestore.indexes.json        #    Firestore composite indexes
├── firebase.json                 # 🔥 Firebase project configuration
├── .firebaserc                   #    Firebase project alias
├── .env.example                  #    Sample environment variables
├── .gitignore                    #    Git ignore rules
├── package.json                  #    Root workspace config & scripts
└── README.md                     #    ← You are here
```

### Workspaces

| Workspace         | Path             | Description                                  |
|--------------------|------------------|----------------------------------------------|
| `@infora/mobile`   | `apps/mobile/`   | Expo managed-workflow React Native app       |
| `@infora/web`      | `apps/web/`      | Next.js 14 App Router web application        |
| `@infora/functions` | `functions/`    | Firebase Cloud Functions (TypeScript)        |

---

## Tech Stack

> **Strict — do not change without discussion.**

| Layer         | Technology                                         |
|---------------|----------------------------------------------------|
| **Mobile**    | React Native, Expo (managed), NativeWind, Reanimated 3 |
| **Web**       | Next.js 14 (App Router), TypeScript, Tailwind CSS  |
| **Backend**   | Firebase Auth, Cloud Firestore, Cloud Functions, Storage |
| **Language**  | TypeScript throughout                              |
| **Monorepo**  | npm workspaces                                     |

---

## System Architecture

```text
┌──────────────────────┐        ┌──────────────────────┐
│  Mobile (Expo RN)    │        │  Web (Next.js 14)    │
│  - NativeWind UI     │        │  - Tailwind UI       │
│  - Reanimated 3      │        │  - App Router        │
└─────────▲────────────┘        └─────────▲────────────┘
          │                                │
          │        Firebase SDKs (Auth, Firestore, Storage)
          │                                │
          ▼                                ▼
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

```
users (collection)
└─ userId (doc)
   ├─ name: string
   ├─ email: string
   ├─ preferredLanguage: "si" | "en"
   └─ createdAt: Timestamp

chatSessions (collection)
└─ sessionId (doc)
   ├─ userId: string
   ├─ language: "si" | "en"
   └─ messages: Message[]
       ├─ role: "user" | "assistant" | "system"
       ├─ content: string
       ├─ type: "text" | "card" | "step" | "link"
       ├─ timestamp: Timestamp
       └─ metadata: object

newsCache (collection)
└─ newsId (doc)
   ├─ title_si / title_en: string
   ├─ summary_si / summary_en: string
   ├─ source: string
   ├─ url / imageUrl: string
   ├─ publishedAt: Timestamp
   ├─ district: string
   └─ category: string

govServices (collection)
└─ serviceId (doc)
   ├─ name_si / name_en: string
   └─ steps: Step[]
```

---

## Getting Started

### Prerequisites

- **Node.js** LTS (≥18) and **npm** (≥9)
- **Firebase** account and project
- **Expo CLI**: `npm i -g expo-cli` or use `npx expo`
- Optional: **EAS CLI** for Expo builds: `npm i -g eas-cli`

### Installation

```bash
# Clone the repository
git clone https://github.com/Sasudul/Infora-Multilingual-News-AI.git
cd Infora-Multilingual-News-AI

# Install all workspace dependencies from the root
npm install
```

> npm workspaces will automatically link `apps/mobile`, `apps/web`, and `functions`.

### Environment Variables

1. Copy the sample file:
   ```bash
   cp .env.example .env
   ```
2. Create app-level env files:
   - `apps/mobile/.env` — with `EXPO_PUBLIC_*` variables
   - `apps/web/.env.local` — with `NEXT_PUBLIC_*` variables
   - `functions/.env` — with `NEWS_FEEDS`, `DEFAULT_DISTRICT`, etc.
3. Fill in your **actual Firebase project values**. Never commit real secrets.

### Running Locally

```bash
# Start the Expo mobile dev server
npm run dev:mobile

# Start the Next.js web dev server
npm run dev:web

# Build Cloud Functions
npm run build:functions

# Start Firebase emulators (all services)
npm run emulators
```

---

## Firebase Configuration

### Setup

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com).
2. Enable: **Authentication**, **Cloud Firestore**, **Cloud Functions**, **Storage**.
3. Update `.firebaserc` with your project ID.
4. Deploy rules: `npm run deploy:rules`

### Security Rules

- **Firestore** — see [`firestore.rules`](./firestore.rules)
- **Storage** — see [`storage.rules`](./storage.rules)

---

## Development & Deployment

| Command                  | Description                              |
|--------------------------|------------------------------------------|
| `npm run dev:web`        | Start Next.js dev server                 |
| `npm run dev:mobile`     | Start Expo dev server                    |
| `npm run build:web`      | Production build for web                 |
| `npm run build:functions`| Compile Cloud Functions TypeScript       |
| `npm run deploy:hosting` | Deploy web to Firebase Hosting           |
| `npm run deploy:functions`| Deploy Cloud Functions                  |
| `npm run deploy:rules`   | Deploy Firestore & Storage rules         |
| `npm run deploy:all`     | Deploy everything                        |
| `npm run emulators`      | Start Firebase Emulator Suite            |
| `npm run lint`           | Lint all workspaces                      |
| `npm run clean`          | Clean build artifacts in all workspaces  |

---

## Contributing

We welcome contributions! Please follow these steps:

### 1. Fork & Clone

```bash
git clone https://github.com/<your-username>/Infora-Multilingual-News-AI.git
cd Infora-Multilingual-News-AI
npm install
```

### 2. Create a Feature Branch

```bash
git checkout -b feature/your-feature-name
```

### 3. Development Guidelines

- **Code style**: TypeScript strict mode; follow existing patterns.
- **Commits**: Use [Conventional Commits](https://www.conventionalcommits.org/) (e.g., `feat:`, `fix:`, `docs:`).
- **Testing**: Add/update tests for any functional changes.
- **Workspace scope**: Make changes in the appropriate workspace (`apps/mobile`, `apps/web`, or `functions`).
- **No secrets**: Never commit API keys, tokens, or credentials.

### 4. Submit a Pull Request

- Ensure `npm run lint` passes.
- Provide a clear description of your changes.
- Reference any related issues.

### Branch Naming Convention

| Prefix       | Use Case                  |
|-------------|---------------------------|
| `feature/`  | New features              |
| `fix/`      | Bug fixes                 |
| `docs/`     | Documentation changes     |
| `refactor/` | Code refactoring          |
| `chore/`    | Build/tooling changes     |

---

## Security & Privacy

- Authentication enforced on user‑specific documents.
- Public read access for `newsCache` and `govServices`; writes controlled via Cloud Functions only.
- No hallucinated news: Fetch only from trusted sources; store with citations.
- Minimal PII storage: name, email, preferredLanguage, createdAt.
- Comply with local regulations; show disclaimers on guidance.

---

## License

MIT License — see [LICENSE](./LICENSE) for details.

---

## Acknowledgements

- **Sri Lankan news sources**: Ada Derana, Daily Mirror, News 1st
- **Technologies**: Firebase, Expo, React Native, Next.js, Tailwind CSS, NativeWind, Reanimated
- **Community**: Sri Lankan developer community 🇱🇰

---

## Demo & Screenshots

| Screen       | Path                          |
|-------------|-------------------------------|
| Home         | `docs/screenshots/home.png`   |
| News Results | `docs/screenshots/news.png`   |
| Gov Services | `docs/screenshots/services.png`|

Demo video: _Coming soon_

---

<p align="center">
  <em>"This is guidance only. Always check official government websites."</em>
</p>