import * as process from 'process';

export default defineNuxtConfig({
  ssr: false,
  modules: [
    '@nuxt/ui',
    '@nuxt/fonts',
    '@vueuse/nuxt',
    'nuxt-icon',
    '@nuxt/eslint',
  ],
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
      include: ['@coral-xyz/anchor', '@solana/web3.js', 'buffer', 'yup'],
    },
  },
  plugins: [
    { src: '~/plugins/buffer-polyfill.ts', mode: 'client' },
  ],
  experimental: {
    clientNodeCompat: true,
  },
  runtimeConfig: {
    PINATA_JWT: process.env.NUXT_PINATA_JWT,
    PROGRAM_ID: process.env.NUXT_PROGRAM_ID,
    public: {
      PROGRAM_ID: process.env.NUXT_PROGRAM_ID,
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
});
