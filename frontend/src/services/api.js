import axios from 'axios'

const API_BASE_URL = 'https://aayup78bm-floodrescueai-1.hf.space'

export const predictFlood = async (file) => {
  const formData = new FormData()
  formData.append('file', file)

  const response = await axios.post(`${API_BASE_URL}/predict`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

  return response.data
}

export const predictBatchFlood = async (files) => {
  const formData = new FormData()

  files.forEach((file) => {
    formData.append('files', file)
  })

  const response = await axios.post(`${API_BASE_URL}/predict-batch`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

  return response.data
}

export const getAssetUrl = (path) => {
  if (!path) return ''
  return `${API_BASE_URL}${path}`
}
