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
  <div class="min-h-screen bg-primary-main flex flex-col">
    <van-nav-bar :title="'แบบตรวจสอบด้านความปลอดภัย'" left-arrow  :border="false"
      @click-left="navigateTo(`/inspector/safety-form/${route.params.id}/form2`)">
    </van-nav-bar>
    <section class="p-4 card-content flex-grow pt-10">
      <!-- <Form :validation-schema="yupSchema" @submit="onSubmit"> -->
      <form @submit.prevent="submitForm">




        <div class="card mb-5">

          <h2 class="font-bold text-lg mb-8">
            {{ resSurvey?.topic?.name }}
          </h2>

          <div class="space-y-4">
            <div v-for="(question, index) in questions" :key="question.id" class="form-group">

              <label class="" :for="`radio`">{{ question.text }}</label>
              <div class="flex flex-col flex-wrap gap-2 mt-3">
                <div class="flex items-center gap-2 bg-yellow-100 p-3" v-for="choice in question.choices" :key="choice.id">
                    <RadioButton :inputId="`question_${choice.id}`" v-model="answers[question.id]"
                      :value="choice.id" />
                  <label :for="`question_${choice.id}`">{{ choice.audit_choice_text }}</label>
                </div>
                <p v-if="showErrors && !answers[question.id]" class="error-text">
                  กรุณาเลือกคำตอบสำหรับข้อนี้
                </p>
              </div>
            </div>

          </div>
        </div>
        <!-- <NuxtLink to="/vendor/manage-business/survay/form3"> -->
        <Button :loading="isloadingAxi" label="ถัดไป" severity="primary" type="submit" class="w-full" :pt="{
          root: {
            class: '!border-primary-main'
          },
        }" />
        <!-- </NuxtLink> -->
      </form>
    </section>
    <MyToast :data="alertToast" />

  </div>
</template>

<script setup>
definePageMeta({
  middleware: ["auth"],
});
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
const isloadingAxi = useState("isloadingAxi");
import { ref, computed, onMounted } from "vue";
import { useForm, Field, Form, ErrorMessage } from "vee-validate";
import * as Yup from "yup";
import * as dataApi from "./api/data.js";

const route = useRoute();
const alertToast = ref({});

const questions = ref([]); // เก็บข้อมูลคำถาม
const answers = ref({}); // เก็บคำตอบของผู้ใช้
const showErrors = ref(false); // ใช้ตรวจสอบว่าแสดงข้อความแจ้งเตือนหรือไม่

// ฟังก์ชันสำหรับโหลดคำตอบที่มีอยู่แล้ว (edit mode)
const getChoiceForUpdate = async (surveyId) => {
  try {
    const timeSurveyResponse = await dataApi.geyTimeSurvey(surveyId);
    const existingAnswers = timeSurveyResponse.data.data.survey_audit_police;
    console.log(existingAnswers)
    if (!existingAnswers) {
      return
      // return loadSurveyFromVendorForFirstAudit();
    }
    // กรองเฉพาะค่าที่ audit_questions_id มีอยู่ใน questions
    const filteredAnswers = existingAnswers.filter(entry => 
      questions.value.some(q => q.id === entry.audit_questions_id)
    );

    // เติมค่าลงใน answers
    filteredAnswers.forEach(entry => {
      answers.value[entry.audit_questions_id] = entry.audit_choices_id;
    });

  } catch (error) {
    console.error("Error fetching existing choices:", error);
  }
};

const loadSurveyFromVendorForFirstAudit =async ()=>{
  try {
    const res = await dataApi.geyVendorSurveyByBusinessId(route.params.id)
    const existingAnswers = res.data.data.survey_audit;
    const filteredAnswers = existingAnswers.filter(entry => 
      questions.value.some(q => q.id === entry.audit_questions_id)
    );
    // เติมค่าลงใน answers
    filteredAnswers.forEach(entry => {
      answers.value[entry.audit_questions_id] = entry.audit_choices_id;
    });
  } catch (error) {
    console.error(error)
  }
}


const resSurvey = ref()
const loadSurvey = async () => {
  try {
    const surveyResponse = await dataApi.geySurveyBuId(3);
    resSurvey.value = surveyResponse.data.data;
    questions.value = surveyResponse.data.data.questions;
    // await getChoiceForUpdate(route.params.id);
  } catch (error) {
    console.error("Error fetching questions:", error);
  }
}
onMounted(async () => {
  loadSurvey();
});

const submitForm = async () => {
  showErrors.value = true; // เปิดให้แสดงข้อความแจ้งเตือน

  const isValid = questions.value.every(question => answers.value[question.id]);

  if (isValid) {
    const formattedAnswers = Object.keys(answers.value).map(key => ({
      [key]: answers.value[key]
    }));
    await saveToLocalStorage("audit_choice", formattedAnswers);
    // await navigateTo(`/inspector/safety-form/${route.params.id}/form3`);


    try {
        const storedChoice = JSON.parse(localStorage.getItem("audit_choice")) || [];
        const payload = {
            "business_id": parseInt(route.params.id),
            "user_type": "เจ้าหน้าที่ตำรวจท่องเที่ยว",
            "user_id": null,
            "user_name": null,
            "police_id": null,
            "police_name": null,
            "police_headquarters_id": null,
            "police_headquarters_name": null,
            "security_audit_times": null,
            "safety_audit_date": null,
            "safety_audit_time": null,
            "safety_audit_location": null,
            "choice": storedChoice,
            "score_show": null,
        }
        const res = await dataApi.saveSurveyAudit(payload);
        alertToast.value = {
            title: 'สำเร็จ',
            color: 'info',
            isError: false,
            msg: res.data.message,
        }
        clearAuditLocalStorageKeys();
        // เปลี่ยนเส้นทางไปยังหน้าอื่น
        // setTimeout(() => {
        navigateTo(`/inspector/send-warning/${res.data.data}/status`);
        // }, 1000);

    } catch (error) {
      alertToast.value = {
            title: 'ล้มเหลว',
            isError: true,
            color: "error",
            msg: error.response?.data?.message || "Error occurred",
            dataError: error,
        };
        console.error(error)
    }
  } else {
    // alert("กรุณาตอบทุกข้อก่อนส่งแบบสอบถาม");
  }
};
const clearAuditLocalStorageKeys = () => {
    const keysToRemove = [
        "audit_shop_name",
        "audit_police_name",
        "audit_police_headquarters_name",
        "audit_safety_audit_date",
        "audit_security_audit_times",
        "audit_safety_audit_location",
        "audit_safety_audit_time",
        "audit_choice",
        "audit_business_id"
    ];

    keysToRemove.forEach((key) => localStorage.removeItem(key));
};
function saveToLocalStorage(key, newValue) {
  // ตรวจสอบว่ามีข้อมูลใน localStorage หรือไม่
  let storedData = JSON.parse(localStorage.getItem(key)) || [];

  // ลบข้อมูลที่มี question_id เดิมออกก่อน (ป้องกันการซ้ำซ้อน)
  storedData = storedData.filter(
    item => !newValue.some(newItem => Object.keys(newItem)[0] === Object.keys(item)[0])
  );

  // เพิ่มข้อมูลใหม่เข้าไป
  storedData = [...storedData, ...newValue];

  // บันทึกกลับไปยัง localStorage
  localStorage.setItem(key, JSON.stringify(storedData));
}

</script>