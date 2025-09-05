<script setup lang="ts">
import { ref, reactive, onMounted, onBeforeUnmount, h } from "vue";
import { getFriendLinks } from "@/api/links";
import { homeGetConfig } from "@/api/config";
import { Edit } from "@element-plus/icons-vue";
import { ElNotification } from "element-plus";
import { useUserStore } from "@/stores/index";
import { storeToRefs } from "pinia";
import SkeletonItem from "@/components/SkeletonItem/skeleton-item.vue";
import PageHeader from "@/components/PageHeader/index.vue";
import linkApply from "./link-apply.vue";
import { _removeLocalItem, _setLocalItem } from "@/utils/tool";
import Loading from "@/components/Loading/index.vue"; // 确保此组件已导入

const { getUserInfo } = storeToRefs(useUserStore());

const loading = ref<boolean>(false);
const scrollLoading = ref<boolean>(false);
const params = reactive<{
  current: number;
  size: number;
  status: number;
}>({
  current: 1,
  size: 6,
  status: 2,
});

// 定义友链列表的类型
interface FriendLink {
  id: number;
  site_avatar: string;
  site_name: string;
  site_desc: string;
  url: string;
  user_id: number;
}
const linksList = ref<FriendLink[]>([]);
const total = ref<number>(0);
const dialogVisible = ref<boolean>(false);
const applyType = ref<"add" | "edit">("add");
const blogName = ref<string>("");
let observe: IntersectionObserver | null = null;
let box: Element | null = null;

const goToSite = (url: string): void => {
  window.open(url);
};

const updateLink = (item: FriendLink): void => {
  _setLocalItem("blog-link-update", item);
  dialogVisible.value = true;
  applyType.value = "edit";
};

const observeBox = (): void => {
  // 获取要监听的元素，并进行类型断言
  box = document.querySelector(".observer");
  if (box) {
    observe = new IntersectionObserver(
      (entries) => {
        entries.forEach(async (e) => {
          if (e.isIntersecting && e.intersectionRatio > 0) {
            if (total.value > linksList.value.length) {
              params.current++;
              await pageGetLinksList();
            }
          }
        });
      },
      { rootMargin: "0px 0px 300px 0px" }
    );
    observe.observe(box);
  }
};

const returnUrl = (url: string): string => {
  const end = url.substring(url.length - 1);
  return end !== "/" ? url + "/favicon.ico" : url + "favicon.ico";
};

const pageGetLinksList = async (): Promise<void> => {
  try {
    if (params.current === 1) {
      loading.value = true;
    } else {
      scrollLoading.value = true;
    }
    const res = await getFriendLinks(params);
    if (res && res.code === 0 && res.result) {
      linksList.value =
        params.current === 1 ? res.result.list : [...linksList.value, ...res.result.list];
      total.value = Number(res.result.total);
    }
  } finally {
    loading.value = false;
    scrollLoading.value = false;
  }
};

const applyLinks = (): void => {
  if (getUserInfo.value.id) {
    dialogVisible.value = true;
    applyType.value = "add";
  } else {
    ElNotification({
      offset: 60,
      title: "温馨提示",
      message: h("div", { style: "color: #e6c081; font-weight: 600;" }, "请先登录"),
    });
  }
};

const getConfigDetail = async (): Promise<void> => {
  let res = await homeGetConfig();
  if (res.code === 200 && typeof res.result !== "string" && res.result) {
    blogName.value = res.result.blog_name;
  }
};

onMounted(async () => {
  _removeLocalItem("blog-link-update");
  await getConfigDetail();
  await pageGetLinksList();
  if (linksList.value.length < total.value) {
    observeBox();
  }
});

onBeforeUnmount(() => {
  if (observe && box) {
    observe.unobserve(box);
    observe = null;
  }
});
</script>

