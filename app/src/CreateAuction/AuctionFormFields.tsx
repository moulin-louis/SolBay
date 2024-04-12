// AuctionFormFields.jsx
import React, {FC} from 'react';
import {Field, FormikProps} from "formik";
import {Box, FormControl, FormLabel} from '@chakra-ui/react';
import {ListToken} from "./ListToken.tsx";
import {t_auction} from "../Auction/Auction";
import {t_token} from "./FetchToken.tsx";

interface AuctionFormFieldsProps extends FormikProps<t_auction> {
  auction: t_auction;
  setAuction: React.Dispatch<React.SetStateAction<t_auction>>;
  setFile: React.Dispatch<React.SetStateAction<File | null>>,
  tokens: t_token[];
}

export const AuctionFormFields: FC<AuctionFormFieldsProps> = ({
                                                                setFieldValue,
                                                                errors,
                                                                touched,
                                                                auction,
                                                                setAuction,
                                                                setFile,
                                                                tokens
                                                              }) => {
  const handleSelectToken = (token: t_token) => {
    setAuction(prev => ({...prev, token: token}));
  };
  return (
    <>
      <Field name="image_data">
        {({form}) => (
          <FormControl isRequired marginBottom="1.5rem">
            <FormLabel>Image</FormLabel>
            <input
              id="image_data"
              name="image_data"
              type="file"
              onChange={(event) => {
                const file = event.currentTarget.files ? event.currentTarget.files[0] : null;
                if (file)
                  setFile(file); // Setting file to state for later use
                setFieldValue("image_path", event.currentTarget.value); // Keeping this in case you need the path in the form
              }}
            />
          </FormControl>
        )}
      </Field>

      <Field name="name" isRequired>
        {({field}) => (
          <FormControl isRequired marginBottom="1.5rem">
            <FormLabel>Name</FormLabel>
            <input {...field} id="name" type="text"/>
            {touched.name && errors.name ? (
              <div>{errors.name}</div>
            ) : null}
          </FormControl>
        )}
      </Field>
      <Field name="description">
        {({field}) => (
          <FormControl isRequired marginBottom="1.5rem">
            <FormLabel>Description</FormLabel>
            <input {...field} id="description" type="text"/>
            {touched.description && errors.description ? (
              <div>{errors.description}</div>
            ) : null}
          </FormControl>
        )}
      </Field>
      {auction.token ? (
        <Box marginBottom="1.5rem">You chose {auction.token.name}</Box>
      ) : (
        <ListToken tokens={tokens} onSelectToken={handleSelectToken}/>
      )}
      <Field name="min_price">
        {({field}) => (
          <FormControl isRequired marginBottom="1.5rem">
            <FormLabel>Minimum Price</FormLabel>
            <input {...field} id="min_price" type="number"/>
            {touched.min_price && errors.min_price ? (
              <div>{errors.min_price}</div>
            ) : null}
          </FormControl>
        )}
      </Field>
      <Field name="end_date">
        {({field}) => (
          <FormControl isRequired marginBottom="1.5rem">
            <FormLabel>End Date</FormLabel>
            <input {...field} id="end_date" name="end_date" type="datetime-local"/>
            {touched.end_date && errors.end_date ? (
              <div>{errors.end_date}</div>
            ) : null}
          </FormControl>
        )}
      </Field>
    </>
  );
};

export default AuctionFormFields;