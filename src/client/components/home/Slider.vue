<template>
  <div class="w-600 max-w-xl mt-15">
    <VueperSlides
      ref="slider"
      :autoplay="true"
      :delay="4000"
      :speed="1000"
      :visible-slides="1"
      centering="center"
      fixed-height="600px"
      :bullets="true"
      :gap="0"
      class="carousel no-shadow"
    >
      <VueperSlide v-for="item in slides" :key="item.id">
        <template #content>
          <div
            class="h-full flex flex-col justify-center items-center p-6 space-y-6"
          >
            <div class="w-full rounded-3xl overflow-hidden">
              <img
                :src="item.image"
                :alt="item.name"
                class="hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </template>
      </VueperSlide>
    </VueperSlides>
  </div>
</template>

<script>
  import { VueperSlides, VueperSlide } from 'vueperslides';

  const slides = ref([
    { id: 1, name: 'CONTOUR LIFT', image: '/images/banner-1.jpg' },
    { id: 2, name: 'HYDRA ACTIVE', image: '/images/banner-2.jpg' },
    { id: 3, name: 'SNOW WHITE', image: '/images/banner-3.jpg' },
    { id: 4, name: 'Ламинирование ресниц', image: '/images/banner-4.jpg' },
    { id: 5, name: 'Акция: Массаж лица', image: '/images/banner-5.jpg' },
  ]);
</script>
