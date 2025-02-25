<template>

  <!-- Header -->
  <div class="min-h-screen bg-white flex flex-col">

    <van-nav-bar :title="resProfile?.role_id == 3 ? 'ตรวจสอบ' : ''" :border="true">
      <template #left>
        <back-page @click="router.go(-1)" />
      </template>
    </van-nav-bar>

    <!-- Card ร้านค้า -->
    <div class="bg-white shadow-md  mt-4 px-4 mb-5">
      <!-- รูปภาพร้านค้า -->
      <div class="bg-primary-main">
        <div class="   px-4 py-2">
          <h3 class="text-lg font-bold text-white">{{ resInfo?.shop_name }}</h3>
          <p class="text-secondary-main">{{ resInfo?.business_type_name }}dd</p>
        </div>
        <img :src="resInfo?.image_profile" alt="ร้านค้า" class="w-full h-48 object-cover" />

      </div>

      <!-- สถานะ -->
      <div v-if="resInfo?.status == false"
        class="bg-red-100 text-red-500 text-sm flex items-center justify-center py-2">
        <i class="fas fa-exclamation-circle mr-2"></i> รออนุมัติ
      </div>
      <div v-if="resInfo?.status == true"
        class="bg-green-50 text-green-500 text-sm flex items-center justify-center py-2">
        <i class="fa-regular fa-circle-check mr-2"></i> อนุมัติแล้ว
      </div>

      <p class="text-gray-700 flex items-center mt-5">
        <i class="fas fa-map-marker-alt text-primary-main mr-2"></i>
        {{ resInfo?.shop_address }}
      </p>
    </div>

    <!-- Tabs -->
    <div class="mx-auto w-full max-w-xl px-5">
      <van-tabs v-model:active="activeTab" type="card" :border="false" color="#f8f4f4" title-active-color="#ff4b3a"
        title-inactive-color="#ff4b3a">
        <!-- แท็บ รายละเอียดร้านค้า -->
        <van-tab title="รายละเอียดร้านค้า" class="!p-3 !m-5">
          <template #title class="!p-4">
            <h1 class="text-md lg:text-xl">รายละเอียดร้านค้า</h1>
          </template>

          <div class="p-4">
            <h3 class="text-lg font-semibold text-red-500">ข้อมูลร้านค้า</h3>
            <p class="text-gray-600 mt-2">{{ resInfo?.shop_details }}</p>
          </div>
        </van-tab>

        <!-- แท็บ ความปลอดภัยร้านค้า -->
        <van-tab title="ความปลอดภัยร้านค้า">
          <template #title class="!p-4">
            <h1 class="text-md lg:text-xl">ความปลอดภัยร้านค้า</h1>
          </template>
          <div class="">
            <div class="max-w-xl mx-auto p-4 bg-white shadow-md rounded-md">
              <h2 class="text-lg font-bold text-gray-800 mb-4 text-center">✅ รายการที่มีมาตรการ</h2>
              <ul class="divide-y divide-gray-300">
                <li v-for="(item, index) in filteredData " :key="index" class="py-2 px-4">
                  {{ item.audit_questions_text }}
                </li>
              </ul>
            </div>
          </div>
        </van-tab>
      </van-tabs>
    </div>


    <!-- ปุ่มประเมิน -->
    <div class="max-w-lg mx-auto">
      <Button @click="navigateTo(`/inspector/safety-form/${route.params.id}/form1`)" v-if="resProfile?.role_id == 3"
        label="ประเมินมาตรฐานความปลอดภัย" class="!text-secondary-main " />

    </div>
  </div>
</template>
<style>
.van-nav-bar {
  --van-nav-bar-background: white;
  --van-nav-bar-height: 80px
}

.van-cell {
  padding-inline: 0 !important;
}

:root {
  --van-collapse-item-content-text-color: #f59e0b;
  /* เปลี่ยนเป็นสีเหลือง */
}

/* .van-collapse-item{
    --van-collapse-item-content-text-color:red
}	 */
</style>
<script setup>
// definePageMeta({
//     middleware: ["auth"],
// });
import * as dataApi from './api/data.js'
import widgetSocial from './widgets/widget-social.vue';
import widgetItemsBusiness from './widgets/widget-items-business.vue';
import widgetReview from './widgets/widget-review.vue';
import widgetPolicy from './widgets/widget-policy.vue';
const router = useRouter();
const route = useRoute();
const isloadingAxi = useState("isloadingAxi");
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
const localPath = useLocalePath();
const activeTab = ref(0);
const tabViewStyles = {
  tabList: {
    class: "border-b border-gray-300"
  },
  tabPanel: {
    class: "p-4"
  },
  root: {
    class: "bg-white shadow-sm rounded-lg"
  },
  header: ({ context }) => ({
    class: context.selected
      ? "text-red-500 border-b-2 border-red-500 font-semibold bg-white px-6 py-3"
      : "text-gray-500 font-medium px-6 py-3"
  })
};
const business_items_active = ref([]);

const showShare = ref(false);
const options = [
  {
    name: 'Facebook',
    icon: '/image/social/facebook.png',
  },
  {
    name: 'Line',
    icon: '/image/social/line.png',
  },
  {
    name: 'Discord',
    icon: '/image/social/discord.png',
  },
  {
    name: 'Twitter',
    icon: '/image/social/twitter.png',
  },
];

const resProfile = ref({ role_id: null })
const loadProfile = async () => {
  try {
    const res = await dataApi.getProfile();
    resProfile.value = res.data.data;
  } catch (error) {
    console.error(error)
  }
}
// Handle selection
const onSelect = (option) => {
  console.log(`Selected: ${option.name}`);
  // Add share logic here, such as opening links or triggering actions
};
const token = localStorage.getItem("token");
onMounted(() => {
  if (token) {
    loadProfile();
  }
  loadDataInfo()
  loadChoiceAudit()
})

const resInfo = ref();
const loadDataInfo = async () => {
  try {
    const res = await dataApi.getBusinessById(route.params.id);
    resInfo.value = res.data.data;

    console.log(resInfo.value)


  } catch (error) {
    console.error(error)
  }
}

const resPolicy = ref([])
const loadChoiceAudit = async () => {
  try {
    const res = await dataApi.getResultPoliceSurveyAudit(route.params.id);
    resPolicy.value = res.data.data.flatMap(item => item.question);
    // resPolicy.value = res.data.data;
    console.log('resPolicy', resPolicy.value)
    console.log(resPolicy)
  } catch (error) {
    console.error(error)
  }
}
const filteredData = computed(() => resPolicy.value.filter(item => item.choice_text === "มี"));
const isLiked = ref(false);

const toggleLike = () => {
  isLiked.value = !isLiked.value;
};
</script>
