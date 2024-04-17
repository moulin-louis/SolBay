<script setup lang="ts">
const {
  data: listings,
  refresh,
  pending,
  error,
} = await useFetch('/api/fetch-open-listing', {
  method: 'POST',
});
</script>

<template>
  <div class="listings-container">
    <div v-if="pending" class="loading">Loading...</div>
    <div v-else-if="error" class="error">
      Error fetching listing: {{ error.message }}
    </div>
    <div v-else>
      <div class="refresh-button">
        <UButton @click="refresh">Refresh</UButton>
      </div>
      <ListListing
        :listings="listings as unknown as t_listing[]"
        variant="tiny"
      />
    </div>
  </div>
</template>

<style scoped>
.listings-container {
  padding: 1.23em;
}
.loading,
.error {
  text-align: center;
  font-size: 1.125em; /* 18px if base font size is 16px */
  margin-top: 1.25em;
}
.refresh-button {
  margin-bottom: 1.25em;
  text-align: right;
}
</style>
