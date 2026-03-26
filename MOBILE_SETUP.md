# 🚀 Infora Mobile App - Complete Setup Guide

## ✅ What's Been Fixed

1. **Firebase Integration** ✓
   - Updated to use `EXPO_PUBLIC_*` env vars (Expo standard)
   - Added AsyncStorage for persistent authentication
   - Proper Firebase initialization with multi-app prevention

2. **Backend API Integration** ✓
   - Created `lib/api.ts` with backend connection
   - News, Chat, Services, and User APIs
   - Automatic auth token injection
   - Error handling included

3. **App Structure** ✓
   - All screens have proper exports
   - Tab navigation fully configured
   - Proper styling and spacing system
   - New Architecture enabled

4. **Missing Dependencies** ✓
   - Updated `package.json` with AsyncStorage
   - Created all required utility files
   - Styles and spacing constants ready

---

## 📋 Setup Steps

### Step 1: Install Dependencies
```bash
cd apps/mobile
npm install
```

### Step 2: Configure Firebase

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Go to **Project Settings → General**
4. Copy your Web API credentials
5. Update `apps/mobile/.env`:

```bash
EXPO_PUBLIC_FIREBASE_API_KEY=YOUR_API_KEY
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=YOUR_PROJECT.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=YOUR_PROJECT.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=YOUR_SENDER_ID
EXPO_PUBLIC_FIREBASE_APP_ID=YOUR_APP_ID
```

### Step 3: Start Backend
```bash
cd backend
./mvnw.cmd spring-boot:run
```
Backend runs at: `http://localhost:8080/api/v1`

### Step 4: Start Mobile App
```bash
cd apps/mobile

# For Android Emulator
npx expo start --android

# For iOS Simulator
npx expo start --ios

# For Web
npx expo start --web
```

---

## 🔧 Architecture Overview

```
Mobile App
  ├── lib/firebase.ts         → Firebase initialization with AsyncStorage
  ├── lib/api.ts             → Backend API client with auth tokens
  ├── app/
  │   ├── (tabs)/
  │   │   ├── index.tsx      → Home screen with trending news
  │   │   ├── news.tsx       → News feed with search & categories
  │   │   ├── chat.tsx       → AI chat interface
  │   │   ├── services.tsx   → Government services guide
  │   │   ├── profile.tsx    → User profile & settings
  │   │   └── login.tsx      → Authentication
  │   ├── services/api.ts    → Helper functions for screens
  │   └── _layout.tsx        → Root navigation
  ├── styles/
  │   ├── colors.ts          → Theme constants
  │   └── spacing.ts         → Layout spacing
  ├── i18n/                  → Multilingual support
  └── assets/
```

---

## 🔌 API Integration

All API calls are automatically authenticated using Firebase tokens:

### News API
```typescript
import { newsApi } from '../lib/api';

const latestNews = await newsApi.getLatest(20);
const category = await newsApi.getByCategory('politics', 10);
const results = await newsApi.search('query');
```

### Chat API
```typescript
const response = await chatApi.sendMessage(message, sessionId, language);
```

### Services API
```typescript
const services = await servicesApi.getAll();
const service = await servicesApi.getById('passport');
```

### User API
```typescript
const user = await userApi.get(userId);
await userApi.updateLanguage(userId, 'si');
```

---

## 🌐 Multilingual Support

The app supports three languages:
- **English** (en)
- **Sinhala** (si)
- **Tamil** (ta)

Switch languages from the Profile tab.

---

## ✨ Features

✅ Real-time news feed with categories & search
✅ AI chat in your language (Sri Lankan focused)
✅ Government services step-by-step guides
✅ User profiles with language preferences
✅ Firebase authentication
✅ Persistent login with AsyncStorage
✅ Dark theme optimized for Sri Lanka
✅ Tab-based navigation

---

## 🐛 Troubleshooting

### Firebase init errors
→ Ensure all `EXPO_PUBLIC_*` env vars are set in `.env`

### Backend connection fails
→ Verify backend is running on `http://localhost:8080`
→ On Android emulator, app uses `10.0.2.2:8080` automatically

### AsyncStorage errors
→ Run `npm install @react-native-async-storage/async-storage`

### Module not found errors
→ Run `npm install` again and restart dev server

---

## 📱 Device-Specific Setup

### Android Emulator (Default)
- Uses `10.0.2.2` to access host localhost
- Backend should run on `http://localhost:8080`

### Physical Android Device
- Update `lib/api.ts` API_BASE to your machine's IP:
  ```typescript
  const API_BASE = 'http://192.168.x.x:8080/api/v1';
  ```

### iOS Simulator
- Automatically uses `localhost` like web
- Backend should run on `http://localhost:8080`

---

## 🎯 Next Steps

1. **Set Firebase credentials** in `.env`
2. **Run backend** with `./mvnw.cmd spring-boot:run`
3. **Start mobile app** with `npx expo start --android`
4. **Test features** in the running emulator

The mobile app is now fully integrated with the backend, just like the web version! 🚀
