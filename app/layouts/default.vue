<script setup lang="ts">
import {WalletMultiButton} from "solana-wallets-vue";
</script>

<template>
  <client-only placeholder="Loading....">
    <WalletMultiButton/>
  </client-only>
  <Header/>
  <slot/>
</template>

<style scoped>

</style>