<template>
  <div class="flex flex-col items-center justify-center min-h-screen p-6">
    <!-- ปุ่มย้อนกลับ -->

    <BackPage class="absolute top-4 left-4" @click="formStore.prevPage"/>

    <!-- หัวข้อ -->
    <h2 class="text-red-500 font-bold text-2xl mt-6">รูปภาพธุรกิจการท่องเที่ยว</h2>
    <p class="text-gray-600 text-center mt-2">เพิ่มรูปภาพธุรกิจการท่องเที่ยวของคุณ</p>
    <Form @submit="handleNext">
 
    <!-- กล่องอัปโหลดรูปภาพ -->
    <input ref="fileInputBgProfile" type="file" accept="image/*" @change="onFileSelectBgProfile" class="hidden" />
    <div class="relative mt-6" v-if="!image_profile">
      <label
        class="border-2 border-dashed border-gray-400 w-64 h-64 flex items-center justify-center rounded-lg cursor-pointer"
        @click="triggerFileInputProfile">
        <!-- <input type="file" accept="image/*" class="hidden" @change="onFileSelectBgProfile"/> -->

        <i class="fa-regular fa-image text-3xl text-gray-500"></i>
      </label>

    </div>
    <div v-else>

      <img @click="triggerFileInputProfile" :src="image_profile?.src" alt=""
        class="p-1 border-2 border-dashed border-gray-400 w-64 h-64 flex items-center justify-center rounded-lg cursor-pointer">
    </div>



    <!-- ปุ่มบันทึก -->

    <div class="flex justify-center mt-10">
    <Button  label="บันทึกข้อมูล" type="submit" class="!text-secondary-main" :loading="isloadingAxi" />

    </div>
  </Form>
  <my-toast />
  </div>
</template>

<script setup>
import { useFieldArray, useForm, Form, useField } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as zod from "zod";
import * as dataApi from "../api/data.js";
const isloadingAxi = useState('isloadingAxi')

const alertToast = ref({});


const requireValue = "กรุณาระบุข้อมูลให้ถูกต้อง";
const validationSchema = toTypedSchema(
  zod.object({
    image_profile: zod
      .union([
        zod.object({ src: zod.string() }), // Case where an object with `src` is provided
        zod.instanceof(File),           // Case where the raw File is directly passed
      ])
      .refine(
        (value) =>
          !(value instanceof File) || value.size > 0, // Ensure the file is not empty
        { message: requireValue }
      ),
  })
);
const { handleSubmit, handleReset, errors } = useForm({
  validationSchema,
});
const { value: image_profile } = useField('image_profile')
import { useFormStore } from "@/store/businessStore.js";
const formStore = useFormStore(); // ใช้ Pinia Store
const handleNext = handleSubmit(async() => {
  try { 
    console.log('on handle')
    const formData = new FormData();
    formData.append("business_type_id", parseInt(formStore.business_type_id));
    formData.append("business_type_name", formStore.business_type_name || "");
    formData.append("shop_name", formStore.shop_name);
    formData.append("shop_address", formStore.shop_address);
    formData.append("shop_phone", formStore.shop_phone);
    formData.append("shop_details", formStore.shop_details);
    formData.append("image_profile", image_profile.value.file);
    formData.append("status", true);
    const res = await dataApi.saveBusinessRegister(formData)
    navigateTo(`/vendor/register-business/success/${res.data.data?.id}`)
    } catch (error) {
        console.error(error)
        alertToast.value = {
            title: ("ล้มเหลว"),
            isError: true,
            color: "error",
            msg: error.response?.data?.message || "Error occurred",
            dataError: error,
        };
    }
});
// image_profile
const fileInputBgProfile = ref(null);
const onFileSelectBgProfile = (event) => {
  const file = event.target.files[0]; // Get the first selected file
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      image_profile.value = { src: e.target.result, file: file };
    };
    reader.readAsDataURL(file);
  }
};
const removeImageBgProfile = () => {
  image_profile.value = null;
};
const triggerFileInputProfile = () => {
  fileInputBgProfile.value.click(); // Programmatically click the file input
};
</script>
