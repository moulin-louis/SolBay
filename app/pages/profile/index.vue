<script setup lang="ts">
import {useWallet} from 'solana-wallets-vue';

const wallet = useWallet();
let userBuyListings: t_listingFilter[];
let userListings: t_listingFilter[];

const {
  pending: pendingB,
  refresh: refreshB,
  error: errorB,
} = await useFetch('/api/user/fetch-purchasing', {
  method: 'POST',
  body: {
    buyer: wallet.publicKey.value?.toString(),
  },
  onResponse: (response) => {
    userBuyListings = transformListings(response.response._data as t_listing[]);
  },
});
const {
  pending: pendingL,
  refresh: refreshL,
  error: errorL,
} = await useFetch('/api/user/fetch-listings', {
  method: 'POST',
  body: {
    seller: wallet.publicKey.value?.toString(),
  },
  onResponse: (response) => {
    userListings = transformListings(response.response._data as t_listing[]);
  },
});
await nextTick();
</script>

<template>
  <div>
    <div>
      <UserCard />
    </div>
    <div v-if="wallet === null">Please connect your wallet</div>
    <div>
     Your item:
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
