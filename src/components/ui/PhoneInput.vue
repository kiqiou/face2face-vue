<template>
  <TextField
    ref="inputRef"
    :modelValue="modelValue"
    @update:modelValue="onInput"
    @focus="onFocus"
    @keydown="onKeyDown"
    maxlength="13"
    placeholder="Введите номер телефона"
  />
</template>

<script setup>
  import { ref, nextTick } from 'vue';
  import TextField from './TextField.vue';

  const PREFIX = '+375';

  const props = defineProps({
    modelValue: {
      type: String,
      default: '',
    },
  });

  const emit = defineEmits(['update:modelValue']);

  const inputRef = ref(null);

  const onFocus = async () => {
    if (!props.modelValue) {
      emit('update:modelValue', PREFIX);

      await nextTick();

      const input =
        inputRef.value?.$el?.querySelector('input') || inputRef.value;

      input?.setSelectionRange(PREFIX.length, PREFIX.length);
    }
  };

  const onInput = (value) => {
    let numbers = value.replace(/\D/g, '');

    if (numbers.startsWith('375')) {
      numbers = numbers.slice(3);
    }

    numbers = numbers.slice(0, 9);

    emit('update:modelValue', PREFIX + numbers);
  };

  const onKeyDown = (event) => {
    const start = event.target.selectionStart;

    if (
      (event.key === 'Backspace' && start <= PREFIX.length) ||
      (event.key === 'Delete' && start < PREFIX.length)
    ) {
      event.preventDefault();
    }
  };
</script>
