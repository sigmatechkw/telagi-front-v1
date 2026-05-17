import axios from 'axios'
import toast from 'react-hot-toast'
import { t } from 'i18next'
import { store } from '../../../store'
import { getCookie } from 'cookies-next'
import { getApiBaseUrl } from 'src/configs/api'

const state = store.getState()

const getAuthToken = cookies => cookies?.token ?? getCookie('token')

export const fetchUserDetails = async (id, cookies) => {
  const apiBaseUrl = getApiBaseUrl()
  const token = getAuthToken(cookies)

  try {
    const response = await axios.get(`${apiBaseUrl}users/${id}`, {
      headers: {
        ...(token ? { Authorization: token } : {}),
        'Accepted-Language': cookies?.lang ?? getCookie('lang') ?? state.lang ?? 'en'
      }
    })

    return response.data.data.items
  } catch (err) {
    if (typeof window !== 'undefined') {
      toast.error(err.response?.data?.message)
    }

    return null
  }
}

export const deleteUsers = async ids => {
  const apiBaseUrl = getApiBaseUrl()
  let data = {
    delete_ids: ids
  }

  try {
    await axios.post(`${apiBaseUrl}users/delete`, data, {
      headers: {
        Authorization: getCookie('token'),
        'Accepted-Language': getCookie('lang') ?? state.lang ?? 'en'
      }
    })
  } catch (err) {
    toast.error(err.response?.data?.message)
  }
}

export const fetchExpertStatistics = async id => {
  // try {
  //   const response = await axios.get(`${process.env.NEXT_PUBLIC_API_KEY}experts/${id}/statistics`, {
  //     headers: {
  //       'Authorization': getCookie('token'),
  //       'Accepted-Language': getCookie('lang') ?? state.lang ?? 'en'
  //     }
  //   })

  //   return response.data.data.items
  // } catch (err) {
  //   toast.error(err.response?.data?.message)
  // }
  return {}
}
