<template>
    <div class="relative w-full h-screen flex flex-col items-center justify-center bg-black">
      <!-- รูปพื้นหลังแบบ Object Contain -->
      <img src="/image/bg/bangkok-bg.png" alt="Bangkok Background"
        class="absolute inset-0 w-full h-full object-cover z-0" />
  
      <!-- เนื้อหาหลัก -->
      <div class="relative z-20 flex flex-col items-center text-center px-6">
        <!-- โลโก้ -->
        <img src="/image/logo_erp.png" alt="Tourist Police Logo" class="w-32 h-32 mb-6" />
  
        <!-- ข้อความต้อนรับ -->
        <h1 class="text-white text-xl font-semibold mb-20">ยินดีต้อนรับเข้าสู่ บช ทท</h1>
  
        <Button @click="navigateTo('/vendor/register-business/')" label="เริ่มต้น" class="!bg-secondary-main w-full" />
      </div>
    </div>
  </template>
  