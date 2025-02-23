<template>
    <div class="bg-primary-main min-h-screen flex flex-col items-center justify-center">
        <div class="p-6 max-w-md mb-10">
            <!-- Check Icon -->
            <div class="flex items-center justify-center w-16 h-16 !bg-black p-1 rounded-full mx-auto">
                <!-- <i class="fas fa-check text-white text-3xl"></i> -->
                <i class="fa-solid fa-check text-white text-3xl"></i>
            </div>

            <!-- Title -->
            <h1 class="text-xl font-semibold mt-6 text-center">ส่งใบเตือนสำเร็จ</h1>
            
        </div>
        <div class="p-6 max-w-md w-full ">
            <!-- Button -->
            <NuxtLink to="/inspector/home">
                <Button :loading="isloadingAxi" :label="('กลับสู่หน้าหลัก')" severity="contrast" variant="outlined"  class="w-full"  />
            </NuxtLink>
        </div>

    </div>
</template>

<script setup>
definePageMeta({
  middleware: ["auth"],
});
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
const isloadingAxi = useState("isloadingAxi");

</script>

<style scoped>
/* Add custom styles here if needed */
</style>