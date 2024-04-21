import {type PublicKey} from '@solana/web3.js';
import {createQR} from '@solana/pay';
import type QRCodeStyling from '@solana/qr-code-styling';

interface t_return {
  qr_code: QRCodeStyling;
  reference: PublicKey;
}

export async function GenerateQRCode(listing: t_listing, recipient: PublicKey): Promise<t_return> {
  const res = await $fetch('/api/generate-url-solana', {
    method: 'POST',
    body: {
      recipient: recipient, // who whill receive the payment
      amount: listing.price,
      splToken: listing.token.address,
      message: `Buy item: ${listing.name}`,
      memo: 'TOTO',
    },
  });
  const url_solana: URL = res.url;
  const reference: PublicKey = res.reference;
  console.log('url_solana', url_solana);
  console.log('reference', reference);
  return {qr_code: createQR(url_solana), reference};
}