<template>
  <PageHeader :loading="loading" />
  <div class="center_box">
    <el-card class="card-tight">
      <el-descriptions :column="1">
        <template #title>
          <div class="desc-title">{{ "欢迎来到" + blogName }}</div>
        </template>

        <el-descriptions-item label="博客链接">
          <span v-copy="''" class="cursor-pointer">''</span>
        </el-descriptions-item>

        <el-descriptions-item label="QQ">
          <span v-copy="'2530320102'" class="cursor-pointer">2530320102</span>
        </el-descriptions-item>

        <el-descriptions-item>
          <span class="desc-remark" style="text-shadow: none">
            快来申请时敢的友链吧
            <span class="apply-button" @click="applyLinks">友链申请</span>
          </span>
        </el-descriptions-item>
      </el-descriptions>
    </el-card>

    <el-skeleton :loading="loading" style="height: 100%" animated>
      <template #template>
        <div class="flex-start" v-for="i in 2" :key="i">
          <div class="link-skeleton">
            <SkeletonItem variant="text" width="80%" height="60px" />
          </div>
        </div>
      </template>

      <el-row class="site" v-if="linksList.length">
        <el-col :xs="24" :sm="8" v-for="(item, index) in linksList" :key="item.id">
          <el-card class="card-hover animate__animated animate__fadeIn">
            <div
              :key="item.id"
              :style="{
                zIndex: 1,
                backgroundImage: `url(${
                  item.site_avatar
                })`,
              }"
              class="site-item site-mask"
            >
              <div class="top">
                <el-avatar
                  :key="item.id"
                  fit="cover"
                  :size="64"
                  :src="item.site_avatar || returnUrl(item.url)"
                >
                  <span class="avatar-font">{{ item.site_name }}</span>
                </el-avatar>
                <div class="flex-1">
                  <span :title="item.site_name" class="name" @click="goToSite(item.url)">{{
                    item.site_name
                  }}</span>
                </div>
              </div>

              <div class="bottom">
                <span :title="item.site_desc" class="desc"> {{ item.site_desc }}</span>
              </div>

              <div class="op-icon" v-if="getUserInfo.id">
                <el-icon v-if="getUserInfo.id === 1 || getUserInfo.id === item.user_id">
                  <Edit @click="updateLink(item)" />
                </el-icon>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <div class="observer">
        <Loading :size="32" v-if="scrollLoading" />
        <template v-else>
          {{ linksList.length >= total ? "已经到底了~" : "下拉加载更多～" }}
        </template>
      </div>
    </el-skeleton>
  </div>

  <linkApply v-model:show="dialogVisible" :type="applyType"></linkApply>
</template>

<style lang="scss" scoped>
.card-tight {
  margin: 2rem !important;
}
.desc-title {}

.cursor-pointer {
  cursor: pointer !important;
}

.flex-start {
  display: flex;
  justify-content: flex-start;
  width: 100%;
  margin-top: 10px !important;
}

.link-skeleton {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 11rem;
  border-radius: 0.375rem; /* 等价 rounded-md */
}

.top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* 名称容器：原 flex-1 !ml-[2rem] */
.flex-1 {
  flex: 1 1 0%;
  margin-left: 2rem !important;
}

.desc {
  &-title {
    font-size: 1.8rem;
  }
  &-remark {
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;
  }
}

.site {
  transition: height 0.8s ease;
  &-item {
    padding: 10px;
    cursor: pointer;
    position: relative;
    height: 11rem;
    background-position: center;
    background-size: cover;

    .top {
      .avatar-hover {
        animation: avatarHover 0.8s forwards;
      }

      .name {
        display: inline-block;
        width: 10rem;
        font-size: 1.8rem;
        font-weight: bold;
        line-height: 1.7;
        color: var(--global-white);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        text-decoration: none;
        transition: 0.2s ease-in-out;

        &:hover {
          scale: 1.1;
        }
      }
    }

    .bottom {
      width: 100%;
      margin-top: 1rem;
      .desc {
        transition: all 0.5s;
        display: -webkit-box;
        width: 100%;
        font-weight: bold;
        color: var(--global-white);
        line-height: 1.2;
        font-size: 1rem;
        text-overflow: -o-ellipsis-lastline;
        overflow: hidden;
        text-overflow: ellipsis;
        -webkit-line-clamp: 3;
        line-clamp: 3;
        -webkit-box-orient: vertical;
      }
    }

    .op-icon {
      position: absolute;
      top: 3px;
      right: 10px;
      font-size: 24px;
      font-weight: 600;
      z-index: 3333;
    }
  }
}

.op-icon {
  color: var(--global-white);
}

.link-skeleton {
  background-color: rgba(255, 255, 255, 0.5);
}

.site-mask::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
  background-color: rgba(0, 0, 0, 0.3);
}

@keyframes avatarHover {
  0% {
    transform: translateY(0);
  }

  100% {
    transform: translateY(-100px);
  }
}

.observer {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.2rem;
  color: var(--font-color);
  margin-top: 30px;
  letter-spacing: 1px;
}
</style>