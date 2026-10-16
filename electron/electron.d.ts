export interface ElectronAPI {
  store: {
    get: <T = unknown>(key: string) => Promise<T | undefined>;
    set: (key: string, value: unknown) => Promise<void>;
    delete: (key: string) => Promise<void>;
    clear: () => Promise<void>;
  };
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}
