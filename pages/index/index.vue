<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Header -->
    <div class="bg-primary-main text-white p-4 flex items-center justify-between">
      <div class="flex items-center">
        <i class="fas fa-user-circle text-xl mr-2"></i>
        <span v-if="name" class="text-lg font-semibold">{{name}}</span>
        <div v-else class="underline cursor-pointer" @click="navigateTo('/auth/login')">
          เข้าสู่ระบบ
        </div>
      </div>
      <!-- <i class="fas fa-search text-xl"></i> -->
      <drawer-menu/>
    </div>

    <!-- Title -->
    <div class="p-6 bg-yellow-400 text-black">
      <h1 class="text-2xl font-bold">TOURIST</h1>
      <h1 class="text-2xl font-bold">POLICE</h1>
    </div>

    <!-- Content -->
    <div class="p-4">

      <h2 class="text-lg font-semibold mb-4">รายการทั้งหมด</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <div v-for="(place, index) in resData" :key="index" class="bg-white rounded-lg shadow-md overflow-hidden flex p-2 max-w-md cursor-pointer" @click="navigateTo(`/client/information/${place?.id}`)">
          <img :src="place?.image_profile" alt="Place" class="w-24 h-24 object-cover">
          <div class="p-4 flex-1">
            <h3 class="text-lg font-semibold">{{ place?.shop_name }}</h3>
            <p class="text-gray-600 text-sm flex items-center">
              <i class="fas fa-map-marker-alt text-yellow-500 mr-1"></i>
              {{ place?.shop_address }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <MyToast :data="alertToast" />

  </div>
</template>

<script setup>
const alertToast = ref({});
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
import * as dataApi from "./api/data.js";
const route= useRoute()
const name =localStorage.getItem("name")
const places = ref([
  { title: "หมี่น บน นัว", location: "ถ.บรรทัดทอง แมว...", image: "https://via.placeholder.com/150" },
  { title: "สวนรถไฟ", location: "ถ.บรรทัดทอง แมว...", image: "https://via.placeholder.com/150" },
  { title: "ตลาดน้ำสี่ภาค", location: "เขตลาดกระบัง กรุงเทพฯ", image: "https://via.placeholder.com/150" },
  { title: "ท่ามหาราช", location: "เขตพระนคร กรุงเทพฯ", image: "https://via.placeholder.com/150" },
  { title: "สวนสมเด็จฯ", location: "เขตพระนคร กรุงเทพฯ", image: "https://via.placeholder.com/150" },
]);

const resData = ref([])
const loadData =async ()=>{
  try {
    const res= await dataApi.getBusinessVerify()
    resData.value = res.data.data;
  } catch (error) {
    console.error(error)
  }
}

onMounted(()=>{
  loadData()
})


</script>

<style scoped>
</style>
