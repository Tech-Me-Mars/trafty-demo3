<template>
 <div class="min-h-screen bg-white p-4">
    <!-- Title -->
    <van-nav-bar title="" :border="true">

      <template #left>
        <h1 class="header-label">กรอกข้อมูลของคุณ</h1>
      </template>
      <template #right>
        <span v-if="name" class="text-lg font-semibold text-primary-main underline" @click="navigateTo('/auth/login')">ออกจากระบบ</span>
        <div v-else class="underline cursor-pointer text-primary-main" @click="navigateTo('/auth/login')">
          เข้าสู่ระบบ
        </div>
      </template>

    </van-nav-bar>

    <!-- List of Shops -->
    <div v-for="shop in resData" :key="shop.id" class="bg-primary-main cursor-pointer rounded-lg shadow-lg overflow-hidden mb-4 p-1"
    @click="navigateTo(`/client/information/${shop.id}`)" >
      <!-- Shop Header -->
      <div class=" p-3">
        <h2 class="text-lg font-bold text-white">{{ shop.shop_name }}</h2>
        <p class="text-sm text-yellow-300">ร้านค้า</p>
      </div>

      <!-- Shop Image -->
      <img :src="shop.image_profile" alt="Shop Image" class="w-full h-52 object-cover">

    </div>
  </div>

    <MyToast :data="alertToast" />

 
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
