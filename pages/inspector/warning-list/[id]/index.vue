<template>
    <div class="min-h-screen bg-zinc-50">
        <!-- Header Section -->
        <van-nav-bar :title="('ดูรายละเอียดใบเตือน')" left-arrow @click-left="router.go(-1)">
        </van-nav-bar>

        <section class="p-4">

            <div class="mb-10">
    
                <div class="mb-2 card max-w-md" v-for="(item, index) in fields" :key="index">
                    <div class="flex items-start space-x-3 mb-2">
                        <i class="fa-solid fa-circle-xmark text-red-600 mt-1"></i>
                        <p>{{ item?.value.warning_title }}</p>
                       
                        

                    </div>
                    <p class="text-black">{{ item.value.warning_details }}</p>
                    <div class="mb-3 px-2 py-2 bg-zinc-100 border border-gray-300 rounded-md flex items-start gap-2">
                        <div>
                            <Image v-if="item.value?.respond_warning_img" :src="item.value?.respond_warning_img"
                                alt="Image" width="50" class="object-cover w-20 h-20 rounded-md shadow-md"
                                :pt="{ image: { class: 'object-cover w-20 h-20 rounded-md shadow-md' } }" preview />
                        </div>
                        <div>
                            <span class="text-lg font-bold text-gray-800 mb-1">การตอบกลับ :</span>
                            <span class="text-md ">
                                {{ item?.value?.respond_warning_note }}
                            </span>
                        </div>

                    </div>

                    <div class="flex items-center space-x-4">
                        <div v-for="choice in item.value.choices" :key="choice.audit_choices_id"
                            class="flex items-center space-x-2">
                            <RadioButton :inputId="`question_${choice.audit_choices_id}`"
                                v-model="item.value.choices_answer" :value="choice.audit_choices_id" class="mr-2"
                                :invalid="errors[`list_survey[${index}].choices_answer`] ? true : false" />
                            <label class="" :for="`question_${choice.audit_choices_id}`">{{ choice.audit_choice_text
                            }}</label>
                        </div>
                    </div>
                </div>

            </div>

            <div class=" mx-auto">
                <!-- <Button :loading="isloadingAxi" label="ตรวจสอบมาตรฐาน" rounded class="w-full mb-5"
                    @click="navigateTo(`/inspector/inspec-vendor/${resData.business_id}/safety-form/form1/`)" /> -->
                <Button :loading="isloadingAxi" :label="('อนุมัติ')" rounded class="w-full" @click="setApprove()" />
            </div>






        </section>

        <MyToast :data="alertToast" />

    </div>
</template>

<style>
.van-nav-bar {
    --van-nav-bar-background: #ffc83A;
    --van-nav-bar-text-color: black;
    --van-nav-bar-icon-color: black;
    --van-nav-bar-title-text-color: black;
    --van-nav-bar-height: 70px;
}

.van-tab {
    --van-tab-active-text-color: #281c74 !important
}

.van-tabs__line {
    width: 120px !important;
    background: #281c74 !important;
}
</style>

<script setup>
definePageMeta({
    middleware: ["auth"],
});
import { useI18n } from 'vue-i18n';
const { t } = useI18n();

const isloadingAxi = useState("isloadingAxi");
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import * as dataApi from "./api/data.js";
import { useFieldArray, useForm, Form, useField } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as zod from "zod";

const router = useRouter();
const route = useRoute();
const alertToast = ref({});

const resData = ref();
const loadData = async () => {
    try {
        const res = await dataApi.getSurveyWarningRespon(route.params.id);
        console.log(res.data.data)
        resData.value = res.data.data;
        res.data.data?.responds?.forEach((e, i) => {
            push({
                // key: fields.value.length + 1,
                // value: {
                survey_warning_respond_details_id: e.survey_warning_respond_details_id,
                survey_audit_police_details_id: e.survey_audit_police_details_id,
                warning_title: e.warning_title,
                warning_details: e.warning_details,
                respond_warning_note: e.respond_warning_note,
                respond_warning_img: e.respond_warning_img,
                choices: e?.choices || [],
                choices_answer: null
                // }
            });
        });


    } catch (error) {
        console.error(error)
    }
}
onMounted(() => loadData())

const requireValue = ('กรุณาระบุข้อมูลให้ถูกต้อง');
// *************  VARIDATOR
const validationSchema = toTypedSchema(
    zod.object({
        list_survey: zod.array(
            zod.object({
                choices_answer: zod.number({
                    required_error: requireValue,
                    invalid_type_error: requireValue,
                }),
            })
        ),
    })
);
const { handleSubmit, errors, handleReset } = useForm({
    initialValues: {

    },
    validationSchema,
});

const { value: respond_warning_note } = useField('respond_warning_note')
const { remove, push, fields } = useFieldArray("list_survey");

const setApprove = async () => {
    try {
        // const res = await dataApi.saveUpdateSurveyPoliceToApprove(payload);
        const res = await dataApi.saveApproveWarningRespon(parseInt(route.params.id));
        
        alertToast.value = {
            title: ('สำเร็จ'),
            color: 'info',
            isError: false,
            msg: res.data.message,
        }
        // setTimeout(() => {
        navigateTo(`/inspector/warning-list/${route.params.id}/success`)
        // }, 1500);
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
</script>