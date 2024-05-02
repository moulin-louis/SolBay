<script setup lang="ts">
import {useWallet} from 'solana-wallets-vue';

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
</script>

<template>
  <div>
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
  </div>
</template>

<style scoped></style>
