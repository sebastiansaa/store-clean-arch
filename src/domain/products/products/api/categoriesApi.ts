// Módulo que centraliza las llamadas HTTP para obtener las categorías desde la API

import { axiosAdapter } from '@/shared/api/axiosAdapter'
import type { CategoryInterface } from '../interfaces'
import type { AxiosResponse } from 'axios'

export const categoriesApi = {
  getAll: (): Promise<AxiosResponse<CategoryInterface[]>> => {
    return axiosAdapter.get('/categories')
  },
}
