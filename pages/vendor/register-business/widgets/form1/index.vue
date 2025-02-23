<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useField, useForm, Form } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as zod from "zod";
import { useFormStore } from "@/store/businessStore.js";
import * as dataApi from "../../api/data.js";
import { useI18n } from 'vue-i18n';
const { t } = useI18n();

const stepsBar = ref([
    { step: 1, active: true },
    { step: 2, active: false },
    { step: 3, active: false },
    { step: 4, active: false },
    { step: 5, active: false },
])

const router = useRouter();
const formStore = useFormStore(); // ใช้ Pinia Store

const alertToast = ref({});
const resBusinessType = ref([]);

// โหลดข้อมูลประเภทธุรกิจ
const loadBusinessType = async () => {
  try {
    const res = await dataApi.getBusinessType();
    resBusinessType.value = res.data.data;
  } catch (error) {
    console.error(error);
    alertToast.value = {
      title: t('ล้มเหลว'),
      isError: true,
      color: "error",
      msg: error.response?.data?.message || "Error occurred",
      dataError: error,
    };
  }
};

// กำหนด Schema Validation
const requireValue = t('กรุณาระบุประเภทธุรกิจในแหล่งท่องเที่ยว');
const validationSchema = toTypedSchema(
  zod.object({
    selectedItem: zod.number({ required_error: requireValue, invalid_type_error: requireValue }),
  })
);

const { handleSubmit, errors } = useForm({
  validationSchema,
});

const { value: selectedItem } = useField('selectedItem', null, {
  initialValue: formStore.businessTypeId // ใช้ค่าจาก Pinia
});

const handleNext = handleSubmit(() => {
  const selectedBusiness = resBusinessType.value.find(
    (item) => item.id === selectedItem.value
  );

  if (selectedBusiness) {
    formStore.setForm1(selectedBusiness.id, selectedBusiness.business_type_name); // บันทึกค่าใน Pinia
    formStore.nextPage(); // ไปหน้าถัดไป
  }
});

onMounted(() => loadBusinessType());
</script>

<template>
  <div class="bg-zinc-100 min-h-screen">
    <van-nav-bar
      :title="t('ประเภทธุรกิจในแหล่งท่องเที่ยว')"
      left-arrow
      @click-left="formStore.prevPage()"
    ></van-nav-bar>

    <div class="p-4">
      <!-- Steps Bar -->
      <div class="flex space-x-5 items-center justify-center mb-8">
        <div
          v-for="(item, index) in stepsBar"
          :key="index"
          :class="item.active ? 'w-8 h-2 bg-blue-900' : 'w-8 h-2 bg-gray-200'"
        ></div>
      </div>

      <h2 class="text-center font-bold text-lg mb-8">
        {{ t('เลือกประเภทธุรกิจในแหล่งท่องเที่ยว') }}
      </h2>

      <!-- Form -->
      <Form @submit="handleNext">
        <div class="grid grid-cols-2 gap-3 mb-10">
          <div
            v-for="(item, index) in resBusinessType"
            :key="index"
            class="flex flex-col items-center justify-center border-2 rounded-sm p-4 
              hover:bg-blue-50 card cursor-pointer"
            :class="{ '!border-indigo-900': selectedItem === item.id }"
            @click="selectedItem = item.id"
          >
            <i :class="item.icon" class="text-2xl mb-2 text-primary-main"></i>
            <span class="text-sm">{{ item.business_type_name }}</span>
          </div>
        </div>

        <!-- แสดงข้อความข้อผิดพลาด -->
        <p v-if="errors.selectedItem" class="text-red-500 text-xl mb-4 text-center">
          {{ errors.selectedItem }}
        </p>

        <!-- ปุ่มถัดไป -->
        <Button
          :label="t('ถัดไป')"
          severity="primary"
          rounded
          class="w-full"
          :pt="{ root: { class: '!border-primary-main' } }"
          type="submit"
        />
      </Form>
    </div>
    <MyToast :data="alertToast" />
  </div>
</template>
