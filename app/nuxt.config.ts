import * as process from 'process';

export default defineNuxtConfig({
  ssr: false,
  modules: ['@nuxt/ui', '@nuxt/fonts', '@vueuse/nuxt', '@nuxt/eslint'],
  nitro: {
    devStorage: {
      db: {
        driver: 'fs',
        base: './data/db',
      },
    },
  },
  vite: {
    esbuild: {
      target: 'esnext',
    },
    build: {
      target: 'esnext',
    },
    optimizeDeps: {
      esbuildOptions: {
        target: 'esnext',
      },
      include: ['@coral-xyz/anchor', '@solana/web3.js', 'yup'],
    },
  },
  experimental: {
    clientNodeCompat: true,
  },
  runtimeConfig: {
    PINATA_JWT: process.env.NUXT_PINATA_JWT,
    PROGRAM_ID: process.env.NUXT_PROGRAM_ID,
    RECIPIENT_PUBLIC_KEY: process.env.NUXT_RECIPIENT_PUBLIC_KEY,
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
  typescript: {
    includeWorkspace: true,
  },
  eslint: {},
  ui: {
    primary: 'green',
    gray: 'cool',
  },
});
