export const URL_SCHEME_RXP = /^lxmusic:\/\//

/** 用户数据目录名称（位于 userData 下） */
export const MW_DATA_DIR_NAME = 'MelodyWorkshopData' as const
/** 数据库文件名 */
export const MW_DB_FILENAME = 'mw_data.db' as const

/** 本发行版品牌与上游说明（界面、托盘、窗口标题等统一引用） */
export const APP_BRAND = {
  displayName: '旋律工坊',
  /** 英文界面与文档中的统一名称 */
  displayNameEn: 'Melody Workshop',
  studio: 'wzystudio',
  /** 上游开源项目（洛雪音乐助手桌面版） */
  upstreamDisplayName: 'LX Music（洛雪音乐助手）',
  upstreamRepoReadmeUrl: 'https://github.com/lyswhut/lx-music-desktop#readme',
  upstreamReleasesUrl: 'https://github.com/lyswhut/lx-music-desktop/releases',
  upstreamIssuesUrl: 'https://github.com/lyswhut/lx-music-desktop/issues?q=is%3Aissue+',
  upstreamLicenseAnchorUrl: 'https://github.com/lyswhut/lx-music-desktop#%E9%A1%B9%E7%9B%AE%E5%8D%8F%E8%AE%AE',
} as const

/** 内置「旋律工坊」主题 id，与 createThemes.js 中 melody_workshop 一致 */
export const MELODY_WORKSHOP_THEME_ID = 'melody_workshop' as const

export const LISTEN_SESSION_STORAGE_KEY = 'mw_listen_sessions_v1'
export const BRAND_WELCOME_STORAGE_KEY = 'mw_brand_welcome_v2'

export const SPLIT_CHAR = {
  DISLIKE_NAME: '@',
  DISLIKE_NAME_ALIAS: '#',
} as const

export const STORE_NAMES = {
  APP_SETTINGS: 'config_v2',
  DATA: 'data',
  SYNC: 'sync',
  HOTKEY: 'hot_key',
  USER_API: 'user_api',
  LRC_RAW: 'lyrics',
  LRC_EDITED: 'lyrics_edited',
  THEME: 'theme',
  SOUND_EFFECT: 'sound_effect',
} as const

export const APP_EVENT_NAMES = {
  winMainName: 'win_main',
  winLyricName: 'win_lyric',
  trayName: 'tray',
} as const

export const LIST_IDS = {
  DEFAULT: 'default',
  LOVE: 'love',
  TEMP: 'temp',
  DOWNLOAD: 'download',
  PLAY_LATER: null,
} as const

export const DATA_KEYS = {
  viewPrevState: 'viewPrevState',
  playInfo: 'playInfo',
  searchHistoryList: 'searchHistoryList',
  listScrollPosition: 'listScrollPosition',
  listPrevSelectId: 'listPrevSelectId',
  listUpdateInfo: 'listUpdateInfo',
  ignoreVersion: 'ignoreVersion',

  leaderboardSetting: 'leaderboardSetting',
  songListSetting: 'songListSetting',
  searchSetting: 'searchSetting',

  lastStartInfo: 'lastStartInfo',
} as const

export const DEFAULT_SETTING = {
  leaderboard: {
    source: 'kw',
    boardId: 'kw__16',
  },

  songList: {
    source: 'kw',
    sortId: 'new',
    tagId: '',
  },

  search: {
    temp_source: 'kw',
    source: 'all',
    type: 'music',
  },

  viewPrevState: {
    url: '/search',
    query: {},
  },
}

export const DOWNLOAD_STATUS = {
  RUN: 'run',
  WAITING: 'waiting',
  PAUSE: 'pause',
  ERROR: 'error',
  COMPLETED: 'completed',
} as const

export const QUALITYS = ['flac24bit', 'flac', 'wav', 'ape', '320k', '192k', '128k'] as const

export const TRAY_AUTO_ID = -1
