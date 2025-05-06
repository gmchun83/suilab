/// <reference types="vite/client" />

interface ImportMeta {
  readonly env: {
    readonly VITE_SUI_RPC_URL: string;
    readonly VITE_API_URL: string;
    readonly VITE_MEME_COIN_PACKAGE: string;
    readonly VITE_DEX_INTEGRATION_PACKAGE: string;
    readonly [key: string]: string | undefined;
  };
}
