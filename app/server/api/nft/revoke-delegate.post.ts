import {
  TokenStandard,
  mplTokenMetadata,
  revokeStandardV1,
} from '@metaplex-foundation/mpl-token-metadata';
import {createUmi} from '@metaplex-foundation/umi-bundle-defaults';
import {
  createSignerFromKeypair,
  isKeypairSigner,
  signerPayer,
  signerIdentity,
  publicKey,
} from '@metaplex-foundation/umi';
import bs58 from 'bs58';

export default defineEventHandler(async (event): Promise<string> => {
  const body = await readBody(event);
  const {adddressNft, ownerNftAddress} = body;
  console.log('adddressNft = ', adddressNft);
  console.log('ownerNftAddress = ', ownerNftAddress);
  const config = useRuntimeConfig();
  const umi = createUmi(config.SOLANA_DEVNET_RPC);
  const recipient_keypair = umi.eddsa.createKeypairFromSecretKey(
    Uint8Array.from(bs58.decode(config.RECIPIENT_PRIVATE_KEY)),
  );
  const recipient_signer = createSignerFromKeypair(umi, recipient_keypair);
  if (!isKeypairSigner(recipient_signer)) {
    throw new Error('invalid recipient signer'); //server error
  }
  umi.use(mplTokenMetadata());
  umi.use(signerPayer(recipient_signer));
  umi.use(signerIdentity(recipient_signer));
  const revokeTx = await revokeStandardV1(umi, {
    mint: publicKey(adddressNft),
    tokenOwner: publicKey(ownerNftAddress),
    authority: umi.payer,
    delegate: umi.payer.publicKey,
    tokenStandard: TokenStandard.NonFungible,
  }).sendAndConfirm(umi, {
    send: {
      commitment: 'finalized',
    },
  });
  if (revokeTx.result.value.err !== null)
    throw new Error(`revoke tx failed: ${revokeTx.result.value.err.toString()}`);
  console.log('NFT revoked!');
});
