/**
 * 从 resources/icons/2.png 生成：
 * - electron-builder：icon.ico / icon.icns / icon.png / 16~512 Linux PNG
 * - 托盘：src/static/images/tray/*
 * - 窗口角标（Win/Linux）：src/static/images/app/window-icon.ico、window-icon.png
 * - Windows 任务栏缩略图按钮：src/static/images/taskbar/*.png（青绿 + 珊瑚渐变品牌系）
 *
 * 依赖：sharp、png2icons（devDependencies）
 */
const fs = require('fs')
const path = require('path')

const root = path.join(__dirname, '..')
const src = path.join(root, 'resources/icons/2.png')
const outDir = path.join(root, 'resources/icons')
const staticTray = path.join(root, 'src/static/images/tray')
const staticApp = path.join(root, 'src/static/images/app')
const staticTaskbar = path.join(root, 'src/static/images/taskbar')

/** 与主图标协调的任务栏按钮色 */
const TB = {
  teal: '#47B8B4',
  tealDeep: '#3A9A96',
  coral: '#E59885',
}

const resizeOpts = { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }

function ensureDir(p) {
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true })
}

function writeIco(png2icons, pngBuffer, icoPath) {
  fs.writeFileSync(icoPath, png2icons.createICO(pngBuffer, png2icons.BILINEAR, 0, false, true))
}

/** 基于 SVG 生成 48×48 任务栏按钮（Windows ThumbarButton） */
async function writeTaskbarIcons(sharp) {
  const heart = 'M12,21.35l-1.45-1.32C5.4,15.36,2,12.28,2,8.5 2,5.42 4.42,3 7.5,3c1.74,0 3.41,0.81 4.5,2.09C13.09,3.81 14.76,3 16.5,3 19.58,3 22,5.42 22,8.5c0,3.78-3.4,6.86-8.55,11.54L12,21.35z'
  const hg = `<g transform="translate(12,10) scale(1.08)">`
  const heartOutline = `${hg}<path d="${heart}" fill="none" stroke="${TB.teal}" stroke-width="1.55" stroke-linejoin="round"/></g>`
  const heartFilled = `${hg}<path d="${heart}" fill="url(#mwHeart)"/></g>`

  const svgs = {
    play: `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
      <path d="M14 11 L38 24 L14 37 Z" fill="${TB.teal}" stroke="${TB.tealDeep}" stroke-width="1" stroke-linejoin="round"/>
    </svg>`,
    pause: `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
      <rect x="13" y="11" width="7" height="26" rx="3" fill="${TB.teal}"/>
      <rect x="28" y="11" width="7" height="26" rx="3" fill="${TB.teal}"/>
    </svg>`,
    prev: `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
      <rect x="7" y="12" width="4" height="24" rx="2" fill="${TB.teal}"/>
      <path d="M17 12 L17 36 L36 24 Z" fill="${TB.teal}" stroke="${TB.tealDeep}" stroke-width="0.8" stroke-linejoin="round"/>
    </svg>`,
    next: `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
      <path d="M12 24 L31 12 L31 36 Z" fill="${TB.teal}" stroke="${TB.tealDeep}" stroke-width="0.8" stroke-linejoin="round"/>
      <rect x="37" y="12" width="4" height="24" rx="2" fill="${TB.teal}"/>
    </svg>`,
    collect: `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">${heartOutline}</svg>`,
    collected: `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
      <defs>
        <linearGradient id="mwHeart" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${TB.tealDeep}"/>
          <stop offset="100%" stop-color="${TB.coral}"/>
        </linearGradient>
      </defs>
      ${heartFilled}
    </svg>`,
  }

  for (const [key, xml] of Object.entries(svgs)) {
    await sharp(Buffer.from(xml, 'utf8'))
      .resize(48, 48)
      .png()
      .toFile(path.join(staticTaskbar, `${key}.png`))
  }
}

