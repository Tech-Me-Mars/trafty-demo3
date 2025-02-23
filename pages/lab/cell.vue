<template>
    <div class="bg-zinc-100 min-h-screen">
      <!-- Header -->
      <div class="flex items-center justify-between mb-4">
        <div class="font-bold text-lg">การจัดการข้อมูล</div>
      </div>
  
      <!-- Stats Overview -->
      <div class="grid grid-cols-3 gap-4 mb-6">
        <div class="bg-white p-3 rounded shadow text-center">
          <div class="text-xl font-bold text-red-600">1</div>
          <div class="text-gray-600 text-sm">รออนุมัติ</div>
        </div>
        <div class="bg-white p-3 rounded shadow text-center">
          <div class="text-xl font-bold text-gray-400">0</div>
          <div class="text-gray-600 text-sm">อนุมัติแล้ว</div>
        </div>
        <div class="bg-white p-3 rounded shadow text-center">
          <div class="text-xl font-bold text-gray-400">0</div>
          <div class="text-gray-600 text-sm">ไม่ผ่านเกณฑ์</div>
        </div>
      </div>
  
      <!-- List Section -->
      <van-cell-group  class="!m-0 !p-0">
        <van-cell title="ระบบจัดเก็บข้อมูล" value="Content" />
        <!-- <van-cell
          title="ระบบจัดเก็บข้อมูล"
          is-link
          @click="onClick('ระบบจัดเก็บข้อมูล')"
        /> -->
        <van-cell
          title="จัดการแหล่งท่องเที่ยว"
          is-link
          @click="onClick('จัดการแหล่งท่องเที่ยว')"
        />
        <van-cell
          title="จัดการธุรกิจในแหล่งท่องเที่ยว"
          is-link
          @click="onClick('จัดการธุรกิจในแหล่งท่องเที่ยว')"
        >
          <!-- Badge -->
          <template #right-icon>
            <span class="relative">
              <span
                class="absolute top-0 right-0 bg-red-500 text-white text-xs px-2 rounded-full"
              >
                1
              </span>
            </span>
          </template>
        </van-cell>
        <van-cell
          title="ตรวจสอบคอมเมนท์"
          is-link
          @click="onClick('ตรวจสอบคอมเมนท์')"
        />
        <van-cell
          title="จัดการใบเตือน"
          is-link
          @click="onClick('จัดการใบเตือน')"
        />
      </van-cell-group>
    </div>
  </template>
  
  <script setup>
  import { showToast } from "vant";
  
  const onClick = (title) => {
    showToast(`คุณคลิกที่ "${title}"`);
  };
  </script>
  
  <style>
  /* Tailwind CSS จะดูแลส่วนของสไตล์ */
  </style>
  