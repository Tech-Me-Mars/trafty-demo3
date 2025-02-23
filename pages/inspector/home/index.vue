<script setup>
definePageMeta({
  middleware: ["auth"],
});
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
import widgetMap from "./widgets/widget-map.vue";
import { showToast } from "vant";

const router = useRouter();
const route = useRoute();
const alertToast = ref({});
import * as dataApi from "./api/data.js";

const resDataComon =ref()
const loadDataComon= async ()=>{
    try {
        const res= await dataApi.getNotificationPolice();
        resDataComon.value =res.data.data;
    } catch (error) {
        alertToast.value = {
            title: t('"ล้มเหลว"'),
            isError: true,
            color: "error",
            msg: error.response?.data?.message || "Error occurred",
            dataError: error,
        };
    }
}
onMounted(()=>{
    loadDataComon();
})
const onClick = (title) => {
    // showToast(`คุณคลิกที่ "${title}"`);
};
</script>

<style>
/* Tailwind CSS จะดูแลส่วนของสไตล์ */
</style>
<style scoped>
.menu-item {
  @apply flex items-center justify-between bg-white py-4 px-5 rounded-lg shadow-md text-gray-700 text-lg font-medium;
}
.menu-item i {
  @apply text-gray-500;
}
.van-nav-bar {
    --van-nav-bar-background: #ffc83A;
    --van-nav-bar-text-color: black;
    --van-nav-bar-icon-color: black;
    --van-nav-bar-title-text-color: black;
    --van-nav-bar-height: 70px
}

.van-cell {
    --van-cell-line-height: 40px;
    --van-cell-text-color: black;
    --van-cell-right-icon-color: black;
}
</style>
<template>
    <div class="min-h-screen bg-yellow-400 p-6">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <!-- Profile Image -->
      <img
        src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
        alt="Profile"
        class="w-10 h-10 rounded-full border-2 border-white"
      />
      <!-- Menu Icon -->
      <!-- <button
        class="w-10 h-10 bg-yellow-300 flex items-center justify-center rounded-full shadow-md hover:bg-yellow-500 transition"
      >
        <i class="fa-solid fa-bars text-lg text-black"></i>
      </button> -->
      <DrawerMenu/>
    </div>

    <!-- Title -->
    <h2 class="text-xl font-bold text-black text-center mb-6">
      ระบบบริหารจัดการข้อมูล
    </h2>

    <!-- Menu List -->
    <div class="space-y-4">

      <div class="menu-item relative" @click="navigateTo('/inspector/list/business-tourlist')">
        <i class="fa-solid fa-map-location-dot"></i>
        <span>จัดการแหล่งท่องเที่ยว</span>
        <span v-if="resDataComon?.notify_business_tourist>0"
          class="absolute right-4 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full"
          >{{ resDataComon?.notify_business_tourist }}</span
        >
        <i class="fa-solid fa-chevron-right text-gray-500"></i>
      </div>

      <div class="menu-item relative" @click="navigateTo('/inspector/list/business-tourlist')">
        <i class="fa-solid fa-store"></i>
        <span>จัดการธุรกิจในแหล่งท่องเที่ยว</span>
        <span v-if="resDataComon?.notify_business_tourist>0"
          class="absolute right-4 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full"
          >{{ resDataComon?.notify_business_tourist }}</span
        >
        <i class="fa-solid fa-chevron-right text-gray-500"></i>
      </div>

      <div class="menu-item">
        <i class="fa-solid fa-comments"></i>
        <span>ตรวจสอบคอมเมนท์</span>
        <i class="fa-solid fa-chevron-right text-gray-500"></i>
      </div>

      <div class="menu-item relative" @click="navigateTo('/inspector/warning-list')">
        <i class="fa-solid fa-store"></i>
        <span>จัดการใบเตือน</span>
        <span v-if="resDataComon?.notify_warning>0"
          class="absolute right-4 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full"
          >{{ resDataComon?.notify_warning }}</span
        >
        <i class="fa-solid fa-chevron-right text-gray-500"></i>
      </div>
    </div>
  </div>
</template>
