import axios from 'axios'
import { getCookie } from 'cookies-next'
import toast from 'react-hot-toast'
import { getApiBaseUrl } from 'src/configs/api'

export const fetchCountriesDetails = async id => {
  const apiBaseUrl = getApiBaseUrl()
  try {
    const response = await axios.get(`${apiBaseUrl}countries/${id}`, {
      headers: {
        Authorization: getCookie('token'),
        'Accepted-Language': getCookie('lang') ?? 'en'
      }
    })
    
    return response.data.data.items
  } catch (err) {
    toast.error(err.response?.data?.message)
  }
}
