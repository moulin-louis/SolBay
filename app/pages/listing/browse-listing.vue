<script setup lang="ts">
const {
  data: listings,
  refresh,
  pending,
  error,
} = await useFetch('/api/listing/fetch-open', {
  method: 'POST',
});
</script>

<template>
  <div>
    <div class="p-4">
      <div v-if="pending" class="text-gray-500">Loading...</div>
      <div v-else-if="error" class="text-red-500">Error fetching listing: {{ error.message }}</div>
      <div v-else>
        <UButton @click="refresh">Refresh</UButton>
        <ListTinyListing :listings="listings" />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
