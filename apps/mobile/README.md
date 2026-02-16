# Infora — Mobile App (Expo / React Native)

> Expo managed-workflow mobile application for **Infora** — multilingual news retrieval and government service guidance for Sri Lanka.

## Tech Stack

- **React Native** with **Expo** managed workflow
- **NativeWind** (Tailwind CSS for React Native)
- **Reanimated 3** for animations
- **Firebase SDK** for Auth, Firestore, Storage

## Getting Started

```bash
# From the repo root
npm install

# Start the Expo dev server
npm run dev:mobile

# Or from this directory
npx expo start
```

## Folder Structure (planned)

```
mobile/
├── app/            # Screens (Expo Router)
├── components/     # Reusable UI components
├── hooks/          # Custom React hooks
├── lib/            # Firebase init, helpers
├── styles/         # NativeWind theme config
├── i18n/           # Language detection & strings
├── app.json        # Expo configuration
└── package.json
```

## Environment Variables

Copy `../../.env.example` → `.env` (in this directory) and fill in your `EXPO_PUBLIC_*` values.

---

_This workspace is part of the [Infora mono-repo](../../README.md)._
