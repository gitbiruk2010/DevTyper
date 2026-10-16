# App icon

The app logo lives in `build/logo-source.png` (original artwork). The files below are generated from it:

| File | Used for |
|------|----------|
| `build/icons/icon.ico` | Windows installer, `DevTyper.exe`, window icon |
| `build/icons/icon.icns` | macOS app icon |
| `build/icons/icon.png` (512px) | Linux app icon |
| `src/assets/logo.png` (256px) | Logo shown on the menu screen |
| `public/favicon.png` (64px) | Browser/dev favicon |

To change the logo, replace `build/logo-source.png` and regenerate the icons. Any square-ish PNG of 512px or
more with a transparent background works; non-square images are padded to a square. The `.ico` is built from
16-256px PNG layers and the `.icns` from 128-1024px layers (e.g. with `sharp`, or `electron-icon-maker`).

`signExecutable: false` in `package.json` skips code signing but still embeds the icon into `DevTyper.exe`.
