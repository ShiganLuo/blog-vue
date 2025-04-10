import { ref, onMounted, reactive } from "vue";
import { message } from "@/utils/message";
import { useRoute, useRouter } from "vue-router";

import { getCategoryDictionary } from "@/api/category";
import { getTagDictionary } from "@/api/tag";
import {
  addArticle,
  editArticle,
  getArticleById,
  titleExist,
  imgUpload,
  addCategory,
  addTag
} from "@/api/article";
import { mdImgUpload } from "@/api/site";
import { tagV, coverV } from "./validator";
import { ElLoading } from "element-plus";
import { useNav } from "@/layout/hooks/useNav";

export function useArticle() {
  const { username } = useNav();
  const dialogVisible = ref(false);
  const articleFormRef = ref();
  const dialogArticleFormRef = ref();
  const route = useRoute();
  const router = useRouter();
  const canPublish = ref(true);

  const articleForm = reactive({
    id: "",
    article_title: "",
    category: {},
    category_id: null,
    tagIdList: [],
    tagList: [],
    author_name: "",
    article_content: "",
    article_cover: "",
    is_top: 2, // 置顶 1 置顶 2 取消置顶
    order: 1, // 置顶文章的排序
    status: 1, // 状态 1 公开 2 私密 3 回收站（相当于草稿）
    type: 1, // 类型 1 原创 2 翻译 3 转载
    origin_url: "", // 原文链接 翻译或转载才需要填
    coverList: [],
    article_description: "" // 文章描述
  });
  interface articleRequest {
    title: string;
    summary: string;
    content: string;
    author: string;
  }
  interface categoryRequest {
    categoryName: string;
    articleId: number;
  }
  interface tagRequest {
    tagNames: [];
    articleId: number;
  }
  const tagOptionList = ref([]);
  const categoryOptionList = ref([]);

  const coverPreviewVisible = ref(false);
  const coverUrl = ref(null);

  // 校验规则
  const articleFormRules = reactive({
    article_title: {
      required: true,
      trigger: "blur",
      message: "请输入文章标题"
    },
    article_content: {
      required: true,
      message: "请输入文章内容",
      trigger: "blur"
    }
  });
  // 校验规则
  const dialogArticleFormRules = reactive({
    category_id: {
      required: true,
      message: "请选择文章分类",
      trigger: ["change"]
    },
    article_description: {
      required: true,
      message: "请输入文章描述",
      trigger: ["blur"]
    },
    tagIdList: {
      required: true,
      message: "请选择文章标签",
      validator: tagV,
      trigger: ["change"]
    },
    coverList: {
      required: true,
      message: "请上传文章封面",
      validator: coverV,
      trigger: ["change"]
    },
    origin_url: {
      required: true,
      message: "请输入原文链接",
      trigger: ["blur"]
    },
    order: {
      validator: (rule, value, callback) => {
        if (!value) {
          callback(new Error("请输入文章排序"));
        } else {
          articleForm.order = value - 0;
          callback();
        }
      },
      trigger: "blur"
    }
  });

  function closeDialog() {
    resetForm(dialogArticleFormRef.value);
    dialogVisible.value = false;
  }

  const resetForm = formEl => {
    if (!formEl) return;
    formEl.resetFields();
  };

  // 发布文章 打开弹窗
  async function publish(formEl) {
    if (!formEl) return;
    if (!canPublish.value) {
      message("文章标题重复，换个标题试试", { type: "warning" });
      return;
    }
    await formEl.validate(valid => {
      if (valid) {
        dialogVisible.value = true;
      } else {
        message("请按照提示填写信息", { type: "warning" });
      }
    });
  }
  // 图片上传
  async function uploadCover(articleId) {
    if (!articleForm.coverList[0].id) {
      const upLoadLoading = ElLoading.service({
        fullscreen: true,
        text: "图片上传中"
      });
      const res = await imgUpload(articleForm.coverList[0], articleId);
      if (res.code == 200) {
        const url = res.result;
        articleForm.article_cover = url;
      }
      upLoadLoading.close();
    }
  }

  async function articleTitleVAlidate() {
    const { id, article_title } = articleForm;
    const res = await titleExist({ id, article_title });
    if (res.code != 200) {
      canPublish.value = false;
      message("文章标题已存在，换一个试试", { type: "warning" });
    } else {
      canPublish.value = true;
    }
  }

  // 上传md文章图片
  async function uploadImage(files, callback) {
    const res = await Promise.all(
      files.map(file => {
        return new Promise((resolve, reject) => {
          mdImgUpload(file).then(imgData => {
            if (imgData.code == 200) {
              const { url } = imgData.result;
              resolve(url);
            } else {
              reject(imgData.message || "上传失败");
            }
          });
        });
      })
    );

    callback(res);
  }

  // 整理文章的数据返回给后端,剥离响应式以正确序列化发送请求
  function arrangeArticle(articleForm) {
    const { id, category_id, tagIdList, ...restArticle } = articleForm;
    let newCategory;
    const newTagList = [];

    // ​根据输入的 category_id 类型区分「选择已有分类」和「创建新分类」两种场景
    if (typeof category_id == "number") {
      const foundCategory = categoryOptionList.value.find(
        category => category.id === category_id
      );
      newCategory = {
        id: foundCategory.id,
        category_name: foundCategory.name
      };
    } else {
      newCategory = {
        category_name: category_id
      };
    }
    tagIdList.forEach(tagId => {
      if (typeof tagId == "number") {
        const foundTag = tagOptionList.value.find(tag => tag.id === tagId);
        newTagList.push({
          id: foundTag.id,
          tag_name: foundTag.name
        });
      } else {
        newTagList.push({
          tag_name: tagId
        });
      }
    });
    restArticle.category = newCategory;
    restArticle.tagList = newTagList;
    if (id) {
      restArticle.id = id;
    }
    // 如果文章是新创建的，从登录状态获取用户名赋值给author_name
    if (!id) {
      restArticle.author_name = username ? username?.value : "hello";
    }
    // type为1表示原创，没有原文链接
    if (restArticle.type == 1) {
      restArticle.origin_url = null;
    }
    //删除封面图片，此功能由uploadCover实现
    delete restArticle.coverList;
    return restArticle;
  }

  // 发布
  async function submitForm(formEl, type) {
    await formEl.validate(async valid => {
      if (valid) {
        // 图片上传

        if (type == 1) {
          // 1 是保存草稿 2 是直接发布
          articleForm.status = 3;
        }

        if (articleForm.is_top == 2) {
          articleForm.order = null;
        }
        // 整合数据
        const finalArticle = arrangeArticle(articleForm);
        let res;
        if (!finalArticle.id) {
          // 创建文章返回文章id
          console.log(finalArticle);
          const articleData: articleRequest = {
            title: finalArticle?.article_title,
            summary: finalArticle?.article_description,
            content: finalArticle?.article_content,
            author: finalArticle?.author_name
          };
          res = await addArticle(articleData);
          if (res.code == 200) {
            finalArticle.id = res.result;
            await uploadCover(res.result);
            const categoryData: categoryRequest = {
              categoryName: finalArticle?.category?.category_name,
              articleId: finalArticle?.id
            };
            await addCategory(categoryData);
            const tagData: tagRequest = {
              tagNames: finalArticle?.tagList?.map(tag => tag.tag_name),
              articleId: finalArticle?.id
            };
            console.log(tagData);
            await addTag(tagData);
          }
        } else {
          // 编辑
          res = await editArticle(finalArticle);
        }
        if (res.code == 200) {
          message(res.message, { type: "success" });
          resetForm(formEl.value);
          resetForm(articleFormRef.value);
          dialogVisible.value = false;
          setTimeout(() => {
            router.push("/article/articleList");
          }, 300);
        }
      } else {
        message("请按照提示填写信息", { type: "warning" });
      }
    });
  }

  // 获取标签列表
  async function getTagD() {
    const res = await getTagDictionary();
    if (res.code == 200) {
      tagOptionList.value = res.result;
    }
  }
  // 获取分类列表
  async function getCategoryD() {
    const res = await getCategoryDictionary();
    if (res.code == 200) {
      categoryOptionList.value = res.result;
    }
  }
  // 根据id获取文章详情
  async function getArticleDetailsById(article_id) {
    const res = await getArticleById(article_id);
    if (res.code == 200) {
      const { article_cover } = res.result;
      Object.assign(articleForm, res.result);

      articleForm.coverList = [
        {
          // 获取数组最后一位有很多种方法 article_cover.split('/').reverse()[0]
          //           article_cover.split('/').slice(-1)
          //           article_cover.split('/').at(-1)
          id: 1,
          name: article_cover.split("/").pop(),
          url: article_cover
        }
      ];
    }
  }

  onMounted(async () => {
    await getTagD();
    await getCategoryD();

    if (!route.query.articleId) return;
    // 根据id获取文章信息,articleId从url中获取
    getArticleDetailsById(route.query.articleId);
  });

  return {
    coverUrl,
    articleForm,
    dialogVisible,
    tagOptionList,
    articleFormRef,
    articleFormRules,
    categoryOptionList,
    coverPreviewVisible,
    dialogArticleFormRef,
    dialogArticleFormRules,
    closeDialog,
    uploadImage,
    publish,
    submitForm,
    articleTitleVAlidate
  };
}
