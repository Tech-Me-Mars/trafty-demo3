<template>
    <div class="mt-4">
      <h2 class="text-lg font-bold text-gray-700">{{ $t('หมวดหมู่') }}</h2>
      <swiper
        class="mt-4"
        :slides-per-view="4"
        space-between="20"
        pagination
        @slideChange="onSlideChange"
        :breakpoints="{
          768: { slidesPerView: 5 },
          1024: { slidesPerView: 7 }
        }"
      >
        <!-- Loop through categories -->
        <swiper-slide
          v-for="category in resCategoryType"
          :key="category.id"
        >
          <div
            class="flex flex-col items-center text-center"
          >
            <!-- Category Image with Background -->
             
            <NuxtLink :to="`/client/category/${category.id}`"
              :style="{ backgroundColor: category.bg_color }"
              class="p-3 rounded-2xl shadow-md cursor-pointer transform transition-transform hover:scale-105"
            >
              <img
                :src="category.image"
                class="w-12 h-12"
                alt="Category Image"
              />
            </NuxtLink>
            <!-- Category Name -->
            <span class="mt-2 text-sm font-medium text-gray-800">
              {{ category.business_type_name }}
            </span>
          </div>
        </swiper-slide>
      </swiper>
  
      <!-- Progress Bar -->
      <div class="max-w-[3rem] mx-auto">
        <div class="relative w-full h-1.5 bg-gray-300 rounded-full mt-4">
          <div
            class="absolute top-0 left-0 h-1.5 bg-[#281c74] rounded-full transition-all"
            :style="{ width: `${progressPercentage}%` }"
          ></div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { Swiper, SwiperSlide } from "swiper/vue";
  import "swiper/css";
  import "swiper/css/navigation";
  import "swiper/css/pagination";
  import { useI18n } from "vue-i18n";
  import { ref, onMounted } from "vue";
  import * as dataApi from "../api/data.js";
  
  const currentSlideIndex = ref(0);
  const progressPercentage = ref(0);
  const resCategoryType = ref([]);
  
  function onSlideChange(swiper) {
    currentSlideIndex.value = swiper.activeIndex;
    progressPercentage.value = ((swiper.activeIndex + swiper.params.slidesPerView) / resCategoryType.value.length) * 100;
  }
  
  async function loadBusinessType() {
    try {
      const res = await dataApi.getBusinessType();
      resCategoryType.value = res.data.data;
    } catch (error) {
      console.error(error);
    }
  }
  
  onMounted(() => {
    loadBusinessType();
  });
  </script>
  