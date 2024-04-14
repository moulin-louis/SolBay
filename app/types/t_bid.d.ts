export { t_bid };

declare global {
  type t_bid = {
    id: string; //uid of the bid
    bidder: PublicKey; //address of the bidder
    price: number; //price of the bid
  }
}
