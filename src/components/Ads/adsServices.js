import {store} from "../../store";
import axios from "axios";
import {getCookie} from "cookies-next";
import toast from "react-hot-toast";

const state = store.getState()

export const fetchAds = async (page = 1, search, sortKey = 'id', sortType = 'desc', perPage = 10, isActive = '', isExpired = '' , isSold = '', isFeatured = '', setRows, setLoading) => {
  let params = {
    paginate: 1,
    page: page + 1,
    perPage,
  }
  
  let filters = { }

  if(isActive !== ''){ 
    filters.active = isActive
  }

  if(isExpired !== ''){ 
    filters.expired = isExpired
  }

  if(isSold !== ''){ 
    filters.sold = isSold
  }
  
  if(isFeatured !== ''){ 
    filters.featured = isFeatured
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

  if (Object.keys(filters).length === 0) {
    filters = null;
  }

  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_KEY}all-ads`, filters === null ? null : {filters}, {
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

export const deleteAds = async (ids) => {
  let data = {
    delete_ids: ids
  }

  try {
    await axios.post(`${process.env.NEXT_PUBLIC_API_KEY}all-ads`, data, {
      headers: {
        'Authorization': getCookie('token'),
        'Accepted-Language': getCookie('lang') ?? state.lang ?? 'en'
      }
    })
  } catch (err) {
    toast.error(err.response?.data?.message)
  }
}
