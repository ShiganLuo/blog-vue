import { fullRequest, request } from "./http/index";

export const addComment = (data?: object) => {
  return fullRequest({
    method:  'post',
    url: '/api/front/comments/addComment',
    data: data
  })
}

export const frontGetCommentTotal = (data?: object) => {
  return fullRequest({
    method:  'post',
    url: '/api/front/comments/getCommentTotal',
    data: data
  })
}

export const frontGetParentComment = (data?: object) => {
  return fullRequest({
    method:  'post',
    url: '/api/front/comments/getCommentPage',
    data: data
  })
}

export const applyComment = (data?: object) => {
  return fullRequest({
    method:  'post',
    url: '',
    data: data
  })
}

export const deleteComment = (id?: number | string) => {
  return fullRequest({
    method:  'get',
    url: `/api/front/comments/deleteCommentById/${id}`,
  })
}

export const frontGetChildrenComment = (data?: object) => {
  return fullRequest({
    method:  'post',
    url: '',
    data: data
  })
}

