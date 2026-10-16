import { app, BrowserWindow, ipcMain, session } from 'electron';
import type { IpcMainInvokeEvent } from 'electron';
import path from 'path';
import Store from 'electron-store';

const store = new Store();

const DEV_SERVER_URL = app.isPackaged ? undefined : process.env.VITE_DEV_SERVER_URL;

// Only these keys may be read or written from the renderer.
const ALLOWED_KEYS = new Set(['userStats', 'settings']);

const CSP = [
  "default-src 'self'",
  // Vite's dev server needs inline/eval for HMR; production stays strict.
  DEV_SERVER_URL ? "script-src 'self' 'unsafe-inline'" : "script-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self' data:",
  DEV_SERVER_URL ? "connect-src 'self' ws://localhost:*" : "connect-src 'none'",
  "object-src 'none'",
  "base-uri 'none'",
  "form-action 'none'",
  "frame-ancestors 'none'",
].join('; ');

let mainWindow: BrowserWindow | null = null;

function isTrustedSender(event: IpcMainInvokeEvent): boolean {
  const url = event.senderFrame?.url;
  if (!url) return false;
  if (DEV_SERVER_URL) return url.startsWith(DEV_SERVER_URL);
  return url.startsWith('file://');
}

function assertKey(key: unknown): asserts key is string {
  if (typeof key !== 'string' || !ALLOWED_KEYS.has(key)) {
    throw new Error('Invalid store key');
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    backgroundColor: '#1a1a1a',
    icon: path.join(__dirname, '../build/icons/icon.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      webSecurity: true,
      allowRunningInsecureContent: false,
      webviewTag: false,
      devTools: !app.isPackaged,
    },
  });

  // The app is a single local page: never open new windows or navigate away.
  mainWindow.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
  mainWindow.webContents.on('will-navigate', (event, url) => {
    if (!DEV_SERVER_URL || !url.startsWith(DEV_SERVER_URL)) {
      event.preventDefault();
    }
  });
  mainWindow.webContents.on('will-attach-webview', (event) => event.preventDefault());

  if (DEV_SERVER_URL) {
    mainWindow.loadURL(DEV_SERVER_URL);
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

if (!app.requestSingleInstanceLock()) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });

  app.whenReady().then(() => {
    // Deny every permission request (camera, notifications, etc.); the app needs none.
    session.defaultSession.setPermissionRequestHandler((_wc, _permission, callback) => callback(false));
    session.defaultSession.setPermissionCheckHandler(() => false);

    session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
      callback({
        responseHeaders: {
          ...details.responseHeaders,
          'Content-Security-Policy': [CSP],
        },
      });
    });

    createWindow();

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
      }
    });
  });
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC handlers for electron-store
ipcMain.handle('store:get', (event, key: unknown) => {
  if (!isTrustedSender(event)) throw new Error('Untrusted sender');
  assertKey(key);
  return store.get(key);
});

ipcMain.handle('store:set', (event, key: unknown, value: unknown) => {
  if (!isTrustedSender(event)) throw new Error('Untrusted sender');
  assertKey(key);
  if (typeof value !== 'object' || value === null) throw new Error('Invalid store value');
  store.set(key, value);
});

ipcMain.handle('store:delete', (event, key: unknown) => {
  if (!isTrustedSender(event)) throw new Error('Untrusted sender');
  assertKey(key);
  store.delete(key);
});

ipcMain.handle('store:clear', (event) => {
  if (!isTrustedSender(event)) throw new Error('Untrusted sender');
  store.clear();
});
