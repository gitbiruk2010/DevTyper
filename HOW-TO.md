# DevTyper - Developer Guide

## 📋 Complete Workflow After Making Changes

### Step-by-Step Process

```
Make Changes → Test in Dev → Build → Test Build → Package Installer → Distribute
```

---

## 🔧 Types of Builds

### 1. **Development Build** (Hot Reload)
- **Purpose:** Active development with instant updates
- **Command:** `npm run dev:electron`
- **Features:**
  - ✅ Hot module replacement (HMR)
  - ✅ DevTools open automatically
  - ✅ Instant code changes without restart
  - ✅ Source maps for debugging
- **When to use:** While coding/testing features

### 2. **Production Build** (Optimized)
- **Purpose:** Optimized files without installer
- **Command:** `npm run build`
- **Output:** `dist/` and `dist-electron/` folders
- **Features:**
  - ✅ Minified code
  - ✅ Optimized assets
  - ✅ Tree-shaking
  - ✅ Production-ready but not packaged
- **When to use:** Before creating installer

### 3. **Electron Build Only**
- **Purpose:** Rebuild only Electron files (main/preload)
- **Command:** `npm run build:electron`
- **Output:** `dist-electron/` folder
- **When to use:** After changing only `electron/main.ts` or `electron/preload.ts`

### 4. **Package Installer** (Distribution)
- **Purpose:** Create installable executable
- **Command:** `npm run package`
- **Output:** `release/DevTyper-X.X.X-Setup.exe`
- **Features:**
  - ✅ NSIS installer
  - ✅ Desktop shortcuts
  - ✅ Start menu entry
  - ✅ Uninstaller
- **When to use:** Final release for distribution

---

## 🧪 Testing Workflow (Step-by-Step)

### **Phase 1: Development Testing**

1. **Start dev server:**
   ```bash
   npm run dev:electron
   ```

2. **Test your changes:**
   - Make code changes in `src/`
   - Changes auto-reload in the app
   - Check console for errors (DevTools is open)
   - Test all features thoroughly

3. **Verify functionality:**
   - ✅ Menu navigation works
   - ✅ Typing area responds correctly
   - ✅ Racing game animates
   - ✅ Stats save/load properly
   - ✅ Results screen displays

4. **Stop dev server:**
   - Press `Ctrl+C` in terminal

### **Phase 2: Production Testing**

5. **Create production build:**
   ```bash
   npm run build
   ```

6. **Test production build:**
   ```bash
   npm start
   ```
   - This runs the built version (not dev server)
   - No DevTools, no hot reload
   - Tests actual production performance

7. **Verify:**
   - ✅ App launches correctly
   - ✅ No console errors
   - ✅ All features work as in dev
   - ✅ Performance is good
   - ✅ Icons display correctly

8. **Stop production test:**
   - Close the app window

### **Phase 3: Installer Testing**

9. **Create installer:**
   ```bash
   npm run package
   ```
   - Wait for build to complete (~30-60 seconds)
   - Check `release/` folder for `.exe` file

10. **Test installer:**
    - Navigate to `release/` folder
    - Run `DevTyper-X.X.X-Setup.exe`
    - Go through installation process
    - Choose custom install directory (optional)
    - Select desktop shortcut option

11. **Test installed app:**
    - Launch from Desktop shortcut
    - Launch from Start Menu
    - Verify icon in taskbar
    - Test all app features
    - Check stats persistence

12. **Test uninstaller:**
    - Go to Windows Settings → Apps
    - Find "DevTyper"
    - Click Uninstall
    - Verify clean removal

---

## 📝 Common Change Scenarios

### **Scenario A: Changed React Components**

```bash
# 1. Test in dev
npm run dev:electron

# 2. After testing, build
npm run build

# 3. Test production
npm start

# 4. Create installer
npm run package
```

### **Scenario B: Changed Electron Main/Preload**

```bash
# 1. Rebuild Electron files only
npm run build:electron

# 2. Test
npm start

# 3. If good, create installer
npm run package
```

### **Scenario C: Changed Exercises/Data**

```bash
# 1. Test in dev (changes auto-reload)
npm run dev:electron

# 2. Build and package
npm run build
npm run package
```

### **Scenario D: Changed Styling (Tailwind)**

```bash
# 1. Test in dev (HMR updates instantly)
npm run dev:electron

# 2. Build when satisfied
npm run build
npm run package
```

### **Scenario E: Updated Dependencies**

```bash
# 1. Install dependencies
npm install

# 2. Check for vulnerabilities
npm audit

# 3. Fix if needed
npm audit fix

# 4. Test thoroughly
npm run dev:electron

# 5. Build
npm run build
npm run package
```

