export { t_auction };

declare global {
  type t_auction  = t_listing & {
    //Fill by the server
    status: string; //status of the auction
    bids: t_bid[]; //array of bids
    current_price: number; //current price of the auction
    //Fill by the client
    end_date: string; //end date of the auction
  }
}