import { fullRequest, request } from "./http/index";

interface homeGetArticleListParam {
  pageNum: number;
  pageSize: number;
  keyword?: string;
  sortBy?: string;
  sortOrder?: string;
}

interface Article {
  id: number;
  title: string;
  // 根据实际接口补充其他字段
}

// 由在axios配置中由BaseResponse包裹，只需要定义后端返回数据的result部分类型
interface homeGetArticleListResult {
  list: Article[];
  total: number;

}
export const homeGetArticleList = (data?: homeGetArticleListParam) => {
    return fullRequest<homeGetArticleListResult>({
        method: 'post',
        url: '',
        data:data
    })
}


export const getHotArticle = (data?: object) => {
  return request({
    method: 'post',
    url: '',
    data: data
  })
}

export const getArticleByContent = (data?: object) => {
  return request({
    method: 'post',
    url: '',
    data: data
  })
}
