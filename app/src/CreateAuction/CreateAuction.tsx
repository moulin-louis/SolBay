import {FC, useState} from 'react';
import {Box, Button, useToast} from '@chakra-ui/react';
import {useWallet} from "@solana/wallet-adapter-react";
import {t_auction} from "../Auction/Auction.tsx";
import {useFetchTokens} from "./FetchToken.tsx";
import {AuctionFormFields} from "./AuctionFormFields.tsx";
import {handle_emit, return_empty} from './AuctionUtils.tsx';

export const CreateAuction: FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const wallet_context = useWallet();
  const {tokens, isLoading} = useFetchTokens();
  const [auction, setAuction] = useState<t_auction>(return_empty());
  const toast = useToast();
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("submiting");
    if (!auction.token) {
      toast({
        title: "Error Auction",
        description: "You need to choose a token",
        status: "error",
        duration: 5000,
        isClosable: true
      });
      return;
    }
    auction.image_data = file;
    await handle_emit(auction, wallet_context, toast);
    setAuction(return_empty());
    setFile(null);
  };

  if (isLoading) return (<div> Loading... </div>);
  return (
    <Box borderWidth="1px" borderRadius="lg" boxShadow="lg" marginTop="60px" backgroundColor="gray.200" width="150%"
         marginX="auto" padding="6">
      <form onSubmit={handleSubmit}>
        <AuctionFormFields auction={auction} setAuction={setAuction} setFile={setFile} tokens={tokens}/>
        <Button type="submit" colorScheme="purple" width="full" marginTop="1rem">
          Submit
        </Button>
      </form>
    </Box>
  );
};  
