<template>
  <button
    type="button"
    @click="$emit('click')"
    class="h-12 w-full rounded-[30px] bg-gradient-to-br from-[#E5A663] to-[#FAEE9E] px-4 text-[16px] font-bold text-black/60 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl active:scale-95 sm:h-10 sm:px-6 sm:text-[17px]"
  >
    {{ buttonName }}
  </button>
</template>

<script setup>
defineProps({
  buttonName: {
    type: String,
    default: 'Кнопка',
  },
});

defineEmits(['click']);
</script>