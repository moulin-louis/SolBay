import {FindReferenceError, findReference, validateTransfer} from '@solana/pay';
import {type ConfirmedSignatureInfo, Connection, PublicKey} from '@solana/web3.js';
import BigNumber from 'bignumber.js';

const pollForSignature = async (
  connection: Connection,
  reference: PublicKey,
): Promise<ConfirmedSignatureInfo | null> => {
  for (let i = 0; i < 60; i++) {
    try {
      return await findReference(connection, reference, {finality: 'confirmed'});
    } catch (e) {
      if (e instanceof FindReferenceError) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        continue;
      }
      throw e;
    }
  }
  return null;
};

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    if (!body) throw new Error('No body provided');
    checkMissingParams(body, ['referenceAddress', 'recipientAddress', 'listing']);
    const {referenceAddress, recipientAddress, listing} = body;
    const reference = new PublicKey(referenceAddress);
    const recipient = new PublicKey(recipientAddress);
    const config = useRuntimeConfig();
    const connection: Connection = new Connection(config.public.SOLANA_DEVNET_RPC, 'confirmed');
    const signatureInfo = await pollForSignature(connection, reference);
    if (!signatureInfo) throw new Error('Payment not confirmed');
    await validateTransfer(
      connection,
      signatureInfo?.signature as string,
      {
        recipient,
        amount: new BigNumber(listing.price as number),
        splToken: listing?.token ? new PublicKey(listing.token.address as string) : undefined,
        reference,
        memo: 'Buying-Item',
      },
      {commitment: 'confirmed'},
    );
    console.log('payement found and validated');
  } catch (e) {
    const error = e as Error;
    throw new Error(`Error while waiting for payement: ${error.message}`);
  }
});
