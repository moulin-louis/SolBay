import {Program} from "@coral-xyz/anchor";
import {PublicKey} from "@solana/web3.js";

export function getFormattedDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, '0'); // months are zero-indexed
  const day = now.getDate().toString().padStart(2, '0');
  const hour = now.getHours().toString().padStart(2, '0');
  const minute = now.getMinutes().toString().padStart(2, '0');
  return `${year}-${month}-${day}T${hour}:${minute}`;
}

export const upload_to_ipfs = async (data: File) => {
  console.log('data = ', data);
  try {
    const formData = new FormData();
    formData.append('file', new Blob([data], {type: 'image/jpeg'}));
    formData.append("pinataMetadata", JSON.stringify({name: "auction_image"}));
    const api_jwt = import.meta.env.VITE_PINATA_JWT;
    const res = await fetch(`https://api.pinata.cloud/pinning/pinFileToIPFS`, {
      method: 'POST',
      headers: {Authorization: `Bearer ${api_jwt}`},
      body: formData,
    });
    return res.json();
  } catch (error) {
    console.log('error when uploading to ipfs', error);
    throw error;
  }
}

export const getAccountData = async (program: Program, pubKey: PublicKey) => {
  return await program.account.auction.fetch(pubKey);
}