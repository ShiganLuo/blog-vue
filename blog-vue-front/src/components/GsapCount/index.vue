<script setup lang="ts">
import { nextTick, reactive, ref, watch, onMounted } from "vue";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

// 定义 props 类型
interface Props {
  value?: number;
  duration?: number;
}

// 使用类型定义 props
const props = withDefaults(defineProps<Props>(), {
  value: 0,
  duration: 1
});

// 定义响应式变量类型
const id = ref<string | null>(null);

// 定义 reactive 对象类型
interface NumData {
  num: number;
}

const d = reactive<NumData>({
  num: 0
});

// 实现动画的方法（明确返回类型）
function AnimateToValue(): void {
  if (!id.value) return;
  
  gsap.to(d, {
    scrollTrigger: `.num-${id.value}`,
    duration: props.duration,
    num: props.value,
    onUpdate: () => {
      // 确保数字是整数
      d.num = Math.floor(d.num);
    }
  });
}

onMounted(() => {
  id.value = Math.random().toString(16).slice(2);

  nextTick(() => {
    gsap.registerPlugin(ScrollTrigger);
    AnimateToValue();
  });
});

// 监听 props.value 的变化
watch(
  () => props.value,
  () => {
    nextTick(() => {
      gsap.registerPlugin(ScrollTrigger);
      AnimateToValue();
    });
  },
  { immediate: true } // 添加 immediate 确保初始值也能触发
);
</script>

<template>
  <span :class="'num-' + id">
    {{ Math.floor(d.num) }} <!-- 更安全的整数转换 -->
  </span>
</template>