<script setup>
definePageMeta({
  middleware: ["auth"],
});
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
// import widgetMap from "./widgets/widget-map.vue";
import { showToast } from "vant";

const router = useRouter();
const route = useRoute();
const alertToast = ref({});
import * as dataApi from "./api/data.js";

const resDataComon = ref()
const loadDataComon = async () => {
  try {
    const res = await dataApi.getNotificationPolice();
    resDataComon.value = res.data.data;
  } catch (error) {
    alertToast.value = {
      title: "ล้มเหลว",
      isError: true,
      color: "error",
      msg: error.response?.data?.message || "Error occurred",
      dataError: error,
    };
  }
}

onMounted(() => {
  loadDataComon();
})
const onClick = (title) => {
  // showToast(`คุณคลิกที่ "${title}"`);
};
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

<style>
/* Tailwind CSS จะดูแลส่วนของสไตล์ */
</style>
<style scoped>
.card {
  @apply flex flex-col items-center bg-white p-6 rounded-lg shadow-md border-2 border-yellow-500;
}


.van-nav-bar {
  --van-nav-bar-background: white;
  --van-nav-bar-height: 80px
}
</style>

<template>
  <div class="min-h-screen bg-white flex flex-col">
    <van-nav-bar >
      <template #left>
        <h1 class="header-label">ระบบบริหารจัดการข้อมูลตำรวจ</h1>
      </template>
      <template #right>
        <button type="button" @click="toggle" class="focus:outline-none">
            <i class="fas fa-user-circle text-gray-400 text-3xl"></i>
        </button>
        <TieredMenu ref="menu" id="user_menu" :model="itemsDropDownMenu" popup />
      </template>
    </van-nav-bar>

    <div class="flex flex-col items-center  bg-cover bg-center flex-grow p-6"
    style="background-image: url('/image/bg/bangkok-bg.png');">
    <!-- Header -->

    <!-- Grid Layout -->
    <div class="grid grid-cols-2 gap-4 w-full max-w-md">
      <!-- Card 1 -->
      <div class="card flex flex-col justify-between" >
        <i class="fas fa-map-marked-alt text-red-500 text-5xl"></i>
        <p class="text-center text-lg font-medium mt-2">จัดการแหล่งท่องเที่ยว</p>
        <Button v-if="resDataComon?.notify_business_tourist>0" type="button" class=" !text-primary-main" :badge="resDataComon?.notify_business_tourist" badgeSeverity="primary" outlined label="ดูข้อมูล"
          @click="navigateTo('/inspector/list/tourlist')"></Button>
        <Button v-else type="button" class=" !text-primary-main"  outlined label="ดูข้อมูล"
        @click="navigateTo('/inspector/list/tourlist')" ></Button>
      </div>

      <!-- Card 2 -->
      <div class="card flex flex-col justify-between">
        <i class="fas fa-store text-red-500 text-5xl"></i>
        <p class="text-center text-lg font-medium mt-2">จัดการธุรกิจในแหล่งท่องเที่ยว</p>
        <Button v-if="resDataComon?.notify_business_tourist>0" type="button" class=" !text-primary-main" :badge="resDataComon?.notify_business_tourist" badgeSeverity="primary" outlined label="ดูข้อมูล"
          @click="navigateTo('/inspector/list/business-tourlist')"></Button>
        <Button v-else type="button" class=" !text-primary-main"  outlined label="ดูข้อมูล"
        @click="navigateTo('/inspector/list/business-tourlist')" ></Button>
      </div>

      <!-- Card 3 -->
      <div class="card flex flex-col justify-between">
        <i class="fas fa-file-alt text-red-500 text-5xl"></i>
        <p class="text-center text-lg font-medium mt-2">จัดการใบเตือน</p>
        <div></div>
        <!-- <Button v-if="resDataComon?.notify_warning>0" type="button" class=" !text-primary-main" :badge="resDataComon?.notify_warning" badgeSeverity="primary" outlined label="ดูข้อมูล"
          @click="navigateTo('/inspector/list/business-tourlist')"></Button>
        <Button v-else type="button" class=" !text-primary-main"  outlined label="ดูข้อมูล"
        @click="navigateTo('/inspector/list/business-tourlist')" ></Button> -->
      </div>

      <!-- Card 4 -->
      <div class="card flex flex-col justify-between">
        <i class="fas fa-comments text-red-500 text-5xl"></i>
        <p class="text-center text-lg font-medium mt-2">ตรวจสอบคอมเมนท์</p>
        <Button class="btn mt-auto !text-primary-main" outlined>ดูข้อมูล</Button>
      </div>
    </div>

    <!-- Logout Button -->
    <button class="logout-btn bg-white py-3 w-full mt-10" severity="secondary" @click="navigateTo('/auth/login')" >ออกจากระบบ</button>
  </div>

  </div>


  
</template>