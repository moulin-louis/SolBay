import {Keypair, type PublicKey} from '@solana/web3.js';
import {createQR} from '@solana/pay';
import type QRCodeStyling from '@solana/qr-code-styling';

interface t_return {
  qr_code: QRCodeStyling;
  reference: PublicKey;
}

export async function GenerateQRCode(listing: t_listing, recipient: PublicKey): Promise<t_return> {
  const wallet = new Keypair();
  const res = await $fetch('/api/generate-url-solana', {
    method: 'POST',
    body: {
      recipient: recipient, // who whill receive the payment
      amount: listing.price,
      splToken: listing.token.address,
      reference: wallet.publicKey, // random generated wallet
      message: `Buy item: ${listing.name}`,
      memo: 'TOTO',
    },
  });
  const url_solana: URL = res as unknown as URL;
  return {qr_code: createQR(url_solana), reference: wallet.publicKey};
}
