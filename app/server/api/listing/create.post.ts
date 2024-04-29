import {v4 as uuidv4} from 'uuid';
export default defineEventHandler(async (event): Promise<string> => {
  try {
    const body = await readBody(event);
    const {listing, prevListingAddress} = body;
    checkMissingParams(body, ['listing']);
    checkMissingParams(listing, ['name', 'description', 'seller', 'ipfs_hash', 'price']);
    listing.id = uuidv4();
    listing.created_at = new Date().toISOString();
    const nftAddress = await $fetch('/api/nft/handle-listing', {
      method: 'POST',
      body: {listing, prevListingAddress},
    });
    listing.nftAddress = nftAddress;
    await useStorage('db').setItem(listing.id.toString(), listing);
    return listing.id;
  } catch (e) {
    const error = e as Error;
    throw new Error('error when creating listing:' + error.message);
  }
});
