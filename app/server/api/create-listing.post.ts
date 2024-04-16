import {v4 as uuidv4} from 'uuid';
import {checkMissingParams} from '../../composables/checkMissingParams';

export default defineEventHandler(async (event) => {
  try {
    const listing: t_listing = (await readBody(event)) as t_listing;
    const requiredParams = [
      'name',
      'description',
      'seller',
      'ipfs_hash',
      'price',
    ];
    checkMissingParams(listing, requiredParams);
    listing.id = uuidv4();
    listing.created_at = new Date().toISOString();

    await useStorage('db').setItem(listing.id.toString(), listing);
    return {
      status: 200,
      data: 'Good!',
    };
  } catch (e) {
    const error = e as Error;
    return {
      status: 500,
      data: 'error when creating listing:' + error.message,
    };
  }
});
