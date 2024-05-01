<script lang="ts" setup>
import {useListNft} from '~/composables/ListNft';

const props = defineProps<{
  ownerAddress: string;
  selectedNft: unknown | null;
  upadteSelectedNft: (nft: t_nft) => void;
}>();
const {ownerAddress} = props;
const isOpen = ref(false);
const selectedNft = toRef(props.selectedNft);

const config = useRuntimeConfig();
const listNft: Ref<t_nft[]> = await useListNft(ownerAddress);
listNft.value.filter((nft: t_nft) => {
  return (
    nft.authorities[0].address === config.public.RECIPIENT_PUBLIC_KEY &&
    nft.creators[0].address === config.public.CREATOR_PUBLIC_KEY
  );
});
const onNftClick = () => {
  isOpen.value = true;
  selectedNft.value = null;
};
</script>

<template>
  <div>
    <div v-if="listNft.length === 0" class="text-red-500">No SolBay Nfts found</div>
    <div v-else>
      <UButton
        label="Choose a Nft"
        class="text-indigo-500 hover:text-indigo-700"
        @click="onNftClick"
      />
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
