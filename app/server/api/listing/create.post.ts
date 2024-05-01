import {type H3Event} from 'h3';
import {v4 as uuidv4} from 'uuid';

export default defineEventHandler(async (event: H3Event): Promise<string> => {
  try {
    const mFormData = await readMultipartFormData(event);
    if (!mFormData) throw new Error('No form data found');

    const file = mFormData.find((data) => data.name === 'file');
    if (!file) throw new Error('File not found');

    const prevListingAddress = mFormData
      .find((data) => data.name === 'prevListingAddress')
      ?.data.toString();

    const listingData = mFormData.find((data) => data.name === 'listing')?.data;
    if (!listingData) throw new Error('Listing not found');
    const listing: t_listing = JSON.parse(listingData as unknown as string);
    checkMissingParams(listing, ['name', 'description', 'seller', 'price']);
    listing.id = uuidv4();
    listing.created_at = new Date().toISOString();

    const InfoData = new FormData();
    InfoData.append('file', new Blob([file.data], {type: file.type}));
    InfoData.append('listing', JSON.stringify(listing));
    InfoData.append('prevListingAddress', prevListingAddress || '');

    const res = await fetch('http://localhost:3000/api/nft/handle-listing', {
      method: 'POST',
      body: InfoData,
    });
    const resJson = await res.json();
    listing.nftAddress = resJson.nftAddress;
    listing.imageUri = resJson.imageUri || listing.imageUri;

    await useStorage('db').setItem(listing.id.toString(), listing);
    return listing.id;
  } catch (e) {
    const error = e as Error;
    throw new Error('error when creating listing:' + error.message);
  }
});
