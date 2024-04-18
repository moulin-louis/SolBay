import {PublicKey, Keypair} from '@solana/web3.js';
import {createQR} from '@solana/pay';
import type QRCodeStyling from '@solana/qr-code-styling';

interface t_return {
  qr_code: QRCodeStyling;
  reference: PublicKey;
}

export const GenerateQRCode = async (
  listing: t_listing,
  recipient: PublicKey, //merchent address
): Promise<t_return> => {
  const wallet = new Keypair();
  const res = await $fetch('/api/generate-url-solana', {
    method: 'POST',
    body: {
      recipient: recipient.toBase58(), // who whill receive the payment
      amount: listing.price,
      splToken: new PublicKey(listing.token.address as string).toBase58(),
      reference: wallet.publicKey.toBase58(), // who will pay
      message: 'Buy item: ' + listing.name,
      memo: 'TOTO',
    },
  });
  const url_solana: URL = res as unknown as URL;
  return {qr_code: createQR(url_solana), reference: wallet.publicKey};
};
