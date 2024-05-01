export default defineEventHandler(async (event): Promise<t_listing[]> => {
  try {
    const body = await readBody(event);
    if (!body) throw new Error('Empty body');
    checkMissingParams(body, ['buyer']);
    const buyer = body.buyer;
    const listings = await fetchAllListing();
    return listings.filter((listing) => listing.buyer === buyer);
  } catch (e) {
    const error = e as Error;
    throw new Error('error when fetching open purchasing:' + error.message);
  }
});
