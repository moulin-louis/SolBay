import {useWallet} from 'solana-wallets-vue';

export const handleCreateListing = async (
  form: t_form,
  selectedToken: t_token | null,
  prevListingAddress: string | null,
): Promise<string> => {
  let idRes = '';
  const toast = useToast();
  try {
    const {wallet} = useWallet();
    const pub_key = wallet.value?.adapter.publicKey;
    if (!pub_key) throw new Error('Wallet not connected');
    const listing: t_listing = {
      name: form.name,
      description: form.description,
      seller: pub_key.toString(),
      token: selectedToken?.address === 'SOL' ? null : selectedToken,
      price: form.price,
      buyer: null,
      id: '0',
      created_at: '0',
      nftAddress: '',
      imageUri: '',
    };
    const listingData = new FormData();
    listingData.append('file', form.file, 'listing-image');
    listingData.append('listing', JSON.stringify(listing));
    listingData.append('prevListingAddress', prevListingAddress || '');
    const res = await $fetch('/api/listing/create', {
      method: 'POST',
      body: listingData,
    });
    toast.add({
      id: 'success-notification',
      title: 'Listing Created !',
      description: 'Your listing has been created successfully with id: ' + res,
      icon: 'i-material-symbols-check-circle-outline',
      color: 'green',
    });
    console.log('Listing created');
    idRes = res;
  } catch (e) {
    const error = e as Error;
    toast.add({
      id: 'error-notification',
      title: 'An error occurred while creating the listing',
      description: error.message,
      icon: '',
      color: 'red',
    });
    console.log('Error creating listing: ', error.message);
  }
  return idRes;
};
