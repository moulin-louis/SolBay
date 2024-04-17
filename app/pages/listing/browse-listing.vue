<script setup lang="ts">
const {
  data: listings,
  refresh,
  pending,
  error,
} = await useFetch('/api/fetch-all-listing', {
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
      <div class="listing-list">
        <div
          v-for="listing in listings.data"
          :key="listing.id"
          class="listing-item"
        >
          <UCard>
            <template #header>
              <div class="listing-name">{{ listing.name }}</div>
            </template>
            <div class="listing-description">{{ listing.description }}</div>
            <div class="listing-date">
              Listing date:
              {{ new Date(listing.created_at).toLocaleDateString() }}
            </div>
            <div class="listing-price">Price: ${{ listing.price }}</div>
            <img :src="getImgLink(listing)" >
            <template #footer>
              <ULink :to="`/listing/${listing.id}`">
                <UButton>View Details</UButton>
              </ULink>
            </template>
          </UCard>
        </div>
      </div>
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
.listing-list {
  display: grid;
  grid-template-columns: repeat(
    auto-fill,
    minmax(18.75em, 1fr)
  ); /* 300px assuming base font size is 16px */
  gap: 1.25em; /* 20px assuming base font size is 16px */
}
.listing-item img {
  width: 100%;
  height: 12.5em; /* 200px if base font size is 16px */
  object-fit: contain;
  object-position: center;
  background-color: #fff;
  border-radius: 2%; /* Using a percentage for responsiveness */
}
.listing-name,
.listing-description,
.listing-price,
.listing-date {
  margin-bottom: 0.625em; /* 10px if base font size is 16px */
}
.separator {
  margin-top: 0.625em;
  text-align: center;
}
</style>
