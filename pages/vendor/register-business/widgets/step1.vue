<script setup>
definePageMeta({
  middleware: ["auth"],
});
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
const isloadingAxi = useState("isloadingAxi");
const router = useRouter();
const alertToast = ref({});

import { useFieldArray, useForm, Form, useField } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as zod from "zod";
import * as dataApi from "../api/data.js";

const resBusinessType = ref([])
const loadBusinessType = async () => {
  try {
    const res = await dataApi.getBusinessType();
    resBusinessType.value = res.data.data;
  } catch (error) {
    console.error(error)
  }
}

onMounted(() => loadBusinessType());
const requireValue = t('กรุณาระบุข้อมูลให้ถูกต้อง');
const requireText = t('ระบุข้อมูล');
// *************  VARIDATOR
const validationSchema = toTypedSchema(
  zod.object({
    shop_name: zod.string().nonempty(requireValue).default(""),
    business_type_id: zod.number({ required_error: requireValue, invalid_type_error: requireValue }),
    shop_details: zod.string().nonempty(requireValue).default(""),
    shop_address: zod.string().nonempty(requireValue).default(""),
    shop_phone: zod.string().nonempty(requireValue).default(""),
    shop_phone: zod.string().nonempty(requireValue).default(""),
  })
);
const { handleSubmit, handleReset, errors } = useForm({
  validationSchema,
});

const { value: shop_name } = useField('shop_name')
const { value: shop_address } = useField('shop_address')
const { value: shop_phone } = useField('shop_phone')
const { value: shop_details } = useField('shop_details')
const { value: business_type_id } = useField('business_type_id')
const { value: business_type_name } = useField('business_type_name')




import { format } from 'date-fns';
import { useFormStore } from "@/store/businessStore.js";
const formStore = useFormStore(); // ใช้ Pinia Store
const onSubmit = handleSubmit(async () => {

  try {
    // ค้นหาชื่อ business_type_name จาก business_type_id
    const selectedBusiness = resBusinessType.value.find(
      (item) => item.id === business_type_id.value
    );
    if (selectedBusiness) {
      business_type_name.value = selectedBusiness.business_type_name;
    }

    // ✅ บันทึกข้อมูลลงใน Pinia Store
    formStore.setStep1(
      business_type_id.value,
      business_type_name.value,
      shop_name.value,
      shop_address.value,
      shop_phone.value,
      shop_details.value,
    );
    formStore.goToPage(2)
  } catch (error) {
    console.error(error);
    alertToast.value = {
            title: "ล้มเหลว",
            isError: true,
            color: "error",
            msg: error.response?.data?.message || "Error occurred",
            dataError: error,
        };
  }

});

</script>
<style scoped>
.van-nav-bar {
  --van-nav-bar-background: white;
  --van-nav-bar-height: 100px
}
</style>
<template>
  <div class="min-h-screen bg-white">
    <!-- <layouts-header style="height: 150px;" class="flex justify-center">
      <BackPage class=""/>
      <h6 class="header-label mx-auto">กรอกข้อมูลของคุณ</h6>

    </layouts-header> -->
    <van-nav-bar title="">
      <template #title>
        <h1 class="header-label">กรอกข้อมูลของคุณ</h1>
      </template>
      <template #left>
        <back-page />
      </template>
    </van-nav-bar>
    <section class="p-4 card-content">

      <Form @submit="onSubmit">
        <div class="card pt-0 mb-10">
          <div class="space-y-4 mb-2">

            <div>
              <label class="label-input">ชื่อธุรกิจ</label>
              <InputText v-model="shop_name" class="w-full custom-border" :invalid="errors?.shop_name ? true : false" />
              <p class="error-text" v-if="errors?.shop_name">{{ errors?.shop_name }}</p>

            </div>

            <div>
              <label class="label-input">ประเภทธุรกิจ</label>
              <Select v-model="business_type_id" :options="resBusinessType" optionLabel="business_type_name"
                optionValue="id" class="w-full custom-border">
              </Select>
              <p class="error-text" v-if="errors?.business_type_id">{{ errors?.business_type_id }}</p>
            </div>

            <div>
              <label class="label-input">เบอร์โทรศัพท์</label>
              <InputText v-keyfilter.int v-model="shop_phone" class="w-full custom-border"
                :invalid="errors?.shop_phone ? true : false" />
              <p class="error-text" v-if="errors?.shop_phone">{{ errors?.shop_phone }}</p>
            </div>


            <div>
              <label class="label-input">ที่อยู่</label>
              <InputText v-model="shop_address" placeholder="ที่อยู่" class="w-full custom-border"
                :invalid="errors?.shop_address ? true : false" />
              <p class="error-text" v-if="errors?.shop_address">{{ errors?.shop_address }}</p>
            </div>

            <div>
              <label class="label-input">รายละเอียดธุรกิจ</label>
              <InputText v-model="shop_details" placeholder="รายละเอียดธุรกิจ" class="w-full custom-border"
                :invalid="errors?.shop_details ? true : false" />
              <p class="error-text" v-if="errors?.shop_details">{{ errors?.shop_details }}</p>
            </div>

          </div>
          <hr class="border-b-2 mb-3" />

        </div>

        <Button :loading="isloadingAxi" :label="'บันทึกข้อมูล'" type="submit" class="w-full !text-secondary-main" />
      </Form>

    </section>
    <MyToast :data="alertToast" />

  </div>
</template>