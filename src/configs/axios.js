import axios from 'axios'

import { getApiBaseUrl } from 'src/configs/api'

const localApiPattern = /^https?:\/\/(127\.0\.0\.1|localhost)(:\d+)?\/api\/v1\//i

let axiosApiRewriteConfigured = false

export const configureAxiosApiRewrite = () => {
  if (axiosApiRewriteConfigured) {
    return
  }

  axios.interceptors.request.use(config => {
    if (typeof window === 'undefined' || typeof config.url !== 'string') {
      return config
    }

    const apiBaseUrl = getApiBaseUrl()

    if (apiBaseUrl && localApiPattern.test(config.url)) {
      config.url = config.url.replace(localApiPattern, apiBaseUrl)
    }

    return config
  })

  axiosApiRewriteConfigured = true
}
