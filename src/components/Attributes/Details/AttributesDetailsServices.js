import axios from "axios";
import toast from "react-hot-toast";
import {store} from "../../../store";
import { getApiBaseUrl } from "src/configs/api";

const state = store.getState()

export const fetchAttributesDetails = async (id, cookies = null) => {
  const apiBaseUrl = getApiBaseUrl()
  try {
    const response = await axios.get(`${apiBaseUrl}attributes/${id}`, {
      headers: {
        'Authorization': cookies?.token ?? state.auth.token,
        'Accepted-Language': cookies?.lang ?? state.lang ?? 'en'
      }
    })

    return response.data.data.attribute
  } catch (err) {
    if (typeof window !== 'undefined') {
      toast.error(err.response?.data?.message)
    }

    return null
  }

}
