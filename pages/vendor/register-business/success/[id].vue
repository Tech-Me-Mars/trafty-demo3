<template>
    <div class="flex flex-col items-center justify-start h-screen bg-white px-6 pt-[8rem]">
      <!-- Check Icon -->
      <div class="text-red-500 text-6xl mb-5">
        <i class="fas fa-check"></i>
      </div>
      
      <!-- Success Text -->
      <h1 class="text-red-500 text-2xl font-bold mt-4">บันทึกข้อมูลแล้ว</h1>
      <p class="text-gray-600 mt-2 mb-10">โปรดรอการอนุมัติจากเจ้าหน้าที่</p>
  
      <!-- Button -->
      <!-- <button class="mt-6 bg-red-500 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-red-600 transition">
        กลับสู่หน้าหลัก
      </button> -->
      <Button label="ตกลง" class="!text-secondary-main w-full max-w-md" @click="navigateTo(`/vendor/manage-business/home/${route.params.id}`)" />
    </div>
  </template>

<script setup>
definePageMeta({
    middleware: ["auth"],
});
const route = useRoute();
</script>