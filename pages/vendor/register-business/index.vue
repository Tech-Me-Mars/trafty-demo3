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
import * as dataApi from "./api/data.js";

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
    // business_type_name: zod.number({ required_error: requireValue, invalid_type_error: requireValue }),
    shop_details: zod.string().nonempty(requireValue).default(""),
    shop_address: zod.string().nonempty(requireValue).default(""),
    shop_phone: zod.string().nonempty(requireValue).default(""),
    business_email: zod
      .string()
      .email(t('กรุณาระบุอีเมลที่ถูกต้อง'))
      .nonempty(requireValue)
      .default(""),

    // shop_time: zod.string().nonempty(requireValue).default(""),
    shop_phone: zod.string().nonempty(requireValue).default(""),
  
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

    business_img: zod.custom((value) => {
      if (value != null && (Array.isArray(value) ? value.length > 0 : true)) {
        return value;
      }
    }),
  })
);
const { handleSubmit, handleReset, errors } = useForm({
  initialValues: {
    social_media: [
      {
        social_name: "",
        social_link: ""

      },
    ],
  },
  validationSchema,
});

const { value: image_profile } = useField('image_profile')
const { value: shop_name } = useField('shop_name')
const { value: shop_address } = useField('shop_address')
const { value: shop_phone } = useField('shop_phone')
const { value: shop_details } = useField('shop_details')
const { value: business_email } = useField('business_email')
const { value: business_type_id } = useField('business_type_id')
const { value: business_type_name } = useField('business_type_name')

const { value: business_img } = useField('business_img', null, {
  initialValue: []
})


import { format } from 'date-fns';
import { useFormStore } from "@/store/businessStore.js";
const formStore = useFormStore(); // ใช้ Pinia Store
const onSubmit = handleSubmit(async () => {

  try {
    const selectedBusiness = resBusinessType.value.find(
      (item) => item.id === business_type_id.value
    );
    if (selectedBusiness) {
      business_type_name.value = selectedBusiness.business_type_name
    }

    const formData = new FormData();
    formData.append("business_type_id", parseInt(business_type_id.value));
    formData.append("business_type_name", business_type_name.value || "");
    formData.append("shop_name", shop_name.value);
    formData.append("shop_address", shop_address.value);
    formData.append("shop_phone", shop_phone.value);
    formData.append("shop_details", shop_details.value);
    formData.append("business_email", business_email.value);
    formData.append("image_profile", image_profile.value.file);
    business_img.value.forEach((item) => {
      formData.append("business_images", item.file);
    });
    formData.append("status", true);

    const res = await dataApi.saveBusinessRegister(formData)
    navigateTo(`/vendor/register-business/success/${res.data.data?.id}`)
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
});


// function onFileSelect(event) {
//     event.files.forEach(file => {
//         const reader = new FileReader();
//         reader.onload = (e) => {
//             business_img.value.push({ src: e.target.result, file: file });  // Store both the image preview and the file
//         };
//         reader.readAsDataURL(file);  // Read the file as a data URL
//     });
// }
function onFileSelect(event) {
  event.files.forEach(file => {
    if (business_img.value.length >= 3) return; // จำกัดจำนวนไฟล์ที่ 5

    const reader = new FileReader();
    reader.onload = (e) => {
      if (business_img.value.length < 3) { // ตรวจสอบอีกครั้งก่อน push
        business_img.value.push({ src: e.target.result, file: file });
      }
    };
    reader.readAsDataURL(file);
  });
}

const removeImage = (index) => {
  business_img.value.splice(index, 1);  // Remove the image from the array
};
const fileInput = ref(null);
const triggerFileInput = () => {
  fileInput.value.choose();
};

// Reference to the hidden file input
const fileInputBgCover = ref(null);

// Handle file selection
const onFileSelectBgCover = (event) => {
  const file = event.target.files[0]; // Get the first selected file
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      // Set the image source for preview and keep the file for upload
      image_cover.value = { src: e.target.result, file: file };
      console.log('image_cover', image_cover.value)
    };
    reader.readAsDataURL(file); // Read the file as a data URL
  }
};

// Remove the selected image
const removeImageBgCover = () => {
  image_cover.value = null; // Clear the image preview and file data
};

// Trigger the hidden file input
const triggerFileInputBgCover = () => {
  fileInputBgCover.value.click(); // Programmatically click the file input
};


// ###################### profile ##############

// Reference to the hidden file input
const fileInputBgProfile = ref(null);

// Handle file selection
const onFileSelectBgProfile = (event) => {
  const file = event.target.files[0]; // Get the first selected file
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      // Set the image source for preview and keep the file for upload
      image_profile.value = { src: e.target.result, file: file };
      console.log('image_profile', image_profile.value)
    };
    reader.readAsDataURL(file); // Read the file as a data URL
  }
};

// Remove the selected image
const removeImageBgProfile = () => {
  image_profile.value = null; // Clear the image preview and file data
};

// Trigger the hidden file input
const triggerFileInputProfile = () => {
  fileInputBgProfile.value.click(); // Programmatically click the file input
};


</script>
<style scoped>
.van-nav-bar {
  --van-nav-bar-background: #ffc83A;
  --van-nav-bar-text-color: black;
  --van-nav-bar-icon-color: black;
  --van-nav-bar-title-text-color: black;
  --van-nav-bar-height: 120px
}
</style>
<template>
  <div class="min-h-screen bg-primary-main">
    <layouts-header style="height: 150px;">
      <h6 class="header-label mb-4">เริ่มต้นสร้างธุรกิจการท่องเที่ยว</h6>
      <p>กรุณากรอกข้อมูลธุรกิจการท่องเที่ยวของคุณให้ครบถ้วน</p>

    </layouts-header>
    <!-- <van-nav-bar title="">
      <template #title>
        เริ่มต้นสร้างธุรกิจการท่องเที่ยว<br>
        <p class="text-xs">กรุณากรอกข้อมูลธุรกิจการท่องเที่ยวของคุณให้ครบถ้วน</p>
        </template>
