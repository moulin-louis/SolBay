<script setup lang="ts">
import {useWallet} from 'solana-wallets-vue';

const wallet = useWallet();
const {
  data: listings,
  refresh,
  pending,
  error,
} = await useFetch('/api/fetch-user-purchasing', {
  method: 'POST',
  body: {
    buyer: wallet.publicKey.value?.toString(),
  },
});
await nextTick();
</script>

<template>
  <div>
    Profile:
    <div v-if="wallet === null">Please connect your wallet</div>
    <div v-else-if="pending">Loading...</div>
    <div v-else-if="error">Error fetching listing: {{ error.message }}</div>
    <div v-else>
      <ListFullListing :listings="listings" />
    </div>
    <UButton @click="refresh">Refresh</UButton>
  </div>
</template>

<style scoped></style>
