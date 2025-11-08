import type { AxiosResponse } from "axios";

export interface HttpClient {
  get<T = any>(url: string, config?: object): Promise<AxiosResponse<T>>;
  post<T = any>(url: string, data?: any, config?: object): Promise<AxiosResponse<T>>;
  put<T = any>(url: string, data?: any, config?: object): Promise<AxiosResponse<T>>;
  delete<T = any>(url: string, config?: object): Promise<AxiosResponse<T>>;
}

