<script setup lang="ts">
import { date, mixed, number, object, string } from "yup";
import type { FormSubmitEvent } from "#ui/types";

const toast = useToast();
const schema = object({
  name: string().max(50, "Name must be less than 50 characters").required(),
  description: string().required(),
  price: number().required(),
  end_date: date()
    .test(
      "end_date",
      "End date must be in the future",
      (value) => value > new Date()
    )
    .required(), //Default to current date + 24h
  file: mixed()
    .test(
      "fileType",
      "Please provide a valid image file",
      (value) =>
        !value || (value && ["image/jpeg", "image/png"].includes(value.type))
    )
    .required(),
});

const form = reactive({
  name: undefined,
  description: undefined,
  price: undefined,
  end_date: undefined,
  file: undefined,
  file_path: undefined,
});

const isLoading = ref(false);
const onSubmit = async (event: FormSubmitEvent<any>) => {
  isLoading.value = true;
  const auction = event.data as t_auction;
  const { wallet } = useAnchor();
  auction.seller = wallet.publicKey.value;
  const ImageData = new FormData();
  ImageData.append("file", form.file as unknown as string);
  form.file = undefined; // Clear the file
  let answer = await $fetch("/api/upload-file-ipfs", {
    method: "POST",
    body: ImageData,
  });
  if (answer.status === 500) {
    console.error(answer);
    isLoading.value = false;
    return;
  }
  const ipfs_answer = JSON.parse(answer.data);
  auction.ipfs_hash = ipfs_answer.IpfsHash;
  answer = await $fetch("/api/create-auction", {
    method: "POST",
    body: JSON.stringify(auction),
  });

  if (answer.status === 500) {
    toast.add({
      id: "error-notification",
      title: "An error occurred while creating the auction",
      description: answer.data,
      icon: ""
    });
    console.error(answer);
  } else {
    toast.add({ id: "success-notification", title: "Auction Created !", icon: "i-material-symbols-check-circle-outline" });
    console.log("Auction created");
  }
  isLoading.value = false;
  await nextTick();
};
const handleFileChange = (files: any) => {
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
      <UFormGroup label="File" name="file" class="form-group">
        <UInput
          type="file"
          @change="handleFileChange($event)"
          size="md"
          v-model="form.file_path"
          placeholder="Upload a file"
          class="file-input"
        />
      </UFormGroup>
      <UFormGroup label="Name" name="name" class="form-group">
        <UInput
          v-model="form.name"
          placeholder="Listing Name"
          class="text-input"
        />
      </UFormGroup>
      <UFormGroup label="Description" name="description" class="form-group">
        <UInput
          v-model="form.description"
          placeholder="Listing description"
          class="text-input"
        />
      </UFormGroup>
      <UFormGroup label="Price" name="price" class="form-group">
        <UInput
          v-model="form.price"
          placeholder="Minimum price (in tokens)"
          class="text-input"
        />
      </UFormGroup>
      <UFormGroup label="End Date" name="end_date" class="form-group">
        <UInput
          v-model="form.end_date"
          type="datetime-local"
          class="date-input"
        />
      </UFormGroup>
      <UButton
        type="submit"
        icon="i-heroicons-pencil-square"
        color="black"
        class="submit-button"
        :disabled="isLoading"
        :loading="isLoading"
      >
        {{ isLoading ? "Loading..." : "Submit" }}
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

.file-input,
.text-input,
.date-input {
  width: 100%;
  padding: 0.625rem 0.9375rem; /* padding adjusted to rem */
  border: 0.0625rem solid #ccc; /* border-width to rem */
  border-radius: 0.25rem;
  transition: border-color 0.3s ease-in-out;
}

.file-input:hover,
.text-input:hover,
.date-input:hover {
  border-color: #888;
}

.submit-button {
  padding: 0.625rem 1.875rem; /* padding adjusted to rem */
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.submit-button:hover {
  background-color: #45a049;
}
</style>
