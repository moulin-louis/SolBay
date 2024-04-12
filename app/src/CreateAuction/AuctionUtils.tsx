import {Auctions, t_auction} from "../Auction/Auction.tsx";
import {useWallet, WalletContextState} from "@solana/wallet-adapter-react";
import {PublicKey} from "@solana/web3.js";
import {v4 as uuidv4} from 'uuid';
import {BN, getProvider, Idl, Program} from "@coral-xyz/anchor";
import * as idl_program from '../auction.json';

const programId = '6LCrNoyX2f2e1FgBfDgWAW8gSRMrzL9KpNYXAhdsig8X' as string;

const upload_to_ipfs = async (data: File) => {
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
    end_date: '0',
  };
}

export const handle_emit = async (auction: t_auction, toast: any) => {
  const wallet_context = useWallet();
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
  const provider = getProvider();
  const program = new Program(idl_program as Idl, programId, provider);
  const auctionPDA = PublicKey.findProgramAddressSync(
    [Buffer.from("counter"), pubKey.toBuffer()],
    program.programId,
  )[0];
  console.log("auction PDA = ", auctionPDA.toString());
  const auction_info = {
    name: auction.name,
    minPrice: new BN(auction.min_price),
    idAuction: Number(auction.id),
  }
  await program.methods
    .initialize(auction_info)
    .accounts({
      user: pubKey,
      newAuction: auctionPDA,
    })
    .rpc({skipPreflight: true});
  // auction.ipfs_hash = response_ipfs.IpfsHash;
  Auctions.push(auction);
  toast({
    title: "Auction created",
    description: "Your auction has been created",
    status: "success",
    duration: 5000,
    isClosable: true
  });
}
