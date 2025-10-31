import { type AxiosRequestConfig } from "axios";

declare global {
  interface Window {
    $request: {
      Get<T = any>(
        url: string,
        params?: any,
        config?: AxiosRequestConfig & { retry?: number; retryDelay?: number }
      ): Promise<T>;
      Post<T = any>(
        url: string,
        data?: any,
        config?: AxiosRequestConfig & { retry?: number; retryDelay?: number }
      ): Promise<T>;
      Put<T = any>(
        url: string,
        data?: any,
        config?: AxiosRequestConfig & { retry?: number; retryDelay?: number }
      ): Promise<T>;
      Delete<T = any>(
        url: string,
        data?: any,
        config?: AxiosRequestConfig & { retry?: number; retryDelay?: number }
      ): Promise<T>;
      Patch<T = any>(
        url: string,
        data?: any,
        config?: AxiosRequestConfig & { retry?: number; retryDelay?: number }
      ): Promise<T>;
    };
  }
}
