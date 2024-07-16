import {PublicKey} from '@solana/web3.js';
import nacl from 'tweetnacl';

export default defineEventHandler(async (event): Promise<void> => {
  try {
    const mFormData = await readMultipartFormData(event);
    if (mFormData === undefined) throw new Error('No form data found');
    const encodeMessage = mFormData.find((item) => item.name === 'encodeMessage');
    const signedMessage = mFormData.find((item) => item.name === 'signedMessage');
    const publicKey = mFormData.find((item) => item.name === 'publicKey');
    if (!encodeMessage || !signedMessage || !publicKey) throw new Error('Missing required fields');
    const encodeMessageData = encodeMessage.data;
    const signedMessageData = signedMessage.data;
    const publicKeyData = publicKey.data.toString();

    const pubKey = new PublicKey(publicKeyData);
    const result = nacl.sign.detached.verify(
      encodeMessageData,
      signedMessageData,
      pubKey.toBytes(),
    );
    if (!result) throw new Error('Invalid signature');
    return;
  } catch (e) {
    const error = e as Error;
    throw new Error('Error verifying message: ' + error.message);
  }
});
