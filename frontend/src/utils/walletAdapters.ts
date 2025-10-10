import type { TransactionBlock } from '@mysten/sui.js/transactions'

export type WalletId = 'sui-wallet' | 'suiet-wallet' | 'ethos-wallet' | 'martian-wallet'

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

const providerFactories: Record<WalletId, () => WalletAdapter | undefined> = {
  'sui-wallet': () => getWindow()?.suiWallet,
  'suiet-wallet': () => getWindow()?.suiet,
  'ethos-wallet': () => getWindow()?.ethos?.suiWallet ?? getWindow()?.ethos,
  'martian-wallet': () => getWindow()?.martian?.suiWallet ?? getWindow()?.martian,
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
  ethos?: WalletAdapter & {
    suiWallet?: WalletAdapter
  }
  martian?: WalletAdapter & {
    suiWallet?: WalletAdapter
  }
}

declare global {
  interface Window extends ExtendedWindow {}
}
