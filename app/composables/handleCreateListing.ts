import {useWallet} from 'solana-wallets-vue';

interface t_form {
  file: File | undefined;
  name: string;
  description: string;
  price: number;
}

const uploadingImage = async (file: File): Promise<string> => {
  const ImageData = new FormData();
  ImageData.append('file', file);
  const ipfs_answer = await $fetch('/api/upload-file-ipfs', {
    method: 'POST',
    body: ImageData,
  });
  return ipfs_answer;
};

export const handleCreateListing = async (
  form: t_form,
  selectedToken: t_token | null,
  prevListingAddress: string | null,
  isLoading: Ref<boolean>,
): Promise<string> => {
  const toast = useToast();
<<<<<<< HEAD:app/utils/handleCreateListing.ts
=======
  const {wallet} = useWallet();
  isLoading.value = true;
>>>>>>> parent of 16e3941 (use arwaeve, working implementation user):app/composables/handleCreateListing.ts
  try {
    const {wallet} = useWallet();
    const pub_key = wallet.value?.adapter.publicKey;
    if (!pub_key) throw new Error('Wallet not connected');
    const listing: t_listing = {
      name: form.name,
      description: form.description,
      seller: pub_key.toString(),
      ipfs_hash: '',
      //if user choose solana token, we set the token info to null
      token: selectedToken?.address === 'SOL' ? null : selectedToken,
      price: form.price,
      buyer: null,
      id: '0',
      created_at: '0',
      nftAddress: '',
    };
    listing.ipfs_hash = await uploadingImage(form.file as File);
    const res = await $fetch('/api/listing/create', {
      method: 'POST',
      body: {listing, prevListingAddress},
    });
    toast.add({
      id: 'success-notification',
      title: 'Listing Created !',
      description: 'Your listing has been created successfully with id: ' + res,
      icon: 'i-material-symbols-check-circle-outline',
      color: 'green',
    });
    console.log('Listing created');
    return res;
  } catch (e) {
    const error = e as Error;
    toast.add({
      id: 'error-notification',
      title: 'An error occurred while creating the listing',
      description: error.message,
      icon: '',
      color: 'red',
    });
  } finally {
    isLoading.value = false;
  }
};
