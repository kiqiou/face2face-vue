<template>
  <div class="w-full flex flex-col gap-1">
    <input
      ref="inputRef"
      :value="modelValue"
      @focus="onFocus"
      @input="onInput"
      @keydown="onKeyDown"
      maxlength="13"
      placeholder="Введите номер телефона"
      class="h-12 w-full px-6 rounded-[30px] border-2 border-[#EAD6BD] bg-white text-[#5D4037] placeholder-[#C89B6A]/50 outline-none transition-all duration-300 hover:border-[#E5A663] focus:border-[#E5A663] focus:shadow-[0_0_15px_rgba(229,166,99,0.3)]"
    />
  </div>
</template>


<script setup>
import { ref, nextTick } from "vue";

const PREFIX = "+375";
const MAX_LENGTH = 13; // +375XXXXXXXXX

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["update:modelValue"]);

const inputRef = ref(null);

const onFocus = async () => {
  if (!props.modelValue) {
    emit("update:modelValue", PREFIX);

    await nextTick();

    inputRef.value.setSelectionRange(
      PREFIX.length,
      PREFIX.length
    );
  }
};

const onInput = (event) => {
  // только цифры
  let numbers = event.target.value.replace(/\D/g, "");

  // удаляем 375 в начале
  if (numbers.startsWith("375")) {
    numbers = numbers.slice(3);
  }

  // максимум 9 цифр после +375
  numbers = numbers.slice(0, 9);

  // всегда восстанавливаем +
  const formatted = PREFIX + numbers;

  emit("update:modelValue", formatted);

  nextTick(() => {
    const pos = inputRef.value.selectionStart;

    // не даём поставить курсор внутрь +375
    if (pos < PREFIX.length) {
      inputRef.value.setSelectionRange(
        PREFIX.length,
        PREFIX.length
      );
    }
  });
};

const onKeyDown = (event) => {
  const start = event.target.selectionStart;

  // запрещаем удаление +375
  if (
    (event.key === "Backspace" && start <= PREFIX.length) ||
    (event.key === "Delete" && start < PREFIX.length)
  ) {
    event.preventDefault();
  }
};
</script>