import {store} from "../../store";
import axios from "axios";
import {getCookie} from "cookies-next";
import toast from "react-hot-toast";

const state = store.getState()
const emptyCategoriesResponse = { items: [], total: 0 }

const normalizeCategoriesResponse = data => {
  if (Array.isArray(data)) {
    return {
      items: data,
      total: data.length
    }
  }

  if (Array.isArray(data?.items)) {
    return {
      ...data,
      items: data.items,
      total: Number.isFinite(Number(data.total)) ? Number(data.total) : data.items.length
    }
  }

  return emptyCategoriesResponse
}

const getCategoriesHeaders = () => ({
  'Authorization': getCookie('token'),
  'Accepted-Language': getCookie('lang') ?? state.lang ?? 'en'
})

export const fetchCategories = async (page = 1, search, sortKey = 'id', sortType = 'asc', perPage = 10, setRows, setLoading) => {
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
    let response

    try {
      response = await axios.get(`${process.env.NEXT_PUBLIC_API_KEY}categories`, {
        params,
        headers: getCategoriesHeaders()
      })
    } catch (err) {
      if (err.response?.status !== 404) {
        throw err
      }

      response = await axios.get(`${process.env.NEXT_PUBLIC_API_KEY}all-categories`, {
        params,
        headers: getCategoriesHeaders()
      })
    }

    setRows(normalizeCategoriesResponse(response.data?.data))
    setLoading(false)
  } catch (err) {
    setRows(emptyCategoriesResponse)
    toast.error(err.response?.data?.message ?? 'Something went wrong')
    setLoading(false)
  }
}

export const fetchAllCategories = async () => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_KEY}categories`, {
      headers: getCategoriesHeaders()
    })

    return normalizeCategoriesResponse(response.data?.data).items
  } catch (err) {
    toast.error(err.response?.data?.message)

    return []
  }
}

export const deleteCategories = async (ids) => {
  let data = {
    delete_ids: ids,
    force_delete: false
  }

  try {
    await axios.delete(`${process.env.NEXT_PUBLIC_API_KEY}categories/delete`, {
      data: data,
      headers: getCategoriesHeaders()
    })
  } catch (err) {
    toast.error(err.response?.data?.message)
  }
}
