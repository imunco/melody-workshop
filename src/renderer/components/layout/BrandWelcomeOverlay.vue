<template>
  <transition name="animated-fast" appear>
    <div
      v-if="visible"
      :class="$style.wrap"
      role="dialog"
      aria-modal="true"
      :aria-label="ariaLabel"
      @click.self="dismiss"
    >
      <div :class="$style.card" @click.stop>
        <melody-empty-art :size="88" />
        <h2 :class="$style.titleZh">{{ brand.displayName }}</h2>
        <p :class="$style.titleEn">{{ brand.displayNameEn }}</p>
        <p :class="$style.studio">奇点未码·Uncode Studio</p>
        <p :class="$style.tip">{{ $t('melody_brand_welcome_tip') }}</p>
        <div :class="$style.actions">
          <base-btn min @click="goAbout">{{ $t('melody_brand_welcome_about') }}</base-btn>
          <base-btn min @click="dismiss">{{ $t('melody_brand_welcome_close') }}</base-btn>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { computed, onMounted, onBeforeUnmount, ref, watch } from '@common/utils/vueTools'
import { useRouter } from '@common/utils/vueRouter'
import { appSetting } from '@renderer/store/setting'
import { APP_BRAND, BRAND_WELCOME_STORAGE_KEY } from '@common/constants'
import MelodyEmptyArt from '@renderer/components/common/MelodyEmptyArt.vue'

const brand = APP_BRAND
const router = useRouter()
const ariaLabel = computed(() => `${brand.displayName} / ${brand.displayNameEn}`)

const innerShow = ref(false)
let timer = 0

const shouldOffer = () => localStorage.getItem(BRAND_WELCOME_STORAGE_KEY) !== '1' && appSetting['common.isAgreePact']

const visible = computed(() => innerShow.value && appSetting['common.isAgreePact'])

const dismiss = () => {
  innerShow.value = false
  localStorage.setItem(BRAND_WELCOME_STORAGE_KEY, '1')
  if (timer) {
    window.clearTimeout(timer)
    timer = 0
  }
}

const goAbout = () => {
  dismiss()
  void router.push({ path: '/setting', query: { name: 'SettingAbout' } })
}

const armTimer = () => {
  if (timer) window.clearTimeout(timer)
  if (!visible.value) return
  timer = window.setTimeout(dismiss, 3000)
}

watch(visible, (v) => {
  if (v) armTimer()
  else if (timer) {
    window.clearTimeout(timer)
    timer = 0
  }
})

watch(() => appSetting['common.isAgreePact'], (ok) => {
  if (ok && shouldOffer()) innerShow.value = true
})

onMounted(() => {
  if (shouldOffer()) innerShow.value = true
})

onBeforeUnmount(() => {
  if (timer) window.clearTimeout(timer)
})
</script>

<style lang="less" module>
.wrap {
  position: fixed;
  inset: 0;
  z-index: 200000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(155deg, rgba(30, 72, 74, 0.55) 0%, rgba(72, 40, 48, 0.45) 100%);
  backdrop-filter: blur(6px);
}

.card {
  width: min(360px, 88vw);
  padding: 28px 22px 22px;
  border-radius: 16px;
  text-align: center;
  background: rgba(255, 255, 255, 0.94);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.25);
  color: #2a4a4a;
}

.titleZh {
  margin: 4px 0 0;
  font-size: 22px;
  font-weight: 700;
  letter-spacing: 0.06em;
}

.titleEn {
  margin: 6px 0 0;
  font-size: 15px;
  color: #3d8a86;
  font-weight: 600;
}

.studio {
  margin: 10px 0 0;
  font-size: 13px;
  color: #c07060;
  font-weight: 600;
}

.tip {
  margin: 16px 0 0;
  font-size: 13px;
  line-height: 1.55;
  color: rgba(0, 0, 0, 0.62);
}

.actions {
  margin-top: 18px;
  display: flex;
  gap: 10px;
  justify-content: center;
  flex-wrap: wrap;
}
</style>
