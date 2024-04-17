import {PublicKey} from '@solana/web3.js';

export const generateURL = (address: string) => {
  return new PublicKey(address);
};
