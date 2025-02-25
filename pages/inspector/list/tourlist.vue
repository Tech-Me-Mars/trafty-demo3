<template>
    <div class="min-h-screen bg-white flex flex-col">

        <van-nav-bar :title="'จัดการแห่งท่องเที่ยว'" :border="true" >
            <template #left>
                <back-page @click="navigateTo('/inspector/home')" />
            </template>
        </van-nav-bar>


        <section class="p-4 flex-grow pt-10">
            <div class="">
                <!-- หัวข้อรายการ -->
                <h2 class="text-lg font-bold text-gray-800 mb-4">
                    รายการรอตรวจสอบ
                </h2>

                <!-- รายการร้านค้า -->
                <div v-if="resSurveytouristwaiting.length > 0">
                    <div v-for="shop in resSurveytouristwaiting" :key="shop.id"
                        class="border-b border-gray-300 py-4 flex justify-between items-center">
                        <!-- รายละเอียดร้านค้า -->
                        <div>
                            <h3 class="text-lg font-bold text-gray-900">{{ shop?.shop_name }}</h3>
                            <p class="text-gray-600 text-sm">{{ shop?.business_type_name }}</p>
                        </div>

                        <!-- ปุ่มตรวจสอบ -->
                        <!-- <button @click="navigateTo(`/client/information/${shop?.id}`)"
                            class="bg-red-500 hover:bg-red-600 text-white text-sm font-semibold py-2 px-4 rounded">
                            ตรวจสอบ
                        </button> -->
                        <Button label="ตรวจสอบ" class="!text-secondary-main" @click="navigateTo(`/client/information/${shop?.id}`)" />
                    </div>
                </div>

                <no-data v-else />
            </div>
        </section>

    </div>
</template>
<style scoped>
.van-nav-bar {
  --van-nav-bar-background: white;
  --van-nav-bar-height: 80px
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