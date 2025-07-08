<script setup lang="ts">
import { ref, reactive, onMounted,watch } from 'vue'
import { RouterView, useRouter, useRoute } from 'vue-router'
import { addView } from './api/site';
import { isMobile } from './utils/tool';
import WelcomeMessage from "@/components/WelcomeComps/WelcomeMessage.vue";
import BackTop from "@/components/BackTop/index.vue";
const isPc = ref(true);
const router = useRouter();
const route = useRoute();
const ContextMenuRef = ref(null); // ContextMenu 右键菜单组件

const goBack = () => {
  router.go(-1);
};
const backTopProps = reactive({
  right: 0,
  svgWidth: 0,
});


onMounted( async () => {
  isPc.value = !isMobile();

  backTopProps.right = 0;
  backTopProps.svgWidth = 6;
  addView();
})


</script>

<template>
<WelcomeMessage />
  <div id="app">
    <router-view />
    <BackTop v-if="route.path !== '/'" :right="isPc ? 3 : 0" />
    <i
      v-if="!isPc && ['home', '/'].includes(route.path)"
      class="iconfont icon-fanhui"
      @click="goBack"
    ></i>
  </div>
</template>

<style lang="scss">
.app {
  width: 100%;
  box-sizing: border-box;
}

.icon-fanhui {
  position: fixed;
  left: 5px;
  top: 60px;
  font-size: 2.2rem;
  color: var(--font-color);
  z-index: 999;
}
</style>
