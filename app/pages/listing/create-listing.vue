<script setup lang="ts">
import {mixed, number, object, string} from 'yup';
import {useWallet} from 'solana-wallets-vue';
import {PublicKey} from '@solana/web3.js';

const isLoading = ref(false);
const isOpen = ref(false);
const {wallet} = useWallet();
const toast = useToast();
const selectedToken = ref<t_token | null>(null);
const form = reactive({
  file: undefined,
  name: '',
  description: '',
  price: 0,
  prevListingAddress: '',
});
const file_path = ref<string>();
const schema = object({
  file: mixed()
    .test(
      'fileType',
      'Please provide a valid image file',
      (value) => !value || (value && ['image/jpeg', 'image/png'].includes(value.type)),
    )
    .required(),
  name: string().max(50, 'Name must be less than 50 characters').required(),
  description: string().required(),
  price: number().required(),
});

const onSubmit = async () => {
  if (form.prevListingAddress) {
    try {
      if (form.prevListingAddress.length !== 44) throw new Error('Invalid Lenght address');
      new PublicKey(form.prevListingAddress);
    } catch (error) {
      toast.add({
        id: 'error',
        title: 'Error',
        description: 'Please provide a valid previous listing address',
      });
      return;
    }
  }
  console.log('creation listing...');
  await handleCreateListing(form, selectedToken.value, form.prevListingAddress, isLoading);
};
const handleFileChange = (files: FileList) => {
  if (files.length === 0) return;
  form.file = files[0] as unknown as undefined;
};
const onTokenClick = () => {
  isOpen.value = true;
  selectedToken.value = null;
};
</script>

<template>
  <div class="flex flex-col items-center justify-center space-y-8">
    <div v-if="wallet === null" class="text-red-500">
      Please connect your wallet to create a listing
    </div>
    <div v-else class="rounded-lg shadow-md px-8 py-6 w-full max-w-md border border-gray-700">
      <UForm :schema="schema" :state="form" @submit="onSubmit">
        <UFormGroup label="File" name="file" description="Image of your product" class="mb-6">
          <UInput
            v-model="file_path"
            placeholder="Upload a file"
            type="file"
            class="w-full rounded-md border border-gray-700 px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:ring-1"
            @change="handleFileChange($event)"
          />
        </UFormGroup>
        <UFormGroup label="Name" name="name" description="Name for your listing" class="mb-6">
          <UInput
            v-model="form.name"
            placeholder="Listing Name"
            class="w-full rounded-md border border-gray-700 px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:ring-1"
          />
        </UFormGroup>
        <UFormGroup
          label="Description"
          name="description"
          description="A little description for your listing"
          class="mb-6"
        >
          <UInput
            v-model="form.description"
            placeholder="Listing description"
            class="w-full rounded-md border border-gray-700 px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:ring-1"
          />
        </UFormGroup>
        <UFormGroup
          label="Token"
          name="token"
          description="The token you want to sell your listing in"
          class="mb-6 border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:ring-1"
        >
          <UButton
            label="Choose a Token"
            class="text-indigo-500 hover:text-indigo-700"
            @click="onTokenClick"
          />
          <div v-if="!selectedToken">
            <ListToken
              :is-open="isOpen"
              :selected-token="selectedToken"
              :upadte-selected-token="(token: t_token | null) => (selectedToken = token)"
            />
          </div>
          <div v-else>
            <span class="text-indigo-500 font-medium"
              >Token choosed: {{ selectedToken.name }} : $ {{ selectedToken.symbol }}</span
            >
          </div>
        </UFormGroup>
        <UFormGroup
          label="Price"
          name="price"
          description="The sell price in token of your listing"
          class="mb-6"
        >
          <UInput
            v-model="form.price"
            placeholder="Minimum price (in tokens)"
            class="w-full rounded-md border border-gray-700 px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:ring-1"
          />
        </UFormGroup>
        <UFormGroup
          label="Previous Listing"
          name="prev_listing"
          description="Did you buy this item from another listing?"
          class="mb-6"
        >
          <UInput
            v-model="form.prevListingAddress"
            placeholder="Previous listing"
            class="w-full rounded-md border border-gray-700 px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:ring-1"
          />
        </UFormGroup>
        <UButton
          type="submit"
          block
          :disabled="isLoading"
          :loading="isLoading"
          class="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-700"
        >
          {{ isLoading ? 'Loading...' : 'Submit' }}
        </UButton>
      </UForm>
    </div>
  </div>
</template>

<style scoped></style>
