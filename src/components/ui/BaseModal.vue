<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
    @click.self="$emit('close')"
  >
    <div class="w-[90%] max-w-md rounded-2xl bg-white p-6 shadow-2xl">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
  defineEmits(['close']);
</script>
