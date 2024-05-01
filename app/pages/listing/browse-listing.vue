<script setup lang="ts">
const {data, refresh, pending, error} = await useFetch('/api/listing/fetch-open', {
  method: 'POST',
});
useState<t_listingFilter[]>('listings', () => transformListings(data.value as t_listing[]));
const isOpenFilter = useState<boolean>('isOpenFilter', () => false);
</script>

<template>
  <div>
    <div class="p-4">
      <div v-if="pending" class="text-gray-500">Loading...</div>
      <div v-else-if="error" class="text-red-500">Error fetching listing: {{ error.message }}</div>
      <div v-else>
        <UButton @click="refresh">Refresh</UButton>
        <UButton @click="() => (isOpenFilter = true)">Filter</UButton>
        <FilterListing />
        <ListTinyListing />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
