<script lang="ts" setup>
import SkeletonItem from "@/components/SkeletonItem/skeleton-item.vue";
</script>
<template>
  <SkeletonItem variant="image" height="10rem" />
  <div class="flex_r_start">
    <SkeletonItem variant="circle" width="60px" height="60px" top="-2rem" left="1rem" />
    <SkeletonItem width="40%" height="1rem" left="0.3rem" />
  </div>
  <div style="padding: 5px">
    <SkeletonItem height="1rem" width="50%" />
    <SkeletonItem height="1rem" width="80%" />
    <SkeletonItem height="1rem" width="30%" />
  </div>
  <div class="flex_r_around" style="padding: 1.2rem 1rem">
    <SkeletonItem v-for="i in 3" :key="i" width="14%" height="3rem" />
  </div>
  <div style="padding: 0 1.5rem">
    <SkeletonItem variant="text" height="2rem" />
  </div>
  <div class="flex_r_around" style="padding: 1rem 3.8rem">
    <SkeletonItem variant="circle" width="2rem" height="2rem" />
    <SkeletonItem variant="circle" width="2rem" height="2rem" />
    <SkeletonItem variant="circle" width="2rem" height="2rem" />
    <SkeletonItem variant="circle" width="2rem" height="2rem" />
  </div>
</template>
