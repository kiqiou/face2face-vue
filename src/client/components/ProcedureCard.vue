<template>
  <div
    class="group bg-white rounded-2xl p-5 shadow-sm hover:shadow-xl transition-all duration-300 border border-transparent hover:border-[#E5A663]/30"
  >
    <div class="flex justify-between items-center">
      <div>
        <p
          class="text-lg font-semibold text-black/80 group-hover:text-[#E5A663] transition"
        >
          {{ resolvedName }}
        </p>
        <p
          class="text-sm font-semibold text-black/80 group-hover:text-[#E5A663] transition"
        >
          {{ resolvedDuration }} ч.
        </p>
      </div>

      <div class="flex items-center gap-1">
        <span
          class="text-2xl font-black bg-[#E5A663] bg-clip-text text-transparent"
        >
          {{ resolvedPrice }}
        </span>
        <span class="text-sm text-black/80">BYN</span>
      </div>
    </div>

    <div
      class="w-full h-px bg-gradient-to-r from-transparent via-[#E5A663]/40 to-transparent my-3"
    ></div>

    <GradientButton
      v-if="showButton"
      button-name="Записаться"
      @click="$emit('click', procedure)"
    />
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  import GradientButton from '../../components/ui/GradientButton.vue';

  const props = withDefaults(
    defineProps<{
      procedure?: any;
      name?: string;
      duration?: string;
      price?: string | number;
      showButton?: boolean;
    }>(),
    {
      showButton: true,
    }
  );

  const emit = defineEmits<{
    (e: 'click', procedure: any): void;
  }>();

  const resolvedName = computed(
    () => props.procedure?.name || props.name || 'Без названия'
  );
  const resolvedDuration = computed(
    () => props.procedure?.duration || props.duration || '0'
  );
  const resolvedPrice = computed(
    () => props.procedure?.price || props.price || '0'
  );
</script>
