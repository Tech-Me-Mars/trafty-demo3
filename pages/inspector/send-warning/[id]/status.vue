<template>
  <div class="flex items-center justify-center min-h-screen bg-white p-6">
    <div v-if="isPass" class="w-full max-w-sm text-center">
      <!-- ไอคอนผ่านเกณฑ์ -->
      <div class="flex justify-center mb-4">
        <i class="fas fa-smile text-green-500 text-7xl"></i>
      </div>
      <h1 class="text-xl font-bold text-green-500 mb-4">ผ่านเกณฑ์</h1>
      <p class="text-gray-700 text-sm mb-6">
        ธุรกิจแหล่งท่องเที่ยวนี้ผ่านเกณฑ์มาตรฐานด้านความปลอดภัย เจ้าหน้าที่โปรดตรวจสอบ
      </p>
      <button
        @click="navigateTo('/inspector/home')"
        class="w-full border border-red-500 text-red-500 py-3 rounded-lg font-semibold"
      >
        กลับ
      </button>
    </div>

    <div v-else class="w-full max-w-sm text-center">
      <!-- ไอคอนไม่ผ่านเกณฑ์ -->
      <div class="flex justify-center mb-4">
        <i class="fas fa-frown text-red-500 text-7xl"></i>
      </div>
      <h1 class="text-xl font-bold text-red-500 mb-4">ไม่ผ่านเกณฑ์</h1>
      <p class="text-gray-700 text-sm mb-6">
        ธุรกิจแหล่งท่องเที่ยวนี้ไม่ผ่านเกณฑ์มาตรฐานด้านความปลอดภัย เจ้าหน้าที่โปรดตักเตือน
      </p>
      <button
        @click="navigateTo(`/inspector/send-warning/${resData?.survey_audit_police_id}/waring-send`)"
        class="w-full bg-red-500 !text-secondary-main py-3 rounded-lg font-semibold mb-3"
      >
        ส่งใบเตือน
      </button>
      <button
        @click="navigateTo('/inspector/home')"
        class="w-full border border-primary-main !text-primary-main py-3 rounded-lg font-semibold"
      >
        กลับ
      </button>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: ["auth"],
});

import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import * as dataApi from "./api/data.js";

const route = useRoute();
const resData = ref();
const isPass = ref(false);

const loadData = async () => {
  try {
    const res = await dataApi.getSuveyAuditPolice(route.params.id);
    resData.value = res.data.data;
    isPass.value = res.data.data.score_percent_pass >= 80;
  } catch (error) {
    console.error("Error loading data:", error);
  }
};

onMounted(loadData);
</script>
