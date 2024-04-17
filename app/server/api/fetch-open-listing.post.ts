import {fetchAllListing} from '../utils/fetch-all-listings';

export default defineEventHandler(async (): Promise<t_listing[]> => {
  try {
    const listings = (await fetchAllListing()).filter((listing) => listing.buyer === null);
    return listings.sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );
  } catch (e) {
    const error = e as Error;
    throw new Error('error when fetching open listings:' + error.message);
  }
});
