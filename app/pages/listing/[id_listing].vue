<script lang="ts" setup>
import {Connection, PublicKey} from '@solana/web3.js';
import {validateTransfer} from '@solana/pay';
import {FindReferenceError} from '~/composables/findReference';
import BigNumber from 'bignumber.js';
import type QRCodeStyling from '@solana/qr-code-styling';

const toast = useToast();
const route = useRoute();
const {
  data: listing,
  pending,
  error,
} = await useFetch(`/api/fetch-listing/`, {
  method: 'POST',
  body: JSON.stringify({id: route.params.id_listing}),
});
const isBuying = ref(false);
const statusBuy = ref('');

const handleBuy = async () => {
  try {
    const config = useRuntimeConfig();
    const recipient = new PublicKey(config.public.RECIPIENT_PUBLIC_KEY);
    isBuying.value = true;
    statusBuy.value = 'generatingQR';
    const {qr_code, reference} = await GenerateQRCode(
      listing.value?.data as unknown as t_listing,
      recipient,
    );
    statusBuy.value = 'generatedQR';
    await nextTick();
    const element = document.getElementById('qr-code');
    qr_code.append(element);
    const connection = new Connection(
      'https://devnet.helius-rpc.com/?api-key=6b2cf5f2-8b84-4b77-8936-8307eda261ce',
      'confirmed',
    );
    let signatureInfo = null;
    for (let i = 0; i < 60; i++) {
      try {
        signatureInfo = await findReference(connection, reference, 'finalized');
        break;
      } catch (e) {
        if (e instanceof FindReferenceError) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          continue;
        }
        throw e;
      }
    }
    await validateTransfer(connection, signatureInfo?.signature as string, {
      recipient,
      amount: new BigNumber(listing.value?.data.price),
      reference,
      memo: 'TOTO',
    });
    statusBuy.value = 'paymentConfirmed';
    toast.add({
      id: 'success-notification',
      title: 'Payment confirmed',
      description: 'The payment has been confirmed',
      icon: '',
      color: 'green',
    });
  } catch (e) {
    const error = e as Error;
    toast.add({
      id: 'error-notification',
      title: 'An error occurred during the payement',
      description: error.message,
      icon: '',
      color: 'red',
    });
  } finally {
    isBuying.value = false;
    statusBuy.value = '';
  }
};
</script>

<template>
  <div class="card">
    <div v-if="pending">Loading...</div>
    <div v-else-if="error">Error fetching listing: {{ error.message }}</div>
    <div v-else>
      <UCard>
        <template #header>
          <div class="card-header">
            <img :src="getImgLink(listing?.data)" />
          </div>
        </template>
        <div class="card-content">
          <div class="card-title">Name: {{ listing.data.name }}</div>
          <UDivider type="dashed" size="sm" />
          <div class="card-description">
            {{ listing.data.description }}
          </div>
        </div>
        <template #footer>
          <div class="card-footer">
            <div>
              <div class="listing-price">Price: ${{ listing.data.price }}</div>
            </div>
          </div>
          <UButton
            class="buy-button"
            @click="handleBuy"
            label="Buy This Item"
          />
        </template>
      </UCard>
    </div>
  </div>
  <UModal v-model="isBuying">
    <UCard class="p-4">
      <div class="card-header">
        <div class="card-title">Buying: {{ listing.data.name }}</div>
        <div v-if="statusBuy === 'generatingQR'">
          Please wait till we generate the QR code for you
        </div>
        <div v-else-if="statusBuy === 'generatedQR'" id="qr-code" />
        <div v-else>Payement confirmed!</div>
      </div>
    </UCard>
  </UModal>
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

.card-header,
.card-footer {
  padding: 1rem;
  background: #f8f8f8;
}

.card-content {
  padding: 1rem;
}

.card-title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.card-description {
  font-size: 1rem;
  color: #666;
  margin-bottom: 1rem;
}

.card-price {
  font-size: 1.25rem;
  font-weight: bold;
  color: #333;
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
