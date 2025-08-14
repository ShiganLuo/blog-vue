<script setup lang="ts">
import { ref, onMounted } from "vue";
import { getAllMessage } from "@/api/message";
import VueDanmaku from "vue3-danmaku";

// 定义弹幕数据类型
interface Danmu {
  avatar: string;
  nick_name: string;
  message: string;
  isNew?: boolean;
}

// vue-danmaku 组件实例类型（根据库的类型定义调整）
interface VueDanmakuInstance {
  add: (danmu: Danmu) => void;
}

const vueDanmakuRef = ref<VueDanmakuInstance | null>(null);
const danmus = ref<Danmu[]>([]);
const loop = ref(false);

// 添加弹幕
const addDanmu = (danmu: Danmu) => {
  vueDanmakuRef.value?.add(danmu);
};

// 初始化弹幕
const init = () => {
  danmus.value = [];
  getAllMessage().then((res: any) => {
    danmus.value = res.result.list as Danmu[];
    if (danmus.value.length > 100) {
      loop.value = true;
    }
  });
};

onMounted(() => {
  init();
});

defineExpose({
  addDanmu,
  init,
});
</script>

<template>
  <vue-danmaku
    v-if="danmus.length"
    ref="vueDanmakuRef"
    class="!absolute !top-[60px] left-0 w-[100%] !z-[2] h-[calc(100vh-60px)]"
    v-model:danmus="danmus"
    :loop="loop"
    useSlot
    :speeds="60"
    :isSuspend="true"
  >
    <template #dm="{ danmu }">
      <div class="danmu-item">
        <el-avatar :src="danmu.avatar">{{ danmu.nick_name }}</el-avatar> :
        <span class="new-item" v-if="danmu.isNew">{{ danmu.message }}</span>
        <span v-else>{{ danmu.message }}</span>
      </div>
    </template>
  </vue-danmaku>
  <div class="shooting_stars !z-[1]">
    <div class="night">
      <span v-for="i in 20" :key="i" class="shooting_star"></span>
    </div>
  </div>
</template>
