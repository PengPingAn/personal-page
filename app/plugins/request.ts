import { defineNuxtPlugin } from "#app";
import axios, {
  type AxiosRequestConfig,
  type AxiosError,
  type Method,
} from "axios";
import { useCookie } from "#app";

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();
  const tokenCookie = useCookie("web-token");

  const service = axios.create({
    baseURL: config.public.apiBase,
    timeout: 10000,
  });

  service.interceptors.request.use(
    (config) => {
      const token = tokenCookie.value;
      if (token)
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${token}`,
          "Cache-Control": "no-cache, no-store, max-age=0",
          Pragma: "no-cache",
        };
      return config;
    },
    (error) => Promise.reject(error)
  );

  service.interceptors.response.use(
    (res) => {
      // 如果你的接口有自定义 code
      if (res.data?.code && res.data.code !== 200) {
        if (res.data.code === 401) {
          // 统一处理未登录，例如跳转到登录页
          window.$toast?.error("登录已过期，请重新登录");
          // 可选清空 cookie
          useCookie("web-token").value = "";
          // 跳转登录页（Nuxt Router）
          setTimeout(() => {
            window.location.href = "/admin/login2";
          }, 500);
        } else {
          window.$toast?.error(res.data.message || "请求错误");
        }
        return Promise.reject(res.data);
      }
      return res.data;
    },
    (error: AxiosError) => {
      // 处理 HTTP 状态码
      if (error.response) {
        const status = error.response.status;
        if (status === 401) {
          window.$toast?.error("未授权，请重新登录");
          useCookie("web-token").value = "";
          setTimeout(() => {
            window.location.href = "/admin/login2";
          }, 500);
        } else if (status === 403) {
          window.$toast?.error("权限不足");
        } else if (status >= 500) {
          window.$toast?.error("服务器错误，请稍后再试");
        }
      } else {
        // 网络错误 / 超时
        window.$toast?.error(error.message || "网络错误");
      }
      return Promise.reject(error);
    }
  );

  const baseRequest = async <T = any>(
    method: Method,
    url: string,
    data?: any,
    config: AxiosRequestConfig & { retry?: number; retryDelay?: number } = {}
  ): Promise<T> => {
    const { retry = 0, retryDelay = 1000, ...axiosConfig } = config;
    let retries = 0;

    while (true) {
      try {
        const finalConfig: AxiosRequestConfig = { method, url, ...axiosConfig };
        if (method.toUpperCase() === "GET") finalConfig.params = data;
        else finalConfig.data = data;
        return await service(finalConfig);
      } catch (err) {
        const error = err as AxiosError;
        const isNetworkOrTimeout =
          error.code === "ECONNABORTED" ||
          error.message.includes("timeout") ||
          !error.response;

        if (retries < retry && isNetworkOrTimeout) {
          retries++;
          await new Promise((resolve) => setTimeout(resolve, retryDelay));
        } else {
          throw error;
        }
      }
    }
  };

  const request = {
    Get: <T = any>(
      url: string,
      params?: any,
      config?: AxiosRequestConfig & { retry?: number; retryDelay?: number }
    ) => baseRequest<T>("GET", url, params, config),
    Post: <T = any>(
      url: string,
      data?: any,
      config?: AxiosRequestConfig & { retry?: number; retryDelay?: number }
    ) => baseRequest<T>("POST", url, data, config),
    Put: <T = any>(
      url: string,
      data?: any,
      config?: AxiosRequestConfig & { retry?: number; retryDelay?: number }
    ) => baseRequest<T>("PUT", url, data, config),
    Delete: <T = any>(
      url: string,
      data?: any,
      config?: AxiosRequestConfig & { retry?: number; retryDelay?: number }
    ) => baseRequest<T>("DELETE", url, data, config),
    Patch: <T = any>(
      url: string,
      data?: any,
      config?: AxiosRequestConfig & { retry?: number; retryDelay?: number }
    ) => baseRequest<T>("PATCH", url, data, config),
  };

  if (typeof window !== "undefined") {
    // 挂载到 window 或 globalThis，实现全局直接调用
    window.$request = request;
    // 也可用 globalThis.$request = request;
  }
});
