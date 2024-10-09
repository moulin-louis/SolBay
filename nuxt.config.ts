const isProduction = process.env.NODE_ENV === "production";

// import * as process from 'node:process';
export default defineNuxtConfig({
  ssr: false,
  modules: [
    ...(isProduction ? [] : ["@nuxt/eslint"]),
    "@nuxt/image",
    "@nuxt/ui",
    "@nuxt/fonts",
    "@vueuse/nuxt",
  ],
  nitro: {
    storage: {
      db: {
        driver: "vercelKV",
      },
    },
    devStorage: {
      db: {
        driver: "fs",
        base: "./data/db",
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
        external: ["sharp"],
      },
    },
  },
  app: {
    pageTransition: { name: "page", mode: "out-in" },
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
