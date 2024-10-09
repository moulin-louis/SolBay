<script lang="ts" setup>
import {useWallet} from 'solana-wallets-vue';
const wallet = useWallet();
const isSignedIn = ref(false); //need to sign a message with their pubkey to authenticate
const onCLickSignIn = async () => {
  await handleSignIn(isSignedIn);
};
const onCLickSignOut = async () => {
  const toast = useToast();
  isSignedIn.value = false;
  toast.add({
    id: 'success-notification',
    title: 'Success',
    description: 'You are now signed out',
    icon: 'i-material-symbols-check-circle-outline',
    color: 'green',
  });
};
const user = ref<t_user | null>(null);
const onResponseUser = (res) => {
  user.value = res.response._data;
  console.log('user = ', user.value);
};
</script>

<template>
  <div v-if="!isSignedIn">
    <UButton @click="onCLickSignIn">Sign In</UButton>
  </div>
  <div v-else>
    <UButton @click="onCLickSignOut">Sign Out</UButton>
    <TemplateLoadingData
      url="/api/user/fetch-user"
      :body="{address: wallet.publicKey.value || null}"
      :on-response="onResponseUser"
      :disable-button="true"
    >
      <div v-if="!user">No user found with this pubkey ! Do you want to create a profile ?</div>
      <div v-else>
        <div>{{ user.name }}</div>
        <div>{{ user.email }}</div>
        <div>{{ user.address }}</div>
      </div>
    </TemplateLoadingData>
  </div>
</template>

<style></style>
