# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

- `npm run dev` — Start development (multi-webpack build + Electron with HMR on ports 9080/9081)
- `npm run build` — Production build (runs `build-config/pack.js`)
- `npm run lint` — Lint all `.ts/.js/.vue` in src/
- `npm run lint:fix` — Lint with auto-fix
- `npm run build:main` / `build:renderer` / `build:renderer-lyric` / `build:renderer-scripts` — Individual webpack production builds
- `npm run build:theme` — Regenerate theme CSS (runs `src/common/theme/createThemes.js`)
- `npm run refresh:icons` — Regenerate app icons

## Project Architecture

**Electron 40+ / Vue 3** music player — a fork of LX Music (洛雪音乐助手).

### Process Architecture

The app has **4 webpack bundles** running as separate processes/windows:

1. **`src/main/`** — Electron main process. Entry: `src/main/index.ts`. Handles window management, IPC, hotkeys, system tray, sync server/client, DB worker, user API loading, and open API server.
2. **`src/renderer/`** — Main UI window (Vue 3 + vue-router). Entry: `src/renderer/main.ts`. Mounts `App.vue` with a sidebar/toolbar/play-bar layout.
3. **`src/renderer-lyric/`** — Desktop lyric window (standalone Vue app). Entry in `src/renderer-lyric/`. Has its own webpack config and dev server on port 9081.
4. **`src/renderer/worker/`** / **`src/main/worker/`** — Web Workers and Node workers for background tasks (DB, downloads, music resolution).

### Directory Layout

- **`src/common/`** — Shared between main & renderer: config, constants, IPC channel names (`ipcNames.ts`), types, utilities, default settings, theme engine, i18n.
- **`src/lang/`** — i18n messages: zh-cn, zh-tw, en-us. Uses a custom `i18n` plugin (not vue-i18n).
- **`src/renderer/store/`** — Reactive state modules (setting, player, list, search, download, songList, leaderboard, dislikeList, soundEffect). Not Pinia/Vuex — uses Vue 3 `reactive`/`ref` directly.
- **`src/renderer/views/`** — Page components: Search, SongList, Leaderboard, List, Download, Setting.
- **`src/renderer/components/`** — Auto-global-registered Vue components (`components/index.js` uses `require.context`). Subdirs: `base/` (Btn, Input, Tab, SliderBar, VirtualizedList), `layout/` (Aside, PlayBar, Toolbar, PlayDetail), `material/` (SongList, Modal, Pagination, SearchInput).
- **`src/renderer/core/`** — App initialization, player logic, music source management, deeplink handling, open API, theme.
- **`src/renderer/plugins/`** — Vue plugins: Dialog, Tips, SvgIcon.
- **`src/main/modules/`** — Main process modules: winMain, winLyric, hotKey, tray, appMenu, sync, openApi, userApi, commonRenderers (dislike, list).
- **`src/main/worker/dbService/`** — SQLite DB operations using `better-sqlite3` with modular tables (list, download, dislike_list, lyric, music_url, music_other_source).
- **`build-config/`** — Webpack configs per target (main/renderer/renderer-lyric/renderer-scripts), pack/build scripts for electron-builder.

### Key Patterns

- **IPC**: Channel names defined in `src/common/ipcNames.ts`. Renderer communicates via `@common/rendererIpc.ts`, main via `@common/mainIpc.ts`.
- **State**: Custom reactive store modules in `src/renderer/store/`, not Vuex or Pinia. Each module exports `ref`/`reactive` state directly.
- **Aliases** (via webpack): `@common/`, `@main/`, `@renderer/`, `@lyric/`, `@static/`, `@root/`. Also defined in `jsconfig.json` for IDE support.
- **Styling**: LESS with PostCSS (pxtorem for rem conversion). CSS modules via `css-loader` config. Theme engine generates CSS custom properties.
- **Templates**: Vue SFCs use Pug templates (`.vue` files with `<template lang="pug">`).
- **i18n**: Custom implementation in `src/lang/`. Accessible via `window.i18n.t()`.
- **Music Sources**: Pluggable online music sources in `src/renderer/utils/musicSdk/`.
