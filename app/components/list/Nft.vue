<script lang="ts" setup>
import {useListNft} from '~/composables/ListNft';

const props = defineProps<{
  isOpen: boolean;
  ownerAddress: string;
  selectedNft: unknown | null;
  upadteSelectedNft: (nft: t_nft) => void;
}>();
const ownerAddress = props.ownerAddress;
const isOpen = computed(() => props.isOpen);

const config = useRuntimeConfig();
const listNft: Ref<t_nft[]> = await useListNft(ownerAddress);
listNft.value.filter((nft: t_nft) => {
  return (
    nft.authorities[0].address === config.public.RECIPIENT_PUBLIC_KEY &&
    nft.creators[0].address === config.public.CREATOR_PUBLIC_KEY
  );
});
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
