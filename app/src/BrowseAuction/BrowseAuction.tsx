import {FC} from 'react';
import {Box, Image, Stack, Heading, Text, Divider, ButtonGroup, Button} from '@chakra-ui/react';
import {t_token} from "../CreateAuction/FetchToken.tsx";
import {useFetchAuctions} from "./FetchAuctions.tsx";
import {t_auction} from "../Auction/Auction.tsx";

const get_image = (auction: t_auction): string => {
  const ipfsGateway: string = 'https://ipfs.io/ipfs/';
  console.log('ipfs_link = ', ipfsGateway + auction.ipfs_hash + '?filename=' + auction.ipfs_hash);
  return ipfsGateway + auction.ipfs_hash + '?filename=' + auction.ipfs_hash;
}

export const BrowseAuction: FC = () => {

  const auctions = useFetchAuctions();
  const print_token = (token: t_token): string => {
    if (token.symbol.includes("$"))
      return token.symbol;
    else
      return "$" + token.symbol;
  };

  if (auctions.length === 0) {
    return (
      <Box>
        <Heading size='md'>No Auctions available</Heading>
      </Box>);
  }
  return (
    <Box padding="5" display="flex" flexDirection="row" flexWrap="wrap" justifyContent="space-around">
      {auctions.map((auction) => (
        <Box maxW='sm' boxShadow='lg' borderRadius='lg' overflow='hidden' m={4}>
          <Image src={get_image(auction)}/>
          <Stack mt='6' spacing='3' p='5'>
            <Heading size='md'>{auction.name}</Heading>
            <Text>{auction.name}</Text>
          </Stack>
          <Divider/>
          <Box p='5'>
            <ButtonGroup spacing='2'>
              <Button variant='solid' colorScheme='blue'>
                Place a bid
              </Button>
            </ButtonGroup>
          </Box>
        </Box>
      ))}
      <div className="background">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </Box>
  );
};
