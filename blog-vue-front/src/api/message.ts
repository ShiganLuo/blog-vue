import { fullRequest, request } from "./http/index";

export const addMessage = (data?: object) => {
  return fullRequest({
    method:  'post',
    url: '/api/front/articles/getTimeLineArticle',
    data: data
  })
}

export const updateMessage = (data?: object) => {
  return fullRequest({
    method:  'post',
    url: '/api/front/articles/getTimeLineArticle',
    data: data
  })
}

export const getMessageTag = (data?: object) => {
  return fullRequest({
    method:  'post',
    url: '/api/front/articles/getTimeLineArticle',
    data: data
  })
}

export const getMessageList = (data?: object) => {
  return fullRequest({
    method:  'post',
    url: '/api/front/articles/getTimeLineArticle',
    data: data
  })
}

export const deleteMessage = (data?: object) => {
  return fullRequest({
    method:  'post',
    url: '/api/front/articles/getTimeLineArticle',
    data: data
  })
}

export const getAllMessage = (data?: object) => {
  return fullRequest({
    method:  'get',
    url: '/api/front/comments/getAllMessage',
    data: data
  })
}
