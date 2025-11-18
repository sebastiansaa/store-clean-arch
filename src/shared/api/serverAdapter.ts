import axios from 'axios'

// Adapter para llamadas al backend del mismo origen (p.ej. /api/*)
const instance = axios.create({ baseURL: '' })

export const serverAdapter = {
    get: async (url: string, config?: any) => {
        return await instance.get(url, config)
    },
    post: async (url: string, data?: any, config?: any) => {
        return await instance.post(url, data, config)
    },
    put: async (url: string, data?: any, config?: any) => {
        return await instance.put(url, data, config)
    },
    delete: async (url: string, config?: any) => {
        return await instance.delete(url, config)
    },
}
