export const useListNft = async (ownerAddress: string): Promise<Ref<t_nft[]>> => {
  return ref(
    await $fetch('/api/nft/fetch-all-owner', {
      method: 'POST',
      body: {ownerAddress},
    }),
  );
};
