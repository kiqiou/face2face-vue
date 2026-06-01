<template>
  <div class="w-full flex flex-col gap-1">
    <input
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      @focus="$emit('focus', $event)"
      @keydown="$emit('keydown', $event)"
      :placeholder="placeholder"
      :maxlength="maxlength"
      class="h-12 w-full px-6 rounded-[30px] border-2 border-[#EAD6BD] bg-white text-[#5D4037] placeholder-[#C89B6A]/50 outline-none transition-all duration-300 hover:border-[#E5A663] focus:border-[#E5A663] focus:shadow-sm"
    />
  </div>
</template>

<script setup>
  defineProps({
    modelValue: String,
    placeholder: String,
    maxlength: [String, Number],
  });

  defineEmits(['update:modelValue', 'focus', 'keydown']);
</script>
