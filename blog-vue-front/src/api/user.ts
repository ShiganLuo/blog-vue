import { request,fullRequest } from "./http/index";

export type UserResult = {
    /** `token` */
    accessToken: string;
    /** 用于调用刷新`accessToken`的接口时所需的`token` */
    refreshToken: string;
    /** `accessToken`的过期时间（格式'xxxx/xx/xx xx:xx:xx'） */
    expires: Date;
    /** 头像 */
    avatar: string;
    /** 用户名 */
    username: string;
    /** 昵称 */
    nickname: string;
    /** 当前登录用户的角色 */
    roles: string;
    /** 按钮级别权限 */
    permissions: Array<string>;
};

export type RefreshTokenResult = {
    /** `token` */
    accessToken: string;
    /** 用于调用刷新`accessToken`的接口时所需的`token` */
    refreshToken: string;
    /** `accessToken`的过期时间（格式'xxxx/xx/xx xx:xx:xx'） */
    expires: Date;
};

/** 登录 */
export const login = (data?: object) => {
  return request<UserResult>({
    method:"post",
    url: "/api/admin/users/login",
    data: data }
    );
};

/** 刷新`token` */
export const refreshTokenApi = (data?: object) => {
  return request<RefreshTokenResult>({
    method: "post",
    url: "/api/admin/users/refreshToken",
    data: data
    });
};
/** 注册 */
export const register = (data?: object) => {
  return request({
    method: "post",
    url: "/api/admin/users/register",
    data: data
  })
}
export const getUserInfoById = (data?: object) => {
  return request({
    method: "post",
    url: "/api/admin/users/getUserInfoById",
    data: data
  })
}

export const reqLogin = (data?: object) => {
  return fullRequest<UserResult>({
    method: "post",
    url: "/api/admin/users/login",
    data: data
  });
}

export const reqRegister = (data?: object) => {
  return fullRequest({
    method: "post",
    url: "/api/admin/users/register",
    data: data
  });
}

