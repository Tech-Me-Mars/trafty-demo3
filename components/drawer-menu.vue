<template>
  <div class="relative">
    <!-- ปุ่มเปิด Drawer -->
    <button
      @click="drawerVisible = true"
      class="w-10 h-10 bg-yellow-200 flex items-center justify-center rounded-full shadow-lg hover:bg-yellow-500 transition"
    >
      <i class="fa-solid fa-bars text-2xl text-black"></i>
    </button>

    <!-- Drawer Menu -->
    <Drawer v-model:visible="drawerVisible" :dismissable="true" class="w-64 bg-gray-900 text-white">
      <!-- Header -->
      <template #header>
        <div class="flex items-center justify-between px-4 py-3 bg-yellow-400 text-black w-full">
          <span class="text-lg font-semibold">เมนูหลัก</span>
        </div>
      </template>

      <!-- รายการเมนู -->
      <ul class="menu-list space-y-3 p-4">
        <li v-for="(item, index) in listMenu" :key="index">
          <router-link :to="item.path">
            <button
              class="flex items-center space-x-3 w-full py-2 px-4 text-lg rounded-lg hover:bg-yellow-400 hover:text-black transition"
            >
              <i :class="item.icon" class="text-xl"></i>
              <span>{{ item.label }}</span>
            </button>
          </router-link>
        </li>
      </ul>
    </Drawer>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const role_id = localStorage.getItem("role_id");

// ข้อมูลเมนูพื้นฐาน (Model)
const baseMenu = ref([
  { id: 0, label: t('หน้าแรก'), icon: "fa-solid fa-house", path: "/" }
]);

const logoutMenu = { label: t('ออกจากระบบ'), icon: "fa-solid fa-right-from-bracket", path: "/auth/login" };

const listMenu = ref([]);

// Controller: ตรวจสอบเงื่อนไขและสร้าง Dynamic Menu
const conditionAppendMenu = () => {
  let dynamicMenu = [...baseMenu.value];

  if (role_id == 2) {
    dynamicMenu.push({
      id: 1,
      label: t('ธุรกิจของฉัน'),
      icon: "fa-solid fa-briefcase",
      path: "/vendor/my-business"
    });
  } else if (role_id == 3) {
    dynamicMenu.push({
      id: 1,
      label: t('ตรวจสอบข้อมูล'),
      icon: "fa-solid fa-check",
      path: "/inspector/home"
    });
  }

  // รวมเมนูทั้งหมด และให้ "ออกจากระบบ" อยู่ล่างสุดเสมอ
  dynamicMenu.push(logoutMenu);
  listMenu.value = dynamicMenu;
};

onMounted(() => {
  conditionAppendMenu();
});

const drawerVisible = ref(false);
</script>



<style scoped>
.menu-item i {
  color: #281c74;
}

.menu-item:hover i {
  color: #7d6be3;
}
</style>
