<script setup lang="ts">
const {
  data: listings,
  refresh,
  pending,
  error,
} = await useFetch('/api/fetch-listing', {
  method: 'POST',
});

const getImgLink = (listing: t_listing): string => {
  const ipfs_gateway = 'https://aqua-general-primate-588.mypinata.cloud/ipfs/';
  const url = `${ipfs_gateway}${listing.ipfs_hash}`;  // Use listing.ipfs_hash
  console.log('result = ', url);
  return url;
};
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
          class="auction-item"
        >
          <UCard>
            <template #header>
              <div class="listing-name">{{ listing.name }}</div>
            </template>
            <div class="listing-description">{{ listing.description }}</div>
            <div class="listing-price">{{ listing.price }}</div>
            <img :src="getImgLink(listing)" />
            <template #footer>
              <UButton>More Details</UButton>
            </template>
          </UCard>
        </div>
      </div>
    </div>
  </div>
  <div>
    {{ listings.data }}
  </div>
</template>

<style scoped>
.listings-container {
  padding: 20px;
}
.loading,
.error {
  text-align: center;
  font-size: 18px;
  margin-top: 20px;
}
.refresh-button {
  margin-bottom: 20px;
  text-align: right;
}
.listing-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}
.listing-item {
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 10px;
}
.listing-name,
.listing-description,
.listing-price,
.listing-date {
  margin-bottom: 10px;
}
.separator {
  margin-top: 10px;
  text-align: center;
}
</style>
