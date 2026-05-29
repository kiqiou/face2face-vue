<template>
  <div
    class="group bg-white rounded-2xl p-5 shadow-sm hover:shadow-xl transition-all duration-300 border border-transparent hover:border-[#E5A663]/30"
  >
    <div class="flex justify-between items-center">
      <div>
        <p
          class="text-lg font-semibold text-black/80"
        >
          {{ procedure.name }}
        </p>
        <p
          class="text-sm font-semibold text-black/80"
        >
          Длительность: {{  procedure.duration }} ч.
        </p>
      </div>

      <div class="flex flex-col gap-2">
        <div class="flex items-center flex-row gap-1">
        <span
          class="text-2xl font-black bg-[#E5A663] bg-clip-text text-transparent"
        >
          {{ procedure.price }}
        </span>
        <span class="text-sm text-black/80">BYN</span>
      </div>
          <p
            class="text-sm font-semibold text-black/80 hover:text-[#E5A663] transition cursor-pointer"
            @click="$emit('open-details', procedure)"
          >
            Подробнее
          </p>
      </div>
      
    </div>

    <div
      class="w-full h-px bg-gradient-to-r from-transparent via-[#E5A663]/40 to-transparent my-3"
    ></div>

    <GradientButton
      v-if="showButton"
      button-name="Добавить услугу"
      @click="$emit('click', procedure)"
    />
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  import GradientButton from '../../components/ui/GradientButton.vue';
  import { Cosmetologist } from '../../models/cosmetologist.js';
  import { Procedure } from '../../models/procedure.js';

  const props = withDefaults(
    defineProps<{
      procedure: Procedure;
      showButton?: boolean;
    }>(),
    {
      showButton: true,
    }
  );

  const emit = defineEmits<{
    (e: 'click', procedure: any): void;
    (e: 'open-details', procedure: any): void;
  }>();
</script>
