import { http } from "@/utils/http";
import { ElMessage } from "element-plus";
import { imageConversion } from "@/utils/utils";

export type ArticleResult = {
  code: number;
  message: string;
  result: any;
};

/** 条件分页获取文章 */
export const getArticleList = (data?: object) => {
  return http.request<ArticleResult>(
    "post",
    "/api/admin/articles/getArticleList",
    {
      data
    }
  );
};

/** 新增文章 */
export const addArticle = (data?: object) => {
  return http.request<ArticleResult>("post", "/api/admin/articles/create", {
    data
  });
};

/** 修改文章 */
export const editArticle = (data?: object) => {
  return http.request<ArticleResult>("post", "/api/admin/articles/update", {
    data
  });
};

// /** 删除文章  传文章状态 1、2会假删除 3会真删除*/
// export const deleteArticle = (id, status) => {
//   return http.request<ArticleResult>(
//     "delete",
//     `/api/article/delete/${id}/${status}`,
//     {}
//   );
// };

/** 修改文章置顶 */
export const updateArticleTop = (id, is_top) => {
  return http.request<ArticleResult>(
    "put",
    `/api/admin/articles/isTop/${id}/${is_top}`,
    {}
  );
};

// /** 恢复文章 */
// export const revertArticle = id => {
//   return http.request<ArticleResult>("put", `/api/article/revert/${id}`, {});
// };

// /** 公开或隐藏文章 1 公开 2 私密 */
// export const isArticlePublic = (id, status) => {
//   return http.request<ArticleResult>(
//     "put",
//     `/api/article/isPublic/${id}/${status}`,
//     {}
//   );
// };

/** 根据文章id获取文章详细信息 */
export const getArticleById = id => {
  return http.request<ArticleResult>(
    "get",
    `/api/admin/articles/getArticleById/${id}`,
    {}
  );
};
/**设置文章分类 */
export const addCategory = data => {
  return http.request<ArticleResult>(
    "post",
    `/api/admin/articles/uploadCategory`,
    { data }
  );
};
/**设置文章标签 */
export const addTag = data => {
  return http.request<ArticleResult>("post", `/api/admin/articles/uploadTag`, {
    data
  });
};

/** 根据文章标题 和 id 判断文章标题是否重复了 */
export const titleExist = data => {
  return http.request<ArticleResult>("post", `/api/admin/articles/titleExist`, {
    data
  });
};

/**设置文章封面 */
export const imgUpload = async (data, articleId) => {
  // 文件压缩 太大了上传不了，我的服务器比较垃圾
  let res;
  // 没有raw.size 就表示已经压缩过了（多图片上传那里我压缩了一次） 有的话小于800不用压缩
  if (data.raw.size / 1024 > 820) {
    const file = await imageConversion(data.raw);
    if (!file) {
      ElMessage.error("图片上传失败");
      return;
    } else {
      res = file;
    }
  } else {
    res = data.raw;
  }
  const formData = new FormData();
  formData.append("file", res);
  formData.append("articleId", articleId);
  return http.request<ArticleResult>(
    "post",
    `/api/admin/articles/uploadCover`,
    {
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data" // 手动声明 Content-Type
      }
    }
  );
};
