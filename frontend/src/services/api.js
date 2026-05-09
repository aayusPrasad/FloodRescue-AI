import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
})

export const predictFlood = async (file) => {
  const formData = new FormData()
  formData.append('file', file)
  const response = await api.post('/predict', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return response.data
}

export const getAssetUrl = (path) => {
  if (!path) return ''
  return path.startsWith('http') ? path : `${API_BASE_URL}${path}`
}