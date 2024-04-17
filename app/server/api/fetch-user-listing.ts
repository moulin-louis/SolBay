import {fetchAllListing} from '../utils/fetch-all-listings';

export default defineEventHandler(async (event): Promise<t_listing[]> => {
  try {
    const body = await readBody(event);
    if (!body) throw new Error('Empty body');
    const seller = body.seller;
    if (!seller || typeof seller !== 'string')
      throw new Error('Invalid seller');
    const listings = await fetchAllListing();
    return listings.filter((listing) => listing.seller === seller);
  } catch (e) {
    const error = e as Error;
    throw new Error('error when fetching user listings:' + error.message);
  }
});
