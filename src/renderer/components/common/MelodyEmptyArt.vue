<template>
  <svg
    class="melody-empty-art"
    :width="size"
    :height="size"
    viewBox="0 0 120 120"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="mwEmptyG" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#47b8b4" />
        <stop offset="100%" stop-color="#e59885" />
      </linearGradient>
    </defs>
    <circle cx="60" cy="60" r="52" fill="none" stroke="url(#mwEmptyG)" stroke-width="2" opacity="0.35" />
    <path
      fill="none"
      stroke="url(#mwEmptyG)"
      stroke-width="2.4"
      stroke-linecap="round"
      stroke-linejoin="round"
      opacity="0.9"
      d="M38 78 L38 42 Q38 34 46 34 L54 34 Q62 34 62 42 L62 78 M62 50 Q78 38 88 52 Q82 68 62 62"
    />
    <path
      fill="none"
      stroke="#47b8b4"
      stroke-width="1.8"
      stroke-linecap="round"
      opacity="0.75"
      d="M44 88 Q60 96 76 88"
    />
  </svg>
</template>

<script setup>
defineProps({
  size: {
    type: [Number, String],
    default: 96,
  },
})
</script>

<style scoped>
.melody-empty-art {
  display: block;
  margin: 0 auto 10px;
  flex-shrink: 0;
}
</style>
