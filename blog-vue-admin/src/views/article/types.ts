// src/views/article/types.ts
export interface Article {
  /** 文章ID */
  id?: number;
  /** 标题 */
  title: string;
  /** 内容（Markdown格式） */
  content: string;
  /** 分类 */
  category: string;
  /** 状态 0-草稿 1-已发布 */
  status: 0 | 1;
  /** 标签 */
  tags: string[];
  /** 封面图URL */
  cover?: string;
  /** 创建时间 */
  createTime?: string;
}

/** 分类类型 */
export interface Category {
  label: string;
  value: string;
  color: "blue" | "green" | "purple"; // restrict colors to valid options
}
