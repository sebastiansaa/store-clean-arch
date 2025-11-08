//adapter  que usa axios para hacer las peticiones HTTP, NO USA AUTENTICACIÓN. Para endpoints públicos

import axios from "axios";

import { API_BASE_URL } from "@/shared/api/api"
import type { HttpClient } from "./HttpClient";


const instance = axios.create({ baseURL: API_BASE_URL });

export const axiosAdapter: HttpClient = {
  get: async (url, config) => {
    return await instance.get(url, config);
  },
  post: async (url, data, config) => {
    return await instance.post(url, data, config);
  },
  put: async (url, data, config) => {
    return await instance.put(url, data, config);
  },
  delete: async (url, config) => {
    return await instance.delete(url, config);
  },
};
