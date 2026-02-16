# Infora — Web App (Next.js 14)

> Next.js 14 App Router web application for **Infora** — multilingual news retrieval and government service guidance for Sri Lanka.

## Tech Stack

- **Next.js 14** with App Router
- **TypeScript**
- **Tailwind CSS**
- **Firebase SDK** for Auth, Firestore, Storage
- **Firebase Hosting** for deployment

## Getting Started

```bash
# From the repo root
npm install

# Start the dev server
npm run dev:web

# Or from this directory
npm run dev
```

## Folder Structure (planned)

```
web/
├── app/            # Route segments (App Router)
├── components/     # Reusable UI components
├── lib/            # Firebase init, helpers
├── styles/         # Tailwind config & global CSS
├── i18n/           # Language detection & strings
├── public/         # Static assets
├── next.config.js  # Next.js configuration
├── tailwind.config.js
└── package.json
```

## Environment Variables

Copy `../../.env.example` → `.env.local` (in this directory) and fill in your `NEXT_PUBLIC_*` values.

---

_This workspace is part of the [Infora mono-repo](../../README.md)._
