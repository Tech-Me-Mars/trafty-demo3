<template>
  <div class="flex items-center justify-center min-h-screen bg-yellow-400 p-6">

    <div v-if="isPass == true" class="w-full max-w-sm  text-center ">
      <h1 class="text-lg font-bold text-gray-900 mb-4">ผ่านเกณฑ์</h1>
      <div class="flex justify-center mb-4">
        <i class="fas fa-exclamation-circle text-green-500 text-6xl"></i>
      </div>
      <p class="text-gray-700 text-sm mb-6">
        ธุรกิจแหล่งท่องเที่ยวนี้ผ่านเกณฑ์มาตรฐานด้านความปลอดภัยสาธารณสุข และ
        ด้านความปลอดภัยในธรรมชาติของแหล่งท่องเที่ยวตามที่กำหนด เจ้าหน้าที่โปรดตรวจสอบ
      </p>
      <button @click="navigateTo('/inspector/home')" class="w-full border border-black text-black py-2 rounded-lg font-semibold">กลับสู่หน้าหลัก</button>
    </div>
    <div v-if="isPass == false" class="w-full max-w-sm  text-center ">
      <h1 class="text-lg font-bold text-gray-900 mb-4">ไม่ผ่านเกณฑ์</h1>
      <div class="flex justify-center mb-4">
        <i class="fas fa-exclamation-circle text-red-500 text-6xl"></i>
      </div>
      <p class="text-gray-700 text-sm mb-6">
        ธุรกิจแหล่งท่องเที่ยวนี้ไม่ผ่านเกณฑ์มาตรฐานด้านความปลอดภัยสาธารณสุข และ
        ด้านความปลอดภัยในธรรมชาติของแหล่งท่องเที่ยวตามที่กำหนด เจ้าหน้าที่โปรดตรวจสอบ
      </p>
      <button @click="navigateTo(`/inspector/send-warning/${resData?.survey_audit_police_id}/waring-send`)" class="w-full bg-black !text-white py-2 rounded-lg font-semibold mb-3">ส่งใบเตือน</button>
      <button @click="navigateTo('/inspector/home')" class="w-full border border-black text-black py-2 rounded-lg font-semibold">กลับสู่หน้าหลัก</button>
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
import * as dataApi from "./api/data.js";
const route = useRoute();
const resData = ref()
const isPass = ref(false)
const loadData = async () => {
  try {
    const res = await dataApi.getSuveyAuditPolice(route.params.id);
    resData.value = res.data.data;
    console.log(res.data.data.score_percent_pass)
    isPass.value = res.data.data.score_percent_pass >= 80 ? true : false
  } catch (error) {

  }
}
onMounted(()=>{loadData()})

// ไม่ต้อง import FontAwesomeIcon เพราะใช้ class แทน
</script>

<style>
/* สามารถเพิ่ม CSS Tailwind เพิ่มเติมที่นี่ได้ */
</style>