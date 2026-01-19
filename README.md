# Mobile App

A React Native mobile application built with Expo and TypeScript.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 18 or higher recommended)
- **npm** or **yarn** package manager
- **Expo Go** app installed on your mobile device:
  - [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)
  - [Android Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

## Installation
```npm install```

## Running the app

```npx expo start```

## Project Structure

opik-hackathon-mobile/

├── app/                 # 👈 Routes go here

    ├── (tabs)/          # Group for tab screens

    ├── index.tsx        # Home screen

    └── _layout.tsx      # Navigation configuration

|── src/                 # 👈 All logic/UI goes here

    ├── components/      # Reusable UI (Buttons, Cards)

    ├── constants/       # Colors, Fonts, Fixed strings

    ├── hooks/           # Custom React hooks (useAuth, useTheme)

    ├── services/        # API calls (axios, fetch functions)

    ├── types/           # TypeScript interfaces/types

    ├── utils/           # Helper functions (date formatting)

    └── assets/          # Images, Fonts (moved from root)

├── index.ts             # Entry point (keep as is)

└── tsconfig.json        # TS Config


## EAS

### Initializing EAS with an Existing Project ID

Use `eas init --id <project-id>` to link your local project to an existing EAS project on Expo's servers.

### .easignore

Copy the content of .gitignore to .easignore to avoid bundling environment
variables or files with the app.
