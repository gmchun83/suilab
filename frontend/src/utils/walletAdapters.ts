import { TransactionBlock } from '@mysten/sui.js/transactions'
import { WalletStandardAdapterProvider } from '@mysten/wallet-adapter-wallet-standard'
import { getWallets, type WalletAccount } from '@mysten/wallet-standard'

export type WalletId = 'suiet-wallet' | 'slush-wallet'

export interface WalletAdapter {
  connect: () => Promise<void>
  disconnect?: () => Promise<void>
  getAccounts: () => Promise<string[]>
  signAndExecuteTransactionBlock: (params: {
    transactionBlock: TransactionBlock
  }) => Promise<{
    digest: string
    [key: string]: unknown
  }>
}

const walletMatchers: Record<WalletId, (name: string) => boolean> = {
  'suiet-wallet': (name) => name.includes('suiet'),
  'slush-wallet': (name) => name.includes('slush'),
}

export const WALLET_STORAGE_KEY = 'walletProvider'

let walletRegistry: ReturnType<typeof getWallets> | null = null
let standardProvider: WalletStandardAdapterProvider | null = null

const getWalletRegistry = () => {
  if (typeof window === 'undefined') {
    return null
  }

  if (!walletRegistry) {
    walletRegistry = getWallets()
  }

  return walletRegistry
}

const getStandardProvider = () => {
  if (typeof window === 'undefined') {
    return null
  }

  if (!standardProvider) {
    standardProvider = new WalletStandardAdapterProvider()
  }

  return standardProvider
}

type StandardAdapter = {
  name?: string
  wallet?: { name?: string }
  connect: () => Promise<void>
  disconnect?: () => Promise<void>
  getAccounts: () => Promise<(WalletAccount | string)[]>
  signAndExecuteTransactionBlock?: (params: {
    transactionBlock: TransactionBlock | Uint8Array
    account?: WalletAccount
    chain?: string
    options?: Record<string, unknown>
  }) => Promise<{ digest: string; [key: string]: unknown }>
}

const getAdapterName = (adapter: StandardAdapter) => (adapter.name ?? adapter.wallet?.name ?? '').toLowerCase()

const getStandardAdapters = (): StandardAdapter[] => {
  const provider = getStandardProvider()
  if (!provider) {
    return []
  }

  const providerWithAdapters = provider as unknown as {
    getAdapters?: () => StandardAdapter[]
    get?: () => StandardAdapter[]
    wallets?: StandardAdapter[]
  }

  if (typeof providerWithAdapters.getAdapters === 'function') {
    return providerWithAdapters.getAdapters() ?? []
  }

  if (typeof providerWithAdapters.get === 'function') {
    return providerWithAdapters.get() ?? []
  }

  if (Array.isArray(providerWithAdapters.wallets)) {
    return providerWithAdapters.wallets
  }

  return []
}

const wrapAdapter = (adapter: StandardAdapter): WalletAdapter => {
  if (typeof adapter.connect !== 'function' || typeof adapter.getAccounts !== 'function') {
    throw new Error('Wallet adapter is missing required methods.')
  }

  const getNormalizedAccounts = async () => {
    const accounts = await adapter.getAccounts()
    if (!accounts || accounts.length === 0) {
      throw new Error('No accounts available in the connected wallet.')
    }

    return accounts.map((account) => {
      if (typeof account === 'string') {
        return { address: account, accountObject: undefined as WalletAccount | undefined }
      }

      return { address: account.address, accountObject: account }
    })
  }

  return {
    connect: () => adapter.connect(),
    disconnect: adapter.disconnect ? () => adapter.disconnect!() : undefined,
    getAccounts: async () => {
      const normalized = await getNormalizedAccounts()
      return normalized.map((entry) => entry.address)
    },
    signAndExecuteTransactionBlock: async ({ transactionBlock }) => {
      if (typeof adapter.signAndExecuteTransactionBlock !== 'function') {
        throw new Error('Wallet does not support signing transactions.')
      }

      const normalized = await getNormalizedAccounts()
      const primary = normalized[0]
      const params: Record<string, unknown> = {
        transactionBlock,
      }

      if (primary.accountObject) {
        params.account = primary.accountObject
        if (primary.accountObject.chains?.length) {
          params.chain = primary.accountObject.chains[0]
        }
      }

      return adapter.signAndExecuteTransactionBlock(params as {
        transactionBlock: TransactionBlock | Uint8Array
        account?: WalletAccount
        chain?: string
        options?: Record<string, unknown>
      })
    },
  }
}

