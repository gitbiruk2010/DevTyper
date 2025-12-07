import { build } from 'vite';
import { builtinModules } from 'module';

const electronBuild = async () => {
  await build({
    configFile: false,
    build: {
      lib: {
        entry: 'electron/main.ts',
        formats: ['cjs'],
        fileName: () => 'main.cjs',
      },
      outDir: 'dist-electron',
      emptyOutDir: true,
      rollupOptions: {
        external: ['electron', 'electron-store', ...builtinModules],
      },
    },
  });

  await build({
    configFile: false,
    build: {
      lib: {
        entry: 'electron/preload.ts',
        formats: ['cjs'],
        fileName: () => 'preload.cjs',
      },
      outDir: 'dist-electron',
      emptyOutDir: false,
      rollupOptions: {
        external: ['electron', ...builtinModules],
      },
    },
  });
};

electronBuild();
