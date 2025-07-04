<script lang="ts" setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import type { PropType } from "vue";
import { ElAvatar, ElImage, ElPopover } from "element-plus";

import blogAvatar from "@/assets/img/blogAvatar.png";
import GsapCount from "@/components/GsapCount/index.vue";
import SvgIcon from "@/components/SvgIcon/index.vue";

// 严格类型定义
interface BlogConfig {
  avatar_bg?: string;
  blog_avatar?: string;
  blog_name?: string;
  personal_say?: string;
  articleCount?: number;
  categoryCount?: number;
  tagCount?: number;
  git_ee_link?: string;
  bilibili_link?: string;
  github_link?: string;
  we_chat_link?: string;
  qq_link?: string;
}

const router = useRouter();
const avatar = ref<string>(blogAvatar);

defineProps({
  configDetail: {
    type: Object as PropType<BlogConfig>,
    default: () => ({
      avatar_bg: "",
      blog_name: "",
      personal_say: "",
      articleCount: 0,
      categoryCount: 0,
      tagCount: 0
    })
  }
});

// 操作类型联合类型
type OperationType =
  | "goToCategory"
  | "goToTag"
  | "goToArchives"
  | "openLink";

// 严格类型控制的操作函数
const operate = (op: OperationType, val?: string): void => {
  switch (op) {
    case "goToCategory":
      router.push("/category");
      break;
    case "goToTag":
      router.push("/tag");
      break;
    case "goToArchives":
      router.push("/archives");
      break;
    case "openLink":
      if (val) window.open(val);
      break;
  }
};
</script>

<template>
  <!-- 背景图 -->
  <div class="info-background" v-image="configDetail.avatar_bg">
    <ElImage
      fit="cover"
      style="width: 100%; height: 100%"
      :src="configDetail.avatar_bg"
      preview-teleported
      :preview-src-list="[configDetail.avatar_bg || '']"
    >
      <template #error>
        <div class="w-[100%] h-[100%] grid place-items-center">
          <svg-icon name="image404" :width="10" :height="10" />
        </div>
      </template>
    </ElImage>
  </div>

  <!-- 头像区域 -->
  <div class="info-avatar">
    <router-link to="/">
      <ElAvatar :src="configDetail.blog_avatar || avatar" />
    </router-link>
    <span class="blog-name">{{ configDetail.blog_name }}</span>
  </div>

  <!-- 个人签名 -->
  <div class="personal-say">{{ configDetail.personal_say }}</div>

  <!-- 统计菜单 -->
  <div class="common-menu flex_r_between">
    <span class="flex_c_center" @click="operate('goToArchives')">
      <span class="common-menu__label to_pointer">文章</span>
      <span class="common-menu__value to_pointer">
        <GsapCount :value="configDetail.articleCount" />
      </span>
    </span>
    <span class="flex_c_center" @click="operate('goToCategory')">
      <span class="common-menu__label to_pointer">分类</span>
      <span class="common-menu__value to_pointer">
        <GsapCount :value="configDetail.categoryCount" />
      </span>
    </span>
    <span class="flex_c_center" @click="operate('goToTag')">
      <span class="common-menu__label to_pointer">标签</span>
      <span class="common-menu__value to_pointer">
        <GsapCount :value="configDetail.tagCount" />
      </span>
    </span>
  </div>

  <!-- Gitee链接 -->
  <div class="git-ee flex_r_around">
    <span
      class="git-ee__item button-animated"
      @click="operate('openLink', configDetail.git_ee_link ?? '#')"
    >
      <i class="iconfont icon-gitee2"></i>
      <span class="git-ee__item-text"> My Gitee</span>
    </span>
  </div>

  <!-- 社交链接 -->
  <div class="personal-link flex_r_around">
    <i
      class="iconfont icon-bilibili-line to_pointer"
      @click="operate('openLink', configDetail.bilibili_link ?? '#')"
    ></i>
    <i
      class="iconfont icon-github-fill to_pointer"
      @click="operate('openLink', configDetail.github_link ?? '#')"
    ></i>

    <ElPopover placement="top" trigger="hover">
      <ElImage
        style="width: 100%; height: 100%"
        :src="configDetail.we_chat_link ?? ''"
      />
      <template #reference>
        <i class="iconfont icon-weixin1 to_pointer"></i>
      </template>
    </ElPopover>

    <ElPopover placement="top" trigger="hover">
      <ElImage
        style="width: 100%; height: 100%"
        :src="configDetail.qq_link ?? ''"
      />
      <template #reference>
        <i class="iconfont icon-QQ1 to_pointer"></i>
      </template>
    </ElPopover>
  </div>
</template>

<style lang="scss" scoped>
/* 原样保留所有CSS */
.info-background {
  height: 10rem;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.info-avatar {
  display: flex;
  justify-content: flex-start;

  .el-avatar {
    position: relative;
    width: 60px;
    height: 60px;
    transition: ease-in-out 1s;
    background-color: var(--global-white);
    margin: -2rem 0 0 1rem;

    &:hover {
      transform: rotate(360deg);
      -webkit-transform: rotate(360deg);
    }
  }

  .blog-name {
    padding: 0.5rem 0 0 0.5rem;
    color: #222;
    font-size: 14px;
  }
}

.personal-say {
  height: 4.5rem;
  padding: 8px;
  color: var(--font-color-title);
  font-size: 1em;
  font-family: "DYBlack", serif;
}

.common-menu {
  font-size: 1rem;
  color: #1f2d3d;
  font-weight: 1.4rem;
  padding: 1rem 3.5rem;

  &__label {
    color: #533737;
    font-size: 1rem;
    font-weight: 400;
  }

  &__value {
    margin-top: 0.3rem;
    color: var(--text-highlight-color);
    font-size: 1.4rem;
  }
}

.git-ee {
  padding: 0 2rem;

  &__item {
    width: 100%;
    line-height: 1.6;
    text-align: center;
    background-color: #533737;
    border-radius: 3px;

    .iconfont {
      color: var(--global-white);
      font-size: 1.2rem;
    }

    &-text {
      font-size: 1.2rem;
      color: var(--global-white);
      padding-left: 0.5rem;
    }
  }
}

.button-animated {
  position: relative;
  z-index: 1;
  transition: color 1s;
  cursor: pointer;

  &:before {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: -1;
    background: var(--primary);
    content: "";
    transition: transform 0.5s ease-out;
    transform: scaleX(0);
    transform-origin: 0 50%;
  }

  &:hover {
    &:before {
      transition-timing-function: cubic-bezier(0.45, 1.64, 0.47, 0.66);
      transform: scaleX(1);
    }
  }
}

.personal-link {
  padding: 1rem 5rem;

  .iconfont {
    font-size: 1.8rem;
  }

  .icon-QQ1 {
    font-size: 1.6rem;
  }
}
</style>
