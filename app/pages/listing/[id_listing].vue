<script lang="ts" setup>
import {Connection, PublicKey} from '@solana/web3.js';
import {validateTransfer} from '@solana/pay';
import {FindReferenceError} from '~/composables/findReference';
import BigNumber from 'bignumber.js';
import {useWallet} from 'solana-wallets-vue';

const wallet = useWallet();
const toast = useToast();
const route = useRoute();
const config = useRuntimeConfig();
const recipient = new PublicKey(config.public.RECIPIENT_PUBLIC_KEY);
const isBuying = ref(false);
const statusBuy = ref('');
const {
  data: listing,
  pending,
  error,
} = await useFetch(`/api/fetch-single-listing/`, {
  method: 'POST',
  body: JSON.stringify({id: route.params.id_listing}),
});

const pollForSignature = async (connection: Connection, reference: PublicKey) => {
  for (let i = 0; i < 60; i++) {
    try {
      return await findReference(connection, reference, 'finalized');
    } catch (e) {
      if (e instanceof FindReferenceError) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        continue;
      }
      throw e;
    }
  }
  return null;
};

const handleBuy = async () => {
  try {
    isBuying.value = true;
    statusBuy.value = 'generatingQR';
    const {qr_code, reference} = await GenerateQRCode(listing.value as t_listing, recipient);
    statusBuy.value = 'generatedQR';
    await nextTick();
    qr_code.append(document.getElementById('qr-code') as HTMLElement | undefined);
    const connection = new Connection(config.public.SOLANA_DEVNET_RPC, 'confirmed');
    const signatureInfo = await pollForSignature(connection, reference);
    if (!signatureInfo) throw new Error('Payment not confirmed');

    await validateTransfer(connection, signatureInfo?.signature as string, {
      recipient,
      amount: new BigNumber(listing.value?.price as number),
      splToken: new PublicKey(listing.value?.token.address),
      reference,
      memo: 'TOTO',
    });
    statusBuy.value = 'paymentConfirmed';
    await $fetch('/api/close-listing', {
      method: 'POST',
      body: JSON.stringify({
        id: listing.value?.id,
        buyer: wallet.publicKey.value?.toString(),
      }),
    });
    statusBuy.value = 'itemSold';
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
    statusBuy.value = '';
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
          <UButton
            class="buy-button"
            label="Buy This Item"
            :disabled="listing?.buyer !== null"
            @click="handleBuy"
          />
          <UModal v-model="isBuying">
            <UCard class="p-4">
              <div class="card-header">
                <div class="card-title">Buying this item...</div>
                <div v-if="wallet === null">Please Connect your wallet first</div>
                <div v-else-if="statusBuy === 'generatingQR'">
                  Please wait till we generate the QR code for you
                </div>
                <div v-else-if="statusBuy === 'generatedQR'" id="qr-code" />
                <div v-else>Payement confirmed!</div>
              </div>
            </UCard>
          </UModal>
        </FullListing>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  max-width: 50rem; /* 800px assuming base font size is 16px */
  margin: auto;
  box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.1);
  border-radius: 1rem;
  overflow: hidden;
}

.card img {
  width: 100%;
  object-fit: cover;
  height: auto;
}

.card-header {
  padding: 1rem;
  background: #f8f8f8;
}

.card-title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.buy-button {
  font-size: 1rem;
  padding: 0.5rem 1rem;
  background-color: #0055ff;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.buy-button:hover {
  background-color: #0033aa;
}

/* Responsive adjustments */
@media (max-width: 48em) {
  /* 768px */
  .card {
    border-radius: 0;
  }

  .card-header,
  .card-footer {
    padding: 0.75rem;
  }

  .card-title {
    font-size: 1.25rem;
  }

  .card-price {
    font-size: 1rem;
  }
}
</style>
