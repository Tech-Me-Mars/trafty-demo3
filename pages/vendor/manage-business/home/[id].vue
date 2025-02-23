<template>
    <div class="min-h-screen flex flex-col" style="background-color: #ffc83A;">
        <!-- Header -->
        <div class="flex justify-between items-center px-4 py-4 bg-yellow-400">
            <h1 class="text-lg font-bold text-black">ข้อมูลแหล่งท่องเที่ยวของคุณ</h1>
            <div class="flex items-center space-x-4">
                <!-- ปุ่มแจ้งเตือน -->
                <van-badge :content="getNotifyCoute" v-if="getNotifyCoute>0">
                <button @click="navigateTo(`/vendor/notifications/${route.params.id}`)"
                    class="w-10 h-10 bg-yellow-200 flex items-center justify-center rounded-full shadow-md hover:bg-yellow-300 transition">
                    <i class="fa-solid fa-bell text-2xl text-gray-800"></i>
                </button>
                </van-badge>
                <button v-else @click="navigateTo(`/vendor/notifications/${route.params.id}`)"
                    class="w-10 h-10 bg-yellow-200 flex items-center justify-center rounded-full shadow-md hover:bg-yellow-300 transition">
                    <i class="fa-solid fa-bell text-2xl text-gray-800"></i>
                </button>                
                

                <!-- ปุ่มเมนู -->
                <!-- <button
                    class="w-10 h-10 bg-yellow-200 flex items-center justify-center rounded-full shadow-md hover:bg-yellow-300 transition">
                    <i class="fa-solid fa-bars text-2xl text-gray-800"></i>
                </button> -->
                <drawer-menu></drawer-menu>
            </div>
        </div>

        <!-- รายการสถานที่ -->
        <div class=" p-6">
            <div class="card rounded-lg">
                <div class="flex space-x-3">
                    <!-- รูปภาพ -->
                    <img :src="resShop?.image_profile" alt="สถานที่" class="w-16 h-16 rounded-md object-cover">

                    <!-- รายละเอียด -->
                    <div class="flex-1">
                        <h2 class="text-black font-semibold">{{ resShop?.shop_name }}</h2>
                        <p class="text-gray-500 text-sm">{{ resShop?.business_type_name }}</p>

                        <!-- ป้ายสถานะ -->
                        <div class="mt-2">
                            <p
                                class="bg-red-100 text-red-600 text-xs font-semibold px-2 py-1 rounded-md flex items-center space-x-1 inline-flex ">
                                <i class="fa-solid fa-circle-exclamation text-xs"></i>
                                <span v-if="resShop?.status == true">รออนุมัติ</span>
                                <span v-else>ตรวจสอบแล้ว</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- รายการของฉัน -->
        <div class="bg-yellow-100 p-4">
            <h2 class="text-black font-semibold">รายการของฉัน ({{ listItemShop.length }})</h2>
        </div>

        <!-- กล่องว่าง -->
        <div v-if="resShop?.business_lists.length > 0"
            class="flex flex-col items-center justify-start h-full bg-white flex-grow p-4">
            <div class="w-full">
                <div v-for="(item, index) in resShop?.business_lists" :key="index"
                    class="flex justify-between items-center border-b py-4">
                    <span class="text-lg font-semibold">{{ item.business_list_name }}</span>
                    <Button severity="danger" label="ลบรายการ" class="bg-red-600 !text-white px-4 py-2 rounded-md"
                        @click="askDeleteItem(item)" />
                </div>
            </div>

        </div>
        <div v-else class="flex flex-col items-center justify-center h-full bg-white flex-grow p-4">
            <!-- <div class="flex flex-col items-center justify-center mt-10">
                <img src="/image/no-data.png" alt="ไม่มีข้อมูล" class="w-16 h-16" />
                <p class="text-gray-500 mt-2">ยังไม่มีข้อมูล</p>
            </div> -->
            <no-data class="mt-10" />
        </div>


        <!-- ปุ่มเพิ่ม -->
        <button @click="showAddMenu = true"
            class="fixed bottom-6 right-6 bg-black !text-white w-12 h-12 flex items-center justify-center rounded-full shadow-lg hover:scale-105 transition">
            <i class="fa-solid fa-plus text-xl"></i>
        </button>


        <van-popup v-model:show="showAddMenu" round position="bottom" :style="{ height: '50%' }">
            <!-- หัวข้อ และปุ่มปิด -->
            <Form @submit="handleNext">
                <div class="flex items-center justify-between border-b p-5 ">
                    <h2 class="text-lg font-semibold text-black mx-auto">เพิ่มเมนู</h2>
                    <button @click="showAddMenu = false"
                        class="w-8 h-8 bg-yellow-400 text-black rounded-full flex items-center justify-center shadow-md hover:bg-yellow-500 transition absolute right-2">
                        <i class="fa-solid fa-xmark text-lg"></i>
                    </button>
                </div>

                <!-- ฟอร์มกรอกข้อมูล -->
                <div class="mt-4 px-6">
                    <label class="text-gray-500 text-sm">ชื่อเมนู</label>
                    <InputText type="text" v-model="business_list_name"
                        class="w-full border border-yellow-400 focus:border-yellow-500 rounded-md p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        placeholder="ชื่อเมนู" :invalid="errors?.business_list_name ? true : false" />
                </div>
                
                <!-- ปุ่มเพิ่มรายการ -->
                <!-- <button
                class="bg-yellow-400 text-black font-semibold py-3 w-full rounded-lg mt-6 hover:bg-yellow-500 transition">
                เพิ่มรายการ
            </button> -->
                <div class="px-6 mt-10">
                    <Button :loading="isloadingAxi" :label="'เพิ่มรายการ'" type="submit" class="w-full text-black" />

                </div>
            </Form>
        </van-popup>

        <ConfirmDialog group="headless">
            <template #container="{ message, acceptCallback, rejectCallback }">
                <div class="flex flex-col items-center p-8 bg-surface-0  rounded">
                    <!-- <div class="rounded-full bg-primary text-primary-contrast inline-flex justify-center items-center h-24 w-24 -mt-20">
                    <i class="pi pi-question text-5xl"></i>
                </div> -->
                    <span class="font-bold text-2xl block mb-2 mt-6">{{ message.header }}</span>
                    <p class="mb-0">{{ message.message }}</p>
                    <div class="flex items-center gap-2 mt-6">
                        <Button :loading="isloadingAxi" :label="('ยืนยัน')" @click="acceptCallback"></Button>
                        <Button :loading="isloadingAxi" :label="('ยกเลิก')" outlined @click="rejectCallback"></Button>
                    </div>
                </div>
            </template>
        </ConfirmDialog>
    </div>
    <MyToast :data="alertToast" />

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
    loadShop()
    loadNotyfy()
 })

