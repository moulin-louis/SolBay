import {fetchAllListing} from '../utils/fetch-all-listings';

export default defineEventHandler(async (): Promise<t_listing[]> => {
  try {
    return await fetchAllListing();
  } catch (e) {
    const error = e as Error;
    throw new Error('error when fetching all listings:' + error.message);
  }
});
