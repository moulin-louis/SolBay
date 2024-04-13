export { t_auction };

declare global {
  interface t_auction {
    id: string; //uid of the auction
    name: string; //name of the auction
    description: string; //description of the auction
    min_price: number; //price in chosen token
    current_price: number; //current price in chosen token
    seller: PublicKey; //address of the seller
    betters: PublicKey[]; //vector of addresses of the betters
    created_at: number; //timestamp
    end_date: string; //timestamp
    ipfs_hash: string; //hash of the image
    token: t_token; //token struct
  }
}