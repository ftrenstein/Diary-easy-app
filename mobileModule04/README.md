# Diary Easy App 📔

A mobile diary application with mood tracking and cloud synchronization.

## ✨ Features

- 📝 Create notes with mood indicators
- 😊 Track emotional state (5 mood types)
- 📊 Mood statistics in percentages
- 📅 Calendar view of notes
- 🔐 Authentication via Google and GitHub
- ☁️ Cloud sync with Firebase Firestore
- 🎨 Modern UI/UX design

## 🛠 Technologies

- **React Native** - cross-platform development
- **Expo** (~53.0.24) - framework and tools
- **TypeScript** - type safety
- **Firebase** (v12.6.0) - authentication and database
- **Expo Router** - navigation
- **React Native Google Sign-In** - Google authentication
- **Expo Auth Session** - GitHub authentication

## 📋 Requirements

- Node.js 18+
- npm or yarn
- Expo CLI
- EAS CLI (for builds)
- Firebase account
- Expo account

## 🚀 Installation

1. **Clone the repository:**

```bash
cd mobileModule04
```

2. **Install dependencies:**

```bash
npm install
```

3. **Create `.env` file:**

```env
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=your_google_web_client_id
EXPO_PUBLIC_GITHUB_CLIENT_ID=your_github_client_id
EXPO_PUBLIC_GITHUB_CLIENT_SECRET=your_github_client_secret
```

4. **Configure Firebase:**

   - Create a project in [Firebase Console](https://console.firebase.google.com)
   - Add Android/iOS application
   - Download `google-services.json` (Android) or `GoogleService-Info.plist` (iOS)
   - Place the file in the project root
   - Update configuration in `firebase.js`

5. **Configure Google Sign-In:**

   - Create OAuth Client ID in [Google Cloud Console](https://console.cloud.google.com)
   - Add SHA-1 certificate for Android
   - Copy Web Client ID to `.env`

6. **Configure GitHub OAuth:**
   - Create OAuth App in [GitHub Settings](https://github.com/settings/developers)
   - Add Callback URL: `exp://redirect`
   - Copy Client ID and Client Secret to `.env`

## 💻 Running

### Development (with Expo Go)

```bash
npm start
```

### Development (with custom build)

```bash
eas build --platform android --profile development
```

### Production build

```bash
eas build --platform android --profile production
```

### Web version

```bash
npm run web
```

## 📱 Project Structure

```
mobileModule04/
├── app/                    # Application screens
│   ├── (tabs)/            # Tab navigation
│   │   ├── index.tsx      # Main screen
│   │   ├── calendar.tsx   # Calendar
│   │   └── add.tsx        # Add note
│   ├── modals/            # Modal windows
│   │   ├── addNote.tsx    # Create note
│   │   ├── viewNote.tsx   # View note
│   │   └── allNotes.tsx   # All notes
│   ├── auth.tsx           # Authentication
│   └── _layout.tsx        # Main layout
├── components/            # Reusable components
│   ├── AuthContext.tsx    # Authentication context
│   ├── GradientButton.tsx # Gradient button
│   └── CustomButton.tsx   # Custom button
├── services/              # Services
│   └── notesService.ts    # Notes API
├── constants/             # Constants
│   └── Colors.ts          # Color palette
├── firebase.js            # Firebase configuration
├── google-services.json   # Google Services for Android
└── package.json
```

## 🎨 Design Features

- **Minimalist UI** - clean and intuitive interface
- **Mood emojis** - visual emotion representation
- **Gradient buttons** - modern UI elements
- **Statistics** - mood data visualization
- **Responsive** - works on different screen sizes

## 🔒 Security

- Firebase Authentication for secure login
- Tokens not stored locally (Google Sign-In)
- Client and server-side data validation
- Protected API endpoints

## 📊 Moods

The app supports 5 mood types:

- 😊 Happy
- 😌 Calm
- 😐 Neutral
- 😔 Sad
- 😢 Very Sad

## 🐛 Known Issues

- First Google login may require app restart
- GitHub OAuth requires `client_secret` (server-side only)

## 🤝 Contributing

All suggestions and improvements are welcome!

## 📄 License

MIT

## 👤 Author

Anastasiia renstein

---

Made with ❤️ using Expo & Firebase

- Press `i` to launch the iOS Simulator (requires Xcode)
- Press `a` to launch the Android Emulator (requires Android Studio + a running AVD)
- Press `w` to open the web build in your browser
- Scan the QR code with the Expo Go app on your device

Alternatively, you can use the dedicated scripts:

```bash
npm run ios      # Start and open on iOS Simulator
npm run android  # Start and open on Android Emulator
npm run web      # Start the web build
```

## Scripts

- `npx expo start --dev-client --tunnel -c`

- `npm run start` → Run the Expo dev server
  - `npm run start --tunnel` → Start the Expo dev server using a tunnel connection (useful when your device and computer are not on the same network)
- `npm run ios` → Start server and open iOS Simulator
- `npm run android` → Start server and open Android Emulator
- `npm run web` → Start web build
- `npm test` → Run tests with Jest

## Common Tips

- Clear cache if something looks off:
  ```bash
  npx expo start -c
  ```
- Ensure your emulator/simulator is running before using `npm run android`/`npm run ios`, or let Expo start it for you.
- For physical devices, connect to the same Wi‑Fi network as your computer and use Expo Go.

## Project Info

- Expo SDK: ~53
- React Native: 0.79
- Router: `expo-router`

If you run into issues, share the error output from your terminal for help.