async function main() {
  if (!fs.existsSync(src)) {
    console.error('缺少源图:', src)
    process.exit(1)
  }
  const sharp = require('sharp')
  const png2icons = require('png2icons')

  ensureDir(staticApp)

  const sizes = [16, 32, 48, 64, 128, 256, 512]
  for (const s of sizes) {
    await sharp(src)
      .resize(s, s, resizeOpts)
      .png()
      .toFile(path.join(outDir, `${s}x${s}.png`))
  }

  await sharp(src)
    .resize(512, 512, resizeOpts)
    .png()
    .toFile(path.join(outDir, 'icon.png'))

  const buf1024 = await sharp(src)
    .resize(1024, 1024, resizeOpts)
    .png()
    .toBuffer()

  writeIco(png2icons, buf1024, path.join(outDir, 'icon.ico'))
  fs.writeFileSync(
    path.join(outDir, 'icon.icns'),
    png2icons.createICNS(buf1024, png2icons.BILINEAR, 0),
  )

  const trayDefs = [
    ['tray_origin.png', 16, 'color'],
    ['tray_origin@2x.png', 32, 'color'],
    ['tray_black.png', 16, 'dark'],
    ['tray_black@1.25x.png', 20, 'dark'],
    ['tray_black@1.5x.png', 24, 'dark'],
    ['tray_black@2x.png', 32, 'dark'],
    ['trayTemplate.png', 16, 'template'],
    ['trayTemplate@1.25x.png', 20, 'template'],
    ['trayTemplate@1.5x.png', 24, 'template'],
    ['trayTemplate@2x.png', 32, 'template'],
  ]

  for (const [name, s, kind] of trayDefs) {
    let pipeline = sharp(src).resize(s, s, resizeOpts)
    if (kind === 'dark') pipeline = pipeline.modulate({ brightness: 0.82, saturation: 0.75 })
    if (kind === 'template') pipeline = pipeline.greyscale().normalize()
    await pipeline.png().toFile(path.join(staticTray, name))
  }

  const bufOrigin32 = await sharp(src).resize(32, 32, resizeOpts).png().toBuffer()
  const bufOrigin64 = await sharp(src).resize(64, 64, resizeOpts).png().toBuffer()
  writeIco(png2icons, bufOrigin32, path.join(staticTray, 'tray_origin.ico'))
  writeIco(png2icons, bufOrigin64, path.join(staticTray, 'tray_origin@2x.ico'))

  const bufDark32 = await sharp(src).resize(32, 32, resizeOpts).modulate({ brightness: 0.82, saturation: 0.75 }).png().toBuffer()
  const bufDark64 = await sharp(src).resize(64, 64, resizeOpts).modulate({ brightness: 0.82, saturation: 0.75 }).png().toBuffer()
  writeIco(png2icons, bufDark32, path.join(staticTray, 'tray_black.ico'))
  writeIco(png2icons, bufDark64, path.join(staticTray, 'tray_black@2x.ico'))

  const bufTpl32 = await sharp(src).resize(32, 32, resizeOpts).greyscale().normalize().png().toBuffer()
  const bufTpl64 = await sharp(src).resize(64, 64, resizeOpts).greyscale().normalize().png().toBuffer()
  writeIco(png2icons, bufTpl32, path.join(staticTray, 'trayTemplate.ico'))
  writeIco(png2icons, bufTpl64, path.join(staticTray, 'trayTemplate@2x.ico'))

  await sharp(src)
    .resize(256, 256, resizeOpts)
    .png()
    .toFile(path.join(staticApp, 'window-icon.png'))
  const bufWin256 = await sharp(src).resize(256, 256, resizeOpts).png().toBuffer()
  writeIco(png2icons, bufWin256, path.join(staticApp, 'window-icon.ico'))

  await writeTaskbarIcons(sharp)

  console.log('已更新：resources/icons、tray、app、taskbar')
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
