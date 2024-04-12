import {FC} from 'react';
import {Box, Image, Stack, Heading, Text, Divider, Button, Card, CardBody, CardFooter} from '@chakra-ui/react';

// Define the type for auction data
interface Auction {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  price: number;
  highestBid: number;
}

// Sample auction data
const myAuctions: Auction[] = [
  {
    id: '1',
    title: 'Auction 1',
    description: 'This is auction 1',
    imageUrl: 'https://via.placeholder.com/150',
    price: 100,
    highestBid: 100,
  },
];

const myBids: Auction[] = [
  {
    id: '1',
    title: 'Auction 1',
    description: 'This is auction 1',
    imageUrl: 'https://via.placeholder.com/150',
    price: 100,
    highestBid: 100,
  },
];

const mySells: Auction[] = [
  {
    id: '1',
    title: 'Auction 1',
    description: 'This is auction 1',
    imageUrl: 'https://via.placeholder.com/150',
    price: 100,
    highestBid: 100,
  },
];

export const Profile: FC = () => {
  return (
    <Box padding="5">
      <Heading>My Auctions</Heading>
      {myAuctions.map((auction) => (
        <Card key={auction.id} m={4}>
          <Image
            objectFit='cover'
            maxW={{base: '100%', sm: '200px'}}
            src={auction.imageUrl}
            alt={auction.title}
          />
          <Stack>
            <CardBody>
              <Heading size='md'>{auction.title}</Heading>
              <Text>ID: {auction.id}</Text>
              <Text>{auction.description}</Text>
              <Text color='blue.600' fontSize='2xl'>
                Price: ${auction.price}
              </Text>
            </CardBody>
            <CardFooter>
              <Button variant='solid' colorScheme='blue'>
                View Auction
              </Button>
            </CardFooter>
          </Stack>
        </Card>
      ))}

      <Divider/>

      <Heading>My Bids</Heading>
      {myBids.map((bid) => (
        <Card key={bid.id} m={4}>
          <Image
            objectFit='cover'
            maxW={{base: '100%', sm: '200px'}}
            src={bid.imageUrl}
            alt={bid.title}
          />
          <Stack>
            <CardBody>
              <Heading size='md'>{bid.title}</Heading>
              <Text>ID: {bid.id}</Text>
              <Text>{bid.description}</Text>
              <Text color='blue.600' fontSize='2xl'>
                Highest Bid: ${bid.highestBid}
              </Text>
            </CardBody>
            <CardFooter>
              <Button variant='solid' colorScheme='blue'>
                View Bid
              </Button>
            </CardFooter>
          </Stack>
        </Card>
      ))}

      <Divider/>

      <Heading>My Sells</Heading>
      {mySells.map((sell) => (
        <Card key={sell.id} m={4}>
          <Image
            objectFit='cover'
            maxW={{base: '100%', sm: '200px'}}
            src={sell.imageUrl}
            alt={sell.title}
          />
          <Stack>
            <CardBody>
              <Heading size='md'>{sell.title}</Heading>
              <Text>ID: {sell.id}</Text>
              <Text>{sell.description}</Text>
              <Text color='blue.600' fontSize='2xl'>
                Price: ${sell.price}
              </Text>
            </CardBody>
            <CardFooter>
              <Button variant='solid' colorScheme='blue'>
                View Sell
              </Button>
            </CardFooter>
          </Stack>
        </Card>
      ))}
    </Box>
  );
};
