import { axiosAdapter } from "@/shared/api/axiosAdapter";
import type { ProductInterface } from "../interfaces";
import type { AxiosResponse } from "axios";

export const productsApi = {

  getAll: (): Promise<AxiosResponse<ProductInterface[]>> => {
    return axiosAdapter.get("/products");
  },

  getById: (id: number): Promise<AxiosResponse<ProductInterface>> => {
    return axiosAdapter.get(`/products/${id}`);
  },

  create: (data: Partial<ProductInterface>): Promise<AxiosResponse<ProductInterface>> => {
    return axiosAdapter.post("/products", data);
  },

  update: (id: number, data: Partial<ProductInterface>): Promise<AxiosResponse<ProductInterface>> => {
    return axiosAdapter.put(`/products/${id}`, data);
  },

  delete: (id: number): Promise<AxiosResponse<void>> => {
    return axiosAdapter.delete(`/products/${id}`);
  },

};
