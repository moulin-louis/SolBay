import {getImgLink} from '~/composables/getImgLink';
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
} from '@metaplex-foundation/umi';
import {
  TokenStandard,
  createNft,
  fetchMetadataFromSeeds,
  mplTokenMetadata,
  transferV1,
  updateV1,
} from '@metaplex-foundation/mpl-token-metadata';
import bs58 from 'bs58';
import {checkMissingParams} from '../utils/checkMissingParams';
import {type H3Event} from 'h3';

//create NFT SolBay
const createNFTSB = async (event: H3Event, umi: Umi, listing: t_listing): Promise<string> => {
  console.log('creating NFT');
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
  const mintTx = await createNft(umi, {
    mint,
    name: 'SolBay Listing',
    symbol: 'SBL',
    uri,
    sellerFeeBasisPoints: percentAmount(0),
    isCollection: false,
    isMutable: true,
  }).sendAndConfirm(umi, {
    send: {
      commitment: 'finalized',
    },
  });
  if (mintTx.result.value.err !== null) throw new Error('mint tx failed');
  const transferTx = await transferV1(umi, {
    mint: mint.publicKey,
    authority: umi.payer,
    tokenOwner: umi.payer.publicKey,
    destinationOwner: publicKey(listing.seller),
    tokenStandard: TokenStandard.NonFungible,
  }).sendAndConfirm(umi, {
    send: {
      skipPreflight: true,
      commitment: 'finalized',
    },
  });
  if (transferTx.result.value.err !== null) throw new Error('transfer tx failed');
  await useStorage('db').setItem(mint.publicKey.toString(), mint.secretKey.toString());
  setResponseStatus(event, 201);
  console.log('NFT created:', mint.publicKey.toString());
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
  }).sendAndConfirm(umi, {
    send: {
      commitment: 'finalized',
    },
  });
  if (tx.result.value.err !== null) throw new Error('update tx failed');
  console.log('updating done');
};

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
