<script setup lang="ts">
import {WalletMultiButton} from 'solana-wallets-vue';
</script>

<template>
  <ClientOnly>
    <WalletMultiButton />
  </ClientOnly>
  <Header />
  <slot />
</template>

<style scoped></style>
