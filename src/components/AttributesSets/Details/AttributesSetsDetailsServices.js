import axios from "axios";
import toast from "react-hot-toast";
import {store} from "../../../store";

const state = store.getState()

export const fetchAttributesSetsDetails = async (id, cookies = null) => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_KEY}attribute-sets/${id}`, {
      headers: {
        'Authorization': cookies?.token ?? state.auth.token,
        'Accepted-Language': cookies?.lang ?? state.lang ?? 'en'
      }
    })

    return response.data.data.set
  } catch (err) {
    toast.error(err.response?.data?.message)

    return null
  }

}
