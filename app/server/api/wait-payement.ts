import {FindReferenceError, findReference, validateTransfer} from '@solana/pay';
import BigNumber from 'bignumber.js';
// KEKW
import {PublicKey} from '../../node_modules/@solana/web3.js/lib/index.esm.js';

const pollForSignature = async (connection: Connection, reference: PublicKey) => {
  for (let i = 0; i < 60; i++) {
    try {
      return await findReference(connection, reference, {finality: 'confirmed'});
    } catch (e) {
      if (e instanceof FindReferenceError) {
        console.log('nothing found, retry in 1 sec');
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
    if (!body) throw new Error('No body');
    const requiredParams = ['recipient', 'amount', 'reference'];
    checkMissingParams(body, requiredParams);
    const {recipient, amount, splToken, reference} = body;
    const config = useRuntimeConfig(); //runtime config for env var
    const connection = new Connection(config.SOLANA_DEVNET_RPC, 'confirmed');
    const signatureInfo = await pollForSignature(connection, reference);
    if (!signatureInfo) throw new Error('Payment not confirmed');
    await validateTransfer(
      connection,
      signatureInfo?.signature as string,
      {
        recipient,
        amount: new BigNumber(amount),
        splToken: new PublicKey(splToken),
        reference,
        memo: 'TOTO',
      },
      {commitment: 'confirmed'},
    );
    return 'Payement accepted';
  } catch (e) {
    const error = e as Error;
    throw new Error(`error when polling for signature: ${error.message}`);
  }
});
