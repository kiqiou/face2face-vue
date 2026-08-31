<template>
  <div class="flex flex-col w-full max-w-6xl mx-auto gap-8 ">
    <h2
      class="text-4xl self-center md:text-5xl tracking-[0.01em] font-bold mb-6 bg-[#E5A663] bg-clip-text text-transparent"
    >
      Наши мастера
    </h2>
    <div class="grid md:grid-cols-2 gap-8">
      <div
        v-if="cosmetologists.length"
        v-for="cosmetologist in cosmetologists"
        class="flex flex-col gap-6 justify-between bg-white/60 backdrop-blur-sm rounded-3xl p-8 border border-[#E5A663]/20 hover:shadow-2xl transition-all duration-300"
      >
        <div class="flex flex-row gap-10">
          <div
            class="flex-shrink-0 w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden bg-gradient-to-br from-[#E5A663]/20 to-[#FAEE9E]/20"
          >
            <img
              :src="cosmetologist.avatarUrl"
              alt="Фото косметолога"
              class="w-full h-full object-cover"
            />
          </div>
          <div class="flex flex-col">
            <div class="text-2xl font-semibold font-black text-slate-800 mb-2">
              {{ cosmetologist.user.username }}
            </div>
            <div class="text-xl text-[#E5A663] mb-6">
              {{ cosmetologist.specialization }}
            </div>
          </div>
        </div>
        <div class="text-lg text-slate-700 leading-relaxed">
          {{ cosmetologist.bio }}
        </div>
        <GradientButton
          button-name="Услуги"
          @click="openCosmetologistProcedures(cosmetologist.id)"
        ></GradientButton>
      </div>
      <div v-else class="flex self-center text-2xl text-black/70 min-h-screen">
        Загрузка косметологов...
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { onMounted } from 'vue';
  import GradientButton from '../../components/ui/GradientButton.vue';
  import { useRouter } from 'vue-router';
  import { useCosmetologists } from '../../composables/user/useCosmetologists.js';

  const { cosmetologists, loadCosmetologists } = useCosmetologists();

  onMounted(() => {
    loadCosmetologists();
  });

  const router = useRouter();

  const openCosmetologistProcedures = (id: number) => {
    router.push(`/cosmetologist/${id}/procedures`);
  };
</script>
