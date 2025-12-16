# Diary App — Setup and Run

This is an Expo (React Native) app using Expo Router.

## Prerequisites (macOS)

- Node.js 18 or 20 (recommended via `nvm`)
- npm (bundled with Node)
- Xcode (for iOS Simulator) or Android Studio (for Android Emulator)
- Expo Go app on your device (optional, to run on a physical device)

Quick install tips:

```bash
# Install Homebrew if you don't have it
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install nvm and a compatible Node
brew install nvm
mkdir -p ~/.nvm
export NVM_DIR="$HOME/.nvm"
[ -s "/opt/homebrew/opt/nvm/nvm.sh" ] && . "/opt/homebrew/opt/nvm/nvm.sh"

nvm install --lts
nvm use --lts

# iOS requirements (Simulator)
xcode-select --install  # Command Line Tools
# Install Xcode from the App Store and open it once to finish setup

# Android requirements (Emulator)
brew install --cask android-studio
# Then open Android Studio, install SDKs, create and run a Virtual Device (AVD)
```

## Install Dependencies

```bash
cd diary_app
npm install
```

## Start the App (Expo)

```bash
# Start the Expo development server
npm run start
```

This opens Expo DevTools in your terminal. From there you can:

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
