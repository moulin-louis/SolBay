<script setup lang="ts">
import {SpeedInsights} from '@vercel/speed-insights/nuxt';
import {WalletMultiButton} from 'solana-wallets-vue';
</script>

<template>
  <SpeedInsights />
  <ClientOnly>
    <WalletMultiButton />
  </ClientOnly>
  <Header />
  <slot />
</template>

<style scoped></style>
