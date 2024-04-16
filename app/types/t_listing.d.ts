export {t_listing};

declare global {
  type t_listing = {
    //Fill by the server
    id: string; //uid of the auction
    created_at: string; //timestamp
    //Fill by the client
    name: string; //name of the auction
    description: string; //description of the auction
    seller: PublicKey; //address of the seller
    ipfs_hash: string; //hash of the image
    token: t_token; //token struct
    price: number; //price in chosen token (min price for auction, buy now price for normal listing)
  };
}
