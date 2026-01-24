# Ground State Mobile

This is a React Native reimplementation of the Ground State vocabulary game.

## Prerequisites

- Node.js
- npm or yarn

## Setup

1. Navigate to the mobile directory:
   ```bash
   cd mobile
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Running the App

- **iOS:** `npm run ios`
- **Android:** `npm run android`
- **Web:** `npm run web`

## Project Structure

- `src/engine`: Core game logic (Platform agnostic TypeScript).
- `src/components`: UI Components (React Native + Reanimated).
- `src/screens`: Main game screens.
- `src/data`: Vocabulary data.
- `src/hooks`: Custom hooks for game state management.

## Testing

Run unit tests for the game engine:

```bash
npm test
```
