import BigNumber from 'bignumber.js';
import {encodeURL} from '@solana/pay';
import {PublicKey, Keypair} from '@solana/web3.js';

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
    reference: string;
  }> => {
    try {
      const body = await readBody(event);
      if (!body) throw new Error('No body');
      checkMissingParams(body, ['recipient', 'amount', 'message', 'memo']);
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
        reference: reference.publicKey.toString(),
      };
    } catch (e) {
      const error = e as Error;
      throw new Error(`error when generating URL: ${error.message}`);
    }
  },
);
