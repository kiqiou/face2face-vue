<template>
  <button
    @click="$emit('click')"
    class="h-12 w-full rounded-[30px] text-black/60 text-[17px] font-bold transition-all duration-200 active:scale-95 bg-gradient-to-br from-[#E5A663] to-[#FAEE9E] shadow-sm duration-300 hover:shadow-xl hover:-translate-y-0.5"
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
