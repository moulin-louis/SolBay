<script lang="ts" setup>
import type {ListFormat} from 'typescript';
import {useListNft} from '~/composables/ListNft';

const props = defineProps<{
  isOpen: boolean;
  ownerAddress: string | undefined;
  selectedNft: unknown | null;
  upadteSelectedNft: (token: t_token | null) => void;
}>();
const ownerAddress = props.ownerAddress;
const isOpen = computed(() => props.isOpen);

const config = useRuntimeConfig();
const listNft = await useListNft(ownerAddress);
listNft.value.filter((nft) => {
  return (
    nft.authorities[0].address === config.public.RECIPIENT_PUBLIC_KEY &&
    nft.creators[0].address === config.public.CREATOR_PUBLIC_KEY
  );
}); //filter out only SolBay NFT
listNft.value.forEach((nft) => console.log('nft = ', nft));
</script>

<template>
  <div>
    <div v-if="listNft.length === 0" class="text-red-500">No SolBay Nfts found</div>
    <div v-else>
      <UModal v-model="isOpen">
        <NftCard
          v-for="nft in listNft"
          :key="nft.id"
          :name="nft.content.metadata.name"
          :description="nft.content.metadata.description"
          :image-uri="nft.content.links.image"
          @click="upadteSelectedNft(nft)"
        />
      </UModal>
    </div>
  </div>
</template>

<style></style>
