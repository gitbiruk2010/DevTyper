Project Spec: Offline Developer Typing Tutor (Electron/React)

Goal: Build "DevTyper," a fully offline, cross-platform (Windows, macOS, Linux), installable desktop app for developers to practice typing code (focusion on most used coding keys).

The platform uses a simple track game that is fueled by the speed and accuracy of the typing skills. 
Theme should reflect a coding invironment. 

Tech Stack:

  - Core: Electron (main process), React (renderer), TypeScript.
  - Build Tool: Vite (for fast React HMR).
  - Styling: Tailwind CSS (for rapid UI).
  - State/Storage: React Context + electron-store (for persisting stats/settings locally).
  - Packaging: electron-builder.

Phase 1: Environment & Scaffolding

1. Initialize:
      - Create a Vite + React + TS project: npm create vite@latest dev-typer -- --template react-ts.
      - Install Electron deps: npm install -D electron electron-builder concurrently wait-on.
      - Install utility deps: npm install electron-store clsx tailwind-merge.
2. Electron Setup:
      - Create electron/main.ts: Handle window creation (BrowserWindow), load http://localhost:5173 in dev and index.html in prod.
      - Create electron/preload.ts: Expose safe IPC bridge (ContextBridge) for file system ops (saving stats).
      - Modify package.json: Set "main": "dist-electron/main.js". Add scripts for dev:electron and build.

Phase 2: Data Structure (Offline)

1. Exercise Model (types.ts):
    interface Exercise {
      id: string;
      text: string; // The code snippet
      language: 'javascript' | 'python' | 'html' | 'css' | 'java';
      difficulty: 'beginner' | 'intermediate' | 'advanced';
    }
2. Data Source (src/data/exercises.json):
    You must bundle this file with the app to ensure offline functionality.
    [
      {
        "id": "1",
        "level": "beginner",
        "focus": "homeRow",
        "text": "The quick brown fox jumps over the lazy dog.",
        "source_language": "en_common",
        "difficulty_score": 1
      },
      {
        "id": "2",
        "level": "advanced",
        "focus": "symbols_brackets",
        "text": "if (count > 0) { return total; } else { throw new Error('Invalid'); }",
        "source_language": "javascript",
        "difficulty_score": 8
      },
      {
        "id": "3",
        "level": "intermediate",
        "focus": "keywords_python",
        "text": "def calculate_average(data): pass",
        "source_language": "python",
        "difficulty_score": 4
      }
    ]
3. Persistence:
      - Configure electron-store in main.ts to save:
          - userStats: { totalWPM, accuracyHistory, weakKeys: [] }.
          - settings: { theme, soundEffects }.

Phase 3: The Core Typing Engine

1. Component TypingArea.tsx:
      - State: input (string), startTime (number), errors (number), status ('idle' | 'running' | 'finished').
      - Logic:
          - Listen to window.addEventListener('keydown').
          - Validation: Compare input[i] with targetText[i].
          - Visuals: Render target text as spans. Green class for correct char, Red class for incorrect. Blinking cursor at current index.
          - Metrics:
              - WPM = ((charsTyped / 5) / timeElapsedMinutes)
              - Accuracy = ((totalKeyStrokes - errors) / totalKeyStrokes) * 100

Phase 4: Gamification & Adaptive Logic

1. Game Loop:
      - Screen 1: Menu (Select Level or "Survival Mode").
      - Screen 2: Game (The TypingArea).
      - Screen 3: Result (Show WPM, Accuracy, Graph).
2. Adaptive Algorithm:
      - Track keys with highest error rate in userStats.weakKeys.
      - Generator: When selecting the next random exercise, filter exercises.json for snippets containing the user's weak keys (e.g., if weak on {, pick CSS/JSON snippets).

Phase 5: Packaging & Distribution

1. Icons: Add an icon set (icns/ico) in build/icon.*.
2. Configuration (package.json):
    "build": {
      "appId": "com.yourname.devtyper",
      "mac": { "category": "public.app-category.developer-tools" },
      "win": { "target": "nsis" },
      "linux": { "target": "AppImage" }
    }
3. Build Command: npm run build (transpile Vite) -> electron-builder (package).
