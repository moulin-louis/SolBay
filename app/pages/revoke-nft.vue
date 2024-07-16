<script lang="ts" setup>
const adddressNft = ref('');
const ownerNftAddress = ref('');
const revokeNFT = async () => {
  console.log('Revoke NFT');
  const res = await $fetch('/api/nft/revoke-delegate', {
    method: 'POST',
    body: {
      adddressNft: adddressNft.value,
      ownerNftAddress: ownerNftAddress.value,
    },
  });
  console.log('res = ', res);
};
const unlockNFT = async () => {
  console.log('unlock NFT');
  const res = await $fetch('/api/nft/unlock', {
    method: 'POST',
    body: {
      adddressNft: adddressNft.value,
    },
  });
  console.log('res = ', res);
};
</script>

<template>
  <div>
    <UInput v-model="adddressNft" label="NFT Address" placeholder="adddressNft" />
    <UInput v-model="ownerNftAddress" label="NFT Owner Address" placeholder="ownerNftAddress" />
    <UButton label="Revoke NFT" @click="revokeNFT" />
    <UButton label="Unlock NFT" @click="unlockNFT" />
  </div>
</template>

<style></style>
