import axios from 'axios'

const API_URL = '/api/locations'

export const locationsApi = {
  getProvinces: async () => {
    const response = await axios.get(`${API_URL}/provinces`)
    return response.data
  },
  
  getWardsByProvince: async (provinceCode) => {
    if (!provinceCode) return []
    const response = await axios.get(`${API_URL}/provinces/${provinceCode}/wards`)
    return response.data.wards || []
  }
}
