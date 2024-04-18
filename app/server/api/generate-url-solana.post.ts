import BigNumber from 'bignumber.js';
import {checkMissingParams} from '../utils/checkMissingParams';
import {PublicKey} from '@solana/web3.js';

export const encodeURL = ({
  recipient,
  amount,
  splToken,
  reference,
  label,
  message,
  memo,
}: {
  recipient: string;
  amount: BigNumber;
  splToken?: string;
  reference: string;
  label: string;
  message: string;
  memo: string;
}): URL => {
  const url = new URL('solana:' + recipient);
  if (amount) url.searchParams.append('amount', amount.toFixed(amount.decimalPlaces() ?? 0));
  if (splToken) url.searchParams.append('spl-token', splToken);
  if (reference) url.searchParams.append('reference', reference);
  if (label) url.searchParams.append('label', label);
  if (message) url.searchParams.append('message', message);
  if (memo) url.searchParams.append('memo', memo);
  return url;
};

export default defineEventHandler(async (event): Promise<URL> => {
  try {
    const body = await readBody(event);
    if (!body) throw new Error('No body');
    const requiredParams = ['recipient', 'amount', 'reference', 'message', 'memo'];
    checkMissingParams(body, requiredParams);
    const {recipient, amount, reference, message, memo} = body;
    const label = 'SolBay';
    const url = encodeURL({
      recipient,
      amount: new BigNumber(amount),
      reference,
      label,
      message,
      memo,
    });
    return url;
  } catch (e) {
    const error = e as Error;
    throw new Error(`error when generating URL: ${error.message}`);
  }
});
