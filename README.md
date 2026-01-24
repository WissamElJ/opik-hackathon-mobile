# Mobile App

A React Native mobile application built with Expo and TypeScript.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 18 or higher recommended)
- **npm** or **yarn** package manager
- **Backend Agent**: The mobile app requires the backend agent to be running locally. Clone and set up [opik-hackathon-agent](https://github.com/yactouat/opik-hackathon-agent) following its README instructions.
- **Expo Go** app installed on your mobile device:
  - [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)
  - [Android Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

## Installation
```npm install```

## Environment Setup

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
2. Open `.env` and update the variables with your own credentials.

## Running the app

```npx expo start```

```npx expo start -c``` (to clear the cache)

```npx expo start --tunnel -c``` (if all fails)

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


## Architecture & Data Access

- **Authentication**: Implemented following the [Supabase React Native Quickstart Guide](https://supabase.com/docs/guides/auth/quickstarts/react-native).
- **Direct Database Access**: The mobile app should **only** interact directly with the `auth` schema of the Supabase instance. It should not directly access other schemas/tables.

## EAS

### Initializing EAS with an Existing Project ID

Use `eas init --id <project-id>` to link your local project to an existing EAS project on Expo's servers.

### .easignore

Copy the content of .gitignore to .easignore to avoid bundling environment
variables or files with the app.
