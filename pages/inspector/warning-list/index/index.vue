<template>
  <div class="min-h-screen bg-zinc-50">
    <!-- Header Section -->
    <van-nav-bar :title="('การตอบกลับ')" >
      <template #left>
        <BackPage @click="navigateTo('/inspector/home')"/>
      </template>
    </van-nav-bar>

    <!-- Tabs Section -->
    <section class="">
      <div class="p-4">
            <div class="card mb-2" v-for="(item,index) in resList" :key="index">
              <div class="flex items-start w-full  mb-3">
                <Image
                :src="item?.image_profile"
                  alt="Image" width="50" class="object-cover w-20 h-20 rounded-md shadow-md"
                  :pt="{ image: { class: 'object-cover w-20 h-20 rounded-md shadow-md' } }" preview />
                <!-- Info Section -->
                <div class="ml-4 ">
                  <h2 class="text-md font-bold">{{ item?.shop_name }}</h2>
                  <!-- <p class="text-sm text-gray-500">{{ item?.business_type_name }}</p> -->

                  <!-- <p class="text-gray-500 mt-1 text-sm mb-6">ตำบลแสนสุข อำเภอเมือง ชลบุรี 20110</p> -->

                </div>

                <!-- Approval Status -->

              </div>
              <hr class="border-t mb-3 mx-2">
              <h2 class="text-lg font-bold mb-2">{{ getLastRespond(item)?.warning_title }}</h2>
              <p class="text-mdd">{{ getLastRespond(item)?.warning_details }}
              </p>
              <hr class="border-t mb-3 mx-2">
              <div class="mb-3 px-4 py-3 bg-zinc-100 border border-gray-300 rounded-md">
                <span class="text-lg font-bold text-gray-800 mb-1">{{ t('การตอบกลับ') }} :</span>
                <span class="text-md ">
                  {{ getLastRespond(item)?.respond_warning_note }}
                </span>
              </div>
              <hr class="border-t mb-3 mx-2">

              <div class="flex  gap-3">

                <Button :loading="isloadingAxi" @click="navigateTo(`/inspector/warning-list/${item.survey_audit_police_id}`)" :label="t('ดูรายละเอียด')" severity="primary" variant="outlined" class="w-full" :pt="{
                  label: {
                    class: 'text-primary-main'
                  },
                  root: {
                    class: '!border-primary-main'
                  },

                }"   />
                <!-- <Button :loading="isloadingAxi" label="ส่งอีกครั้ง" severity="primary" variant="outlined" class="w-full" :pt="{
                  label: {
                    class: 'text-primary-main'
                  },
                  root: {
                    class: '!border-primary-main'
                  },

                }" @click="navigateTo(`/inspector/send-warning/waring-send-repeat/${item.survey_audit_police_id}`)" /> -->

              </div>
            </div>

            




          </div>
      <MyToast :data="alertToast" />

    </section>
  </div>
</template>

<style>
.van-nav-bar {
  --van-nav-bar-background: #ffc83A;
  --van-nav-bar-text-color: black;
  --van-nav-bar-icon-color: black;
  --van-nav-bar-title-text-color: black;
  --van-nav-bar-height: 70px;
}

.van-tab {
  --van-tab-active-text-color: #281c74 !important
}

.van-tabs__line {
  width: 120px !important;
  background: #281c74 !important;
}
</style>

<script setup>
definePageMeta({
  middleware: ["auth"],
});
const isloadingAxi = useState("isloadingAxi");
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import * as dataApi from "../api/data.js";

import { useI18n } from 'vue-i18n';
const { t } = useI18n();

const router = useRouter();
const route = useRoute();
const activeTab = ref(1);
const alertToast = ref({});

const countList=ref(0)
const resList=ref([])
const loadList =async()=>{
  try {
    const res = await dataApi.getWarningResponPolice();
    resList.value = res.data.data;
    countList.value= res.data.data.length
  } catch (error) {
    
  }
}
onMounted(()=>{
  loadList();
})

const getLastRespond=(item) =>{
    if (item?.responds?.length > 0) {
      return item.responds[item.responds.length - 1]; // ดึงอันสุดท้ายใน Array
    }
    return null; // กรณีไม่มีข้อมูล
  };
</script>