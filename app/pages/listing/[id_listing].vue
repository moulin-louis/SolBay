<script lang="ts" setup>
const route = useRoute();
const {
  data: listing,
  pending,
  error,
} = await useFetch(`/api/fetch-listing/`, {
  method: 'POST',
  body: JSON.stringify({id: route.params.id_listing}),
});
</script>

<template>
  <div class="card">
    <div v-if="pending">Loading...</div>
    <div v-else-if="error">Error fetching listing: {{ error.message }}</div>
    <div v-else>
      <UCard>
        <template #header>
          <div class="card-header">
            <img :src="getImgLink(listing?.data)" />
          </div>
        </template>
        <div class="card-content">
          <div class="card-title">Name: {{ listing.data.name }}</div>
          <UDivider type="dashed" size="sm" />
          <div class="card-description">
            {{ listing.data.description }}
          </div>
        </div>
        <template #footer>
          <div class="card-footer">
            <div>
              <div class="listing-price">Price: ${{ listing.data.price }}</div>
            </div>
          </div>
          <UButton>Buy this Item</UButton>
          <UDivider orientation="vertical"/>
        </template>
      </UCard>

    </div>
  </div>
</template>

<style scoped>
.card {
  max-width: 50rem; /* 800px assuming base font size is 16px */
  margin: auto;
  box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.1);
  border-radius: 1rem;
  overflow: hidden;
}

.card img {
  width: 100%;
  object-fit: cover;
  height: auto;
}

.card-header,
.card-footer {
  padding: 1rem;
  background: #f8f8f8;
}

.card-content {
  padding: 1rem;
}

.card-title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.card-description {
  font-size: 1rem;
  color: #666;
  margin-bottom: 1rem;
}

.card-price {
  font-size: 1.25rem;
  font-weight: bold;
  color: #333;
}

.refresh-button {
  font-size: 1rem;
  padding: 0.5rem 1rem;
  background-color: #0055ff;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.refresh-button:hover {
  background-color: #0033aa;
}

/* Responsive adjustments */
@media (max-width: 48em) { /* 768px */
  .card {
    border-radius: 0;
  }

  .card-header,
  .card-footer {
    padding: 0.75rem;
  }

  .card-title {
    font-size: 1.25rem;
  }

  .card-price {
    font-size: 1rem;
  }
}
</style>