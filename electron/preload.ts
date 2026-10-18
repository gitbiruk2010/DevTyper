import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  store: {
    get: (key: string) => ipcRenderer.invoke('store:get', key),
    set: (key: string, value: unknown) => ipcRenderer.invoke('store:set', key, value),
    delete: (key: string) => ipcRenderer.invoke('store:delete', key),
    clear: () => ipcRenderer.invoke('store:clear'),
  },
  onOpenHelp: (callback: (section?: string) => void) => {
    const listener = (_event: unknown, section?: string) => callback(typeof section === 'string' ? section : undefined);
    ipcRenderer.on('menu:open-help', listener);
    return () => {
      ipcRenderer.removeListener('menu:open-help', listener);
    };
  },
});
