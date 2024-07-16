<script setup lang="ts">
import {useWallet} from 'solana-wallets-vue';

<<<<<<< HEAD
const pubKey = useWallet().wallet.value?.adapter.publicKey?.toString();
let userItems: t_listingFilter[];
let userListings: t_listingFilter[];

const items = [
  {label: 'Profile', slot: 'user-profile'},
  {label: 'Items', slot: 'user-items'},
  {label: 'Listings', slot: 'user-listings'},
];
await nextTick(); //stupid hack to avoid something (kindof forgot what)
const onReponseItems = (res: unknown) => {
  userItems = transformListings(res.response._data);
};
const onReponseListings = (res: unknown) => {
  userListings = transformListings(res.response._data);
};
=======
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
>>>>>>> parent of 16e3941 (use arwaeve, working implementation user)
</script>

<template>
  <div>
<<<<<<< HEAD
    <UTabs :items="items">
      <template #user-profile>
        <UserCard />
      </template>
      <template #user-items>
        <TemplateLoadingData
          url="/api/user/fetch-items"
          :body="{buyer: pubKey}"
          :on-response="onReponseItems"
        >
          <ListFullListing :listings="userItems" />
        </TemplateLoadingData>
      </template>
      <template #user-listings>
        <TemplateLoadingData
          url="/api/user/fetch-listings"
          :body="{seller: pubKey}"
          :on-response="onReponseListings"
        >
          <ListFullListing :listings="userListings" />
        </TemplateLoadingData>
      </template>
    </UTabs>
=======
    Profile:
    <div v-if="wallet === null">Please connect your wallet</div>
    <div v-else-if="pending">Loading...</div>
    <div v-else-if="error">Error fetching listing: {{ error.message }}</div>
    <div v-else>
      <ListFullListing :listings="listings" />
    </div>
    <UButton @click="refresh">Refresh</UButton>
>>>>>>> parent of 16e3941 (use arwaeve, working implementation user)
  </div>
</template>

<style scoped></style>
