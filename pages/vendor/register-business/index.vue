<template>
  <div>
    <widgetStep1 v-if="formStore.activePage == 1" />
    <widgetStep2 v-if="formStore.activePage == 2" />
  </div>
</template>

<script setup>
import { useFormStore } from '@/store/businessStore.js';

import widgetStep1 from './widgets/step1.vue';
import widgetStep2 from './widgets/step2.vue';


const formStore = useFormStore();
</script>