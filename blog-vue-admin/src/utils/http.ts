// HTTP请求工具
import axios from 'axios';
import type { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

// API基础URL，实际项目中应该从环境变量获取
export const API_URL = '/api';

// 默认超时时间（毫秒）
const DEFAULT_TIMEOUT = 10000;

// 创建axios实例
const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: DEFAULT_TIMEOUT,
  headers: {
    Accept: "application/json, text/plain, */*",
    'Content-Type': 'application/json',
    "X-Requested-With": "XMLHttpRequest"
  }
});

// 请求拦截器
axiosInstance.interceptors.request.use(
  (config) => {
    // console.log(config);
    // 获取存储的令牌
    const token = localStorage.getItem('token');
    
    // 如果有令牌，添加到请求头
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    // 添加缓存控制头，避免浏览器缓存
    if (config.method?.toLowerCase() === 'get') {
      config.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate';
      config.headers['Pragma'] = 'no-cache';
      config.headers['Expires'] = '0';
    }
    
    console.time(`API请求: ${config.url}`);
    return config;
  },
  (error) => {
    console.error('请求拦截器错误:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器
axiosInstance.interceptors.response.use(
  (response) => {
    console.timeEnd(`API请求: ${response.config.url}`);
    // console.log(response);
    return response;
  },
  (error: AxiosError) => {
    console.log(error);
    if (error.config) {
      console.timeEnd(`API请求: ${error.config.url}`);
    }
    
    // 处理超时错误
    if (error.code === 'ECONNABORTED') {
      console.error(`请求超时: ${error.config?.url}`);
      return Promise.reject(new Error('请求超时，请稍后再试'));
    }
    
    // 处理服务器响应错误
    if (error.response) {
      const errorData = error.response.data as Record<string, unknown>;
      const errorMessage = errorData.message as string || `请求失败: ${error.response.status}`;
      return Promise.reject(new Error(errorMessage));
    }
    
    console.error('HTTP请求错误:', error);
    return Promise.reject(error);
  }
);

/**
 * 发送HTTP请求
 * @param url 请求URL
 * @param options 请求选项
 * @returns 响应数据
 */
export async function request<T>(url: string, options: AxiosRequestConfig = {}): Promise<T> {
  try {
    const response = await axiosInstance({
      url,
      ...options
    });
    return response.data;
  } catch (error) {
    console.error('请求错误:', error);
    throw error;
  }
}

/**
 * GET请求
 * @param url 请求URL
 * @param params 查询参数
 * @param options 请求选项
 * @returns 响应数据
 */
export function get<T>(url: string, params = {}, options: AxiosRequestConfig = {}): Promise<T> {
  return request<T>(url, { ...options, method: 'GET', params });
}

/**
 * POST请求
 * @param url 请求URL
 * @param data 请求数据
 * @param options 请求选项
 * @returns 响应数据
 */
export function post<T>(url: string, data = {}, options: AxiosRequestConfig = {}): Promise<T> {
  return request<T>(url, { ...options, method: 'POST', data });
}

/**
 * PUT请求
 * @param url 请求URL
 * @param data 请求数据
 * @param options 请求选项
 * @returns 响应数据
 */
export function put<T>(url: string, data = {}, options: AxiosRequestConfig = {}): Promise<T> {
  return request<T>(url, { ...options, method: 'PUT', data });
}

/**
 * DELETE请求
 * @param url 请求URL
 * @param options 请求选项
 * @returns 响应数据
 */
export function del<T>(url: string, options: AxiosRequestConfig = {}): Promise<T> {
  return request<T>(url, { ...options, method: 'DELETE' });
} 