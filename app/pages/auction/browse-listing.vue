<script setup lang="ts">
const {
  data: auctions,
  refresh,
  pending,
  error,
} = await useFetch("/api/fetch-auctions", {
  method: "POST",
});
</script>

<template>
  <div v-if="pending">Loading...</div>
  <div v-else-if="error">Error fetching auctions: {{ error.message }}</div>
  <div v-else>
    <!-- <UButton @click="refresh">Refresh</UButton> -->
    <div>
      <div v-for="auction in auctions.body.data" :key="auction.id">
        <!-- <UCard>
          <template #header>
            <div>{{ auction.name }}</div>
          </template>
          <div>{{ auction.description }}</div>
          <div>{{ auction.price }}</div>
          <div>{{ auction.end_date }}</div>
          <template #footer>
            <div>Footer</div>
          </template>
        </UCard> -->
        <div>
          -------------
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>