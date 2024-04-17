import type {ConfirmedSignatureInfo, Connection, Finality, PublicKey} from '@solana/web3.js';

export class FindReferenceError extends Error {
  name = 'FindReferenceError';
}

/**
 * Find the oldest transaction signature referencing a given public key.
 *
 * @param connection - A connection to the cluster.
 * @param reference - `reference` in the [Solana Pay spec](https://github.com/solana-labs/solana-pay/blob/master/SPEC.md#reference).
 * @param options - Options for `getSignaturesForAddress`.
 *
 * @throws {FindReferenceError}
 */
export const findReference = async (
  connection: Connection,
  reference: PublicKey,
  finality: Finality,
): Promise<ConfirmedSignatureInfo | null> => {
  const signatures = await connection.getSignaturesForAddress(reference, {}, finality);

  const length = signatures.length;
  if (!length) throw new FindReferenceError('no reference found');

  // If one or more transaction signatures are found under the limit, return the oldest one.
  const oldest = signatures[length - 1];
  return oldest;
};
