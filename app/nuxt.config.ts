import {resolve} from "path";
import {Buffer} from 'buffer';
import {inject} from "vue";
import * as process from "process";

export default defineNuxtConfig({
  modules: [
    "@nuxt/ui",
    "@nuxt/fonts",
    "@nuxtjs/tailwindcss",
    '@vueuse/nuxt',
    'nuxt-icon',
  ],
  nitro: {
    // Development
    devStorage: {
      db: {
        driver: 'fs',
        base: './data/db'
      },
    },
  },
  vite: {
    esbuild: {
      target: "esnext",
    },
    build: {
      target: "esnext",
      rollupOptions: {
        plugins: [inject({Buffer: ['buffer', 'Buffer']})],
      },
    },
    plugins: [
      inject({Buffer: ['buffer', 'Buffer']}),
    ],
    resolve: {
      alias: {
        buffer: "buffer",
      },
    },
    define: {
      global: {Buffer},
    },
    optimizeDeps: {
      include: ["@coral-xyz/anchor", "@solana/web3.js", "buffer"],
      esbuildOptions: {
        target: "esnext",
      },
    },
  },
  // ssr: false,
  storage: {
    db: {
      driver: 'fs',
      base: './data/db'
    },
  },
  alias: {
    '@': resolve(__dirname, "/"),
  },
  image: {},
  runtimeConfig: {
    PINATA_JWT: process.env.NUXT_PINATA_JWT,
    PROGRAM_ID: process.env.NUXT_PROGRAM_ID,
    public: {
      PROGRAM_ID: process.env.NUXT_PROGRAM_ID,
    }
  },
  devtools: {
    timeline: {
      enabled: true,
    },
    enabled: true,
  },
  typescript: {
    includeWorkspace: true
  }

})
