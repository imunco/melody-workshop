import { watch } from '@common/utils/vueTools'
import { playMusicInfo, isPlay } from '@renderer/store/player/state'
import { LISTEN_SESSION_STORAGE_KEY } from '@common/constants'

const MAX_TRACKS = 45
const MAX_SESSIONS = 36
const IDLE_MS = 2 * 60 * 1000

export type ListenSessionTrack = { id: string; name: string; singer: string }
export type ListenSession = { id: string; startedAt: number; tracks: ListenSessionTrack[] }

type Buf = ListenSessionTrack & { at: number }

let buffer: Buf[] = []
let sessionEpoch: number | null = null
let idleTimer: number | null = null

function readSessions(): ListenSession[] {
  try {
    const raw = localStorage.getItem(LISTEN_SESSION_STORAGE_KEY)
    const v = raw ? JSON.parse(raw) : []
    return Array.isArray(v) ? v : []
  } catch {
    return []
  }
}

function writeSessions(sessions: ListenSession[]) {
  localStorage.setItem(LISTEN_SESSION_STORAGE_KEY, JSON.stringify(sessions.slice(-MAX_SESSIONS)))
}

function flush() {
  if (idleTimer) {
    window.clearTimeout(idleTimer)
    idleTimer = null
  }
  if (buffer.length < 2) {
    buffer = []
    sessionEpoch = null
    return
  }
  const started = sessionEpoch ?? Date.now()
  const id = `Session_${new Date(started).toISOString().slice(0, 16).replace('T', '_').replace(/:/g, '-')}`
  const sessions = readSessions()
  sessions.push({
    id,
    startedAt: started,
    tracks: buffer.map(({ id, name, singer }) => ({ id, name, singer })),
  })
  writeSessions(sessions)
  buffer = []
  sessionEpoch = null
}

function bumpIdle() {
  if (idleTimer) window.clearTimeout(idleTimer)
  idleTimer = window.setTimeout(flush, IDLE_MS)
}

export function initListenSessionRecorder() {
  watch(() => playMusicInfo.musicInfo?.id, (id, prev) => {
    if (!id || !playMusicInfo.musicInfo) return
    if (id === prev) return
    const m = playMusicInfo.musicInfo
    const last = buffer[buffer.length - 1]
    if (last?.id === id) return
    if (sessionEpoch == null) sessionEpoch = Date.now()
    const info = m as LX.Music.MusicInfo
    buffer.push({
      id,
      name: info.name,
      singer: info.singer ?? '',
      at: Date.now(),
    })
    if (buffer.length >= MAX_TRACKS) flush()
    else bumpIdle()
  })

  watch(isPlay, playing => {
    if (!playing) bumpIdle()
    else bumpIdle()
  })

  window.addEventListener('beforeunload', () => {
    if (buffer.length >= 2) flush()
  })
}

export function getListenSessions(): ListenSession[] {
  return readSessions()
}

export function clearListenSessions() {
  localStorage.removeItem(LISTEN_SESSION_STORAGE_KEY)
}

export function exportListenSessionsJson(): string {
  return JSON.stringify(readSessions(), null, 2)
}

export type ListenStats = {
  totalSessions: number
  totalTracks: number
  topArtists: { name: string; count: number }[]
  topSongs: { name: string; singer: string; count: number }[]
  firstSessionDate: string | null
  lastSessionDate: string | null
}

export function computeListenStats(): ListenStats {
  const sessions = readSessions()
  if (!sessions.length) {
    return {
      totalSessions: 0,
      totalTracks: 0,
      topArtists: [],
      topSongs: [],
      firstSessionDate: null,
      lastSessionDate: null,
    }
  }

  const artistCount = new Map<string, number>()
  const songCount = new Map<string, number>()
  const songMap = new Map<string, { name: string; singer: string }>()

  for (const s of sessions) {
    for (const t of s.tracks) {
      const artistKey = t.singer || 'Unknown'
      artistCount.set(artistKey, (artistCount.get(artistKey) || 0) + 1)

      const songKey = `${t.name}||${t.singer}`
      songCount.set(songKey, (songCount.get(songKey) || 0) + 1)
      songMap.set(songKey, { name: t.name, singer: t.singer })
    }
  }

  const topArtists = [...artistCount.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([name, count]) => ({ name, count }))

  const topSongs = [...songCount.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([key, count]) => {
      const info = songMap.get(key)!
      return { name: info.name, singer: info.singer, count }
    })

  const timestamps = sessions.map(s => s.startedAt).sort()
  const firstSessionDate = new Date(timestamps[0]).toLocaleDateString()
  const lastSessionDate = new Date(timestamps[timestamps.length - 1]).toLocaleDateString()

  return {
    totalSessions: sessions.length,
    totalTracks: sessions.reduce((sum, s) => sum + s.tracks.length, 0),
    topArtists,
    topSongs,
    firstSessionDate,
    lastSessionDate,
  }
}
