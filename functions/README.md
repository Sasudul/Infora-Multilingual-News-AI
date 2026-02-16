# Infora — Firebase Cloud Functions

> Firebase Cloud Functions (TypeScript) for **Infora** — news ingestion, NLP intent parsing, and conversational orchestration.

## Tech Stack

- **Node.js 18+** runtime
- **TypeScript** (strict mode)
- **Firebase Admin SDK**
- **Cloud Firestore** triggers and callable functions

## Getting Started

```bash
# From the repo root
npm install

# Build TypeScript
npm run build:functions

# Start emulators locally
npm run emulators
```

## Folder Structure (planned)

```
functions/
├── src/
│   ├── index.ts          # Function entry point (exports)
│   ├── news/             # News ingestion, caching, NLP parsing
│   ├── chat/             # Conversation orchestration
│   └── services/         # Government service step handlers
├── lib/                  # Compiled JS output (git-ignored)
├── tsconfig.json
└── package.json
```

## Key Functions (planned)

| Function               | Description                                      |
|------------------------|--------------------------------------------------|
| `news:ingestAndCache`  | Periodic fetch & parse trusted RSS → `newsCache` |
| `chat:parseQuery`      | NLP for intent, district, time, topic extraction  |
| `services:getStep`     | Returns next step for a government service        |

## Environment Variables

See `../../.env.example` for the `NEWS_FEEDS`, `DEFAULT_DISTRICT`, and `ALLOW_NEWS_SOURCES` variables.

---

_This workspace is part of the [Infora mono-repo](../../README.md)._
