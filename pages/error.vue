<script setup lang="ts">
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
import { useRouter } from "vue-router";

// Nuxt provides the error object automatically
import type { NuxtError } from "#app";

const props = defineProps({
  error: Object as () => NuxtError,
});

const router = useRouter();

// Clear the error and redirect to the home page
const handleRedirect = () => {
  router.push("/"); // Redirect to home or any other page
};
</script>

<template>
  <div class="flex flex-col items-center justify-center h-screen bg-indigo-800">
    <h1 class="text-5xl font-bold text-white">{{ error?.statusCode || 500 }}</h1>
    <p class="text-lg text-white mt-4 text-center">
      {{ t('เกิดข้อผิดพลาดบ้างอย่าง กรุณาลองใหม่อีกครั้ง') }}
    </p>
    <button
      @click="handleRedirect"
      class="mt-6 px-6 py-3 bg-yellow-500 text-white rounded-lg shadow  transition"
    >
      {{ t('กลับไปหน้าหลัก') }}
    </button>
  </div>
</template>
