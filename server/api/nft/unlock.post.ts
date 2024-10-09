import {TokenStandard, mplTokenMetadata, unlockV1} from '@metaplex-foundation/mpl-token-metadata';
import {createUmi} from '@metaplex-foundation/umi-bundle-defaults';
import {
  createSignerFromKeypair,
  isKeypairSigner,
  signerPayer,
  signerIdentity,
  publicKey,
} from '@metaplex-foundation/umi';
import bs58 from 'bs58';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const {adddressNft} = body;
  console.log('adddressNft = ', adddressNft);
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
  const unlockTx = await unlockV1(umi, {
    mint: publicKey(adddressNft),
    authority: umi.payer,
    tokenStandard: TokenStandard.NonFungible,
  }).sendAndConfirm(umi, {
    send: {
      commitment: 'finalized',
    },
  });
  if (unlockTx.result.value.err !== null)
    throw new Error(`unlock tx failed: ${unlockTx.result.value.err.toString()}`);
  console.log('NFT unlock!');
});
