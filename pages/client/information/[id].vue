<template>
    <div class="bg-zinc-100 min-h-screen">
        <van-nav-bar :title="'ตรวจสอบ'" left-arrow @click-left="navigateTo('/')" :border="false">
            <template #left>
                <back-page />
            </template>
        </van-nav-bar>

        <section class="p-4 bg-gray-50 ">
            <!-- รูปภาพร้านค้า -->
            <div class="relative">
                <img :src="resInfo?.image_profile" alt="รูปภาพร้านค้า" class="w-full h-64 object-cover rounded-lg" />

            </div>

            <!-- รายละเอียดร้านค้า -->
            <div class="bg-white p-4 rounded-lg shadow-md  relative">
                <!-- ชื่อร้าน + สถานะ -->
                <div class="flex justify-between items-center">
                    <h2 class="text-xl font-bold">{{ resInfo?.shop_name }}</h2>
                    <span v-if="resInfo?.status == false"
                        class="bg-red-500 text-white text-sm px-3 py-1 rounded-full flex items-center gap-1">
                        <i class="fa-solid fa-exclamation-circle"></i> รอตรวจสอบ
                    </span>
                    <span v-if="resInfo?.status == true"
                        class="bg-green-500 text-white text-sm px-3 py-1 rounded-full flex items-center gap-1">
                        <i class="fa-solid fa-check"></i> ตรวจสอบแล้ว
                    </span>
                </div>

                <!-- ที่อยู่ -->
                <p class="text-gray-600 text-sm flex items-center mt-1">
                    <i class="fa-solid fa-map-marker-alt text-yellow-500 mr-2"></i>
                    {{ resInfo?.shop_address }}
                </p>

                <!-- เบอร์โทร -->
                <div class="bg-yellow-100 p-3 mt-3 rounded-lg flex items-center">
                    <i class="fa-solid fa-phone text-yellow-500 mr-3"></i>
                    <span class="text-gray-800 font-semibold">{{ resInfo?.shop_phone }}</span>
                </div>

                <!-- รายละเอียดร้านค้า -->
                <div class="mt-4">
                    <h3 class="text-lg font-bold">ข้อมูลร้านค้า</h3>
                    <p class="text-gray-600 text-sm mt-1">
                        {{ resInfo?.shop_details }}
                    </p>
                </div>

                <!-- Accordion -->
                <div class="">
                    <!-- <div class="border-b py-3 flex justify-between items-center cursor-pointer">
                        <span class="text-gray-800 font-bold">รายการอาหาร</span>
                        <i class="fa-solid fa-chevron-down text-yellow-500"></i>
                    </div> -->
                    <div class="mt-6">

                        <van-collapse v-model="business_items_active" :border="false">
                            <van-collapse-item title="รายการ" name="menu" class="">
                                <div class="">
                                    <div v-for="menu in resInfo?.business_lists" :key="menu.id"
                                        class="flex justify-between">
                                        <span class="text-gray-800 font-semibold">{{ menu.business_list_name }}</span>
                                        <!-- <span class="text-yellow-500 font-bold">{{ menu.business_list_price }} บาท</span> -->
                                    </div>
                                </div>
                            </van-collapse-item>
                            <van-collapse-item title="ข้อมูลมาตรฐานความปลอดภัย" name="policy" class="">
                                <!-- <div class="">
                                    <div v-for="menu in resInfo?.business_lists" :key="menu.id"
                                        class="flex justify-between">
                                        <span class="text-gray-800 font-semibold">{{ menu.business_list_name }}</span>
                                      
                                    </div>
                                </div> -->
                                <div v-for="(policy, index) in resPolicy" :key="index" class="mb-6">
                                    <h1 class="text-md font-bold text-gray-900 mb-2">
                                        {{ index + 1 }}. {{ policy.topic_name }}
                                    </h1>

                                    <div v-for="(item, idx) in policy.question" :key="idx"
                                        class="text-gray-500 text-sm flex items-start mb-2">
                                        <span class="mr-2">{{ index + 1 }}.{{ idx + 1 }}</span>
                                        <p class="flex-1">{{ item.audit_questions_text }}</p>
                                        <i
                                            :class="[item.icon, 'text-lg ml-2', item.choice_text === 'มี' ? 'text-green-500' : 'text-red-500']"></i>
                                    </div>
                                </div>
                            </van-collapse-item>
                        </van-collapse>
                    </div>
                    <!-- <div class="border-b py-3 flex justify-between items-center cursor-pointer">
                        <span class="text-gray-800 font-bold">ข้อมูลมาตรฐานความปลอดภัย</span>
                        <i class="fa-solid fa-chevron-down text-yellow-500"></i>
                    </div> -->
                </div>
                <button @click="navigateTo(`/inspector/safety-form/${route.params.id}/form1`)" v-if="resProfile?.role_id == 3"
                    class="w-full mt-6 bg-yellow-400 text-black font-semibold py-3 rounded-lg shadow-md hover:bg-yellow-500 transition">
                    ประเมิน
                </button>
            </div>
        </section>


    </div>
</template>
<style>
.van-nav-bar {
    --van-nav-bar-background: #ffc83A;
    --van-nav-bar-text-color: black;
    --van-nav-bar-icon-color: black;
    --van-nav-bar-title-text-color: black;
    --van-nav-bar-height: 70px;
    --van-collapse-item-content-padding: 0px !important;
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
        resPolicy.value = res.data.data;
        console.log(resPolicy)
    } catch (error) {
        console.error(error)
    }
}

const isLiked = ref(false);

const toggleLike = () => {
    isLiked.value = !isLiked.value;
};
</script>
