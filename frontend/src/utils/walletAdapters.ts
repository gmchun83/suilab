import type { TransactionBlock } from '@mysten/sui.js/transactions'

export type WalletId =
  | 'sui-wallet'
  | 'suiet-wallet'
  | 'ethos-wallet'
  | 'martian-wallet'
  | 'slush-wallet'

export interface WalletAdapter {
  requestPermissions?: () => Promise<unknown>
  hasPermissions?: () => Promise<unknown>
  connect?: () => Promise<unknown>
  getAccounts: () => Promise<string[]>
  signAndExecuteTransactionBlock: (params: {
    transactionBlock: TransactionBlock
  }) => Promise<{
    digest: string
    [key: string]: unknown
  }>
}

export const WALLET_STORAGE_KEY = 'walletProvider'

const getWindow = () => (typeof window === 'undefined' ? undefined : window as ExtendedWindow)

const isWalletAdapter = (adapter: unknown): adapter is WalletAdapter =>
  Boolean(
    adapter &&
      typeof adapter === 'object' &&
      typeof (adapter as WalletAdapter).getAccounts === 'function' &&
      typeof (adapter as WalletAdapter).signAndExecuteTransactionBlock === 'function'
  )

const extractAdapter = (value: unknown): WalletAdapter | undefined => {
  if (!value) {
    return undefined
  }

  if (isWalletAdapter(value)) {
    return value
  }

  if (typeof value !== 'object') {
    return undefined
  }

  const container = value as Record<string, unknown>
  const nestedKeys = ['wallet', 'suiWallet', 'adapter', 'default']

  for (const key of nestedKeys) {
    const nested = container[key]
    if (!nested || nested === value) {
      continue
    }

    const adapter = extractAdapter(nested)
    if (adapter) {
      return adapter
    }
  }

  return undefined
}

const providerFactories: Record<WalletId, () => WalletAdapter | undefined> = {
  'sui-wallet': () => extractAdapter(getWindow()?.suiWallet),
  'suiet-wallet': () => {
    const win = getWindow()
    if (!win) {
      return undefined
    }

    const candidates: unknown[] = [
      win.suiet,
      win.suietWallet,
      win.suietwallet,
      win['__SUIET__'],
      win['__suiet__'],
    ]

    for (const candidate of candidates) {
      const adapter = extractAdapter(candidate)
      if (adapter) {
        return adapter
      }
    }

    return undefined
  },
  'ethos-wallet': () => extractAdapter(getWindow()?.ethos?.suiWallet ?? getWindow()?.ethos),
  'martian-wallet': () => extractAdapter(getWindow()?.martian?.suiWallet ?? getWindow()?.martian),
  'slush-wallet': () => {
    const win = getWindow()
    if (!win) {
      return undefined
    }

    const candidates: unknown[] = [
      win.slush,
      win.slush?.suiWallet,
      win.slush?.wallet,
      win.slushWallet,
      win.slushwallet,
      win['__SLUSH__'],
      win['__slush__'],
    ]

    for (const candidate of candidates) {
      const adapter = extractAdapter(candidate)
      if (adapter) {
        return adapter
      }
    }

    return undefined
  },
}

const allWalletIds = Object.keys(providerFactories) as WalletId[]

export const getWalletAdapter = (preferredId?: WalletId) => {
  const win = getWindow()
  if (!win) {
    return { id: undefined as WalletId | undefined, adapter: undefined as WalletAdapter | undefined }
  }

  const searchOrder = preferredId
    ? [preferredId, ...allWalletIds.filter((id) => id !== preferredId)]
    : allWalletIds

  for (const id of searchOrder) {
    const adapter = providerFactories[id]()
    if (adapter) {
      return { id, adapter }
    }
  }

  return { id: undefined as WalletId | undefined, adapter: undefined as WalletAdapter | undefined }
}

export const getWalletAvailability = () => {
  const availability: Record<WalletId, boolean> = {
    'sui-wallet': false,
    'suiet-wallet': false,
    'ethos-wallet': false,
    'martian-wallet': false,
    'slush-wallet': false,
  }

  const win = getWindow()
  if (!win) {
    return availability
  }

  for (const id of allWalletIds) {
    availability[id] = Boolean(providerFactories[id]())
  }

  return availability
}

export const getStoredWalletPreference = () => {
  if (typeof window === 'undefined') {
    return undefined
  }

  const stored = window.localStorage.getItem(WALLET_STORAGE_KEY) as WalletId | null
  return stored ?? undefined
}

type ExtendedWindow = Window & {
  suiWallet?: WalletAdapter
  suiet?: WalletAdapter
  suietWallet?: WalletAdapter
  suietwallet?: WalletAdapter
  '__SUIET__'?: {
    wallet?: WalletAdapter
    suiWallet?: WalletAdapter
  }
  '__suiet__'?: {
    wallet?: WalletAdapter
    suiWallet?: WalletAdapter
  }
  ethos?: WalletAdapter & {
    suiWallet?: WalletAdapter
  }
  martian?: WalletAdapter & {
    suiWallet?: WalletAdapter
  }
  slush?: WalletAdapter & {
    suiWallet?: WalletAdapter
    wallet?: WalletAdapter
  }
  slushWallet?: WalletAdapter
  slushwallet?: WalletAdapter
  '__SLUSH__'?: {
    wallet?: WalletAdapter
    suiWallet?: WalletAdapter
  }
  '__slush__'?: {
    wallet?: WalletAdapter
    suiWallet?: WalletAdapter
  }
}

declare global {
  interface Window extends ExtendedWindow {}
}
