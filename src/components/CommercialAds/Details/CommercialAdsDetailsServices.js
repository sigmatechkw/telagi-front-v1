import axios from "axios";
import toast from "react-hot-toast";
import { store } from "../../../store";

const state = store.getState()

export const fetchCommercialAdDetails = async (id, cookies = null) => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_KEY}commercial-ads/${id}`, {
      headers: {
        'Authorization': cookies?.token ?? state.auth.token,
        'Accepted-Language': cookies?.lang ?? state.lang ?? 'en'
      }
    })

    return response.data.data.items
  } catch (err) {
    toast.error(err.response?.data?.message)

    return null
  }
}
