<template>
  <div class="min-h-screen bg-white flex flex-col items-center py-6">
    <!-- Header -->
    <h1 class="text-lg font-bold text-center">ธุรกิจในแหล่งท่องเที่ยว</h1>

    <!-- ร้านค้า -->
    <div class="w-full max-w-xs mt-4 flex flex-col items-center">
      <!-- รูปภาพร้าน -->
      <div class="relative w-42 h-26">
        <img :src="resShop?.image_profile" alt="ร้านค้า" class="w-full h-full object-cover rounded-lg" />

      </div>

      <!-- ชื่อร้าน -->
      <p class="mt-2 text-sm font-semibold text-black">{{ resShop?.shop_name }}</p>

      <!-- สถานะ -->
      <div class="flex items-center gap-2 mt-2 bg-red-100 text-red-500 px-3 py-1 rounded-sm" v-if="resShop?.status == false">
        <i class="fas fa-circle-exclamation"></i>
        <span class="text-sm font-medium">รออนุมัติ</span>
      </div>
      <div class="flex items-center gap-2 mt-2 bg-green-50 text-green-500 px-3 py-1 rounded-sm" v-if="resShop?.status == true">
        <i class="fa-solid fa-circle-check"></i>
        <span class="text-sm font-medium">ได้รับอนุมัติจากเจ้าหน้าที่</span>
      </div>
    </div>

    <!-- เมนูต่าง ๆ -->
    <div class="w-full mt-6">
      <ul class="bg-white divide-y rounded-lg shadow">
        <li class="py-3 px-4 flex items-center justify-between text-red-500 font-medium">
          ข้อมูลร้านค้า
        </li>
        <li class="py-3 px-4 flex items-center justify-between text-gray-600 cursor-pointer" @click="navigateTo(`/vendor/notifications/${route.params.id}`)">
          การแจ้งเตือน
          <!-- <van-badge :content="getNotifyCoute" v-if="getNotifyCoute>0">
          </van-badge> -->
          <Badge v-if="getNotifyCoute>0" :value="getNotifyCoute" class="!text-white"></Badge>
        </li>
        <li class="py-3 px-4 flex items-center justify-between text-gray-600">
          แก้ไขข้อมูลร้านค้า
        </li>
      </ul>
    </div>

    <!-- ปุ่มออกจากระบบ -->

    <Button label="ออกจากระบบ" @click="navigateTo('/auth/login')" class="!text-secondary-main !px-10 mt-8" />
  </div>
</template>
<script setup>
definePageMeta({
  middleware: ["auth"],
});

const alertToast = ref({});

const showAddMenu = ref(false)
const isloadingAxi = useState("isloadingAxi");
import * as dataApi from "./api/data.js";
const route = useRoute();

const resShop = ref()
const loadShop = async () => {
  try {
    const res = await dataApi.getShopById(route.params.id)
    resShop.value = res.data.data;
  } catch (error) {
    console.error(error)
    alertToast.value = {
      title: 'ล้มเหลว',
      isError: true,
      color: "error",
      msg: error.response?.data?.message || "Error occurred",
      dataError: error,
    };
  }
}

onMounted(() => {
  loadShop();
  loadNotyfy()
})
const getNotifyCoute =ref(0);
const loadNotyfy =async () =>{
    try {
            const res  = await dataApi.getNotifyBusiness(route.params.id);
            getNotifyCoute.value =res.data.data.length
    } catch (error) {
       console.error(error) 
    }
}
</script>