const normalizeBaseUrl = value => {
  if (!value) {
    return ''
  }

  return value.endsWith('/') ? value : `${value}/`
}

const isLocalApiUrl = value => /https?:\/\/(127\.0\.0\.1|localhost)(:\d+)?\//i.test(value)
const isLocalHost = value => value === 'localhost' || value === '127.0.0.1'

const deriveApiBaseUrlFromHost = (hostname, protocol = 'https:') => {
  if (!hostname || isLocalHost(hostname)) {
    return ''
  }

  const apiHost = hostname.startsWith('admin.') ? hostname.replace(/^admin\./, 'app.') : hostname

  return `${protocol}//${apiHost}/api/v1/`
}

export const getApiBaseUrl = () => {
  const envApiUrl = normalizeBaseUrl(process.env.NEXT_PUBLIC_API_KEY)
  const appUrl = normalizeBaseUrl(process.env.NEXT_PUBLIC_APP_URL)

  if (isLocalApiUrl(envApiUrl) && appUrl) {
    return `${appUrl}api/v1/`
  }

  if (typeof window === 'undefined') {
    return envApiUrl
  }

  const currentHost = window.location.hostname

  if (!isLocalHost(currentHost) && isLocalApiUrl(envApiUrl)) {
    return deriveApiBaseUrlFromHost(currentHost, window.location.protocol) || envApiUrl
  }

  return envApiUrl
}
