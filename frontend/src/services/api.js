import axios from 'axios'

const API_BASE_URL = 'http://127.0.0.1:8000'

export const predictFlood = async (file) => {
  const formData = new FormData()

  formData.append('file', file)

  const response = await axios.post(
    `${API_BASE_URL}/predict`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  )

  return response.data
}

export const getAssetUrl = (path) => {
  if (!path) return ''

  return `${API_BASE_URL}${path}`
}
