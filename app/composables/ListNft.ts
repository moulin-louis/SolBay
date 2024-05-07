export const useListNft = async (ownerAddress: string): Promise<Ref<t_nft[]>> => {
  try {
    return ref(
      await $fetch('/api/nft/fetch-all-owner', {
        method: 'POST',
        body: {ownerAddress},
      }),
    );
  } catch (e) {
    const error = e as Error;
    console.error(error.message);
    return ref([]);
  }
};
