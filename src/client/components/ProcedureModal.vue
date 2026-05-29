<script setup lang="ts">
import { Procedure } from '../../models/procedure.js';

const props = defineProps<{
  procedure: Procedure;
}>();

const emit = defineEmits<{
  close: [];
}>();

const close = () => {
  emit('close');
};
</script>

<template>
  <div
    class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm"
    @click.self="close"
  >
    <div class="bg-white rounded-2xl shadow-2xl w-[500px] max-h-[80vh] overflow-y-auto">
      <!-- Header с градиентом -->
      <div class="relative bg-gradient-to-r from-[#E5A663] to-[#f4c58d] p-6 rounded-t-2xl">
        <div class="flex justify-between items-start">
          <h2 class="text-2xl font-black text-white pr-8">
            {{ procedure.name }}
          </h2>
          <button 
            @click="close" 
            class="absolute top-4 right-4 w-10 h-10 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-full text-white font-bold text-xl transition-all duration-300 hover:rotate-90"
          >
            ×
          </button>
        </div>
      </div>

      <!-- Контент -->
      <div class="p-6 space-y-5">
        <!-- Описание -->
        <div class="bg-gray-50 rounded-xl p-4 border border-gray-100">
          <p class="text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
            <span class="text-[#E5A663]">✦</span> Описание
          </p>
          <p class="text-gray-700 leading-relaxed">
            {{ procedure.description || 'Нет описания' }}
          </p>
        </div>

        <!-- Карточка с деталями -->
        <div class="grid grid-cols-2 gap-4">
          <div class="bg-gradient-to-br from-[#E5A663]/10 to-transparent rounded-xl p-4 border border-[#E5A663]/20">
            <p class="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Цена</p>
            <p class="text-2xl font-black bg-gradient-to-r from-[#E5A663] to-[#f4c58d] bg-clip-text text-transparent">
              {{ procedure.price }}
            </p>
            <p class="text-sm text-gray-600 mt-1">BYN</p>
          </div>

          <div class="bg-gradient-to-br from-[#E5A663]/10 to-transparent rounded-xl p-4 border border-[#E5A663]/20">
            <p class="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Длительность</p>
            <p class="text-2xl font-bold text-gray-900">
              {{ procedure.duration }}
            </p>
            <p class="text-sm text-gray-600 mt-1">часов</p>
          </div>
        </div>

        <!-- Косметолог -->
        <div class="flex items-center gap-3 bg-gradient-to-r from-gray-50 to-white rounded-xl p-4 border border-gray-100">
          <div class="w-12 h-12 bg-gradient-to-br from-[#E5A663] to-[#f4c58d] rounded-full flex items-center justify-center text-white font-bold text-lg">
            {{ procedure.cosmetologist?.user.username?.[0]?.toUpperCase() || '✦' }}
          </div>
          <div>
            <p class="text-xs font-bold text-gray-500 uppercase tracking-wide">Косметолог</p>
            <p class="text-gray-900 font-semibold">
              {{ procedure.cosmetologist?.user.username || 'Не указан' }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.backdrop-blur-sm {
  backdrop-filter: blur(4px);
}
</style>