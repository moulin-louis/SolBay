import {auctionsPDA, t_auction} from "../Auction/Auction.tsx";
import {WalletContextState} from "@solana/wallet-adapter-react";
import {PublicKey} from "@solana/web3.js";
import {v4 as uuidv4} from 'uuid';
import {BN, getProvider, Idl, Program, Provider} from "@coral-xyz/anchor";
import * as idl_program from '../auction.json';
import {getAccountData, getFormattedDate} from "../Utils.tsx";

const programId: string = import.meta.env.VITE_PROGRAM_ID;

export const return_empty = (): t_auction => {
  return {
    token: undefined,
    id: '',
    name: '',
    description: '',
    min_price: 0,
    current_price: 0,
    seller: PublicKey.default,
    betters: [],
    final_buyer: PublicKey.default,
    created_at: 0,
    image_path: '',
    image_data: '',
    ipfs_hash: '',
    end_date: getFormattedDate(),
  };
}

export const handle_emit = async (auction: t_auction, wallet_context: WalletContextState, toast: any) => {
  const pubKey = wallet_context.publicKey as PublicKey;
  auction.id = uuidv4();
  auction.seller = pubKey
  auction.created_at = Date.now();
  // const response_ipfs = await upload_to_ipfs(auction.image_data).catch((error) => {
  //   console.log("error when uploading to ipfs", error);
  //   return '';
  // });
  // console.log('https://ipfs.io/ipfs/' + response_ipfs.IpfsHash);
  // if (!response_ipfs) {
  //   toast({
  //     title: "Error Auction",
  //     description: "Your auction has not been created",
  //     status: "error",
  //     duration: 5000,
  //     isClosable: true
  //   });
  //   return
  // }
  const provider: Provider = getProvider();
  const program: Program = new Program(idl_program as Idl, programId, provider);
  const userAuctionPDA: PublicKey = PublicKey.findProgramAddressSync(
    [Buffer.from("auction"), pubKey.toBuffer()],
    program.programId,
  )[0];
  if (await getAccountData(program, userAuctionPDA) !== undefined) {
    console.log("Auction already exists");

    auctionsPDA.push(userAuctionPDA);
    return;
  }
  console.log("auction PDA = ", userAuctionPDA.toString());
  const auction_info = {
    name: auction.name,
    minPrice: new BN(auction.min_price),
    idAuction: Number(auction.id),
  }
  const tx = await program.methods
    .initialize(auction_info)
    .accounts({
      user: pubKey,
      newAuction: userAuctionPDA,
    })
    .rpc({skipPreflight: true});
  console.log("tx = ", tx);
  // auction.ipfs_hash = response_ipfs.IpfsHash;
  toast({
    title: "Auction created",
    description: "Your auction has been created",
    status: "success",
    duration: 5000,
    isClosable: true
  });
}
