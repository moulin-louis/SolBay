import {getImgLink} from '~/composables/getImgLink';
import {createUmi} from '@metaplex-foundation/umi-bundle-defaults';
import {irysUploader} from '@metaplex-foundation/umi-uploader-irys';
import {
  createGenericFileFromJson,
  createSignerFromKeypair,
  isKeypairSigner,
  signerIdentity,
  signerPayer,
  generateSigner,
  percentAmount,
} from '@metaplex-foundation/umi';
import {createNft, mplTokenMetadata} from '@metaplex-foundation/mpl-token-metadata';
import bs58 from 'bs58';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const {listing, prevListingAddress} = body;
    prevListingAddress;

    const config = useRuntimeConfig();
    const umi = createUmi(config.SOLANA_DEVNET_RPC);
    const recipient_keypair = umi.eddsa.createKeypairFromSecretKey(
      Uint8Array.from(bs58.decode(config.RECIPIENT_PRIVATE_KEY)),
    );
    const recipient_signer = createSignerFromKeypair(umi, recipient_keypair);
    if (!isKeypairSigner(recipient_signer)) {
      throw new Error('invalid recipient signer');
    }
    // const connection = new Connection(config.SOLANA_DEVNET_RPC);
    umi.use(mplTokenMetadata());
    umi.use(signerIdentity(recipient_signer));
    umi.use(signerPayer(recipient_signer));
    umi.use(irysUploader());
    console.log('image uri = ', getImgLink(listing));
    // const connection = new Connection(config.SOLANA_DEVNET_RPC);
    const file = createGenericFileFromJson([
      {
        name: 'SolBay Listing',
        symbol: 'SBL',
        description: 'NFT tracking your listing :O',
        image: getImgLink(listing),
        animation_url: '',
        external_url: 'https://sol-bay-gamma.vercel.app/',
        attributes: [
          {
            trait_type: 'listing_id',
            value: listing.id,
          },
        ],
      },
    ]);
    console.log('umi init, uploading json to irys');
    const uri = (await umi.uploader.upload([file]))[0];
    console.log('uri = ', uri);
    const mint = generateSigner(umi);
    const mintTx = await createNft(umi, {
      mint,
      name: 'SolBay Listing',
      symbol: 'SBL',
      uri: uri,
      sellerFeeBasisPoints: percentAmount(0),
    }).sendAndConfirm(umi, {
      send: {
        skipPreflight: true,
        commitment: 'confirmed',
      },
    });
    console.log('result mint V1  = ', mintTx.result);
  } catch (e) {
    const error = e as Error;
    throw new Error('error when creating listing:' + error.message);
  }
});
