<script setup lang="ts">
import {mixed, number, object, string} from 'yup';
import {useWallet} from 'solana-wallets-vue';

const {wallet} = useWallet();

const isLoading = ref(false);
const isOpenToken = ref(false);
const isOpenNft = ref(false);
const selectedToken = ref<t_token | null>(null);
const selectedNft = ref<unknown | null>(null);
const file_path = ref<string>();
const form = reactive({
  file: undefined,
  name: '',
  description: '',
  price: 0,
});
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
  const idListing = await handleCreateListing(
    form,
    selectedToken.value,
    selectedNft.value ? selectedNft.value.id : null,
    isLoading,
  );
  navigateTo(`/listing/${idListing}`)
};
const handleFileChange = (files: FileList) => {
  if (files.length === 0) return;
  form.file = files[0] as unknown as undefined;
};
const onTokenClick = () => {
  isOpenToken.value = true;
  selectedToken.value = null;
};
const onNftClick = () => {
  isOpenNft.value = true;
  selectedNft.value = null;
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
              :is-open="isOpenToken"
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
          label="PrevNft"
          name="PrevNft"
          description="If you have a NFT from the previous sale (Not required if it's the first sale)"
          class="mb-6 border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:ring-1"
        >
          <UButton
            label="Choose a Nft"
            class="text-indigo-500 hover:text-indigo-700"
            @click="onNftClick"
          />
          <div v-if="!selectedNft">
            <ListNft
              :owner-address="wallet.adapter.publicKey?.toString()"
              :is-open="isOpenNft"
              :selected-nft="selectedNft"
              :upadte-selected-nft="(nft) => (selectedNft = nft)"
            />
          </div>
          <div v-else>
            <span class="text-indigo-500 font-medium">Nft choosed: {{ selectedNft.id }} </span>
          </div>
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