</van-nav-bar> -->
    <section class="p-4 card-content">
      {{ errors }}
      <Form @submit="onSubmit">
        <div class="card pt-0 mb-10">
          <div class="space-y-4 mb-2">

            <div>
              <label class="label-input">ชื่อธุรกิจ</label>
              <InputText v-model="shop_name" :placeholder="'ชื่อธุรกิจในแหล่งท่องเที่ยว'" class="w-full custom-border"
                :invalid="errors?.shop_name ? true : false" />
              <p class="error-text" v-if="errors?.shop_name">{{ errors?.shop_name }}</p>

            </div>

            <div>
              <label class="label-input">ประเภทธุรกิจ</label>
              <Select v-model="business_type_id" :options="resBusinessType" optionLabel="business_type_name"
                optionValue="id" class="w-full custom-border" :placeholder="'ประเภทธุรกิจ'">
              </Select>
              <p class="error-text" v-if="errors?.business_type_id">{{ errors?.business_type_id }}</p>
            </div>

            <div>
              <label class="label-input">รายละเอียดธุรกิจ</label>
              <InputText v-model="shop_details" placeholder="รายละเอียดธุรกิจ" class="w-full custom-border"
                :invalid="errors?.shop_details ? true : false" />
              <p class="error-text" v-if="errors?.shop_details">{{ errors?.shop_details }}</p>
            </div>

            <div>
              <label class="label-input">ที่อยู่</label>
              <InputText v-model="shop_address" placeholder="ที่อยู่" class="w-full custom-border"
                :invalid="errors?.shop_address ? true : false" />
              <p class="error-text" v-if="errors?.shop_address">{{ errors?.shop_address }}</p>
            </div>

            <div>
              <label class="label-input">ติดต่อ</label>
              <InputText v-keyfilter.int v-model="shop_phone" :placeholder="t('เบอร์โทรศัพท์')"
                class="w-full custom-border" :invalid="errors?.shop_phone ? true : false" />
              <p class="error-text" v-if="errors?.shop_phone">{{ errors?.shop_phone }}</p>

            </div>

            <div>
              <label class="label-input">{{ t('อีเมล') }}</label>
              <InputText v-model="business_email" :placeholder="t('อีเมล')" class="w-full custom-border"
                :invalid="errors?.business_email ? true : false" />
              <p class="error-text" v-if="errors?.business_email">{{ errors?.business_email }}</p>

            </div>
          </div>



          <div>
            <p class="text-gray-500 text-sm">{{ t('อัพโหลดรูปภาพโปรไฟล์') }}</p>
            <div class="flex flex-wrap gap-2 mb-3 relative">
              <div class="relative" v-if="image_profile?.src">
                <img :src="image_profile.src" alt="Image" width="50" class="!object-cover w-[5rem] h-[5rem]"
                  :pt="{ image: { class: 'object-cover w-12 h-12 rounded-md ' } }" preview />
                <i class="fa-solid fa-xmark absolute top-0 right-0 p-0.5 text-white rounded-full cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-110 hover:bg-red-300"
                  @click="removeImageBgProfile"></i>
              </div>

              <!-- Upload Button -->
              <div class="flex" v-else>
                <label
                  class="w-[5rem] h-[5rem] border-2 border-dashed border-yellow-400 rounded-lg flex items-center justify-center cursor-pointer hover:border-yellow-500 transition duration-300"
                  @click="triggerFileInputProfile">
                  <i class="fa-solid fa-image text-yellow-400 text-3xl"></i>
                </label>
                <input ref="fileInputBgProfile" id="upload-image" type="file" accept="image/*"
                  @change="onFileSelectBgProfile" class="hidden" />
              </div>


            </div>
            <p class="error-text" v-if="errors?.image_profile">{{ t('กรุณาเลือกอย่างน้อย') }} 1 {{ t('ภาพ') }}</p>
          </div>




          <p class="text-gray-500 text-sm">อัพโหลดรูปภาพธุรกิจ</p>
          <div class="flex flex-wrap gap-2 mb-3 relative">
            <div v-for="(image, index) in business_img" :key="index" class="relative">
              <img :src="image.src" alt="Image" width="50" class="object-cover w-[5rem] h-[5rem]"
                :pt="{ image: { class: 'object-cover w-12 h-12 rounded-md ' } }" preview />
              <i class="fa-solid fa-xmark absolute top-0 right-0 p-0.5 text-white  rounded-full cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-110 hover:bg-red-300"
                @click="removeImage(index)"></i>

            </div>
            <div class="flex">
              <label
                class="w-[5rem] h-[5rem] border-2 border-dashed border-yellow-400 rounded-lg flex items-center justify-center cursor-pointer hover:border-yellow-500 transition duration-300"
                @click="triggerFileInput">
                <i class="fa-solid fa-image text-yellow-400 text-3xl"></i>
              </label>

              <FileUpload ref="fileInput" id="upload-image" mode="basic" accept="image/*" @select="onFileSelect"
                customUpload :auto="true" class="!hidden" multiple />
            </div>
          </div>
          <p class="error-text" v-if="errors?.business_img">{{ t('กรุณาเลือกอย่างน้อย') }} 1 {{ 'ภาพ' }}</p>



          <hr class="border-b-2 mb-3" />

        </div>

        <Button :loading="isloadingAxi" :label="'บันทึกข้อมูล'" type="submit" class="w-full text-black" />
      </Form>

    </section>
    <MyToast :data="alertToast" />

  </div>
</template>