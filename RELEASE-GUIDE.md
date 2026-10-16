# Releasing DevTyper

Releases are built and published by GitHub Actions (`.github/workflows/release.yml`)
whenever a version tag (`vX.Y.Z`) is pushed. The workflow builds the Windows installer
on a clean runner, writes a `SHA256SUMS.txt`, and creates the GitHub Release with
auto-generated notes.

## Versioning

DevTyper follows [Semantic Versioning](https://semver.org) (`MAJOR.MINOR.PATCH`). While the major
version is `0`, the app is pre-1.0 and anything may change, but we still use the numbers like this:

| Bump | When | Example |
|------|------|---------|
| PATCH `0.0.x` | Bug fixes, security fixes, dependency updates, docs, no new user-facing features | `v0.0.1` -> `v0.0.2` (security and dependency update) |
| MINOR `0.x.0` | New user-facing features or a noticeable UI/content change | UI refresh, larger exercise library |
| MAJOR `x.0.0` | Breaking changes (e.g. saved-stats format that can't be migrated). `1.0.0` = first stable release | |

Rules: tags are `v` + the `package.json` version, a version is never reused or moved once released,
and a bump resets the lower numbers (`0.1.3` -> `0.2.0`). Mark builds that aren't ready as
pre-releases with a suffix, e.g. `v0.1.0-beta.1`.

## Release checklist

1. Work on a branch and merge to `main` through a pull request (CI and CodeQL must pass).
2. Bump `version` in `package.json` (and the version badge in `README.md`) in a PR.
   Use [Semantic Versioning](https://semver.org): `0.0.x` fixes, `0.x.0` features, `x.0.0` breaking changes.
3. Pull the merged `main` locally and check it:
   ```bash
   git checkout main && git pull
   npm ci
   npm audit
   npm run build
   ```
4. (Optional) Build and try the installer locally:
   ```bash
   npm run package
   ```
   The installer is written to `release/`.
5. Tag the merged commit and push the tag:
   ```bash
   git tag v0.1.0
   git push origin v0.1.0
   ```
   The tag must match `package.json` (`v` + version) or the workflow fails on purpose.
6. Watch the **Release** run in the Actions tab. When it finishes, the release appears at
   https://github.com/gitbiruk2010/DevTyper/releases/latest with `DevTyper-X.Y.Z-Setup.exe`
   and `SHA256SUMS.txt`.
7. Edit the release notes if you want to add highlights; mark it as a pre-release if needed.

If a release run fails, fix the problem, delete the tag locally and on GitHub
(`git tag -d vX.Y.Z && git push origin :refs/tags/vX.Y.Z`), and tag again.

## Notes for users

- **Windows SmartScreen:** the installer is not code-signed, so first-time users may see a
  warning. Choose **More info → Run anyway**. Code signing would remove this.
- **Verify a download:** compare `certutil -hashfile DevTyper-X.Y.Z-Setup.exe SHA256`
  with the value in `SHA256SUMS.txt`.
- **Platforms:** only Windows (x64) installers are built in CI. macOS and Linux targets exist in
  `package.json` but need to be built on those systems.

## Requirements

- Node.js 22.12 or newer (see `engines` in `package.json`)
- Windows runner/machine to build the Windows installer

## Troubleshooting

- **`EPERM ... rename win-unpacked.tmp` when running `npm run package` locally:** a Windows
  security feature (Defender Controlled Folder Access, OneDrive sync or antivirus) is locking the
  project's folder. Build to a folder outside Documents/OneDrive:
  ```bash
  npx electron-builder --config.directories.output=C:/temp/devtyper-release
  ```
- **Installer shows an old version:** delete `release/`, check `package.json`, and package again.
