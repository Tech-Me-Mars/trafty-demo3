<template>
  <img
        :src="selectedFlag"
        alt="Flag"
        class="w-8 h-8 self-start cursor-pointer"
        @click="navigateTo('/client/lang')"
      />


</template>

<script setup>
import { ref, onMounted } from 'vue';
const { t, locales, locale, setLocale } = useI18n();
const selectedFlag = computed(() => {
  const lang = locales.value.find((l) => l.code == locale.value);
  return lang ? lang.flag : '/image/flag/flag-thailand.png'; // ถ้าไม่มีให้ใช้ default
});

const flag = ref(null);
const languageName = ref('');

onMounted(() => {
  let selectedLanguage = JSON.parse(localStorage.getItem('selectedLanguage'));
  if (!selectedLanguage || !selectedLanguage.code || !selectedLanguage.name || !selectedLanguage.flag) {
    selectedLanguage = {
      code: "th",
      name: "ไทย",
      flag: "/image/flag/flag-thailand.png",
    };
    localStorage.setItem('selectedLanguage', JSON.stringify(selectedLanguage));
  }

  flag.value = selectedLanguage.flag;
  languageName.value = selectedLanguage.name;
});
</script>

<style scoped>

</style>