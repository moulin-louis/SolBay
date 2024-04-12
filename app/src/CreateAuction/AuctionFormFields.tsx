import {ChangeEvent} from 'react';
import {Box, FormControl, FormHelperText, FormLabel, Input} from '@chakra-ui/react';
import {ListToken} from "./ListToken.tsx";
import {t_token} from "./FetchToken.tsx";

export const AuctionFormFields = ({
                                    auction,
                                    setAuction,
                                    setFile,
                                    tokens
                                  }) => {

  const handleSelectToken = (token: t_token) => {
    setAuction(prev => ({...prev, token: token}));
  };
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    setAuction(prev => ({...prev, [name]: value}));
    if (name === 'image_path' && e.target.files) {
      setFile(e.target.files[0]);
      auction.image_data = e.target.files[0];
      auction.image_path = e.target.value;
    }
  };
  return (
    <>
      <Box textAlign="center" marginBottom="1rem">
        <h1>Create Auction</h1>
      </Box>
      <FormControl isRequired marginBottom="1.5rem">
        <FormLabel>Image</FormLabel>
        <Input
          name="image_path"
          value={auction.image_path}
          onChange={handleChange}
          type="file"
          boxShadow="inset 2px 2px 5px #BABECC, inset -5px -5px 10px #FFF"
        />
      </FormControl>
      <FormControl isRequired marginBottom="1.5rem">
        <FormLabel>Auction Name</FormLabel>
        <Input
          name="name"
          value={auction.name}
          onChange={handleChange}
          type="text"
          boxShadow="inset 2px 2px 5px #BABECC, inset -5px -5px 10px #FFF"
        />
        <FormHelperText>Enter the name of your auction</FormHelperText>
      </FormControl>
      <FormControl isRequired marginBottom="1.5rem">
        <FormLabel>Description</FormLabel>
        <Input
          name="description"
          value={auction.description}
          onChange={handleChange}
          type="text"
          boxShadow="inset 2px 2px 5px #BABECC, inset -5px -5px 10px #FFF"
        />
        <FormHelperText>Enter the description of your auction</FormHelperText>
      </FormControl>
      {auction.token ? (
        <Box marginBottom="1.5rem">
          You choose {auction.token.name}
        </Box>
      ) : (
        <ListToken tokens={tokens} onSelectToken={handleSelectToken}/>
      )}
      <FormControl isRequired marginBottom="1.5rem">
        <FormLabel>Minimun Price</FormLabel>
        <Input
          name="min_price"
          value={auction.min_price}
          onChange={handleChange}
          type="number"
          boxShadow="inset 2px 2px 5px #BABECC, inset -5px -5px 10px #FFF"
        />
        <FormHelperText>Price of the auction</FormHelperText>
      </FormControl>
      <FormControl isRequired marginBottom="1.5rem">
        <FormLabel>End Date</FormLabel>
        <Input
          name="end_date"
          value={auction.end_date}
          onChange={handleChange}
          type="datetime-local"
          boxShadow="inset 2px 2px 5px #BABECC, inset -5px -5px 10px #FFF"
        />
        <FormHelperText>Submit Auction</FormHelperText>
      </FormControl>
    </>
  );
};