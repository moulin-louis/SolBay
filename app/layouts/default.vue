<script setup lang="ts">
import {SpeedInsights} from '@vercel/speed-insights/nuxt';
import {WalletMultiButton} from 'solana-wallets-vue';
</script>

<template>
  <div>
    <SpeedInsights />
    <ClientOnly>
      <WalletMultiButton />
    </ClientOnly>
    <NavigationHeader />
    <slot />
  </div>
</template>

<style scoped></style>
