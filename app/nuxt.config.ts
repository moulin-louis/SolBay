import * as process from 'process';

export default defineNuxtConfig({
  ssr: false,
  modules: ['@nuxt/image', '@nuxt/eslint', '@nuxt/ui', '@nuxt/fonts', '@vueuse/nuxt'],
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
  },
  vite: {
    optimizeDeps: {
      include: [
        '@coral-xyz/anchor',
        '@solana/web3.js',
        'yup',
        '@solana/pay',
        'bignumber.js',
        '@vercel/speed-insights/nuxt',
      ],
    },
  },
  experimental: {
    clientNodeCompat: true,
  },
  runtimeConfig: {
    PINATA_JWT: process.env.NUXT_PINATA_JWT,
    PROGRAM_ID: process.env.NUXT_PROGRAM_ID,
    RECIPIENT_PUBLIC_KEY: process.env.NUXT_RECIPIENT_PUBLIC_KEY,
    SOLANA_DEVNET_RPC: process.env.NUXT_SOLANA_DEVNET_RPC,
    public: {
      PROGRAM_ID: process.env.NUXT_PROGRAM_ID,
      RECIPIENT_PUBLIC_KEY: process.env.NUXT_RECIPIENT_PUBLIC_KEY,
      SOLANA_DEVNET_RPC: process.env.NUXT_SOLANA_DEVNET_RPC,
    },
  },
  devtools: {
    timeline: {
      enabled: true,
    },
    enabled: true,
  },
  typescript: {
    includeWorkspace: true,
  },
  eslint: {},
  ui: {
    primary: 'green',
    gray: 'cool',
  },
});
