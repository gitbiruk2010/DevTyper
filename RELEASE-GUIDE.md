# Releasing DevTyper

A release is created automatically when you push a version tag such as `v0.2.0`.
You do not upload anything by hand.

## How it works

Pushing a tag that looks like `vX.Y.Z` starts the **Release** workflow
(`.github/workflows/release.yml`):

1. **build** (runs twice in parallel, each on a clean machine):
   - Windows runner: builds `DevTyper-X.Y.Z-Setup.exe`
   - Ubuntu runner: builds `DevTyper-X.Y.Z-linux.AppImage` and `DevTyper-X.Y.Z-linux.deb`
   - Both first check that the tag matches the version in `package.json`, then run
     `npm ci`, `npm audit` and `npm run package`.
2. **release** (after both builds succeed): collects the three installers, writes
   `SHA256SUMS.txt`, and creates the GitHub Release.

If `release-notes/vX.Y.Z.md` exists, it becomes the release description. If it does not,
GitHub generates the notes from the merged pull requests.

macOS is not built in CI (it needs a Mac runner and an Apple Developer account to sign).

## Versioning

DevTyper follows [Semantic Versioning](https://semver.org) (`MAJOR.MINOR.PATCH`).
While the major version is `0` the app is pre-1.0, but the numbers still mean this:

| Bump | When | Example |
|------|------|---------|
| PATCH (`0.1.0` to `0.1.1`) | Bug fixes, security fixes, dependency updates, docs. No new user-facing features. | Fix a typing bug |
| MINOR (`0.1.1` to `0.2.0`) | New user-facing features or a noticeable change. | New platform, new mode, new exercises |
| MAJOR (`0.x.y` to `1.0.0`) | Breaking changes, or the first stable release. | Saved stats that cannot be migrated |

Rules:
- The tag is `v` plus the `package.json` version (version `0.2.0` means tag `v0.2.0`).
- A bump resets the lower numbers (`0.1.3` to `0.2.0`).
- Once a release is published, never move or reuse its tag. (If a release run fails and
  nothing was published, you may delete the tag and tag again, see Troubleshooting.)
- For test builds use a suffix, for example `v0.2.0-beta.1`. The tag must still match
  `package.json` exactly.

## Release checklist

Do everything through pull requests: the `main` branch is protected, so you cannot push to it directly.

1. **Merge all the work you want in the release** into `main` (CI and CodeQL must pass).
2. **Bump the version** on a new branch, for example `chore/release-0.2.0`:
   - `version` in `package.json` (then run `npm install --package-lock-only` to update the lockfile)
   - the version badge in `README.md`
   - optionally write the release notes in `release-notes/v0.2.0.md` (plain text, no emojis)

   Open a pull request and merge it.
3. **Update your local `main`** and make sure you are on the merged commit:
   ```bash
   git checkout main
   git pull origin main
   git log --oneline -1
   ```
   The top commit should be the release pull request you just merged.
4. **Optional: build and test the installer locally** (see Local builds below). Install it, start a
   run, finish it, close the app and reopen it to confirm your stats were saved.
5. **Create the tag and push it.** Pushing the tag starts the release:
   ```bash
   git tag v0.2.0
   git push origin v0.2.0
   ```
6. **Watch the run** in the repository's **Actions** tab (workflow **Release**). It takes a few minutes.
7. **Check the result** at https://github.com/gitbiruk2010/DevTyper/releases/latest. The release
   should list the `.exe`, `.AppImage`, `.deb` and `SHA256SUMS.txt`, and be marked **Latest**.
8. **Optional:** edit the release in the GitHub UI (pencil icon) to adjust the notes or mark it as a pre-release.

## Local builds

`npm run package` builds an installer for the operating system you run it on and writes it to `release/`.
It never publishes anything.

```bash
npm ci
npm run package
```

You need Node.js 22.12 or newer (see `engines` in `package.json`). A Windows machine builds the `.exe`;
a Linux machine builds the `.AppImage` and `.deb`.

## Installing and verifying (for users)

- **Windows:** the installer is not code-signed, so SmartScreen may warn on first run.
  Choose **More info**, then **Run anyway**.
- **Ubuntu and Debian:** `sudo apt install ./DevTyper-X.Y.Z-linux.deb`
- **Other Linux:** `chmod +x DevTyper-X.Y.Z-linux.AppImage`, then run it. If it does not start on
  Ubuntu 24.04 or newer (Chromium sandbox restriction), use the `.deb` or launch the AppImage with `--no-sandbox`.
- **Verify a download:** compare its hash with the line in `SHA256SUMS.txt`.
  - Windows: `certutil -hashfile DevTyper-X.Y.Z-Setup.exe SHA256`
  - Linux: `sha256sum -c SHA256SUMS.txt` in the download folder (it checks the files you have)

## Troubleshooting

- **The Release run fails and nothing was published:** read the failing step in the Actions log, fix
  the problem through a pull request, update `main` locally, then delete the tag and tag again:
  ```bash
  git tag -d vX.Y.Z
  git push origin :refs/tags/vX.Y.Z
  git tag vX.Y.Z
  git push origin vX.Y.Z
  ```
  If a release was already created, delete it on the Releases page first.
- **"Tag ... does not match package.json version":** the version bump was not merged, or the tag has a typo.
  Fix the version or the tag and try again.
- **`EPERM ... rename win-unpacked.tmp` during a local build on Windows:** a security feature (Defender
  Controlled Folder Access, OneDrive sync or antivirus) is locking the project folder. Build to a folder
  outside Documents and OneDrive:
  ```bash
  npx electron-builder --config.directories.output=C:/temp/devtyper-release
  ```
- **"GitHub Personal Access Token is not set":** `electron-builder` tried to publish on its own. The
  `package` script already passes `--publish never`; do not remove it.
- **Installer shows an old version:** delete `release/`, check `version` in `package.json`, and build again.
