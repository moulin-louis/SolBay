<script setup lang="ts">
import {WalletMultiButton} from "solana-wallets-vue";
import { SpeedInsights } from "@vercel/speed-insights/nuxt"

</script>

<template>
  <SpeedInsights />
  <client-only placeholder="Loading....">
    <WalletMultiButton/>
  </client-only>
  <Header/>
  <slot/>
</template>

<style scoped>

</style>