<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { RouterView } from 'vue-router'
import WelcomeMessage from '@/components/WelcomeMessage.vue'
import { isMobile } from './utils/tool';
import { addView } from './api/site';
const isPc = ref(true);
const backTopProps = reactive({
  right: 0,
  svgWidth: 0,
});

onMounted( async () => {
  backTopProps.right = 0;
  backTopProps.svgWidth = 6;
  isPc.value = !isMobile();
  addView();
})
</script>

<template>
  <div id="app">
    <WelcomeMessage />
    <router-view />
  </div>
</template>

<style scoped>

</style>
