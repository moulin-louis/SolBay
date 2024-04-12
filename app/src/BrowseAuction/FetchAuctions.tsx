import {useEffect, useState} from "react";
import {auctionsPDA, t_auction} from "../Auction/Auction.tsx";
import {getProvider, Idl, Program, Provider} from "@coral-xyz/anchor";
import * as idl_program from '../auction.json';
import {getAccountData} from "../Utils.tsx";

const programId: string = import.meta.env.VITE_PROGRAM_ID;

const getAuctions = async (): Promise<t_auction[]> => {
  const provider: Provider = getProvider();
  const program = new Program(idl_program as Idl, programId, provider);
  const result: t_auction[] = [];
  console.log("auctionsPDA len = ", auctionsPDA.length)
  for (const pda of auctionsPDA) {
    console.log('pda = ', pda);
    const auction = getAccountData(program, pda);
    result.push(auction);
  }
  return result;
}

export const useFetchAuctions = () => {
  console.log("useFetchAuctions")
  const [auctions, setAuctions] = useState<t_auction[]>([]);
  useEffect(() => {
    const fetchAuctions = async () => {
      const auctions: t_auction[] = await getAuctions();
      setAuctions(auctions);
    };
    fetchAuctions().then();
  }, []);
  return auctions;
}