<style scoped>
.van-nav-bar {
  --van-nav-bar-background: white;
  --van-nav-bar-height: 80px
}
</style>
<template>
  <div class="min-h-screen">

    <van-nav-bar :title="'แบบตรวจสอบด้านความปลอดภัย'" left-arrow :border="false">

      <template #title>
        <h1 class="header-label text-lg" @click="router.go(-1)">แบบตรวจสอบด้านความปลอดภัย</h1>
      </template>
      <template #left>
        <BackPage @click="router.go(-1)"/>
        </template>

    </van-nav-bar>
    <!-- แสดงหัวข้อของแต่ละแบบสอบถาม -->
    <template v-for="(survey, sIndex) in surveys" :key="sIndex">
      <h2 class="font-bold text-lg mb-4 text-gray-900">
        {{ sIndex + 1 }}. {{ survey.topic.name }}
      </h2>

      <!-- ตารางแบบสอบถาม -->
      <div class="overflow-x-auto mb-6">
        <table class="w-full border-collapse border border-gray-300">
          <!-- หัวตาราง -->
          <thead>
            <tr class="bg-yellow-300 text-gray-900">
              <th class="p-3 border border-gray-300 text-left">รายการ</th>
              <th class="p-3 border border-gray-300 text-center">มี</th>
              <th class="p-3 border border-gray-300 text-center">ไม่มี</th>
            </tr>
          </thead>

          <!-- เนื้อหาแบบสอบถาม -->
          <tbody>
            <tr v-for="(question, qIndex) in survey.questions" :key="question.id" class="border-b">
              <!-- ข้อคำถาม -->
              <td class="p-3 border border-gray-300 text-gray-800">
                {{ qIndex + 1 }}. {{ question.text }}
              </td>

              <!-- ตัวเลือก 'มี' -->
              <td class="p-3 border border-gray-300 text-center">
                <Checkbox v-for="choice in question.choices.filter(c => c.audit_choice_text === 'มี')" :key="choice.id"
                  :inputId="`yes_${choice.id}`" v-model="answers[question.id]" :binary="true" :true-value="choice.id"
                  :false-value="null" class="mr-2" />
              </td>

              <!-- ตัวเลือก 'ไม่มี' -->
              <td class="p-3 border border-gray-300 text-center">
                <Checkbox v-for="choice in question.choices.filter(c => c.audit_choice_text === 'ไม่มี')"
                  :key="choice.id" :inputId="`no_${choice.id}`" v-model="answers[question.id]" :binary="true"
                  :true-value="choice.id" :false-value="null" class="mr-2" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>

    <!-- แสดงข้อความแจ้งเตือนถ้ายังไม่ได้เลือก -->
    <p v-if="showErrors" class="text-red-500 text-sm mt-3 mb-5 text-center">
      กรุณาเลือกคำตอบให้ครบทุกข้อ
    </p>

    <!-- ปุ่มส่งแบบสอบถาม -->
    <!-- <button
      @click="submitForm"
      class="mt-4 px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold"
    >
      ส่งแบบสอบถาม
    </button> -->
    <div class="flex justify-center mb-10">
      <Button :loading="isloadingAxi" label="ส่งแบบสอบถาม" @click="submitForm" class="!text-secondary-main" />
    </div>
    <MyToast :data="alertToast" />

  </div>
</template>

<script setup>
definePageMeta({
  middleware: ["auth"],
});
const route = useRoute();
const router = useRouter();
const alertToast = ref({});
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
const isloadingAxi = useState("isloadingAxi");
import * as dataApi from "./api/data.js";
const surveys = ref([]);
const answers = ref({});
const showErrors = ref(false);

const loadSurvey = async () => {
  try {
    // ดึงข้อมูลจาก API 3 ชุดพร้อมกัน
    const [res1, res2, res3] = await Promise.all([
      dataApi.getSurveyById(1),
      dataApi.getSurveyById(2),
      dataApi.getSurveyById(3)
    ]);

    // เก็บข้อมูลทั้งหมดไว้ใน surveys
    surveys.value = [res1.data.data, res2.data.data, res3.data.data];

    console.log(surveys.value);
  } catch (error) {
    console.error("Error fetching surveys:", error);
  }
};

// ✅ ตรวจสอบว่าทุกคำถามมีคำตอบหรือไม่ (ห้ามเป็น null)
const validateForm = () => {
  showErrors.value = true;
  return surveys.value.every(survey =>
    survey.questions.every(
      question => answers.value[question.id] !== undefined && answers.value[question.id] !== null
    )
  );
};

// ✅ ฟังก์ชันส่งแบบฟอร์ม
const submitForm = async () => {
  try {
    if (validateForm()) {
      const formattedAnswers = Object.keys(answers.value).map(key => ({
        [key]: answers.value[key]
      }));
      console.log(formattedAnswers)

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
        "choice": formattedAnswers,
        "score_show": null,
      }
      const res = await dataApi.saveSurveyAudit(payload);
      alertToast.value = {
        title: 'สำเร็จ',
        color: 'info',
        isError: false,
        msg: res.data.message,
      }
      // clearAuditLocalStorageKeys();
      // เปลี่ยนเส้นทางไปยังหน้าอื่น
      // setTimeout(() => {
      navigateTo(`/inspector/send-warning/${res.data.data}/status`);
      // await saveToLocalStorage("audit_choice", formattedAnswers);
      // alert("ส่งแบบสอบถามสำเร็จ!");
    } else {
      // alert("กรุณาตอบทุกข้อก่อนส่งแบบสอบถาม");
    }

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
};

// โหลดข้อมูลเมื่อ Component ถูก Mount
loadSurvey();
</script>