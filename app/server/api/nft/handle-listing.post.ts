import {type H3Event} from 'h3';
import {createUmi} from '@metaplex-foundation/umi-bundle-defaults';
import {irysUploader} from '@metaplex-foundation/umi-uploader-irys';
import {
  createSignerFromKeypair,
  isKeypairSigner,
  signerIdentity,
  signerPayer,
  generateSigner,
  percentAmount,
  publicKey,
  type Umi,
  type PublicKey,
  TransactionBuilder,
} from '@metaplex-foundation/umi';
import {
  TokenStandard,
  createNft,
  fetchMetadataFromSeeds,
  mplTokenMetadata,
  transferV1,
  updateV1,
  delegateStandardV1,
} from '@metaplex-foundation/mpl-token-metadata';
import bs58 from 'bs58';
<<<<<<< HEAD
// import sharp from 'sharp';
=======
import {getImgLink} from '~/composables/getImgLink';
>>>>>>> parent of 16e3941 (use arwaeve, working implementation user)

export const maxDuration = 120; // This function can run for a maximum of 120 seconds


//create NFT SolBay
const createNFTSB = async (event: H3Event, umi: Umi, listing: t_listing): Promise<string> => {
  const uri = await umi.uploader.uploadJson({
    name: 'SolBay Listing',
    symbol: 'SBL',
    description: 'NFT tracking your listing :O',
    selleter_fee_basis_points: 0,
    image: getImgLink(listing),
    animation_url: '',
    external_url: 'https://sol-bay-gamma.vercel.app/',
    attributes: [
      {
        trait_type: 'listing_id',
        value: [listing.id],
      },
    ],
  });
  const mint = generateSigner(umi);
  const tx = new TransactionBuilder()
    .add(
      createNft(umi, {
        mint,
        name: 'SolBay Listing',
        symbol: 'SBL',
        uri,
        sellerFeeBasisPoints: percentAmount(0),
        isCollection: false,
        isMutable: true,
      }),
    )
    .add(
      delegateStandardV1(umi, {
        mint: mint.publicKey,
        tokenOwner: umi.payer.publicKey,
        authority: umi.payer,
        delegate: umi.payer.publicKey,
        tokenStandard: TokenStandard.NonFungible,
      }),
    )
    .add(
      transferV1(umi, {
        mint: mint.publicKey,
        authority: umi.payer,
        tokenOwner: umi.payer.publicKey,
        destinationOwner: publicKey(listing.seller),
        tokenStandard: TokenStandard.NonFungible,
      }),
    );
  const res = await tx.sendAndConfirm(umi, {send: {commitment: 'confirmed'}});
  if (res.result.value.err !== null) throw new Error('create/delegate/trans/lock tx failed');
  await useStorage('db').setItem(mint.publicKey.toString(), mint.secretKey.toString());
  setResponseStatus(event, 201);
  console.log('NFT created: https://solana.fm/address/', mint.publicKey.toString());
  return mint.publicKey.toString();
};

//Update NFT SolBay to add a listing id
const updateNFTSB = async (umi: Umi, listing: t_listing, mint: PublicKey): Promise<void> => {
  console.log('updating NFT metadata of ', mint.toString());
  const nftMeta = await fetchMetadataFromSeeds(umi, {mint});
  const metadata = await umi.downloader.downloadJson(nftMeta.uri);
  metadata.attributes[0].value.push(listing.id);
  nftMeta.uri = await umi.uploader.uploadJson(metadata);
  const tx = await updateV1(umi, {
    mint,
    authority: umi.payer,
    data: nftMeta,
  }).sendAndConfirm(umi, {send: {commitment: 'finalized'}});
  if (tx.result.value.err !== null) throw new Error('update tx failed');
  console.log('updating done');
};

<<<<<<< HEAD
export default defineEventHandler(
  async (
    event: H3Event,
  ): Promise<{
    nftAddress: string;
    imageUri: string | null;
  }> => {
    try {
      const config = useRuntimeConfig();
      const mFormData = await readMultipartFormData(event);
      if (!mFormData) throw new Error('No form data found');

      const listing = JSON.parse(
        mFormData.find((data) => data.name === 'listing')?.data as unknown as string,
      );
      checkMissingParams(listing, ['name', 'description', 'seller', 'price']);

      const file = mFormData.find((data) => data.name === 'file');
      if (!file) throw new Error('File not found');

      const prevListingAddress = mFormData
        .find((data) => data.name === 'prevListingAddress')
        ?.data.toString();

      const umi = createUmi(config.SOLANA_DEVNET_RPC);
      const recipient_keypair = umi.eddsa.createKeypairFromSecretKey(
        Uint8Array.from(bs58.decode(config.RECIPIENT_PRIVATE_KEY)),
      );
      if (!listing) throw new Error('Listing not found');
      const recipient_signer = createSignerFromKeypair(umi, recipient_keypair);
      if (!isKeypairSigner(recipient_signer)) {
        throw new Error('invalid recipient signer'); //server error
      }
      umi.use(irysUploader());
      umi.use(mplTokenMetadata());
      umi.use(signerPayer(recipient_signer));
      umi.use(signerIdentity(recipient_signer));

      if (!prevListingAddress) {
        const irys = new Irys({
          url: 'devnet',
          token: 'solana',
          key: config.RECIPIENT_PRIVATE_KEY,
          config: {
            providerUrl: config.SOLANA_DEVNET_RPC,
          },
        });
        const imageSharp = await sharp(file.data).webp({quality: 20}).toBuffer();
        await irys.fund(await irys.getPrice(imageSharp.length));
        console.log(`${file.data.length} bytes => ${imageSharp.length} bytes`);
        const response = await irys.uploader.uploadData(imageSharp);
        const imageUri = `https://gateway.irys.xyz/${response.id}`;
        console.log(`File uploaded ==>${imageUri}`);
        return {
          nftAddress: await createNFTSB(event, umi, listing, imageUri),
          imageUri,
        };
      }
      await updateNFTSB(umi, listing, publicKey(prevListingAddress));
      return {nftAddress: prevListingAddress, imageUri: null};
    } catch (e) {
      const error = e as Error;
      throw new Error('error when updating/creating NFT:' + error.message);
    }
  },
);
=======
export default defineEventHandler(async (event: H3Event) => {
  try {
    const body = await readBody(event);
    const {listing, prevListingAddress} = body;
    checkMissingParams(body, ['listing']);
    const config = useRuntimeConfig();
    const umi = createUmi(config.SOLANA_DEVNET_RPC);
    const recipient_keypair = umi.eddsa.createKeypairFromSecretKey(
      Uint8Array.from(bs58.decode(config.RECIPIENT_PRIVATE_KEY)),
    );
    const recipient_signer = createSignerFromKeypair(umi, recipient_keypair);
    if (!isKeypairSigner(recipient_signer)) {
      throw new Error('invalid recipient signer'); //server error
    }
    umi.use(irysUploader());
    umi.use(mplTokenMetadata());
    umi.use(signerPayer(recipient_signer));
    umi.use(signerIdentity(recipient_signer));
    if (!prevListingAddress) return await createNFTSB(event, umi, listing);
    await updateNFTSB(umi, listing, publicKey(prevListingAddress));
    return prevListingAddress;
  } catch (e) {
    const error = e as Error;
    throw new Error('error when updating/creating NFT:' + error.message);
  }
});
>>>>>>> parent of 16e3941 (use arwaeve, working implementation user)
