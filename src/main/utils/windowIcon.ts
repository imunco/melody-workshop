import path from 'node:path'
import { existsSync } from 'node:fs'
import { isLinux, isWin } from '@common/utils'

/** Windows / Linux 任务栏与窗口角标；macOS 使用打包的 .icns */
export function getBrowserWindowIconPath(): string | undefined {
  if (!isWin && !isLinux) return undefined
  const file = isWin ? 'window-icon.ico' : 'window-icon.png'
  const p = path.join(global.staticPath, 'images', 'app', file)
  return existsSync(p) ? p : undefined
}
