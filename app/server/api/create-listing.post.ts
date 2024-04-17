import {v4 as uuidv4} from 'uuid';
import {checkMissingParams} from '../utils/checkMissingParams';

export default defineEventHandler(async (event): Promise<string> => {
  try {
    const listing: t_listing = (await readBody(event)) as t_listing;
    const requiredParams = ['name', 'description', 'seller', 'ipfs_hash', 'price'];
    checkMissingParams(listing, requiredParams);
    listing.id = uuidv4();
    listing.created_at = new Date().toISOString();
    await useStorage('db').setItem(listing.id.toString(), listing);
    return 'Good!';
  } catch (e) {
    const error = e as Error;
    throw new Error('error when creating listing:' + error.message);
  }
});
