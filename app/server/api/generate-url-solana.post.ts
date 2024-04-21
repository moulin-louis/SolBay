import BigNumber from 'bignumber.js';
import {checkMissingParams} from '../utils/checkMissingParams';
import {encodeURL} from '@solana/pay';
// KEKW
import {Keypair, PublicKey} from '../../node_modules/@solana/web3.js/lib/index.esm.js';

type t_paramsURL = {
  recipient: string;
  amount: BigNumber;
  splToken: string | undefined; //if undefined, use native SOL
  reference: string | string[];
  label: string;
  message: string;
  memo: string;
};

export default defineEventHandler(
  async (
    event,
  ): Promise<{
    url: URL;
    reference: PublicKey;
  }> => {
    try {
      const body = await readBody(event);
      if (!body) throw new Error('No body');
      const requiredParams = ['recipient', 'amount', 'message', 'memo'];
      checkMissingParams(body, requiredParams);
      const {recipient, amount, splToken, message, memo}: t_paramsURL = body;
      const reference = new Keypair();
      return {
        url: encodeURL({
          recipient: new PublicKey(recipient),
          amount: new BigNumber(amount),
          splToken: splToken ? new PublicKey(splToken) : undefined,
          reference: reference.publicKey,
          label: 'SolBay',
          message,
          memo,
        }),
        reference: reference.publicKey,
      };
    } catch (e) {
      const error = e as Error;
      throw new Error(`error when generating URL: ${error.message}`);
    }
  },
);
