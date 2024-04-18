import BigNumber from 'bignumber.js';
import {checkMissingParams} from '../utils/checkMissingParams';

type t_paramsURL = {
  recipient: string;
  amount: BigNumber;
  splToken: string | undefined; //if undefined, use native SOL
  reference: string | string[];
  label: string;
  message: string;
  memo: string;
};

export const encodeURL = ({
  recipient,
  amount,
  splToken,
  reference,
  label,
  message,
  memo,
}: t_paramsURL): URL => {
  const url = new URL('solana:' + recipient);
  if (amount) url.searchParams.append('amount', amount.toFixed(amount.decimalPlaces() ?? 0));
  if (splToken) url.searchParams.append('spl-token', splToken);
  if (reference) {
    if (!Array.isArray(reference)) reference = [reference]; //transform to array if not one already
    for (const pubkey of reference) url.searchParams.append('reference', pubkey);
  }
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
    const {recipient, amount, splToken, reference, message, memo}: t_paramsURL = body;
    const url = encodeURL({
      recipient,
      amount: new BigNumber(amount),
      splToken,
      reference,
      label: 'SolBay',
      message,
      memo,
    });
    return url;
  } catch (e) {
    const error = e as Error;
    throw new Error(`error when generating URL: ${error.message}`);
  }
});
