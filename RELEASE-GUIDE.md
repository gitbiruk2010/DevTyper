# Creating GitHub Releases for DevTyper

## 🚀 Method 1: Using GitHub Web Interface (Recommended)

### Step 1: Navigate to Releases
1. Go to: https://github.com/gitbiruk2010/DevTyper
2. Click on **"Releases"** (right sidebar) or go to: https://github.com/gitbiruk2010/DevTyper/releases
3. Click **"Create a new release"** or **"Draft a new release"**

### Step 2: Create Release Tag
1. **Choose a tag:** Click "Choose a tag"
2. **Type:** `v0.0.1` (creates new tag)
3. **Target:** `main` branch (default)

### Step 3: Fill Release Details
1. **Release title:** `DevTyper v0.0.1 - Initial Release`
2. **Description:** Use the template below:

```markdown
# DevTyper v0.0.1 🎮⌨️

**First stable release of DevTyper** - An offline developer typing tutor for mastering code typing speed!

## 🎯 Features
- ✅ 32+ code exercises across 8+ programming languages
- ✅ Interactive racing game visualization
- ✅ Real-time WPM and accuracy tracking
- ✅ Three difficulty levels (Beginner, Intermediate, Advanced)
- ✅ Stats persistence across sessions
- ✅ Dark mode UI optimized for developers

## 📦 Installation (Windows)

**Download:** `DevTyper-0.0.1-Setup.exe` (below)

### Quick Install
1. Download the installer
2. Run `DevTyper-0.0.1-Setup.exe`
3. Follow installation wizard
4. Launch from Desktop or Start Menu

### System Requirements
- Windows 10/11 (64-bit)
- ~100 MB disk space
- No additional dependencies needed

## 🎮 Supported Languages
JavaScript • TypeScript • Python • Java • HTML • CSS • SQL • PostgreSQL

## 📊 What's Included
- **Typing Engine:** Character-by-character validation
- **Racing Game:** Visual progress tracking with animated car
- **Stats System:** Track your improvement over time
- **Offline First:** No internet required

## ⚠️ Windows SmartScreen
First-time users may see a SmartScreen warning (app is not code-signed):
1. Click **"More info"**
2. Click **"Run anyway"**

## 🐛 Known Issues
None reported yet! Please open an issue if you find any bugs.

## 📝 Changelog
- Initial release with core typing tutor functionality
- 32 curated code exercises
- Racing game visualization
- Stats tracking system

## 🙏 Feedback
Found a bug? Have a suggestion? Open an issue: https://github.com/gitbiruk2010/DevTyper/issues
```

### Step 4: Attach Installer
1. Scroll to **"Attach binaries"** section
2. Drag and drop OR click to browse:
   - `C:\Users\solbi\Desktop\PROJECT\CodeF\release\DevTyper-0.0.1-Setup.exe`
3. Wait for upload to complete (may take 1-2 minutes for ~92 MB)

### Step 5: Publish
1. Optional: Check **"Set as a pre-release"** if this is a beta
2. Optional: Check **"Set as the latest release"** (recommended)
3. Click **"Publish release"** (green button)

---

## 🔧 Method 2: Using GitHub CLI

### Prerequisites
```bash
# Install GitHub CLI (if not installed)
winget install GitHub.cli
# OR download from: https://cli.github.com/

# Login
gh auth login
```

### Create Release
```bash
# Navigate to project
cd C:\Users\solbi\Desktop\PROJECT\CodeF

# Create release with installer
gh release create v0.0.1 `
  release\DevTyper-0.0.1-Setup.exe `
  --title "DevTyper v0.0.1 - Initial Release" `
  --notes "First stable release with 32+ code exercises and racing game visualization. See full changelog at https://github.com/gitbiruk2010/DevTyper/releases"
```

### Verify Release
```bash
# List all releases
gh release list

# View specific release
gh release view v0.0.1
```

---

## 📋 Method 3: Automated GitHub Actions (Future Releases)

Create `.github/workflows/release.yml`:

```yaml
name: Build and Release

on:
  push:
    tags:
      - 'v*.*.*'

jobs:
  build:
    runs-on: windows-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build application
        run: npm run package
      
      - name: Create Release
        uses: softprops/action-gh-release@v1
        with:
          files: release/DevTyper-*.exe
          body: |
            DevTyper release ${{ github.ref_name }}
            
            Download the installer below and run to install.
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

**To use GitHub Actions:**
1. Create `.github/workflows` folder
2. Add `release.yml` file
3. Commit and push
4. Create tag: `git tag v0.0.1 && git push origin v0.0.1`
5. Action runs automatically and creates release

---

## 🔄 For Future Updates

### When releasing v0.0.2, v0.1.0, etc.:

1. **Update version in package.json:**
   ```json
   "version": "0.0.2"
   ```

2. **Build new installer:**
   ```bash
   npm run package
   ```

3. **Create new release:**
   - Repeat Method 1 or 2 above
   - Use new tag: `v0.0.2`
   - Upload new installer: `DevTyper-0.0.2-Setup.exe`

---

## 📌 Best Practices

### Version Numbering (Semantic Versioning)
- **v0.0.x** - Bug fixes, minor changes
- **v0.x.0** - New features, non-breaking changes
- **vx.0.0** - Major updates, breaking changes

### Release Notes Template
```markdown
## What's New
- New feature 1
- New feature 2

## Improvements
- Improvement 1
- Improvement 2

## Bug Fixes
- Fix 1
- Fix 2

## Breaking Changes
- (if any)
```

### Release Checklist
- [ ] Version updated in `package.json`
- [ ] Built successfully: `npm run package`
- [ ] Tested installer locally
- [ ] No vulnerabilities: `npm audit`
- [ ] Changelog prepared
- [ ] Git tag created
- [ ] Release notes written

---

## 🎯 Quick Start Summary

**Easiest way (Web UI):**
1. Go to https://github.com/gitbiruk2010/DevTyper/releases/new
2. Tag: `v0.0.1`
3. Title: `DevTyper v0.0.1 - Initial Release`
4. Upload: `release\DevTyper-0.0.1-Setup.exe`
5. Click "Publish release"

**Users can then download from:**
https://github.com/gitbiruk2010/DevTyper/releases/latest
