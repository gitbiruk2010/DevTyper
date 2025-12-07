# DevTyper - Developer Typing Tutor

![DevTyper](https://img.shields.io/badge/version-0.0.1-blue)
![Electron](https://img.shields.io/badge/Electron-39.x-brightgreen)
![React](https://img.shields.io/badge/React-19.x-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)

DevTyper is a fully offline, cross-platform desktop application designed to help developers practice and improve their typing speed with real code snippets.

## Features

- 🎯 **Code-Focused Practice**: Practice typing real code snippets from JavaScript, TypeScript, Python, Java, HTML, CSS, SQL, and PostgreSQL
- 🎮 **Interactive Game Track**: Watch a racing car move across the screen as you type - the faster you type, the faster it goes!
- 🏎️ **Real-time Performance**: Live WPM and accuracy updates during gameplay
- 📊 **Three Difficulty Levels**: Beginner, Intermediate, and Advanced exercises
- 💾 **Offline Storage**: All data stored locally using electron-store
- 🎨 **Developer-Friendly UI**: Dark theme with syntax highlighting colors
- ⚡ **Fast & Lightweight**: Built with Vite and React for blazing fast performance
- 🏁 **Visual Progress**: Progress bar with milestone markers and finish line

## Installation

### Development

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Run in development mode:
   ```bash
   npm run dev:electron
   ```

### Build

Build the application for your platform:

```bash
npm run build
npm run package
```

The packaged application will be in the `release` folder.

## Tech Stack

- **Core**: Electron + React + TypeScript
- **Build Tool**: Vite (for fast HMR)
- **Styling**: Tailwind CSS
- **State Management**: React Context
- **Storage**: electron-store (persistent local storage)
- **Packaging**: electron-builder

## Project Structure

```
CodeF/
├── electron/           # Electron main and preload processes
├── src/
│   ├── components/    # React components
│   ├── context/       # React Context for state management
│   ├── data/          # Exercise data (JSON)
│   ├── types/         # TypeScript type definitions
│   └── utils/         # Utility functions
├── scripts/           # Build scripts
└── dist/              # Build output
```

## Usage

1. **Select Difficulty**: Choose from Beginner, Intermediate, or Advanced
2. **Start Typing**: Begin typing the code snippet shown on screen
3. **View Results**: See your WPM, accuracy, and error count
4. **Track Progress**: Your stats are automatically saved locally

## Keyboard Shortcuts

- **ESC**: Reset current typing session
- **Any key**: Start typing to begin the timer

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License

## Author

Built with ❤️ for developers who want to type faster
