export const getImgLink = (listing: t_listing): string => {
  const ipfs_gateway = 'https://aqua-general-primate-588.mypinata.cloud/ipfs/';
  return `${ipfs_gateway}${listing.ipfs_hash}`;
};