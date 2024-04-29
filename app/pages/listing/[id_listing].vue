<script lang="ts" setup>
import {useWallet} from 'solana-wallets-vue';

enum StatusBuy {
  waitingUserInput = 'waitingUserInput',
  GeneratingQR = 'generatingQR',
  GeneratedQR = 'generatedQR',
  PaymentConfirmed = 'paymentConfirmed',
  ItemSold = 'itemSold',
}

const wallet = useWallet(); //user wallet
const toast = useToast(); //toast notification
const route = useRoute(); //route params
const config = useRuntimeConfig();
const isBuying = ref(false); // boolean to check if the user is in the process of buying
const statusBuy = ref<StatusBuy>(StatusBuy.waitingUserInput); // status of the buy process
const {
  data: listing,
  pending,
  error,
} = await useFetch(`/api/listing/fetch-single`, {
  method: 'POST',
  body: JSON.stringify({id: route.params.id_listing}),
});

const handleBuy = async () => {
  try {
    isBuying.value = true;
    statusBuy.value = StatusBuy.GeneratingQR;
    const {qr_code, referenceAddress} = await GenerateQRCode(
      listing.value as t_listing,
      config.public.RECIPIENT_PUBLIC_KEY,
    );
    statusBuy.value = StatusBuy.GeneratedQR;
    await nextTick();
    qr_code.append(document.getElementById('qr-code') as HTMLElement | undefined);
    await $fetch('/api/wait-payement', {
      method: 'POST',
      body: {
        referenceAddress,
        recipientAddress: config.public.RECIPIENT_PUBLIC_KEY,
        listing: listing.value,
      },
    });
    statusBuy.value = StatusBuy.PaymentConfirmed;
    await $fetch('/api/listing/close', {
      method: 'POST',
      body: JSON.stringify({
        id: listing.value?.id,
        buyer: wallet.publicKey.value,
      }),
    });
    statusBuy.value = StatusBuy.ItemSold;
    toast.add({
      id: 'success-notification',
      title: 'Payment confirmed',
      description: 'The payment has been confirmed',
      icon: '',
      color: 'green',
    });
    console.log('Item sold');
  } catch (e) {
    const error = e as Error;
    toast.add({
      id: 'error-notification',
      title: 'An error occurred during the payement',
      description: error.message,
      icon: '',
      color: 'red',
    });
    throw error;
  } finally {
    isBuying.value = false;
    statusBuy.value = StatusBuy.waitingUserInput;
  }
};
</script>

<template>
  <div>
    <div class="card">
      <div v-if="pending">Loading...</div>
      <div v-else-if="error">Error fetching listing: {{ error.message }}</div>
      <div v-else>
        <FullListing :listing="listing as t_listing">
          <div v-if="listing?.buyer != null">This item has already been sold.</div>
          <div v-else>
            <UButton
              class="buy-button rounded-full"
              label="Buy This Item"
              :disabled="listing?.buyer != null"
              @click="handleBuy"
            />
          </div>
          <UModal v-model="isBuying">
            <UCard class="p-4">
              <div class="card-header">
                <div class="card-title">Buying this item...</div>
                <div v-if="wallet === null">Please Connect your wallet first</div>
                <div v-else-if="statusBuy === StatusBuy.GeneratingQR">
                  Please wait till we generate the QR code for you
                </div>
                <div v-else-if="statusBuy === StatusBuy.GeneratedQR" id="qr-code" />
                <div v-else>Payement confirmed!</div>
              </div>
            </UCard>
          </UModal>
        </FullListing>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
