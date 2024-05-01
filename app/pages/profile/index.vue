<script setup lang="ts">
import {useWallet} from 'solana-wallets-vue';

const wallet = useWallet();
const {
  data: dataB,
  refresh: refreshB,
  pending: pendingB,
  error: errorB,
} = await useFetch('/api/listing/fetch-user-purchasing', {
  method: 'POST',
  body: {
    buyer: wallet.publicKey.value?.toString(),
  },
});
const userBuyListings = transformListings(dataB.value as t_listing[]);
const {
  data: dataL,
  refresh: refreshL,
  pending: pendingL,
  error: errorL,
} = await useFetch('/api/listing/fetch-user-listing', {
  method: 'POST',
  body: {
    seller: wallet.publicKey.value?.toString(),
  },
});
const userListings = transformListings(dataL.value as t_listing[]);
await nextTick();
</script>

<template>
  <div>
    <div>
      <UserCard />
    </div>
    <div v-if="wallet === null">Please connect your wallet</div>
    <div>
      Listing you has purchasing:
      <div v-if="pendingB">Loading...</div>
      <div v-else-if="errorB">Error fetching listing: {{ errorB.message }}</div>
      <div v-else>
        <ListFullListing :listings="userBuyListings" />
      </div>
      <UButton @click="refreshB">Refresh</UButton>
    </div>
    <div>
      Your listings:
      <div v-if="pendingL">Loading...</div>
      <div v-else-if="errorL">Error fetching listing: {{ errorL.message }}</div>
      <div v-else>
        <ListFullListing :listings="userListings" />
      </div>
      <UButton @click="refreshL">Refresh</UButton>
    </div>
  </div>
</template>

<style scoped></style>
