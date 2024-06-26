export default defineEventHandler(async (event): Promise<void> => {
  try {
    const body = await readBody(event);
    if (!body) throw new Error('No body provided');
    checkMissingParams(body, ['id', 'buyer']);
    const {id, buyer} = body;
    const listing = (await useStorage('db').getItem(id)) as t_listing;
    if (!listing) throw new Error('No listing found with that id');
    if (listing.buyer) throw new Error('Listing already sold');
    listing.buyer = buyer;
    await useStorage('db').setItem(id, listing);
  } catch (e) {
    const error = e as Error;
    throw new Error(`error when closing listing: ${error.message}`);
  }
});
