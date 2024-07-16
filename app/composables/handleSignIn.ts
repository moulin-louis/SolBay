import {useWallet} from 'solana-wallets-vue';
import {getRandomValues} from 'crypto';

export const handleSignIn = async (isSignedIn: Ref<boolean>): Promise<void> => {
  const toast = useToast();
  try {
    const wallet = useWallet();
    if (!wallet.ready.value || !wallet.signMessage.value) throw new Error('Wallet not ready');
    const salt = new Uint8Array(32); //need to switch this ligne and the next to the backend
    getRandomValues(salt);
    const encodeMessage = new TextEncoder().encode(`authenticate your SolBay profile: ${salt}`);
    const signedMessage = await wallet.signMessage.value(encodeMessage);
    const formData = new FormData();
    formData.append('encodeMessage', new Blob([encodeMessage]));
    formData.append('signedMessage', new Blob([signedMessage]));
    formData.append('publicKey', wallet.publicKey.value?.toString() as string);
    await $fetch('/api/user/verify-message', {
      method: 'POST',
      body: formData,
    });
    //$fetch will throw an Error if its not ok (i think ?)
    isSignedIn.value = true;
    toast.add({
      id: 'success-notification',
      title: 'Success',
      description: 'You are now signed in',
      icon: 'i-material-symbols-check-circle-outline',
      color: 'green',
    });
  } catch (error) {
    toast.add({
      id: 'error-notification',
      title: 'Error',
      description: 'An error occured while signing in',
      color: 'red',
    });
  }
};
