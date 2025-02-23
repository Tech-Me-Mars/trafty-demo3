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
    <van-nav-bar title="แบบตรวจสอบด้านความปลอดภัย" left-arrow
      @click-left="navigateTo(`/inspector/inspec-vendor/${route.params.id}/safety-form/form1`)">
    </van-nav-bar>
    <div class="p-4 ">
      <Form  @submit="onSubmit"> 
        <pre>
          {{ errors }}
        </pre>
        {{ form_value }}
        <!-- <div class="card mb-5">
          <div class="space-y-4">
            <div v-for="(field, index) in formSchema.fields" :key="index" class="form-group">
              <label class="label-survay" :for="`radio`">{{ field.label }}</label>
              <div class="flex flex-col flex-wrap gap-2">
                <div class="flex items-center gap-2" v-for="choice in field.choices" :key="choice.id">
                  <Field type="radio " :name="field.name" v-slot="{ field }">
                    <RadioButton :inputId="`radio-${choice.id}`" v-bind="field" v-model="field.name" :value="choice.id" />
                  </Field>
                  <label :for="`radio-${choice.id}`">{{ choice.audit_choice_text }}</label>
                </div>
                <ErrorMessage class="text-red-500" :name="field.name" />
              </div>
            </div>

          </div>
        </div> -->
        <!-- <NuxtLink to="/vendor/manage-business/survay/form3"> -->
        <Button :loading="isloadingAxi" label="ถัดไป" severity="primary" type="submit" rounded class="w-full" :pt="{
          root: {
            class: '!border-primary-main'
          },
        }" />
        <!-- </NuxtLink> -->
      </Form>
    </div>
  </div>
</template>

<script setup>
// definePageMeta({
//   middleware: ["auth"],
// });
const isloadingAxi = useState("isloadingAxi");
import { ref, computed, onMounted } from "vue";
import { useFieldArray, useForm, Form, useField } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as zod from "zod";
import * as dataApi from "./api/data.js";

const route = useRoute();
const stepsBar = ref([
    { step: 1, active: false },
    { step: 2, active: true },
    { step: 3, active: false },
    { step: 4, active: false },
    { step: 5, active: false },
])

// โหลดคำถามจาก API
const resSurvey = ref()
const loadSurvey = async () => {
  try {
    const res = await dataApi.geySurveyBuId(1);
    resSurvey.value = res.data.data;
    const questions = res.data.data.questions;

    const formSchema = questions.map((question) => ({
      label: question.text, // คำถาม
      name: question.id.toString(), // ใช้ ID เป็นชื่อ
      choices: question.choices, // ตัวเลือกช้อยส์
    }));

    // กำหนดค่าเริ่มต้นให้กับ formValues
    form_value.value = formSchema.reduce((acc, field) => {
      console.log(acc)
      acc[field.name] = null; // ค่าเริ่มต้นของแต่ละฟิลด์เป็น null
      return acc;
    }, {});
  } catch (error) {
    console.error("Failed to load survey:", error);
  }
};
const requireValue = "กรุณาเลือกช้อย";
// *************  VARIDATOR
const resValiadtor =ref([8,9,10])
const validationSchema = toTypedSchema(
    zod.object({
      
        // shop_name: zod.string().nonempty(requireValue).default(""),
        // police_name: zod.string().nonempty(requireValue).default(""),
        // responsibilities: zod.string().nonempty(requireValue).default(""),
        // cid: zod.string().nonempty(requireValue).default(""),
        // safety_audit_location: zod.string().nonempty(requireValue).default(""),
        // phone_office: zod.string().nonempty(requireValue).default(""),
        // phone: zod.string().nonempty(requireValue).default(""),
    })
);
const { handleSubmit, handleReset, errors } = useForm({
    validationSchema,
});
const { value: form_value } = useField('form_value', null, {
    initialValue: {}
})
// ฟังก์ชันเมื่อ Submit
const handleNext = handleSubmit(async (values) => {
  // ตรวจสอบว่า values เป็น object และไม่ว่างเปล่า
  if (!values || typeof values !== "object" || Object.keys(values).length === 0) {
    console.error("Invalid values:", values);
    return;
  }

  // วนลูป key-value ใน values
  for (const [key, value] of Object.entries(values)) {
    // สร้าง key-value object
    const keyValue = { [key]: value };

    // บันทึกลง localStorage
    await saveToLocalStorage("audit_choice", keyValue);
  }

  // เปลี่ยนเส้นทางไปยังหน้าอื่น
  navigateTo(`/inspector/inspec-vendor/${route.params.id}/safety-form/form3`);
});

function saveToLocalStorage(key, newValue) {
  // ตรวจสอบว่ามีข้อมูลใน localStorage หรือไม่
  let storedData = JSON.parse(localStorage.getItem(key)) || [];

  // ตรวจสอบว่า key ใน newValue มีอยู่แล้วใน storedData หรือไม่
  let isKeyExists = storedData.some(item => Object.keys(item)[0] === Object.keys(newValue)[0]);

  if (isKeyExists) {
    // อัปเดตค่าถ้ามี key เดิม
    storedData = storedData.map(item =>
      Object.keys(item)[0] === Object.keys(newValue)[0] ? newValue : item
    );
  } else {
    // เพิ่มข้อมูลใหม่ถ้ายังไม่มี key
    storedData.push(newValue);
  }

  // บันทึกกลับไปยัง localStorage
  localStorage.setItem(key, JSON.stringify(storedData));
}

// โหลดข้อมูลเมื่อ component ถูก mount
onMounted(() => {
  loadSurvey();
});
</script>

<style scoped>
.form-group {
  margin-bottom: 1rem;
}

.text-red-500 {
  font-size: 0.875rem;
  color: red;
}
</style>