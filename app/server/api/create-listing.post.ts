import {v4 as uuidv4} from 'uuid';
import {checkMissingParams} from '../utils/checkMissingParams';

export default defineEventHandler(async (event): Promise<string> => {
  try {
    const body = await readBody(event);
    const {listing, prevListingAddress} = body;
    prevListingAddress;
    if (!listing) throw new Error('No listing provided');
    const requiredParams = ['name', 'description', 'seller', 'ipfs_hash', 'price'];
    checkMissingParams(listing, requiredParams);
    listing.id = uuidv4();
    listing.created_at = new Date().toISOString();
    await useStorage('db').setItem(listing.id.toString(), listing);
    // await $fetch('/api/handle-nft-listing', {
    //   method: 'POST',
    //   body: {listing, prevListingAddress},
    // });
    return listing.id;
  } catch (e) {
    const error = e as Error;
    throw new Error('error when creating listing:' + error.message);
  }
});
