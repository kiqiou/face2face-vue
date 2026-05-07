<script setup lang="ts">
  import { useRoute, useRouter } from 'vue-router';

  const route = useRoute();
  const router = useRouter();

  const id = route.params.id;

  const close = () => {
    router.push('/procedures');
  };
</script>

<template>
  <div
    class="fixed inset-0 bg-black/50 flex items-center justify-center"
    @click.self="close"
  >
    <div class="bg-white p-6 rounded-xl w-1/2 h-1/2">
      <h2>Процедура {{ id }}</h2>

      <button @click="close">Закрыть</button>
    </div>
  </div>
</template>
