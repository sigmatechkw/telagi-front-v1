import axios from "axios";
import toast from "react-hot-toast";
import {store} from "../../../store";

const state = store.getState()

const getCategoryHeaders = cookies => ({
  'Authorization': cookies?.token ?? state.auth.token,
  'Accepted-Language': cookies?.lang ?? state.lang ?? 'en'
})

const normalizeCategoryDetails = item => {
  if (!item) {
    return null
  }

  return {
    ...item,
    name: item.name ?? item.name_en ?? item.name_ar ?? '',
    description: item.description ?? item.description_en ?? item.description_ar ?? '',
    long_description: item.long_description ?? item.long_description_en ?? item.long_description_ar ?? '',
    name_en: item.name_en ?? item.name ?? '',
    name_ar: item.name_ar ?? item.name ?? '',
    description_en: item.description_en ?? item.description ?? '',
    description_ar: item.description_ar ?? item.description ?? '',
    long_description_en: item.long_description_en ?? item.long_description ?? '',
    long_description_ar: item.long_description_ar ?? item.long_description ?? '',
    parent: item.parent ?? null,
    sub_categories: Array.isArray(item.sub_categories) ? item.sub_categories : [],
    created_at: item.created_at ?? ''
  }
}

export const fetchCategoryDetails = async (id, cookies = null) => {
  try {
    let response

    try {
      response = await axios.get(`${process.env.NEXT_PUBLIC_API_KEY}categories/getCategory/${id}`, {
        headers: getCategoryHeaders(cookies)
      })
    } catch (err) {
      if (err.response?.status !== 404) {
        throw err
      }

      response = await axios.get(`${process.env.NEXT_PUBLIC_API_KEY}categories/${id}`, {
        headers: getCategoryHeaders(cookies)
      })
    }

    return normalizeCategoryDetails(response.data?.data?.items)
  } catch (err) {
    toast.error(err.response?.data?.message)

    return null
  }

}
