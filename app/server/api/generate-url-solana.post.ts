import BigNumber from 'bignumber.js';
import {checkMissingParams} from '../utils/checkMissingParams';
import {encodeURL} from '@solana/pay';
// KEKW
import {PublicKey} from '../../node_modules/@solana/web3.js/lib/index.esm.js';

type t_paramsURL = {
  recipient: string;
  amount: BigNumber;
  splToken: string | undefined; //if undefined, use native SOL
  reference: string | string[];
  label: string;
  message: string;
  memo: string;
};

export default defineEventHandler(async (event): Promise<URL> => {
  try {
    const body = await readBody(event);
    if (!body) throw new Error('No body');
    const requiredParams = ['recipient', 'amount', 'reference', 'message', 'memo'];
    checkMissingParams(body, requiredParams);
    const {recipient, amount, splToken, reference, message, memo}: t_paramsURL = body;
    return encodeURL({
      recipient: new PublicKey(recipient),
      amount: new BigNumber(amount),
      splToken: new PublicKey(splToken),
      reference: new PublicKey(reference),
      label: 'SolBay',
      message,
      memo,
    });
  } catch (e) {
    const error = e as Error;
    throw new Error(`error when generating URL: ${error.message}`);
  }
});
