export const useListNft = async (ownerAddress: string | undefined) => {
  if (!ownerAddress) {
    return ref(['ADDRESS undefined']);
  }
  return ref(
    await $fetch('/api/nft/fetch-all-owner', {
      method: 'POST',
      body: {ownerAddress},
    }),
  );
};
