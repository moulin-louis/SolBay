// import * as process from 'node:process';
export default defineNuxtConfig({
  ssr: false,
  modules: [
    '@nuxt/image',
    '@nuxt/eslint',
    '@nuxt/ui',
    '@nuxt/fonts',
    '@vueuse/nuxt',
    '@sidebase/nuxt-auth',
  ],
  nitro: {
    storage: {
      db: {
        driver: 'vercelKV',
      },
    },
    devStorage: {
      db: {
        driver: 'fs',
        base: './data/db',
      },
    },
    experimental: {
      legacyExternals: true,
    },
  },

  experimental: {
    clientNodeCompat: true,
  },
  vite: {
    build: {
      rollupOptions: {
        external: ['sharp'],
      },
    },
  },
  app: {
    pageTransition: {name: 'page', mode: 'out-in'},
  },
  auth: {
    provider: {
      type: 'local',
      endpoints: {
        getSession: {path: '/user'},
      },
      token: {
        signInResponseTokenPointer: '/token/accessToken',
      },
    },
    globalAppMiddleware: {
      isEnabled: true,
    },
  },
  runtimeConfig: {
    PINATA_JWT: process.env.NUXT_PINATA_JWT,
    PROGRAM_ID: process.env.NUXT_PROGRAM_ID,
    RECIPIENT_PUBLIC_KEY: process.env.NUXT_RECIPIENT_PUBLIC_KEY,
    RECIPIENT_PRIVATE_KEY: process.env.NUXT_RECIPIENT_PRIVATE_KEY,
    SOLANA_DEVNET_RPC: process.env.NUXT_SOLANA_DEVNET_RPC,
    HELIUS_API_KEY: process.env.NUXT_HELIUS_API_KEY,
    NFT_STORAGE_API_KEY: process.env.NUXT_NFT_STORAGE_API_KEY,
    public: {
      PROGRAM_ID: process.env.NUXT_PROGRAM_ID,
      RECIPIENT_PUBLIC_KEY: process.env.NUXT_RECIPIENT_PUBLIC_KEY,
    },
  },
  devtools: {
    timeline: {
      enabled: true,
    },
    enabled: true,
  },
});
