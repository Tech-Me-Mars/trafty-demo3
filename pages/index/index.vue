<template>
 <div class="min-h-screen bg-white p-4">
    <!-- Title -->
    <van-nav-bar title="" :border="true">

      <template #left>
        <h1 class="header-label">การท่องเที่ยวทั้งหมด</h1>
      </template>
      <template #right>
        <button type="button" @click="toggle" class="focus:outline-none">
            <i class="fas fa-user-circle text-gray-400 text-3xl"></i>
        </button>
        <TieredMenu ref="menu" id="user_menu" :model="itemsDropDownMenu" popup />
        <!-- <div v-if="token" class="underline cursor-pointer text-primary-main" @click="navigateTo('/auth/login')">
          ออกจากระบบ
        </div>
        <div v-else class="underline cursor-pointer text-primary-main" @click="navigateTo('/auth/login')">
          เข้าสู่ระบบ
        </div> -->
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
const router = useRouter();

const token = localStorage.getItem("token");
const role_id = localStorage.getItem("role_id");
const menu = ref();
const itemsDropDownMenu = ref([
    {
        label: "หน้าหลัก",
        icon: "fas fa-home",
        command: () => {
            router.push("/");
        }
    },
    // เงื่อนไข: ถ้า role_id == "2" และมี token ให้เพิ่มเมนู "ธุรกิจของฉัน"
    ...(token && role_id == "2" ? [{
        label: "ธุรกิจของฉัน",
        icon: "fas fa-store",
        command: () => {
            router.push("/vendor/my-business");
        }
    }] : []),
    // เงื่อนไข: ถ้า role_id == "3" และมี token ให้เพิ่มเมนู "ตรวจสอบข้อมูล"
    ...(token && role_id == "3" ? [{
        label: "ตรวจสอบข้อมูล",
        icon: "fas fa-clipboard-check",
        command: () => {
            router.push("/inspector/home");
        }
    }] : []),
    // ถ้ามี Token -> แสดง "Logout"
    // ถ้าไม่มี Token -> แสดง "เข้าสู่ระบบ"
    token
        ? {
            label: "ออกจากระบบ",
            icon: "fas fa-sign-out-alt",
            command: () => {
                localStorage.removeItem("token");
                router.push("/auth/login");
            }
        }
        : {
            label: "เข้าสู่ระบบ",
            icon: "fas fa-sign-in-alt",
            command: () => {
                router.push("/auth/login");
            }
        }
]);

const toggle = (event) => {
    menu.value.toggle(event);
};

</script>

<style >
.van-nav-bar {
    --van-nav-bar-background: white!important;
    --van-nav-bar-height: 80px
}
</style>
