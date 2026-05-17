<template>
  <div :class="[$style.toolbar, { [$style.fullscreen]: isFullscreen }, appSetting['common.controlBtnPosition'] == 'left' ? $style.controlBtnLeft : $style.controlBtnRight]">
    <SearchInput />
    <div v-if="appSetting['common.controlBtnPosition'] == 'left'" :class="$style.logo">
      <span :class="$style.logoLine1">旋律</span><span :class="$style.logoLine2">工坊</span>
    </div>
    <ControlBtns v-else />
  </div>
</template>

<script setup>
import { isFullscreen } from '@renderer/store'
import { appSetting } from '@renderer/store/setting'
import ControlBtns from './ControlBtns.vue'
import SearchInput from './SearchInput.vue'

</script>


<style lang="less" module>
@import '@renderer/assets/styles/layout.less';

.toolbar {
  display: flex;
  height: @height-toolbar;
  align-items: center;
  justify-content: space-between;
  padding-left: 15px;
  -webkit-app-region: drag;
  z-index: 2;

  &.fullscreen {
    -webkit-app-region: no-drag;
    .logo {
      display: none;
    }
  }

  &.controlBtnLeft {
    .control {
      display: none;
    }
  }
  &.controlBtnRight {
    justify-content: space-between;
  }
}

.logo {
  box-sizing: border-box;
  padding: 0 @height-toolbar * .25;
  height: @height-toolbar;
  color: var(--color-primary);
  flex: none;
  text-align: center;
  font-weight: bold;
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  justify-content: center;
  line-height: 1.05;
  font-size: 12px;
  // -webkit-app-region: no-drag;
}

.logoLine1,
.logoLine2 {
  display: block;
}

</style>
