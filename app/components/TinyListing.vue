<script lang="ts" setup>
const props = defineProps<{
  listing: t_listing;
}>();
const listing: t_listing = props.listing;
</script>

<template>
  <UCard>
    <template #header>
      <div class="text-xl font-bold">{{ listing.name }}</div>
    </template>
    <div class="p-4">
      <div class="mb-2">{{ listing.description }}</div>
      <div class="">Listing date: {{ new Date(listing.created_at).toLocaleDateString() }}</div>
      <div class="flex items-center">
        Price: <span class="font-bold ml-2">{{ listing.price }}</span>
        {{ listing.token ? listing.token.symbol : '$SOL' }}
      </div>
      <NuxtImg :src="getImgLink(listing)" class="rounded-2xl" />
    </div>
    <template #footer>
      <ULink :to="`/listing/${listing.id}`">
        <UButton class="py-2 px-4 rounded">View Details</UButton>
      </ULink>
    </template>
  </UCard>
</template>
