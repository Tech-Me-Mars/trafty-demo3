<template>
    <div class="min-h-screen flex flex-col bg-white">
        <van-nav-bar title="" left-arrow @click-left="router.go(-1)">
            <template #left>
                <back-page />
            </template>
        </van-nav-bar>


        <!-- Content -->



        <section class="p-4 card-content flex-grow pt-10">
            <h1 class="text-red-500 text-center text-2xl font-bold mb-5">ตอบกลับ</h1>
            <p class="text-center text-gray-700 mb-6">
                กรุณาพิมพ์ข้อความเพื่อตอบกลับเจ้าหน้าที่
            </p>
            <!-- Form Section -->
            <Form @submit="handleNext">

                <div class="mb-24">

                    <Textarea placeholder="พิมพ์ข้อความ..." class="w-full !bg-gray-200" rows="12" cols="30"
                        v-model="respond_warning_note" />
                    <p class="error-text" v-if="errors?.respond_warning_note">{{ errors?.respond_warning_note }}</p>
                </div>





                <!-- Submit Button -->
                <Button :loading="isloadingAxi" type="submit" label='ส่ง' severity="primary"
                    class="w-full !text-secondary-main !border-none" :pt="{
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
import * as dataApi from "../api/data.js";

import { useFieldArray, useForm, Form, useField } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as zod from "zod";

const requireValue = ('กรุณาระบุข้อมูลให้ถูกต้อง');
// *************  VARIDATOR
const validationSchema = toTypedSchema(
    zod.object({
        // warning_title: zod.string().nonempty(requireValue).default(""),
        respond_warning_note: zod.string().nonempty(requireValue).default(""),
    })
);
const { handleSubmit, handleReset, errors } = useForm({
    validationSchema,
});



const { value: respond_warning_note } = useField('respond_warning_note')
const { value: survey_warning_id } = useField('survey_warning_id')
survey_warning_id.value = route.params.subid

const handleNext = handleSubmit(async () => {
    try {
        const formData = new FormData();
        formData.append('survey_warning_id', parseInt(survey_warning_id.value));
        formData.append('respond_warning_note', respond_warning_note.value);
        const res = await dataApi.saveReplyWarning(formData)
        alertToast.value = {
            title: ('สำเร็จ'),
            color: 'info',
            isError: false,
            msg: res.data.message,
        }
        // setTimeout(() => {
        navigateTo(`/vendor/notifications/${route.params.id}/${route.params.subid}/success`)
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