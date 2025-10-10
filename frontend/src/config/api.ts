const DEFAULT_API_PATH = '/api'

const stripTrailingSlash = (url: string) => url.replace(/\/+$/, '')

export const resolveApiBaseUrl = (): string => {
  const configuredUrl = import.meta.env.VITE_API_URL?.toString().trim()
  if (configuredUrl) {
    return stripTrailingSlash(configuredUrl)
  }

  if (typeof window !== 'undefined') {
    const { protocol, hostname, port } = window.location
    const isLocalhost = ['localhost', '127.0.0.1', '::1'].includes(hostname)

    if (isLocalhost) {
      const devPort = import.meta.env.VITE_API_DEV_PORT?.toString().trim()
      const effectivePort = devPort || port || '3000'
      return `${protocol}//${hostname}:${effectivePort}${DEFAULT_API_PATH}`
    }

    const portSegment = port ? `:${port}` : ''
    return `${protocol}//${hostname}${portSegment}${DEFAULT_API_PATH}`
  }

  return DEFAULT_API_PATH
}

export const API_BASE_URL = resolveApiBaseUrl()

export default {
  API_BASE_URL,
  resolveApiBaseUrl,
}
