import axios from "axios";
import {store} from "../../store";
import toast from "react-hot-toast";
import {getCookie} from "cookies-next";
import { getApiBaseUrl } from "src/configs/api";

const state = store.getState()


export const getOnlineUsersStatistics = async (id) => {
  const apiBaseUrl = getApiBaseUrl()
  try {
    const response = await axios.get(`${apiBaseUrl}users/online-statistics`, {
      headers: {
        'Authorization': getCookie('token'),
        'Accepted-Language': getCookie('lang') ?? state.lang ?? 'en'
      }
    })

    return response.data.data.items
  } catch (err) {
    toast.error(err.response?.data?.message)

    return null
  }

}
