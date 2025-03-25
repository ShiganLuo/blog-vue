<template>
  <PureDialog
    v-model="visible"
    :title="mode === 'edit' ? '编辑文章' : '新建文章'"
    width="90%"
    top="5vh"
  >
    <el-form
      :model="formData"
      :rules="rules"
      label-position="top"
      class="article-editor"
    >
      <div class="grid grid-rows-4 gap-4">
        <!-- 上侧表单 -->
        <div class="row-span-1 h-[20vh]">
          <div class="grid grid-cols-4 gap-x-4">
            <el-form-item label="标题" prop="title">
              <el-input v-model="formData.title" />
            </el-form-item>
            <el-form-item label="分类" prop="category">
              <el-select v-model="formData.category">
                <el-option
                  v-for="item in categories"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>

            <el-form-item label="标签">
              <el-select
                v-model="formData.tags"
                multiple
                filterable
                allow-create
                placeholder="输入标签"
              >
                <el-option
                  v-for="tag in formData.tags"
                  :key="tag"
                  :label="tag"
                  :value="tag"
                />
              </el-select>
            </el-form-item>

            <el-form-item label="状态" prop="status">
              <el-radio-group v-model="formData.status">
                <el-radio :label="0">草稿</el-radio>
                <el-radio :label="1">已发布</el-radio>
              </el-radio-group>
            </el-form-item>
          </div>

          <el-form-item label="封面图">
            <div class="cover-upload">
              <el-upload
                action="#"
                list-type="picture-card"
                :auto-upload="false"
                :on-change="handleCoverChange"
                :class="{ 'has-cover': formData.cover }"
              >
                <div class="upload-content">
                  <el-icon v-if="!formData.cover">
                    <Icon icon="ep:add" />
                  </el-icon>
                  <span v-if="!formData.cover">上传封面</span>
                </div>
              </el-upload>

              <!-- 悬浮预览 -->
              <el-image
                v-if="formData.cover"
                :src="formData.cover"
                class="cover-preview"
                :preview-src-list="[formData.cover]"
                :initial-index="0"
                fit="cover"
              />
            </div>
          </el-form-item>
        </div>

        <!-- 下侧编辑器 -->
        <div class="row-span-3 h-[70vh]">
          <MdEditor
            v-model="formData.content"
            class="h-full"
            :toolbars="toolbars"
          />
        </div>
      </div>
    </el-form>

    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="handleSubmit">提交</el-button>
    </template>
  </PureDialog>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import { ElMessage, UploadFile } from "element-plus";
import { MdEditor } from "md-editor-v3";
import "md-editor-v3/lib/style.css";
import { Icon } from "@iconify/vue";
import type { Article } from "../types";

const props = defineProps<{
  data: Partial<Article>;
  mode: "create" | "edit";
}>();

const emit = defineEmits(["submit", "update:modelValue"]);

const visible = defineModel<boolean>("modelValue", { default: false });

// 编辑器配置
import type { ToolbarNames } from "md-editor-v3";

const toolbars: ToolbarNames[] = [
  "bold",
  "underline",
  "italic",
  "strikeThrough",
  "sub",
  "sup",
  "code",
  "link",
  "image",
  "table",
  "preview"
];

// 表单验证
const rules = {
  title: [{ required: true, message: "请输入标题", trigger: "blur" }],
  category: [{ required: true, message: "请选择分类", trigger: "change" }],
  content: [{ required: true, message: "请输入内容", trigger: "blur" }]
};

// 表单数据
const categories = ref([
  { value: "category1", label: "Category 1" },
  { value: "category2", label: "Category 2" }
  // Add more categories as needed
]);

const formData = ref<Partial<Article>>({ ...props.data });

watch(
  () => props.data,
  val => {
    formData.value = { ...val };
  }
);

const handleSubmit = () => {
  emit("submit", formData.value);
  visible.value = false;
};

const handleCoverChange = (uploadFile: UploadFile) => {
  const file = uploadFile.raw as File;
  const reader = new FileReader();
  reader.onload = e => {
    formData.value.cover = e.target?.result as string;
  };
  reader.readAsDataURL(file);
};
</script>

<style lang="scss">
.article-editor {
  .el-form-item {
    margin-bottom: 1rem;

    &__label {
      font-weight: 500;
      color: #4a5568;
    }
  }

  .md-editor {
    height: 100%;
    border: 1px solid #e2e8f0;
    border-radius: 0.5rem;
    overflow: hidden;
  }
}
// image
.cover-upload {
  position: relative;
  height: 32px; // 与其他表单项一致的高度

  .el-upload {
    height: 32px;
    width: 120px;

    &.has-cover {
      opacity: 0.7;
      transition: opacity 0.3s;

      &:hover {
        opacity: 1;
      }
    }
  }

  .upload-content {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;

    .el-icon {
      margin-right: 4px;
    }
  }

  .cover-preview {
    position: absolute;
    left: 0;
    top: 0;
    height: 50px;
    width: 120px;
    object-fit: cover;
    border-radius: 4px;
    pointer-events: none; // 确保上传按钮可点击
  }
}
</style>
