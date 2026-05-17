import axios from 'axios'
import toast from 'react-hot-toast'
import { getCookie } from 'cookies-next'
import { getApiBaseUrl } from 'src/configs/api'

export const fetchCountries = async (page = 1, search, sortKey, sortType, perPage = 10, setRows, setLoading) => {
  const apiBaseUrl = getApiBaseUrl()

  let params = {
    paginate: 1,
    page: page + 1,
    perPage: perPage
  }

  if (sortKey) {
    params.sortKey = sortKey
  }

  if (search) {
    params.search = search
  }

  if (typeof sortType === 'string') {
    params.sortType = sortType
  }

  try {
    const response = await axios.get(`${apiBaseUrl}countries`, {
      params,
      headers: {
        Authorization: getCookie('token'),
        'Accepted-Language': getCookie('lang') ?? 'en'
      }
    })
    setRows(response.data.data)
    setLoading(false)
  } catch (err) {
    toast.error(err.response?.data?.message)
    setLoading(false)
  }
}
