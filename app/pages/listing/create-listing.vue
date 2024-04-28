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
  <div>
    <div v-if="wallet === null">Please connect your wallet to create a listing</div>
    <div v-else class="form-wrapper">
      <UForm :schema="schema" :state="form" class="form-container" @submit="onSubmit">
        <UFormGroup label="File" name="file" description="Image of your product" class="form-group">
          <UInput
            v-model="file_path"
            variant="outline"
            size="md"
            placeholder="Upload a file"
            type="file"
            @change="handleFileChange($event)"
          />
        </UFormGroup>
        <UFormGroup label="Name" name="name" description="Name for your listing" class="form-group">
          <UInput v-model="form.name" size="md" variant="outline" placeholder="Listing Name" />
        </UFormGroup>
        <UFormGroup
          label="Description"
          name="description"
          description="A little description for your listing"
          class="form-group"
        >
          <UInput
            v-model="form.description"
            size="md"
            variant="outline"
            placeholder="Listing description"
          />
        </UFormGroup>
        <UFormGroup
          label="Token"
          name="token"
          description="The token you want to sell your listing in"
          class="form-group"
        >
          <UButton label="Choose a Token" @click="onTokenClick" />
          <div v-if="!selectedToken">
            <ListToken
              :is-open="isOpen"
              :selected-token="selectedToken"
              :upadte-selected-token="(token: t_token | null) => (selectedToken = token)"
            />
          </div>
          <div v-else>
            <span class="selected-token"
              >Token choosed: {{ selectedToken.name }} : $ {{ selectedToken.symbol }}</span
            >
          </div>
        </UFormGroup>
        <UFormGroup
          label="Price"
          name="price"
          description="The sell price in token of your listing"
          class="form-group"
        >
          <UInput
            v-model="form.price"
            size="md"
            variant="outline"
            placeholder="Minimum price (in tokens)"
          />
        </UFormGroup>
        <UFormGroup
          label="Previous Listing"
          name="prev_listing"
          description="Did you buy this item from another listing?"
          class="form-group"
        >
          <UInput
            v-model="form.prevListingAddress"
            size="md"
            variant="outline"
            placeholder="Previous listing"
          />
        </UFormGroup>
        <UButton
          type="submit"
          icon="i-heroicons-pencil-square"
          color="primary"
          variant="solid"
          size="md"
          :ui="{rounded: 'rounded-full'}"
          block
          :disabled="isLoading"
          :loading="isLoading"
        >
          {{ isLoading ? 'Loading...' : 'Submit' }}
        </UButton>
      </UForm>
    </div>
  </div>
</template>

<style scoped>
.form-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f0f0f0;
}
.form-container {
  display: flex;
  flex-direction: column;
  padding: 2rem;
  border-radius: 0.5rem;
  background: #ffffff;
  box-shadow: 0 0.25rem 0.375rem rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 37.5rem;
}
.form-group {
  margin-bottom: 1.25rem;
  width: 100%;
}
.selected-token {
  background-color: #f0f0f0;
  font-weight: bold;
}

/* Styles for dark theme */
@media (prefers-color-scheme: dark) {
  .form-wrapper {
    background-color: #333; /* Darker background for the form wrapper */
  }
  .form-container {
    background: #222; /* Dark background for the form container */
    color: #fff; /* Light text for readability in dark mode */
    box-shadow: 0 0.25rem 0.375rem rgba(255, 255, 255, 0.1); /* Lighter shadow */
  }
  .selected-token {
    background-color: #555; /* Darker background for the selected token */
  }
}
</style>
