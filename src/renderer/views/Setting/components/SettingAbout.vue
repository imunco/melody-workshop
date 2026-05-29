<template lang="pug">
dt#about {{ $t('setting__about') }}
dd
  .p.small
    strong {{ brand.displayName }}
    | &nbsp;由&nbsp;
    strong {{ brand.studio }}
    | &nbsp;维护发行。界面与图标已按本发行版统一设计。
  .p.small {{ $t('setting__melody_identity_br') }}
  .p.small
    strong 反馈与联系：
    br
    | Bug 报告或功能建议请提交&nbsp;
    span.hover.underline(:aria-label="$t('setting__click_open')" @click="openUrl('https://github.com/imunco/melody-workshop/issues')") GitHub Issue →
    br
    | 加入 QQ 群交流：&nbsp;
    span.hover.underline(:aria-label="$t('setting__click_open')" @click="openUrl('https://qm.qq.com/q/ainGgIul8I')") https://qm.qq.com/q/ainGgIul8I
  br
  .p.small
    strong 源项目说明：
    | 本软件基于开源项目&nbsp;
    strong {{ brand.upstreamDisplayName }}
    | &nbsp;（桌面版）衍生而来，遵循其&nbsp;
    span.hover.underline(:aria-label="$t('setting__click_open')" @click="openUrl('http://www.apache.org/licenses/LICENSE-2.0')") Apache-2.0
    | &nbsp;许可。上游源代码与文档：
    span.hover.underline(:aria-label="$t('setting__click_open')" @click="openUrl(brand.upstreamRepoReadmeUrl)") {{ brand.upstreamRepoReadmeUrl }}
  .p.small
    | 上游发布与问题反馈（原版项目）：
    span.hover.underline(:aria-label="$t('setting__click_open')" @click="openUrl(brand.upstreamReleasesUrl)") GitHub Releases
    | &nbsp;·&nbsp;
    span.hover.underline(:aria-label="$t('setting__click_open')" @click="openUrl(brand.upstreamIssuesUrl)") Issues
  .p.small
    | 使用问题可参考上游整理的常见问题：
    span.hover.underline(:aria-label="$t('setting__click_open')" @click="openUrl('https://lyswhut.github.io/lx-music-doc/desktop/faq')") 桌面版常见问题
  .p.small
    strong 本发行版没有客服
    | ，使用问题请先阅读上述文档与源项目 Issue 区说明。
  br
  .p.small 本软件仅供学习与技术研究，请遵守当地法律法规；音乐请支持正版。
  .p.small
    | 你已签署本软件的
    base-btn(min @click="handleShowPact") 许可协议
    | ，协议的在线版本在
    span.hover.underline(:aria-label="$t('setting__click_open')" @click="openUrl(brand.upstreamLicenseAnchorUrl)") 源项目协议说明
    | 。
  br

  h3#melody_listen {{ $t('melody_sessions_title') }}
  .p.small {{ $t('melody_sessions_desc') }}
  .p.small(v-if="!sessions.length") {{ $t('melody_sessions_empty') }}
  ul(v-else :class="$style.sessionList")
    li(v-for="s in sessions" :key="s.id" :class="$style.sessionItem")
      div(:class="$style.sessionId") {{ s.id }}
      div(:class="$style.sessionMeta") {{ s.tracks.length }} {{ $t('melody_sessions_tracks') }} · {{ formatTime(s.startedAt) }}
  .p.gap-top
    base-btn.btn(min @click="handleExportSessions") {{ $t('melody_sessions_export') }}
    base-btn.btn(min @click="handleClearSessions") {{ $t('melody_sessions_clear') }}

  h3#melody_stats {{ $t('melody_stats_title') }}
  .p.small(v-if="!stats")
    em {{ $t('melody_stats_no_data') }}
  .p(v-else :class="$style.statsWrap")
    .p.small
      span(:class="$style.statTag") {{ $t('melody_stats_total_sessions') }}: {{ stats.totalSessions }}
      span(:class="$style.statTag") {{ $t('melody_stats_total_tracks') }}: {{ stats.totalTracks }}
    .p.small(v-if="stats.firstSessionDate") {{ $t('melody_stats_period') }}: {{ stats.firstSessionDate }} – {{ stats.lastSessionDate }}
    .p.small(v-if="stats.topArtists.length")
      strong {{ $t('melody_stats_top_artists') }}:
      span(v-for="a in stats.topArtists" :key="a.name" :class="$style.statItem") {{ a.name }} ({{ a.count }})
    .p.small(v-if="stats.topSongs.length")
      strong {{ $t('melody_stats_top_songs') }}:
      span(v-for="s in stats.topSongs" :key="`${s.name}${s.singer}`" :class="$style.statItem") {{ s.name }} – {{ s.singer }} ({{ s.count }})

  .p.small.gap-top
    | By:&nbsp;
    strong {{ brand.studio }}
</template>

<script>
import { ref, onMounted } from '@common/utils/vueTools'
import { APP_BRAND } from '@common/constants'
import { isShowPact } from '@renderer/store'
import { openUrl, clipboardWriteText } from '@common/utils/electron'
import { dialog } from '@renderer/plugins/Dialog'
import { useI18n } from '@renderer/plugins/i18n'
import { clearListenSessions, exportListenSessionsJson, getListenSessions, computeListenStats } from '@renderer/core/listenSession'

export default {
  name: 'SettingAbout',
  setup() {
    const t = useI18n()
    const brand = APP_BRAND
    const sessions = ref([])
    const stats = ref(null)

    const loadSessions = () => {
      sessions.value = [...getListenSessions()].reverse()
    }

    const loadStats = () => {
      stats.value = computeListenStats()
    }

    onMounted(() => {
      loadSessions()
      loadStats()
    })

    const formatTime = (ts) => {
      try {
        return new Date(ts).toLocaleString()
      } catch {
        return String(ts)
      }
    }

    const handleShowPact = () => {
      isShowPact.value = true
    }

    const handleExportSessions = () => {
      const json = exportListenSessionsJson()
      clipboardWriteText(json)
      dialog({
        message: t('melody_sessions_export_ok'),
        confirmButtonText: t('alert_button_text'),
      }).catch(() => {})
    }

    const handleClearSessions = async() => {
      const ok = await dialog.confirm({
        message: t('melody_sessions_clear_confirm'),
        cancelButtonText: t('cancel_button_text'),
        confirmButtonText: t('confirm_button_text'),
      })
      if (!ok) return
      clearListenSessions()
      loadSessions()
      loadStats()
    }

    return {
      brand,
      sessions,
      stats,
      formatTime,
      openUrl,
      clipboardWriteText,
      handleShowPact,
      handleExportSessions,
      handleClearSessions,
    }
  },
}
</script>

<style lang="less" module>
.sessionList {
  list-style: none;
  padding: 0;
  margin: 8px 0 0;
  max-height: 220px;
  overflow: auto;
}
.sessionItem {
  padding: 8px 0;
  border-bottom: 1px solid var(--color-border-line);
  font-size: 13px;
}
.sessionId {
  color: var(--color-font);
  word-break: break-all;
}
.sessionMeta {
  margin-top: 4px;
  color: var(--color-font-label);
  font-size: 12px;
}
.gap-top {
  margin-top: 10px;
}
.statsWrap {
  font-size: 13px;
  line-height: 1.7;
}
.statTag {
  display: inline-block;
  margin-right: 16px;
  padding: 2px 8px;
  border-radius: 4px;
  background: var(--color-button-bg);
  font-weight: 600;
}
.statItem {
  display: inline-block;
  margin-right: 10px;
  white-space: nowrap;
}
</style>
