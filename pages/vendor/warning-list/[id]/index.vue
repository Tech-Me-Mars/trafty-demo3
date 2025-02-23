<template>
  <div class="min-h-screen bg-zinc-50">
    <!-- Header Section -->
    <van-nav-bar :title="t('ใบเตือน')" left-arrow @click-left="router.go(-1)">
    </van-nav-bar>

    <!-- Tabs Section -->
    <section class="">
      <van-tabs v-model:active="activeTab">
        <!-- Tab 1: ใบเตือน -->
        <van-tab :title="t('ใบเตือน')">
          <section class="p-4">
            <div class="card mb-2" v-for="(item,index) in resWarning" :key="index">
              <div class="flex items-center mb-2">
                <i class="fas fa-exclamation-triangle text-primary-main mr-2"></i>
                <p class="text-lg font-semibold text-primary-main">{{ item?.warning_title }}</p>
              </div>
              <p class=" text-gray-600 mb-2">
                {{ item?.warning_details }}
              </p>
              
              <Button v-if="item?.survey_status_id == 5" disabled :loading="isloadingAxi"  rounded icon="fa-solid fa-pen"
                :label="t('จัดการใบเตือนแล้ว')" />
              <Button v-else :loading="isloadingAxi" @click="navigateTo(`/vendor/warning-list/${route.params.id}/${item.id}/reply`)" rounded icon="fa-solid fa-pen"
                :label="t('จัดการใบเตือน')" />

            </div>
          </section>

        </van-tab>

        <!-- Tab 2: จัดการใบเตือนแล้ว -->
        <van-tab :title="t('จัดการใบเตือนแล้ว')">
          <div class="text-center text-gray-500 text-sm pt-10">
            {{ t('ไม่มีข้อมูลใบเตือนที่จัดการแล้ว') }}
          </div>
        </van-tab>
      </van-tabs>
    </section>
    <MyToast :data="alertToast" />

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
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
const isloadingAxi = useState("isloadingAxi");
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import * as dataApi from "./api/data.js";

const router = useRouter();
const route = useRoute();
const activeTab = ref(0);

const alertToast = ref({});

const resWarning=ref([])
const loadWaring=async()=>{
  try {
    const res= await dataApi.getSurveyWaringByBusinessId(route.params.id);
    resWarning.value =res.data.data;
  } catch (error) {
    console.error(error)
  }
}
onMounted(()=>{
  loadWaring()
})
</script>