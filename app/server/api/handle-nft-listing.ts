import {Helius} from 'helius-sdk';

export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig();
    const helius = new Helius(config.HELIUS_API_KEY, 'devnet');
    const body = await readBody(event);
    const {listing, prevListingAddress} = body;
    if (prevListingAddress) {
      //upadte existing nft
      return;
    } //else create a new nft

    const responseMint = await helius.mintCompressedNft({
      name: 'SolBay Listing',
      symbol: 'SBL',
      owner: listing.seller,
      description: 'NFT tracking your listing :O',
      attributes: [
        {
          trait_type: 'Price',
          value: listing.price,
        },
      ],
      imageUrl:
        'https://cdna.artstation.com/p/assets/images/images/052/118/830/large/julie-almoneda-03.jpg?1658992401',
      externalUrl: 'https://sol-bay-gamma.vercel.app/',
      sellerFeeBasisPoints: 1,
      confirmTransaction: true,
    });
    console.log('response', responseMint);
    const responseAsset = await helius.rpc.getAsset({
      id: responseMint.result.assetId,
      displayOptions: {
        showUnverifiedCollections: true,
        showCollectionMetadata: true,
        showFungible: true,
        showInscription: true,
      },
    });
    console.log(responseAsset.grouping?.map((g) => g.collection_metadata?.name));
    return responseMint.result.assetId;
  } catch (e) {
    const error = e as Error;
    throw new Error('error when creating listing:' + error.message);
  }
});
