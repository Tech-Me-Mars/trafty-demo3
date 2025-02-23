<template>
    <div class="min-h-screen bg-primary-main flex flex-col">

        <van-nav-bar :title="'การจัดการธุรกิจในแหล่งท่องเที่ยว'" :border="false" left-arrow
            @click-left="navigateTo('/inspector/home')">
            <template #left>
                <back-page @click="navigateTo('/inspector/home')" />
            </template>
        </van-nav-bar>


        <section class="p-4 card-content flex-grow pt-10">
            <div class="">
                <!-- หัวข้อรายการ -->
                <h2 class="text-lg font-bold text-gray-800 mb-4">
                    รายการทั้งหมด ({{ resSurveytouristwaiting.length }})
                </h2>

                <!-- รายการร้านค้า -->
                <div v-if="resSurveytouristwaiting.length >0" v-for="shop in resSurveytouristwaiting" :key="shop.id"
                    class="bg-yellow-100 border border-gray-200 rounded-lg p-4 shadow-sm flex flex-col">
                    <!-- แถวบน: ชื่อร้าน + สถานะ -->
                    <div class="flex justify-between items-center">
                        <h3 class="text-lg font-bold text-gray-900">{{ shop?.shop_name }}</h3>
                        <span class=" !text-red-500 text-sm px-3 py-1 " v-if="shop?.status == false">
                            <i class="fa-solid fa-exclamation-circle"></i> รอตรวจสอบ
                        </span>
                        <span class=" !text-green-500 text-sm px-3 py-1 " v-if="shop?.status == true">
                            <i class="fa-solid fa-exclamation-circle"></i> ตรวจสอบแล้ว
                        </span>
                    </div>

                    <!-- ที่อยู่ร้าน -->
                    <p class="text-gray-600 mt-1">{{ shop?.shop_address }}</p>

                    <!-- ปุ่มตรวจสอบ / ลบรายการ -->
                    <div class="flex justify-end space-x-2 mt-3">
                        <Button @click="navigateTo(`/client/information/${shop?.id}`)" label="ตรวจสอบ" severity="contrast" size="small" class="!text-white w-auto">
                        </Button>
                        
                    </div>

                </div>

                <no-data v-else />
            </div>
        </section>

    </div>
</template>
<style scoped>
.van-nav-bar {
    --van-nav-bar-background: #ffc83A;
    --van-nav-bar-text-color: black;
    --van-nav-bar-icon-color: black;
    --van-nav-bar-title-text-color: black;
    --van-nav-bar-height: 100px
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

const resSurveytouristwaiting = ref([])
const loadListData = async () => {
    try {
        const res = await dataApi.getsurveybusinessintouristwaiting();
        resSurveytouristwaiting.value = res.data.data;
    } catch (error) {

    }
}
onMounted(() => {
    loadListData();
})
// const resSurveytouristwaiting2 = ref([
//     {
//         id: 1,
//         shop_name: "หนึ่ง นม นัว",
//         shop_address: "ถนนพญาไท เขตราชเทวี กรุงเทพฯ",
//         status: "รอตรวจสอบ",
//     },
// ]);
</script>