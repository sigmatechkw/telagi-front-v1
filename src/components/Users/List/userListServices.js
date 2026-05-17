import axios from "axios";
import toast from "react-hot-toast";
import {store} from "../../../store";
import {getCookie} from "cookies-next";
import { getApiBaseUrl } from "src/configs/api";

const state = store.getState()

export const fetchUsersRoles = async () => {
  const apiBaseUrl = getApiBaseUrl()
  try {
    const response = await axios.get(`${apiBaseUrl}roles`, {
      headers: {
        'Authorization': getCookie('token'),
        'Accepted-Language': getCookie('lang') ?? state.lang ?? 'en'
      }
    })

    return response.data.data.items
  } catch (err) {
    toast.error(err.response?.data?.message)
  }
}

export const fetchUsersStatistics = async (dateRange) => {
  const apiBaseUrl = getApiBaseUrl()
  try {
    const response = await axios.get(`${apiBaseUrl}users/getStatistics/${dateRange}`, {
      headers: {
        'Authorization': getCookie('token'),
        'Accepted-Language': getCookie('lang') ?? state.lang ?? 'en'
      }
    })
    
    return response.data.data.items
  } catch (err) {
    toast.error(err.response?.data?.message)
  }
}

export const fetchDateRanges = async () => {
  const apiBaseUrl = getApiBaseUrl()
  try {
    const response = await axios.get(`${apiBaseUrl}getDateRanges`, {
      headers: {
        'Authorization': getCookie('token'),
        'Accepted-Language': getCookie('lang') ?? state.lang ?? 'en'
      }
    })

    return response.data.data.items
  } catch (err) {
    toast.error(err.response?.data?.message)
  }
}

export const fetchCountries = async () => {
  const apiBaseUrl = getApiBaseUrl()
  try {
    const response = await axios.get(`${apiBaseUrl}countries`, {
      headers: {
        'Authorization': getCookie('token'),
        'Accepted-Language': getCookie('lang') ?? state.lang ?? 'en'
      }
    })

    return response.data.data.items
  } catch (err) {
    toast.error(err.response?.data?.message)
  }
}


export const fetchUsersInfinityQuery = async ({ pageParam = 1, queryKey }) => {
  const apiBaseUrl = getApiBaseUrl()
  try { 
    const [_, searchTerm] = queryKey;

    const response = await axios.get(`${apiBaseUrl}users`, {
      params: {
        page: pageParam,
        search: searchTerm,
        paginate : 1,
      },
      headers: {
        Authorization: getCookie('token'),
        'Accepted-Language': getCookie('lang') ?? 'en'
      }
    })
    
    return response.data.data;
  }catch(err){ 
    toast.error(err.response?.data?.message)
  }
}
