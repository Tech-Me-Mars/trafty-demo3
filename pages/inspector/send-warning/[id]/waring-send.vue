<template>
    <div class="min-h-screen flex flex-col bg-white">
        <van-nav-bar title="" left-arrow @click-left="router.go(-1)">
            <template #left>
                <back-page/>
            </template>
        </van-nav-bar>


        <!-- Content -->



        <section class="p-4 card-content flex-grow pt-10">
            <h1 class="text-red-500 text-center text-2xl font-bold mb-5">ส่งใบเตือน</h1>
            <p class="text-center text-gray-700 mb-6">
                กรุณาพิมพ์ข้อความเพื่อตักเตือนธุรกิจในแหล่งท่องเที่ยว
            </p>
            <!-- Form Section -->
            <Form @submit="handleNext">

                <div class="mb-24">
                   
                    <Textarea placeholder="พิมพ์ข้อความ..." class="w-full !bg-gray-200" rows="12" cols="30"
                        v-model="warning_details" />
                    <p class="error-text" v-if="errors?.warning_details">{{ errors?.warning_details }}</p>
                </div>





                <!-- Submit Button -->
                <Button :loading="isloadingAxi" type="submit" label='ส่ง' severity="primary" class="w-full !text-secondary-main !border-none"
                    :pt="{
                        root: {
                            class: '!border-primary-main'
                        },
                    }" />


            </Form>

            <MyToast :data="alertToast" />
        </section>
    </div>

</template>

<script setup>
definePageMeta({
    middleware: ["auth"],
});
import { useI18n } from 'vue-i18n';
const { t } = useI18n();

const isloadingAxi = useState("isloadingAxi");
const route = useRoute();
const router = useRouter();


const alertToast = ref({})
import * as dataApi from "./api/data.js";

import { useFieldArray, useForm, Form, useField } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as zod from "zod";


const resData = ref()
const loadData = async () => {
    try {
        const res = await dataApi.getSuveyAuditPolice(route.params.id);
        resData.value = res.data.data
        //   resData.value= res.data.data;
        console.log(res.data.data)
        shop_name.value = res.data.data.shop_name
    } catch (error) {
        console.error(error)
    }
}

onMounted(() => loadData())
const requireValue = ('กรุณาระบุข้อมูลให้ถูกต้อง');
// *************  VARIDATOR
const validationSchema = toTypedSchema(
    zod.object({
        // warning_title: zod.string().nonempty(requireValue).default(""),
        warning_details: zod.string().nonempty(requireValue).default(""),
    })
);
const { handleSubmit, handleReset, errors } = useForm({
    validationSchema,
});


const { value: shop_name } = useField('shop_name')

const { value: warning_title } = useField('warning_title')
const { value: warning_details } = useField('warning_details')

const handleNext = handleSubmit(async () => {
    try {
        const payload = {
            "survey_audit_police_id": parseInt(route.params.id),
            "warning_details": warning_details.value
        }
        const res = await dataApi.saveSurveyPoliceWarning(payload);
        handleReset()
        alertToast.value = {
            title: ('สำเร็จ'),
            color: 'info',
            isError: false,
            msg: res.data.message,
        }
        // setTimeout(() => {
        navigateTo(`/inspector/send-warning/${route.params.id}/success`)
        // }, 1000);
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
</script>

<style>
.van-nav-bar {
  --van-nav-bar-background: white;
  --van-nav-bar-height: 80px
}
</style>