const listItemShop = ref([
    { name: "ลาวาโทสต์วานอฟฟี่" },
    { name: "บิงซู" },
    { name: "สเลอปี้ชาเขียว" },
])

const removeItem = (index) => {
    listItemShop.value.splice(index, 1);
};
import { useFieldArray, useForm, Form, useField } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as zod from "zod";
const requireValue = ('กรุณาระบุข้อมูลให้ถูกต้อง');
// *************  VARIDATOR
const validationSchema = toTypedSchema(
    zod.object({
        business_list_name: zod.string().nonempty(requireValue).default(""),
    })
);
const { handleSubmit, handleReset, errors } = useForm({
    validationSchema,
});


const { value: business_list_name } = useField('business_list_name')

const handleNext = handleSubmit(async () => {
    try {
        const payload = {
            "business_id": parseInt(route.params.id),
            "shop_name": resShop.value?.shop_name,
            "business_list_name": business_list_name.value,
            "business_list_price": "0",
            "status": true
            // "status": false
        }
        const res = await dataApi.createBusinessList(payload);
        handleReset()
        loadShop();
        showAddMenu.value = false
    } catch (error) {
        alertToast.value = {
            title: ('ล้มเหลว'),
            isError: true,
            color: "error",
            msg: error.response?.data?.message || "Error occurred",
            dataError: error,
        };
        console.error(error)
    }
})

import { useConfirm } from "primevue/useconfirm";
const confirm = useConfirm();
const idFordelete=ref();
const askDeleteItem = async (item)=>{
    try {
        console.log(item)
        idFordelete.value =await item.id
        console.log(idFordelete.value)

        confirm.require({
        group: 'headless',
        header: 'ยืนยัน',
        message: 'กดยืนยันการลบรายการ',
        accept: () => {
            deleteItemShop();
        },
        reject: () => {
            // toast.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
        }
    });
    } catch (error) {
        
    }
}
const deleteItemShop = async()=>{
    try {
        const res = await dataApi.deleteBusinessList(idFordelete.value);
        loadShop();
    } catch (error) {
        alertToast.value = {
            title: ('ล้มเหลว'),
            isError: true,
            color: "error",
            msg: error.response?.data?.message || "Error occurred",
            dataError: error,
        };
        console.error(error)
    }
}

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