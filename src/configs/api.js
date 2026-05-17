const normalizeBaseUrl = value => {
  if (!value) {
    return ''
  }

  return value.endsWith('/') ? value : `${value}/`
}

const isLocalApiUrl = value => /https?:\/\/(127\.0\.0\.1|localhost)(:\d+)?\//i.test(value)

export const getApiBaseUrl = () => {
  const envApiUrl = normalizeBaseUrl(process.env.NEXT_PUBLIC_API_KEY)
  const appUrl = normalizeBaseUrl(process.env.NEXT_PUBLIC_APP_URL)

  if (typeof window === 'undefined') {
    return envApiUrl
  }

  const currentHost = window.location.hostname
  const isLocalHost = currentHost === 'localhost' || currentHost === '127.0.0.1'

  if (!isLocalHost && isLocalApiUrl(envApiUrl) && appUrl) {
    return `${appUrl}api/v1/`
  }

  return envApiUrl
}