---

## 🔍 Before Release Checklist

### **Code Quality**

- [ ] No TypeScript errors: `npx tsc --noEmit`
- [ ] No linting errors: `npm run lint`
- [ ] No console errors in app
- [ ] No console warnings (critical ones)

### **Functionality**

- [ ] All menu options work
- [ ] Typing detection accurate
- [ ] WPM/Accuracy calculations correct
- [ ] Racing game animates smoothly
- [ ] Stats persist after closing app
- [ ] All difficulty levels work
- [ ] All 32 exercises load properly

### **Build Quality**

- [ ] Production build completes: `npm run build`
- [ ] No build errors or warnings
- [ ] App runs from build: `npm start`
- [ ] Bundle sizes reasonable
- [ ] No missing assets

### **Installer Quality**

- [ ] Installer builds: `npm run package`
- [ ] Installer size reasonable (~90-100 MB)
- [ ] Custom icon displays correctly
- [ ] Installation completes successfully
- [ ] Desktop shortcut works
- [ ] Start menu entry works
- [ ] Uninstaller works cleanly

### **Security**

- [ ] Zero vulnerabilities: `npm audit`
- [ ] Dependencies up to date (check for critical updates)
- [ ] No exposed secrets in code

### **Version Management**

- [ ] Updated version in `package.json`
- [ ] Updated version in docs if needed
- [ ] Changelog updated (if maintained)

---

## 🚀 Quick Commands Reference

```bash
# Development
npm run dev              # Vite dev server only
npm run dev:electron     # Full Electron app with HMR

# Building
npm run build            # Build React + Electron
npm run build:electron   # Build only Electron files

# Testing
npm start                # Run built app (no dev server)

# Packaging
npm run package          # Create Windows installer

# Maintenance
npm install              # Install dependencies
npm audit                # Check for vulnerabilities
npm run lint             # Run ESLint
npx tsc --noEmit         # Check TypeScript types
```

---

## 📦 Build Output Locations

```
dist/                    # React production build
  ├── index.html
  ├── assets/
  └── ...

dist-electron/           # Electron production build
  ├── main.cjs
  └── preload.cjs

release/                 # Installer output
  ├── DevTyper-X.X.X-Setup.exe      # Windows installer
  ├── DevTyper-X.X.X-Setup.exe.blockmap
  ├── win-unpacked/                  # Unpacked app (testing)
  └── builder-*.yaml                 # Build configs
```

---

## 🔄 Version Update Workflow

When releasing a new version:

1. **Update version number:**
   ```json
   // package.json
   "version": "0.0.2"  // Increment from 0.0.1
   ```

2. **Build new installer:**
   ```bash
   npm run package
   ```

3. **Installer will be named:**
   ```
   DevTyper-0.0.2-Setup.exe
   ```

4. **Distribute the new version**

---

## 🐛 Troubleshooting

### Issue: "Module not found" errors
**Solution:** 
```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue: Build fails with TypeScript errors
**Solution:**
```bash
npx tsc --noEmit  # See all errors
# Fix errors, then rebuild
```

### Issue: Installer shows old version
**Solution:**
1. Delete `release/` folder
2. Update version in `package.json`
3. Run `npm run package` again

### Issue: Hot reload not working
**Solution:**
1. Stop dev server (Ctrl+C)
2. Delete `.vite/` folder
3. Run `npm run dev:electron` again

### Issue: Icons not showing
**Solution:**
1. Check `build/icons/` folder exists
2. Rebuild: `npm run build:electron`
3. Package: `npm run package`

---

## 💡 Best Practices

1. **Always test in dev first** before building
2. **Test production build** before creating installer
3. **Increment version** for each new installer
4. **Keep dependencies updated** monthly
5. **Run audit** before each release
6. **Test installer** before distributing
7. **Keep old installers** for rollback if needed
8. **Document changes** for users

---

## 📊 Typical Development Cycle

```
Day-to-day development:
├── npm run dev:electron (leave running)
├── Make changes
├── Test instantly (HMR)
└── Repeat

Before pushing to Git:
├── npm run lint
├── npx tsc --noEmit
└── npm run build (verify builds)

Before release:
├── Update version in package.json
├── npm audit
├── npm run build
├── npm start (test production)
├── npm run package
├── Test installer
└── Distribute
```

---

## 🎯 Summary

**For quick testing:** `npm run dev:electron`  
**For production check:** `npm run build && npm start`  
**For release:** `npm run package`

Always follow: **Dev → Build → Test → Package → Distribute**
