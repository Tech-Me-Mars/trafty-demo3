<template>
  <div class="min-h-screen  flex flex-col">
    <!-- Header Section -->
    <van-nav-bar :title="('แจ้งเตือน')" :border="true">
      <template #title="">
        <h1 class="header-label">การแจ้งเตือน</h1>
      </template>
      <template #left>
        <BackPage @click="navigateTo(`/vendor/manage-business/home/${route.params.id}`)" />
      </template>
    </van-nav-bar>

    <!-- Notification Section -->
    <section class="p-4 flex-grow space-y-4">
      <div v-for="item in resNotify" :key="item.id" class="bg-white shadow-md p-4  border-l-4 border-red-500">
        <!-- Title -->
        <p class="text-red-500 font-bold text-lg">แจ้งเตือนการประเมิน</p>
        <!-- Description -->
        <p class="text-sm text-gray-700 mt-2 line-clamp-2">
          {{ item.warning_details }}
        </p>

        <!-- Button -->
        <div class="flex justify-center mt-3">
          <button
            @click="navigateTo(`/vendor/notifications/${route.params.id}/${item.id}/reply`)"
            class="px-4 py-2 bg-red-500 !text-secondary-main rounded-lg text-sm font-semibold"
          >
            ตอบกลับแจ้งเตือน
          </button>
        </div>
      </div>
    </section>
    <MyToast :data="alertToast" />

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

import { useFieldArray, useForm, Form, useField } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as zod from "zod";


import * as dataApi from "./api/data.js";


const resNotify = ref([])
const loadNotify = async () => {
  try {
    const res = await dataApi.getNotify(route.params.id);
    resNotify.value = res.data.data;
  } catch (error) {
    console.error(error)
  }
}

onMounted(() => {
  loadNotify();
})

const formatTime = (datetime) => {
  const date = new Date(datetime);
  return date.toLocaleTimeString("th-TH", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const requireValue = t('กรุณาระบุข้อมูลให้ถูกต้อง');
const validationSchema = toTypedSchema(
  zod.object({
    respond_warning_note: zod.string().nonempty(requireValue).default(""),
  })
);
const { handleSubmit, errors, handleReset } = useForm({
  validationSchema,
});

const { value: warning_details } = useField('warning_details')
const { value: respond_warning_note } = useField('respond_warning_note')
const { value: survey_warning_id } = useField('survey_warning_id')
const handleNext = handleSubmit(async () => {
  try {

    const formData = new FormData();
    formData.append('survey_warning_id', parseInt(survey_warning_id.value));
    formData.append('respond_warning_note', respond_warning_note.value);
    const res = await dataApi.saveReplyWarning(formData)

    
    
    await navigateTo(`/vendor/notifications/${route.params.id}/success`)
    showPopupReply.value = false
    handleReset();
    loadNotify();
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
});
const showPopupReply = ref(false);

const onClickSelect = (item) => {
  try {
    showPopupReply.value = true
    survey_warning_id.value = item.id
    warning_details.value = item.warning_details
  } catch (error) {
    console.error(error)
  }
}
</script>