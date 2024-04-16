<script setup lang="ts">
import {date, mixed, number, object, string} from 'yup';
import type {FormSubmitEvent} from '#ui/types';

import {Keypair} from '@solana/web3.js';

const file_path = ref<string>();
const isLoading = ref(false);
const form = reactive({
  name: '',
  description: '',
  price: 0,
  file: undefined,
});

const toast = useToast();
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

const onSubmit = async (event: FormSubmitEvent<any>) => {
  isLoading.value = true;
  try {
    const listing: t_listing = {
      name: form.name,
      description: form.description,
      seller: new Keypair().publicKey,
      ipfs_hash: '',
      token: {},
      price: form.price,
    };
    const ImageData = new FormData();
    console.log('form file=', form.file);
    ImageData.append('file', form.file as unknown as File);
    let answer = await $fetch('/api/upload-file-ipfs', {
      method: 'POST',
      body: ImageData,
    });
    if (answer.status === 500)
      throw new Error(
        'An error occurred while uploading the file:' + answer.data,
      );
    listing.ipfs_hash = answer.data;
    console.log(' ipfs_hash = ', listing.ipfs_hash);
    answer = await $fetch('/api/create-listing', {
      method: 'POST',
      body: JSON.stringify(listing),
    });
    toast.add({
      id: 'success-notification',
      title: 'Listing Created !',
      icon: 'i-material-symbols-check-circle-outline',
    });
    console.log('Listing created');
  } catch (error) {
    const e = error as Error;
    toast.add({
      id: 'error-notification',
      title: 'An error occurred while creating the listing',
      description: e.message,
      icon: '',
    });
    console.error(e);
  } finally {
    isLoading.value = false;
  }
};
const handleFileChange = (files: FileList) => {
  if (files.length === 0) return;
  if (files[0] instanceof File) {
    console.log('files[0] is a File');
  }
  form.file = files[0];
};
</script>

<template>
  <div class="form-wrapper">
    <UForm
      :schema="schema"
      :state="form"
      @submit="onSubmit"
      class="form-container"
    >
      <UFormGroup
        label="File"
        name="file"
        description="Image of your product"
        class="form-group"
      >
        <UInput
          variant="outline"
          size="md"
          placeholder="Upload a file"
          type="file"
          @change="handleFileChange($event)"
          v-model="file_path"
        />
      </UFormGroup>
      <UFormGroup
        label="Name"
        name="name"
        description="Name for your listing"
        class="form-group"
      >
        <UInput
          size="md"
          variant="outline"
          placeholder="Listing Name"
          v-model="form.name"
        />
      </UFormGroup>
      <UFormGroup
        label="Description"
        name="description"
        description="A little description for your listing"
        class="form-group"
      >
        <UInput
          size="md"
          variant="outline"
          placeholder="Listing description"
          v-model="form.description"
        />
      </UFormGroup>
      <UFormGroup
        label="Price"
        name="price"
        description="The sell price in token of your listing"
        class="form-group"
      >
        <UInput
          size="md"
          variant="outline"
          placeholder="Minimum price (in tokens)"
          v-model="form.price"
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
