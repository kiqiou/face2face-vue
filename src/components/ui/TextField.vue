<template>
  <div class="w-full flex flex-col gap-1">
    <input
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      :placeholder="placeholder"
      class="h-12 w-full px-6 rounded-[30px] border-2 border-[#EAD6BD] bg-white text-[#5D4037] placeholder-[#C89B6A]/50 outline-none transition-all duration-300 hover:border-[#E5A663] focus:border-[#E5A663] focus:shadow-[0_0_15px_rgba(229,166,99,0.3)]"
    />
  </div>
</template>

<script setup>
  defineProps({
    modelValue: String,
    placeholder: {
      type: String,
      default: 'Введите текст...',
    },
  });

  defineEmits(['update:modelValue']);
</script>
