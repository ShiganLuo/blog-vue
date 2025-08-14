import { fullRequest, request } from "./http/index";

export const getFriendLinks = (data?: object) => {
  return fullRequest({
    method:  'post',
    url: '/api/front/articles/getTimeLineArticle',
    data: data
  })
}

export const addFriendLinks = (data?: object) => {
  return fullRequest({
    method:  'post',
    url: '/api/front/articles/getTimeLineArticle',
    data: data
  })
}

export const updateFriendLinks = (data?: object) => {
  return fullRequest({
    method:  'post',
    url: '/api/front/articles/getTimeLineArticle',
    data: data
  })
}