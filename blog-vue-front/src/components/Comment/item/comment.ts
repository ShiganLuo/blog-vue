export type CommentType = "post" | "comment" | "talk";

export interface CommentItem {
  id: number | string;
  from_id: number | string;
  from_name: string;
  from_avatar: string;
  content: string;
  createdAt: string;
  thumbs_up: number;
  is_like: boolean;
  ipAddress: string;
  showApplyInput: boolean;
  [key: string]: any;
}

export interface CommentParams {
  current: number;
  size: number;
  type?: string;
  for_id: number | string;
  order: string;
  user_id?: number | string;
  parent_id?: number | string;
  loading: boolean;
}

export interface CommentTo {
  to_name: string
  to_avatar: string
  to_id: string | number
  from_id?: string | number
  from_avatar?: string
  from_name?: string
  parent_id?: string | number
  content?: string
}
