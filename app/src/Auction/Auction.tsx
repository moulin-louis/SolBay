import {PublicKey} from "@solana/web3.js";
import {t_token} from "../CreateAuction/FetchToken.tsx";

export const auctionsPDA: PublicKey[]= [];

export interface t_auction {
  id: string; //uid of the auction
  name: string; //name of the auction
  description: string; //description of the auction
  min_price: number; //price in chosen token
  current_price: number; //current price in chosen token
  seller: PublicKey; //address of the seller
  betters: PublicKey[]; //vector of addresses of the betters
  final_buyer: PublicKey; //address of the buyer
  created_at: number; //timestamp
  end_date: string; //timestamp
  image_path: string; //url of the image
  image_data: File;
  ipfs_hash: string; //hash of the image
  token: t_token; //token struct
}