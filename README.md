# Sasa - Premium Cross-Platform Chat App

A production-ready real-time messaging application built with **React Native** and **Supabase**.

## Features

- **Real-time Messaging** - Instant one-to-one and group chats via Supabase Realtime
- **Cyber Neon UI** - Premium glassmorphism design with glowing neon effects
- **Multi-language Support** - English, Swahili, Chinese (easily expandable)
- **Dark/Light Themes** - Manual theme switching with persistent preferences
- **Multiple Auth Methods** - Email/Password, Phone, Google Sign-In, Apple Sign-In
- **QR Code System** - Generate & scan QR codes to add contacts
- **Floating Navigation** - Glassmorphic bottom tab bar with neon indicators
- **Responsive Design** - Optimized for all iOS and Android screen sizes

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React Native 0.73 |
| State Management | Zustand |
| Backend | Supabase (PostgreSQL + Realtime) |
| Navigation | React Navigation v6 |
| UI | Custom Glassmorphism Components |
| Animations | React Native Reanimated |
| Localization | i18next |
| Icons | React Native Vector Icons |

## Prerequisites

- Node.js >= 18
- React Native CLI
- Xcode (for iOS)
- Android Studio (for Android)
- Supabase account

## Quick Start

### 1. Clone & Install

```bash
git clone <your-repo>
cd sasa
npm install
cd ios && pod install && cd ..
```

### 2. Supabase Setup

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** → **New Query**
3. Copy and paste the entire contents of `supabase/migrations/001_initial_schema.sql`
4. Click **Run**
5. Go to **Project Settings** → **API** and copy:
   - Project URL
   - `anon` public API key

### 3. Environment Configuration

```bash
cp .env.example .env
```

Edit `.env` with your Supabase credentials:

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
```

Then update `src/services/supabase/client.js`:

```javascript
const SUPABASE_URL = 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key-here';
```

### 4. Configure Authentication Providers (Optional)

**Google Sign-In:**
- Follow [react-native-google-signin setup](https://github.com/react-native-google-signin/google-signin)
- Add your web client ID to Supabase Auth settings

**Apple Sign-In:**
- Follow [@invertase/react-native-apple-authentication setup](https://github.com/invertase/react-native-apple-authentication)
- Configure in Apple Developer Console and Supabase

### 5. Run the App

```bash
# iOS
npx react-native run-ios

# Android
npx react-native run-android
```

## Project Structure

```
sasa/
├── App.js                          # App entry point
├── src/
│   ├── core/
│   │   ├── constants/              # App constants
│   │   ├── theme/
│   │   │   ├── colors.js         # Neon color palette
│   │   │   └── typography.js     # Font system
│   │   ├── store/                # Zustand stores
│   │   │   ├── authStore.js
│   │   │   ├── themeStore.js
│   │   │   ├── languageStore.js
│   │   │   └── chatStore.js
│   │   ├── navigation/
│   │   │   ├── AppNavigator.js   # Main app navigation
│   │   │   └── AuthNavigator.js  # Auth flow navigation
│   │   └── hooks/                # Shared hooks
│   ├── features/
│   │   ├── splash/               # Animated splash screen
│   │   ├── auth/
│   │   │   ├── screens/          # Login, Register, Forgot Password
│   │   │   ├── components/
│   │   │   └── hooks/useAuth.js
│   │   ├── home/                 # Home screen with ads
│   │   ├── chat/
│   │   │   ├── screens/          # Chat list, room, new chat, group
│   │   │   └── components/
│   │   ├── profile/              # User profile
│   │   ├── settings/             # App settings
│   │   └── qr/                   # QR code display & scanner
│   ├── shared/
│   │   └── components/           # Reusable UI components
│   │       ├── GlassCard.js
│   │       ├── NeonButton.js
│   │       └── NeonInput.js
│   ├── services/
│   │   └── supabase/
│   │       └── client.js         # Supabase client config
│   └── localization/
│       └── i18n.js               # Translation setup
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql # Database schema
├── android/                       # Android native config
├── ios/                          # iOS native config
└── assets/                       # Images & fonts
```

## Database Schema

### Tables

| Table | Purpose |
|-------|---------|
| `profiles` | User profiles (extends auth.users) |
| `chats` | Chat rooms (1-on-1 & groups) |
| `chat_participants` | Chat membership & admin roles |
| `messages` | Chat messages with real-time sync |
| `contacts` | User contact list |
| `presence` | Online/offline status |

### Security

- **Row Level Security (RLS)** enabled on all tables
- Users can only access chats they participate in
- Messages filtered by chat membership
- Profile updates restricted to owner

## Customization

### Adding a New Language

1. Open `src/localization/i18n.js`
2. Add a new key to the `resources` object:

```javascript
fr: {
  translation: {
    appName: 'Sasa',
    welcome: 'Bienvenue sur Sasa',
    // ... all keys
  }
}
```

3. Update `languageStore.js` to include the new language code

### Changing Colors

Edit `src/core/theme/colors.js`:

```javascript
neon: {
  lime: '#CCFF00',        // Change to your neon color
  limeGlow: 'rgba(204, 255, 0, 0.4)',
}
```

### Replacing Placeholder Assets

1. Add your logo to `assets/images/`
2. Update references in components
3. For app icons, replace files in:
   - `android/app/src/main/res/mipmap-*/`
   - `ios/Sasa/Images.xcassets/AppIcon.appiconset/`

## Building for Production

### Android

```bash
cd android
./gradlew assembleRelease
```

APK will be at: `android/app/build/outputs/apk/release/app-release.apk`

### iOS

1. Open `ios/Sasa.xcworkspace` in Xcode
2. Select your team in Signing & Capabilities
3. Product → Archive
4. Distribute App

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Metro bundler won't start | `npx react-native start --reset-cache` |
| iOS build fails | `cd ios && pod deintegrate && pod install` |
| Android build fails | `cd android && ./gradlew clean` |
| Supabase realtime not working | Check RLS policies and realtime publication |
| QR code not generating | Ensure `react-native-svg` is properly linked |

## License

MIT License - feel free to use for commercial projects.

## Support

For issues or questions, please open an issue on the repository.

---

**Built with passion for the future of messaging.**
