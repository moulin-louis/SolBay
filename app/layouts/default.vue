<script setup lang="ts">
import {WalletMultiButton} from 'solana-wallets-vue';
</script>

<template>
  <div>
    <ClientOnly>
      <WalletMultiButton />
    </ClientOnly>
    <NavigationHeader />
    <slot />
  </div>
</template>

<style scoped></style>
