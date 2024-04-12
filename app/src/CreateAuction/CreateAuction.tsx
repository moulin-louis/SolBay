import {FC, FormEvent, useState} from 'react';
import {Formik, Form} from "formik";
import {Box, Button, useToast} from '@chakra-ui/react';
import {useWallet} from "@solana/wallet-adapter-react";
import * as Yup from 'yup';
import {t_auction} from "../Auction/Auction.tsx";
import {useFetchTokens} from "./FetchToken.tsx";
import {AuctionFormFields} from "./AuctionFormFields.tsx";
import {handle_emit, return_empty} from './AuctionUtils.tsx';

const AuctionSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  description: Yup.string().required('Description is required'),
  min_price: Yup.number().min(0, 'Minimum price must be greater than or equal to 0').required('Minimum price is required'),
  end_date: Yup.date().required('End date is required')
});

export const CreateAuction: FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const {tokens, isLoading} = useFetchTokens();
  const [auction, setAuction] = useState<t_auction>(return_empty());
  const toast = useToast();
  const handleSubmit = async (e: FormEvent, {setSubmitting}) => {
    setSubmitting(true);
    if (!auction.token) {
      toast({
        title: "Error Auction",
        description: "You need to choose a token",
        status: "error",
        duration: 5000,
        isClosable: true
      });
      setSubmitting(false);
      return
    }
    if (file)
      auction.image_data = file;
    await handle_emit(auction, toast);
    setAuction(return_empty());
    setSubmitting(false);
    setFile(null);
  };

  if (isLoading) return (<div> Loading... </div>);
  return (
    <Box borderWidth="1px" borderRadius="lg" boxShadow="lg" marginTop="60px" backgroundColor="gray.200" width="150%"
         marginX="auto" padding="6">
      <Formik
        initialValues={{
          image_path: '',
          name: '',
          description: '',
          min_price: '',
          end_date: '',
        }}
        validationSchema={AuctionSchema}
        onSubmit={handleSubmit}
      >
        {(formikProps) => (
          <Form>
            <AuctionFormFields {...formikProps} auction={auction} setAuction={setAuction} setFile={setFile} tokens={tokens}/>
            <Button type="submit" colorScheme="purple" width="full" marginTop="1rem" isLoading={formikProps.isSubmitting}>
              Submit
            </Button>
          </Form>
        )}
      </Formik>
    </Box>
  );
};  