const matchAdapterById = (adapter: StandardAdapter, id: WalletId) => {
  const name = getAdapterName(adapter)
  if (!name) {
    return false
  }

  return walletMatchers[id](name)
}

const getAvailableAdapter = (id: WalletId) => {
  const adapters = getStandardAdapters()
  const matchingAdapter = adapters.find((adapter) => matchAdapterById(adapter, id))

  if (!matchingAdapter) {
    return undefined
  }

  try {
    return wrapAdapter(matchingAdapter)
  } catch (error) {
    console.error('Failed to prepare wallet adapter', matchingAdapter?.name, error)
    return undefined
  }
}

const allWalletIds: WalletId[] = ['suiet-wallet', 'slush-wallet']

export const getWalletProviderAdapters = () => {
  const adapters = getStandardAdapters()
  return adapters.filter((adapter) => allWalletIds.some((id) => matchAdapterById(adapter, id)))
}

export const getWalletAdapter = (preferredId?: WalletId) => {
  const ids = preferredId ? [preferredId, ...allWalletIds.filter((id) => id !== preferredId)] : allWalletIds

  for (const id of ids) {
    const adapter = getAvailableAdapter(id)
    if (adapter) {
      return { id, adapter }
    }
  }

  return { id: undefined as WalletId | undefined, adapter: undefined as WalletAdapter | undefined }
}

export const getWalletAdapterById = (id: WalletId) => {
  const adapter = getAvailableAdapter(id)
  return { id, adapter: adapter ?? undefined }
}

export const getWalletAvailability = () => {
  const availability: Record<WalletId, boolean> = {
    'suiet-wallet': false,
    'slush-wallet': false,
  }

  const adapters = getStandardAdapters()
  allWalletIds.forEach((id) => {
    availability[id] = adapters.some((adapter) => matchAdapterById(adapter, id))
  })

  if (Object.values(availability).some((isAvailable) => isAvailable)) {
    return availability
  }

  const registry = getWalletRegistry()
  if (!registry) {
    return availability
  }

  const wallets = registry.get()
  allWalletIds.forEach((id) => {
    availability[id] = availability[id] || wallets.some((wallet) => walletMatchers[id](wallet.name.toLowerCase()))
  })

  return availability
}

export const getStoredWalletPreference = () => {
  if (typeof window === 'undefined') {
    return undefined
  }

  const stored = window.localStorage.getItem(WALLET_STORAGE_KEY) as WalletId | null
  return stored ?? undefined
}

export const subscribeToWalletChanges = (listener: () => void) => {
  const provider = getStandardProvider()
  const registry = getWalletRegistry()

  const unsubscribes: Array<() => void> = []

  if (provider) {
    const eventsApi = provider as unknown as { on?: (event: string, cb: () => void) => () => void }
    if (typeof eventsApi.on === 'function') {
      const offRegistered = eventsApi.on('walletRegistered', listener)
      const offUnregistered = eventsApi.on('walletUnregistered', listener)
      const offChanged = eventsApi.on('walletsChanged', listener)

      offRegistered && unsubscribes.push(offRegistered)
      offUnregistered && unsubscribes.push(offUnregistered)
      offChanged && unsubscribes.push(offChanged)
    }
  }

  if (registry) {
    const eventsApi = registry as unknown as { on?: (event: string, cb: () => void) => () => void }
    if (typeof eventsApi.on === 'function') {
      const offRegister = eventsApi.on('register', listener)
      const offUnregister = eventsApi.on('unregister', listener)
      offRegister && unsubscribes.push(offRegister)
      offUnregister && unsubscribes.push(offUnregister)
    }
  }

  if (!unsubscribes.length) {
    return () => {}
  }

  return () => {
    unsubscribes.forEach((unsubscribe) => {
      try {
        unsubscribe()
      } catch (error) {
        console.error('Failed to unsubscribe from wallet change listener', error)
      }
    })
  }
}

export type { WalletAccount }
