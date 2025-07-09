import { store } from "../../store";
import axios from "axios";
import { getCookie } from "cookies-next";
import toast from "react-hot-toast";

const state = store.getState()

export const fetchCommercialCategories = async (page = 1, search, sortKey = 'id', sortType = 'asc', perPage = 10, setRows, setLoading) => {
  let params = {
    paginate: 1,
    page: page + 1,
    perPage,
  }

  if (search) {
    params.search = search
  }

  if (sortKey) {
    params.sortKey = sortKey
  }

  if (typeof sortType === 'string') {
    params.sortType = sortType
  }

  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_KEY}commercial-categories`, {
      params,
      headers: {
        'Authorization': getCookie('token'),
        'Accepted-Language': getCookie('lang') ?? state.lang ?? 'en'
      }
    })
    setRows(response.data.data)
    setLoading(false)
  } catch (err) {
    toast.error(err.response?.data?.message)
    setLoading(false)
  }
}

export const fetchAllCommercialCategories = async () => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_KEY}commercial-categories`, {
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

export const deleteCommercialCategories = async (ids) => {
  let data = {
    delete_ids: ids,
    force_delete: false
  }

  try {
    await axios.post(`${process.env.NEXT_PUBLIC_API_KEY}commercial-categories/delete`, data, {
      headers: {
        'Authorization': getCookie('token'),
        'Accepted-Language': getCookie('lang') ?? state.lang ?? 'en'
      }
    })
  } catch (err) {
    toast.error(err.response?.data?.message)
  }
}
