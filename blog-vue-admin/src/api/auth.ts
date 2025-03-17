// 认证相关的API服务
import { post, get } from '../utils/http';
import axios from 'axios';

interface LoginData {
  username: string;
  password: string;
}

interface RegisterData {
  username: string;
  password: string;
}

interface LoginResponse {
  code: number;
  message: string;
  result: {
    token: string;
    user: {
      username: string;
      id: string;
      role: string;
    };
  }

}

/**
 * 用户登录
 * @param data 登录数据
 * @returns 登录响应
 */
export function login(data: LoginData): Promise<LoginResponse> {
  return post<LoginResponse>('/admin/users/login', data);
}

/**
 * 用户注册
 * @param data 注册数据
 * @returns 注册响应
 */
export function register(data: RegisterData): Promise<{ message: string }> {
  return post<{ message: string }>('/admin/users/register', data);
}

/**
 * 验证用户token是否有效
 */
export async function verifyToken(token: string) {
  try {
    const response = await axios.get('/api/verify-token', {
      headers: {
        'Authorization': `Bearer ${token}`
      },
    });
    return response.data;
  } catch (error) {
    // 如果是超时错误，返回一个默认响应
    if (axios.isAxiosError(error) && error.code === 'ECONNABORTED') {
      console.warn('Token验证超时，假定有效');
      return { valid: true };
    }
    throw error;
  }
}