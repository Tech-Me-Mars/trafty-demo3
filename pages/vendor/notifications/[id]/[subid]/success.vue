<template>
    <div class="min-h-screen flex flex-col items-center justify-center bg-white">
      <div class="text-center">
        <!-- Check Icon -->
        <div class="flex items-center justify-center w-16 h-16 bg-red-500 p-3 rounded-full mx-auto">
          <i class="fa-solid fa-check text-white text-4xl"></i>
        </div>
  
        <!-- Title -->
        <h1 class="text-xl font-bold text-red-500 mt-4">ส่งสำเร็จ</h1>
        <p class="text-gray-700 mt-2">ขอบคุณสำหรับการตอบกลับใบเตือน</p>
  
        <!-- Button -->
        <NuxtLink :to="`/vendor/manage-business/home/${route.params.id}`">
          <button class="mt-6 w-full bg-red-500 !text-secondary-main py-3 rounded-lg font-bold text-lg">
            กลับสู่หน้าหลัก
          </button>
        </NuxtLink>
      </div>
    </div>
  </template>
  
  <script setup>
  definePageMeta({
    middleware: ["auth"],
  });
  const route = useRoute();
  </script>
  