<template>
    <div class="p-5">
      <h2 class="text-xl font-bold">แบบสอบถาม</h2>
      <form @submit.prevent="submitForm">
        <div v-for="(question, index) in questions" :key="question.id" class="mb-5">
          <p class="font-medium">{{ index + 1 }}. {{ question.text }}</p>
  
          <div v-for="choice in question.choices" :key="choice.id">
            <label class="flex items-center space-x-2 cursor-pointer">
              <input 
                type="radio" 
                :name="`question_${question.id}`" 
                :value="choice.id" 
                v-model="answers[question.id]"
              />
              <i :class="choice.icon"></i>
              <span>{{ choice.audit_choice_text }}</span>
            </label>
          </div>
  
          <!-- แสดงข้อความแจ้งเตือนเฉพาะข้อที่ยังไม่ได้ตอบ -->
          <p v-if="showErrors && !answers[question.id]" class="text-red-500 text-sm">
            กรุณาเลือกคำตอบสำหรับข้อนี้
          </p>
        </div>
  
        <button 
          type="submit" 
          class="px-4 py-2 bg-blue-600 text-white rounded"
        >
          ส่งคำตอบ
        </button>
      </form>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from "vue";
  import * as dataApi from "./api/data.js";
  
  const questions = ref([]); // เก็บข้อมูลคำถาม
  const answers = ref({}); // เก็บคำตอบของผู้ใช้
  const showErrors = ref(false); // ใช้ตรวจสอบว่าแสดงข้อความแจ้งเตือนหรือไม่
  
  // ฟังก์ชันสำหรับโหลดคำตอบที่มีอยู่แล้ว (edit mode)
  const getChoiceForUpdate = async (surveyId) => {
    try {
      const timeSurveyResponse = await dataApi.geyTimeSurvey(surveyId);
      const existingAnswers = timeSurveyResponse.data.data.survey_audit_police;
  
      // เติมค่าลงใน answers
      existingAnswers.forEach(entry => {
        answers.value[entry.audit_questions_id] = entry.audit_choices_id;
      });
  
    } catch (error) {
      console.error("Error fetching existing choices:", error);
    }
  };
  
  onMounted(async () => {
    try {
      // ดึงข้อมูลคำถาม
      const surveyResponse = await dataApi.geySurveyBuId(1);
      questions.value = surveyResponse.data.data.questions;
  
      // โหลดค่าคำตอบที่มีอยู่
    //   await getChoiceForUpdate(37);
  
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  });
  
  const submitForm = () => {
    showErrors.value = true; // เปิดให้แสดงข้อความแจ้งเตือน
  
    const isValid = questions.value.every(question => answers.value[question.id]);
  
    if (isValid) {
      console.log("Submitted Answers:", answers.value);
      alert("บันทึกคำตอบสำเร็จ!");
    } else {
      alert("กรุณาตอบทุกข้อก่อนส่งแบบสอบถาม");
    }
  };
  </script>
  
  <style scoped>
  input[type="radio"]:checked {
    accent-color: #2563eb;
  }
  </style>
  