<script setup>
definePageMeta({
  middleware: ["auth"],
});
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
const isloadingAxi = useState("isloadingAxi");
import { ref } from "vue";
import { useRouter } from "vue-router";
// import { Form, useForm } from "vee-validate";
// import * as yup from "yup";
import { useFieldArray, useForm, Form, useField } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as zod from "zod";
import * as dataApi from "../../api/data.js";
const router = useRouter();
const alertToast = ref({});

const requireValue = t('กรุณาระบุข้อมูลให้ถูกต้อง');
// *************  VARIDATOR
const validationSchema = toTypedSchema(
    zod.object({
      business_name: zod.string().nonempty(requireValue).default(""),
      business_person: zod.string().nonempty(requireValue).default(""),
      business_address: zod.string().nonempty(requireValue).default(""),
      business_contact: zod.string().nonempty(requireValue).default(""),
      business_email: zod
    .string()
    .email(t('กรุณาระบุอีเมลที่ถูกต้อง'))
    .nonempty(requireValue)
    .default(""),

    })
);
const { handleSubmit, handleReset, errors } = useForm({
    validationSchema,
});

const { value: business_name } = useField('business_name')
const { value: business_person } = useField('business_person')
const { value: business_address } = useField('business_address')
const { value: business_contact } = useField('business_contact')
const { value: business_email } = useField('business_email')
const { value: listFiles } = useField('listFiles', null, {
    initialValue: []
})


import { useFormStore } from "@/store/businessStore.js";
const formStore = useFormStore(); // ใช้ Pinia Store
const handleNext = handleSubmit(() => {
    // const listFilesArray = listFiles.value.map((item) => ({
    //   business_documents_img: item.src
    // }));
    // เก็บข้อมูลลง Pinia แทน LocalStorage
    formStore.setForm3(
      business_name.value,
      business_person.value,
      business_address.value,
      business_contact.value,
      business_email.value,
      listFiles.value
    );
    // เปลี่ยนหน้าไป form4
    formStore.nextPage();
});

const onFileSelect = (event) => {
  event.files.forEach((file) => {
    const reader = new FileReader();
    // Convert file to data URL to display in UI
    reader.onload = (e) => {
      listFiles.value.push({
        src: e.target.result,
        file: file,
      }); // Store both the image preview and the file
    };
    reader.readAsDataURL(file); // Read the file as a data URL
  });
};
const removeFile = (index) => {
  listFiles.value.splice(index, 1); // Remove the file from the list
};
const stepsBar = ref([
  { step: 1, active: false },
  { step: 2, active: false },
  { step: 3, active: true },
  { step: 4, active: false },
  { step: 5, active: false },
])
</script>
<style scoped>
.van-nav-bar {
  --van-nav-bar-background: #ffc83A;
  --van-nav-bar-text-color: black;
  --van-nav-bar-icon-color: black;
  --van-nav-bar-title-text-color: black;
  --van-nav-bar-height: 70px
}
</style>
<template>
  <div class="bg-zinc-100 min-h-screen">
    <van-nav-bar :title="t('ข้อมูลธุรกิจ')" left-arrow @click-left="formStore.prevPage()">
    </van-nav-bar>

    <div class="p-4 ">
      <div class="flex space-x-5 items-center justify-center mb-8">
        <div v-for="(item, index) in stepsBar" :key="index"
          :class="item.active ? 'w-8 h-2 bg-blue-900' : 'w-8 h-2 bg-gray-200'"></div>
      </div>

      <Form @submit="handleNext">
      <div class="card pt-5 mb-10">
        <h2 class="font-bold text-lg mb-3">
          {{ t('ข้อมูลธุรกิจ') }}
        </h2>

        <div class="space-y-4">
          <!-- ชื่อบริษัท -->
          <div>
            <label class="label-input" v-if="formStore?.is_corporation == true">{{ t('ชื่อบริษัท') }}</label>
            <label class="label-input" v-else>{{ t('ชื่อธุรกิจ') }}</label>
            <InputText v-model="business_name" :placeholder="formStore?.is_corporation ? t('ชื่อบริษัท') : t('ชื่อธุรกิจ')" class="w-full custom-border" :invalid="errors?.business_name ? true:false" />
            <p class="error-text" v-if="errors?.business_name">{{errors?.business_name}}</p>

          </div>

          <!-- ผู้รับผิดชอบหลัก -->
          <div>
            <label class="label-input">{{ t('ผู้รับผิดชอบ') }}</label>
            <InputText v-model="business_person" :placeholder="t('ผู้รับผิดชอบ')" class="w-full custom-border" :invalid="errors?.business_person ? true:false" />
            <p class="error-text" v-if="errors?.business_person">{{errors?.business_person}}</p>

          </div>

          <!-- ที่อยู่หน่วยงาน -->
          <div>
            <label class="label-input">{{ t('ที่อยู่') }}</label>
            <InputText v-model="business_address" :placeholder="t('ที่อยู่')"  class="w-full custom-border" :invalid="errors?.business_address ? true:false" />
            <p class="error-text" v-if="errors?.business_address">{{errors?.business_address}}</p>
          
          </div>

          <!-- ติดต่อ -->
          <div>
            <label class="label-input">{{ t('ติดต่อ') }}</label>
            <InputText v-keyfilter.int v-model="business_contact" :placeholder="t('เบอร์โทรศัพท์')"  class="w-full custom-border" :invalid="errors?.business_contact ? true:false" />
            <p class="error-text" v-if="errors?.business_contact">{{errors?.business_contact}}</p>

          </div>

          <!-- อีเมล -->
          <div>
            <label class="label-input">{{ t('อีเมล') }}</label>
            <InputText v-model="business_email" :placeholder="t('อีเมล')"  class="w-full custom-border" :invalid="errors?.business_email ? true:false" />
            <p class="error-text" v-if="errors?.business_email">{{errors?.business_email}}</p>

          </div>

          <!-- อัพโหลดไฟล์ -->
          <div>
            <label class="label-input">{{ t('เอกสารรับรอง') }}</label>
            <div class="flex">
              <FileUpload mode="basic" @select="onFileSelect" customUpload rounded auto severity="secondary"
                class=" p-button-outlined border-gray-00" style="color: gray;" outlined :chooseLabel="t('เพิ่มไฟล์')"
                chooseIcon="pi pi-upload" :multiple="true" />
            </div>

            <div class="mt-4 mb-5" v-if="listFiles.length>0">
              <!-- <h3 class="text-lg font-semibold mb-2"></h3> -->
              <ul class="list-none p-0 space-y-2">
                <li v-for="(file, index) in listFiles" :key="index"
                  class="flex items-center justify-between bg-gray-50 p-1 px-2 rounded-md shadow-sm">
                  <div class="flex items-center space-x-3">
                    <!-- Display file preview if it's an image -->
                    <img v-if="file.file.type.startsWith('image/')" :src="file.src" alt="Preview"
                      class="w-8 h-8 object-cover rounded-md" />
                    <!-- Display file name -->
                    <span class="text-gray-800 text-sm">{{ file.file.name }}</span>
                  </div>

                  <!-- Remove button -->
                  <button class="" @click="removeFile(index)">
                    <i class="fa-solid fa-xmark text-lg text-red-700" ></i>
                  </button>
                </li>
              </ul>
            </div>


          </div>
        </div>

      </div>



      <Button :loading="isloadingAxi" :label="t('ถัดไป')" severity="primary" type="submit" rounded class="w-full" :pt="{
        root: {
          class: '!border-primary-main'
        },
      }" />

    </Form>
    </div>
    <MyToast :data="alertToast" />

  </div>
</template>