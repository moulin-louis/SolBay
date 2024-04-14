<script setup lang="ts">
import { date, mixed, number, object, string } from "yup";
import { Keypair } from "@solana/web3.js";

//All reactive stuff
const isAuction = ref<boolean>(false);
const isLoading = ref<boolean>(false);
const file = ref<string | undefined>(undefined);
const form = reactive({
  id: undefined, //string
  created_at: undefined, //string
  name: undefined, //string
  description: undefined, //string
  seller: undefined, //PublicKey
  ipfs_hash: undefined, //string
  token: undefined, //t_token
  price: undefined, //number
});

const schema = object({
  name: string().max(50, "Name must be less than 50 characters").required(),
  description: string().required(),
  price: number().required(),
  end_date: date()
    .test(
      "end_date",
      "End date must be in the future",
      (value) => value && value > new Date()
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

const onSubmit = async (event: MouseEvent) => {
  event.preventDefault();
  console.log("event = ", event);
  console.log("form = ", form);
  try {
    schema.validateSync(form, { abortEarly: false });
  } catch (error) {
    console.error("form validation failed", error);
    return;
  }
  try {
    isLoading.value = true;
    const auction: t_listing = form as unknown as t_listing;
    auction.seller = new Keypair().publicKey;
    const ImageData = new FormData();
    ImageData.append("file", file as unknown as string);
    file.value = undefined; // Clear the file
    let answer = await $fetch("/api/upload-file-ipfs", {
      method: "POST",
      body: ImageData,
    });
    auction.token = {};
    if (answer.status === 500)
      throw new Error("Error uploading image: " + answer.data);
    const ipfs_answer = JSON.parse(answer.data);
    auction.ipfs_hash = ipfs_answer.IpfsHash;
    answer = await $fetch("/api/create-listing", {
      method: "POST",
      body: JSON.stringify(auction),
    });

    if (answer.status === 500)
      throw new Error("Error creating auction: " + answer.data);
    console.log("Auction created");
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="form-wrapper">
    <!-- <InputGroup> -->
    <!-- <FileUpload mode="basic" name="image" accept="image/*" /> -->
    <!-- </InputGroup> -->
    <!-- <Divider /> -->
    <form @submit="onSubmit">
      <InputGroup>
        <FloatLabel>
          <div class="card flex justify-content-center">
            <InputText id="name" type="text" v-model="form.name" :invalid=true />
          </div>
          <label for="name">Name</label>
        </FloatLabel>
      </InputGroup>
      <Divider />

      <FloatLabel>
        <InputText id="description" type="text" v-model="form.description" />
        <label for="description">Description</label>
      </FloatLabel>
      <Divider />

      <FloatLabel>
        <InputNumber id="price" v-model="form.price" />
        <label for="price">Price</label>
      </FloatLabel>
      <Divider />

      <Button
        type="submit"
        :loading="isLoading"
        label="Create Auction"
        raised
      />
    </form>
  </div>
</template>

<style scoped></style>
