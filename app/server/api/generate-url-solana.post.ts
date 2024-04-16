import BigNumber from 'bignumber.js';
import {checkMissingParams} from '../../composables/checkMissingParams';

export const encodeURL = ({
  recipient,
  amount,
  splToken,
  reference,
  label,
  message,
  memo,
}: any): URL => {
  const url = new URL('solana:' + recipient);
  if (amount)
    url.searchParams.append(
      'amount',
      amount.toFixed(amount.decimalPlaces() ?? 0),
    );
  if (splToken) url.searchParams.append('spl-token', splToken);
  if (reference) url.searchParams.append('reference', reference);
  if (label) url.searchParams.append('label', label);
  if (message) url.searchParams.append('message', message);
  if (memo) url.searchParams.append('memo', memo);
  return url;
};

export default defineEventHandler(
  async (event): Promise<t_apiAnswer<URL> | t_apiAnswer<string>> => {
    try {
      const body = await readBody(event);
      if (!body) throw new Error('No body');
      const requiredParams = [
        'recipient',
        'amount',
        'reference',
        'message',
        'memo',
      ];
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
      return {
        status: 200,
        data: url,
      };
    } catch (e) {
      const error = e as Error;
      console.log('error in generate-url-solana.post: ', error.message);
      return {
        status: 500,
        data: error.message,
      };
    }
  },
);
