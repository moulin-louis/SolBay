<script setup lang="ts">
import {mixed, number, object, string} from 'yup';

import {useWallet} from 'solana-wallets-vue';

const {wallet} = useWallet();
const file_path = ref<string>();
const isLoading = ref(false);
const toast = useToast();
const form = reactive({
  name: '',
  description: '',
  price: 0,
  file: undefined,
});
const schema = object({
  name: string().max(50, 'Name must be less than 50 characters').required(),
  description: string().required(),
  price: number().required(),
  file: mixed()
    .test(
      'fileType',
      'Please provide a valid image file',
      (value) =>
        !value || (value && ['image/jpeg', 'image/png'].includes(value.type)),
    )
    .required(),
});

const onSubmit = async () => {
  isLoading.value = true;
  try {
    const pub_key = wallet.value?.adapter.publicKey;
    if (!pub_key) throw new Error('Wallet not connected');
    const listing: t_listing = {
      name: form.name,
      description: form.description,
      seller: pub_key.toString(),
      ipfs_hash: '',
      token: {},
      price: form.price,
      buyer: null,
    };
    const ImageData = new FormData();
    ImageData.append('file', form.file as unknown as File);
    const ipfs_answer = await $fetch('/api/upload-file-ipfs', {
      method: 'POST',
      body: ImageData,
    });
    listing.ipfs_hash = ipfs_answer;
    await $fetch('/api/create-listing', {
      method: 'POST',
      body: JSON.stringify(listing),
    });
    toast.add({
      id: 'success-notification',
      title: 'Listing Created !',
      icon: 'i-material-symbols-check-circle-outline',
    });
    console.log('Listing created');
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
const handleFileChange = (files: FileList) => {
  if (files.length === 0) return;
  form.file = files[0];
};
</script>

<template>
  <div>
    <div v-if="wallet === null">
      Please connect your wallet to create a listing
    </div>
    <div v-else class="form-wrapper">
      <UForm
        :schema="schema"
        :state="form"
        class="form-container"
        @submit="onSubmit"
      >
        <UFormGroup
          label="File"
          name="file"
          description="Image of your product"
          class="form-group"
        >
          <UInput
            v-model="file_path"
            variant="outline"
            size="md"
            placeholder="Upload a file"
            type="file"
            @change="handleFileChange($event)"
          />
        </UFormGroup>
        <UFormGroup
          label="Name"
          name="name"
          description="Name for your listing"
          class="form-group"
        >
          <UInput
            v-model="form.name"
            size="md"
            variant="outline"
            placeholder="Listing Name"
          />
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
  max-width: 37.5rem; /* equivalent to 600px */
}

.form-group {
  margin-bottom: 1.25rem; /* equivalent to 20px */
  width: 100%;
}
</style>
