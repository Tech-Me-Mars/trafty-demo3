<template>
  <div class="min-h-screen bg-primary-main flex flex-col">
    <!-- Header Section -->
    <van-nav-bar :title="('แจ้งเตือน')" :border="false">
      <template #left>
        <BackPage @click="navigateTo(`/vendor/manage-business/home/${route.params.id}`)" />
      </template>
    </van-nav-bar>

    <!-- Notification Section -->
    <section class="p-4 flex-grow pt-10 space-y-2 ">
      <div v-for="item in resNotify" :key="item.id" class=" bg-white shadow-md p-4 cursor-pointer rounded-lg">
        <div class="flex items-center">
          <!-- Icon -->
          <div class="flex-shrink-0 bg-red-100 w-10 h-10 flex items-center justify-center rounded-full">
            <i class="fas fa-bell text-red-500 text-xl"></i>
          </div>

          <!-- Content -->
          <div class="ml-4 flex-1">
            <p class="text-sm font-semibold text-gray-900">{{ item.warning_title }}</p>
            <p class="text-sm text-gray-600 mt-1 line-clamp-2">
              {{ item.warning_details }}
            </p>

          </div>
        </div>


        <div class="flex justify-end">
          <!-- Button -->
          <Button @click="onClickSelect(item)" label="ตอบกลับ" size="small" severity="contrast" class="!text-white">
          </Button>

          <van-popup v-model:show="showPopupReply" round position="bottom" :style="{ height: '70%' }">
            <Form @submit="handleNext" class="p-6 bg-white rounded-t-lg relative">
              <!-- ปุ่มปิด -->
              <button @click="showPopupReply = false" class="absolute top-4 right-4 text-gray-500">
                <i class="fas fa-times text-xl"></i>
              </button>

              <!-- หัวข้อ -->
              <h2 class="text-lg font-bold text-gray-900">ตอบกลับใบเตือน</h2>

              <!-- รายละเอียดใบเตือน -->
              <p class="mt-2 text-gray-700 text-sm">
                {{ warning_details }}
              </p>

              <!-- ฟอร์มตอบกลับ -->
              <div class="mt-4">

                <label class="block text-sm font-semibold text-gray-900 mb-1">ตอบกลับเจ้าหน้าที่</label>
                <Textarea class="w-full p-3 border border-yellow-400 rounded-lg focus:ring focus:ring-yellow-300"
                  placeholder="พิมพ์ตอบกลับที่นี่..." rows="4" v-model="respond_warning_note"
                  :invalid="errors?.respond_warning_note ? true : false"></Textarea>
              </div>

              <!-- ปุ่มตอบกลับ -->
              <Button type="submit" :loading="isloadingAxi" label="ตอบกลับใบเตือน"
                class="mt-4 w-full bg-yellow-400 text-white font-semibold py-3 rounded-lg">

              </Button>
            </Form>
          </van-popup>
        </div>
      </div>
    </section>
    <MyToast :data="alertToast" />

  </div>
</template>

<style scoped>
.van-nav-bar {
  --van-nav-bar-background: #ffc83A;
  --van-nav-bar-text-color: black;
  --van-nav-bar-icon-color: black;
  --van-nav-bar-title-text-color: black;
  --van-nav-bar-height: 70px;
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