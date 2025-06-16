import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

// API基础URL配置，可以从环境变量中获取
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
const DEEPSEEK_API_URL = import.meta.env.VITE_DEEPSEEK_API_URL || 'https://api.deepseek.com/v1';
const DEEPSEEK_API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY || '';

// API响应数据接口
export interface ApiResponseData<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: Record<string, any>;
}

// 创建axios实例
const createApiInstance = (baseURL: string, config?: AxiosRequestConfig): AxiosInstance => {
  const instance = axios.create({
    baseURL,
    timeout: 30000, // 默认超时时间：30秒
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    ...config,
  });

  // 请求拦截器
  instance.interceptors.request.use(
    (config) => {
      // 添加认证信息
      if (!config.headers) {
        config.headers = {};
      }

      // 如果使用DeepSeek API，添加API密钥
      if (config.baseURL === DEEPSEEK_API_URL && DEEPSEEK_API_KEY) {
        config.headers['Authorization'] = `Bearer ${DEEPSEEK_API_KEY}`;
      }

      // 添加其他自定义认证头，例如JWT令牌（如果有）
      // const token = localStorage.getItem('authToken');
      // if (token) {
      //   config.headers['Authorization'] = `Bearer ${token}`;
      // }

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // 响应拦截器
  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      // 直接返回响应数据
      return response.data;
    },
    (error: AxiosError) => {
      // 处理错误响应
      if (error.response) {
        // 服务器返回错误状态码
        const status = error.response.status;
        const data = error.response.data as any;

        // 根据状态码处理不同错误
        switch (status) {
          case 401:
            // 未授权，可以触发登出或刷新令牌
            console.error('API Error: Unauthorized');
            // 可以在此处添加自动登出或刷新令牌的逻辑
            break;
          case 403:
            console.error('API Error: Forbidden');
            break;
          case 404:
            console.error('API Error: Resource not found');
            break;
          case 500:
            console.error('API Error: Internal server error');
            break;
          default:
            console.error(`API Error: ${status}`, data);
        }

        // 格式化错误响应
        return Promise.reject({
          success: false,
          error: {
            code: `ERR_${status}`,
            message: data.message || '请求失败',
            details: data,
          },
        });
      }

      if (error.request) {
        // 请求已发送但未收到响应
        console.error('API Error: No response received', error.request);
        return Promise.reject({
          success: false,
          error: {
            code: 'ERR_NO_RESPONSE',
            message: '服务器无响应，请检查网络连接',
          },
        });
      }

      // 请求配置错误
      console.error('API Error: Request config error', error.message);
      return Promise.reject({
        success: false,
        error: {
          code: 'ERR_REQUEST_CONFIG',
          message: error.message || '请求配置错误',
        },
      });
    }
  );

  return instance;
};

// 创建默认API实例
export const api = createApiInstance(API_BASE_URL);

// 创建DeepSeek API实例
export const deepseekApi = createApiInstance(DEEPSEEK_API_URL);

// 通用请求方法
export const apiRequest = {
  // GET请求
  get: async <T = any>(
    url: string,
    params?: Record<string, any>,
    config?: AxiosRequestConfig
  ): Promise<ApiResponseData<T>> => {
    try {
      const response = await api.get<ApiResponseData<T>>(url, {
        params,
        ...config,
      });
      return response as ApiResponseData<T>;
    } catch (error) {
      return error as ApiResponseData<T>;
    }
  },

  // POST请求
  post: async <T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponseData<T>> => {
    try {
      const response = await api.post<ApiResponseData<T>>(url, data, config);
      return response as ApiResponseData<T>;
    } catch (error) {
      return error as ApiResponseData<T>;
    }
  },

  // PUT请求
  put: async <T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponseData<T>> => {
    try {
      const response = await api.put<ApiResponseData<T>>(url, data, config);
      return response as ApiResponseData<T>;
    } catch (error) {
      return error as ApiResponseData<T>;
    }
  },

  // DELETE请求
  delete: async <T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponseData<T>> => {
    try {
      const response = await api.delete<ApiResponseData<T>>(url, config);
      return response as ApiResponseData<T>;
    } catch (error) {
      return error as ApiResponseData<T>;
    }
  },

  // PATCH请求
  patch: async <T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponseData<T>> => {
    try {
      const response = await api.patch<ApiResponseData<T>>(url, data, config);
      return response as ApiResponseData<T>;
    } catch (error) {
      return error as ApiResponseData<T>;
    }
  },
};

export default apiRequest;
