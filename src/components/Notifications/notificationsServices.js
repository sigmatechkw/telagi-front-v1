import axios from "axios";
import {getCookie} from "cookies-next";
import toast from "react-hot-toast";
import {store} from "../../store";

const state = store.getState()

export const fetchNotifications = async (page) => {
  let params = {
    paginate: 1,
    page: page.pageParam + 1,
  }

  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_KEY}user/notifications`, {
      params,
      headers: {
        'Authorization': getCookie('token'),
        'Accepted-Language': getCookie('lang') ?? state.lang ?? 'en'
      }
    })

    const data = response.data?.data

    return {
      items: Array.isArray(data?.items) ? data.items : (Array.isArray(data) ? data : []),
      current_page: data?.current_page ?? 1,
      last_page: data?.last_page ?? 1,
    }
  } catch (err) {
    return { items: [], current_page: 1, last_page: 1 }
  }
}

export const readNotifications = async () => {
  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_KEY}user/notifications-read`, 
    {
      all_notifications: true
    }, 
    {
      headers: {
        'Authorization': getCookie('token'),
        'Accepted-Language': getCookie('lang') ?? state.lang ?? 'en'
      }
    })

    return response.data.data
  } catch (err) {
    toast.error(err.response?.data?.message)
    // setLoading(false)
  }
}

export const unReadNotification = async () => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_KEY}user/notifications/unread-count`,
    {
      headers: {
        'Authorization': getCookie('token'),
        'Accepted-Language': getCookie('lang') ?? state.lang ?? 'en'
      }
    })

    return response.data.data?.count ?? 0
  } catch (err) {
    return 0
  }
}


