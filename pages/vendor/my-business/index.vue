<template>
    <div class="bg-zinc-100 min-h-screen">
        <van-nav-bar :title="'ร้านค้า'" left-arrow @click-left="navigateTo('/')">
            <template #left @click="navigateTo('/')">
                <back-page />
            </template>
        </van-nav-bar>

        <div class="container mx-auto p-6">
            <!-- Header -->
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-2xl font-bold text-gray-800">ร้านค้าของฉัน</h2>
                <button @click="navigateTo('/vendor/register-business/welcome')"
                    class="flex items-center gap-2 px-4 py-2 bg-yellow-400 text-black font-semibold rounded-lg shadow-md hover:bg-yellow-500 transition">
                    <i class="fa-solid fa-plus"></i> เพิ่มร้านค้า
                </button>
            </div>

            <!-- รายการร้านค้า -->
            <!-- รายการร้านค้า (แบบแนวนอน) -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div v-for="shop in resBusiness" :key="shop.id" class="bg-white rounded-lg shadow-lg p-4  gap-4 border">
                    <div class="flex items-center justify-between gap-4">


                        <!-- รูปภาพ -->
                        <img :src="shop.image_profile" alt="ร้านค้า"
                            class="w-24 h-24 rounded-full border-2 border-yellow-400 object-cover" />

                        <!-- รายละเอียดร้านค้า -->
                        <div class="flex flex-col flex-grow">
                            <h3 class="text-lg font-semibold text-gray-800">{{ shop.shop_name }}</h3>
                            <p class="text-sm text-gray-500">{{ shop.shop_details }}</p>
                            <p class="text-sm text-gray-500"><i class="fa-solid fa-map-marker-alt text-red-500"></i> {{
                                shop.shop_address }}</p>
                        </div>
                    </div>
                    <!-- ปุ่มดูรายละเอียดและแก้ไข -->
                    <div class="flex space-x-2 mt-4 w-full justify-center">
                        <button @click="navigateTo(`/vendor/manage-business/home/${shop?.id}`)"
                            class="flex items-center gap-2 px-4 py-2 bg-yellow-400 text-black rounded-lg shadow hover:bg-yellow-500 transition">
                            <i class="fa-solid fa-eye"></i> ดูรายละเอียด
                        </button>
                    </div>

                </div>
            </div>
        </div>

    </div>
</template>
<style scoped>
.van-nav-bar {
    --van-nav-bar-background: #ffc83A;
    --van-nav-bar-text-color: black;
    --van-nav-bar-icon-color: black;
    --van-nav-bar-title-text-color: black;
    --van-nav-bar-height: 70px
}
</style>
<script setup>
definePageMeta({
    middleware: ["auth"],
});
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
const isloadingAxi = useState("isloadingAxi");
const router = useRouter();
const route = useRoute();
const alertToast = ref({});
import * as dataApi from "./api/data.js";

const resBusiness = ref([])
const loadListData = async () => {
    try {
        const res = await dataApi.getMyBusiness();
        resBusiness.value = res.data.data;
    } catch (error) {

    }
}
onMounted(() => {
    loadListData();
})

const status_select = ref(1)
const statusOptions = ref([
    { id: 1, name: t('สถานะ:ทั้งหมด') }
])
</script>