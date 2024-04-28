import {createQR} from '@solana/pay';
import type QRCodeStyling from '@solana/qr-code-styling';

interface t_return {
  qr_code: QRCodeStyling;
  referenceAddress: string;
}

export async function GenerateQRCode(
  listing: t_listing,
  recipientAddress: string,
): Promise<t_return> {
  const res = await $fetch('/api/generate-url-solana', {
    method: 'POST',
    body: {
      recipient: recipientAddress, // who whill receive the payment
      amount: listing.price,
      splToken: listing.token ? listing.token.address : null,
      message: `Buy item: ${listing.name}`,
      memo: 'Buying-Item',
    },
  });
  const url_solana: URL = res.url;
  const referenceAddress: string = res.reference;
  return {qr_code: createQR(url_solana), referenceAddress};
}
