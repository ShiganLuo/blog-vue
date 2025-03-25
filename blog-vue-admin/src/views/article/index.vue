<template>
  <PureTable
    :data="filteredArticles"
    :pagination="pagination"
    :loading="loading"
    @update:pagination="handlePagination"
  >
    <!-- 搜索栏 -->
    <template #header>
      <el-input
        v-model="searchKeyword"
        placeholder="搜索文章"
        class="!w-64"
        clearable
      />
      <el-button type="primary" @click="handleCreate">
        <template #icon>
          <Icon icon="ep:add" />
          <!-- 使用 Element Plus 图标 -->
        </template>
        新增文章
      </el-button>
    </template>

    <!-- 表格 -->
    <el-table-column prop="title" label="标题" min-width="200" />
    <el-table-column prop="category" label="分类" width="120">
      <template #default="{ row }">
        <el-tag :type="getCategoryColor(row.category)">
          {{ categories.find(c => c.value === row.category)?.label }}
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column prop="status" label="状态" width="100">
      <template #default="{ row }">
        <el-tag :type="row.status ? 'success' : 'warning'">
          {{ row.status ? "已发布" : "草稿" }}
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column prop="createTime" label="发布时间" width="180" />
    <el-table-column label="操作" width="180" fixed="right">
      <template #default="{ row }">
        <el-button link type="primary" @click="handleEdit(row)">
          <IconifyIcon icon="carbon:edit" class="mr-1" />
          编辑
        </el-button>
        <el-popconfirm title="确认删除？" @confirm="handleDelete(row.id)">
          <template #reference>
            <el-button link type="danger">
              <IconifyIcon icon="carbon:delete" class="mr-1" />
              删除
            </el-button>
          </template>
        </el-popconfirm>
      </template>
    </el-table-column>

    <!-- 编辑弹窗 -->
    <ArticleEditor
      v-model="dialogVisible"
      :data="currentArticle"
      :mode="isEdit ? 'edit' : 'create'"
      @submit="handleSubmit"
    />
  </PureTable>
</template>

<script lang="ts" setup>
import { ref, reactive, computed } from "vue";
import { ElMessage } from "element-plus";
import { PureTable } from "@pureadmin/table";
import { Icon } from "@iconify/vue";
import ArticleEditor from "./components/ArticleEditor.vue";
import type { Article, Category } from "./types";

// 配置项
const categories: Category[] = [
  { label: "技术", value: "tech", color: "blue" },
  { label: "生活", value: "life", color: "green" },
  { label: "其他", value: "other", color: "purple" }
];
const handlePagination = (newPagination: { page: number; size: number }) => {
  pagination.page = newPagination.page;
  pagination.size = newPagination.size;
  // Here you would typically fetch data based on the new pagination
  // For now, we're just updating the pagination state
};

// 响应式状态
const searchKeyword = ref("");
const loading = ref(false);
const dialogVisible = ref(false);
const isEdit = ref(false);
const currentArticle = ref<Partial<Article>>({});

const pagination = reactive({
  page: 1,
  size: 10,
  total: 0
});

// 模拟数据
const articles = ref<Article[]>([]);

// 计算属性
const filteredArticles = computed(() => {
  return articles.value.filter(
    article =>
      article.title.includes(searchKeyword.value) ||
      article.content.includes(searchKeyword.value)
  );
});

// 方法
const getCategoryColor = (
  category: string
): "success" | "warning" | "info" | "primary" | "danger" => {
  const categoryObj = categories.find(c => c.value === category);
  switch (categoryObj?.color) {
    case "blue":
      return "primary";
    case "green":
      return "success";
    case "purple":
      return "info";
    default:
      return "info";
  }
};

const handleCreate = () => {
  currentArticle.value = {
    title: "",
    content: "",
    category: "tech",
    status: 0,
    tags: [],
    cover: ""
  };
  isEdit.value = false;
  dialogVisible.value = true;
};

const handleEdit = (row: Article) => {
  currentArticle.value = { ...row };
  isEdit.value = true;
  dialogVisible.value = true;
};

const handleDelete = async (id: number) => {
  articles.value = articles.value.filter(item => item.id !== id);
  ElMessage.success("删除成功");
};

const handleSubmit = (formData: Article) => {
  if (isEdit.value) {
    const index = articles.value.findIndex(item => item.id === formData.id);
    if (index > -1) articles.value.splice(index, 1, formData);
  } else {
    articles.value.push({
      ...formData,
      id: Date.now(),
      createTime: new Date().toISOString()
    });
  }
  dialogVisible.value = false;
  ElMessage.success("操作成功");
};
</script>
