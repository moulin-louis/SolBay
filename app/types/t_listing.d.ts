import type {PublicKey} from '@solana/web3.js';

export {t_listing};

declare global {
  type t_listing = {
    //Fill by the server
    id: string; //uid of the listing
    created_at: string; //timestamp
    //Fill by the client
    name: string; //name of the listing
    description: string; //description of the listing
    seller: PublicKey; //address of the seller
    ipfs_hash: string; //hash of the image
    token: t_token; //token struct
    price: number; //price in chosen token (min price for listing, buy now price for normal listing)
    buyer: PublicKey | null; //address of the buyer
  };
}
