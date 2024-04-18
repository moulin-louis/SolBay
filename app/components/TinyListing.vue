<script lang="ts" setup>
const props = defineProps<{
  listing: t_listing;
}>();
const listing: t_listing = props.listing;
</script>

<template>
  <UCard>
    <template #header>
      <div class="listing-name">{{ listing.name }}</div>
    </template>
    <div class="listing-description">{{ listing.description }}</div>
    <div class="listing-date">
      Listing date: {{ new Date(listing.created_at).toLocaleDateString() }}
    </div>
    <div class="listing-price">Price: ${{ listing.price }} {{ listing.token.symbol }}</div>
    <NuxtImg :src="getImgLink(listing)" />
    <template #footer>
      <ULink :to="`/listing/${listing.id}`">
        <UButton>View Details</UButton>
      </ULink>
    </template>
  </UCard>
</template>

<style>
.listing-name,
.listing-description,
.listing-price,
.listing-date {
  margin-bottom: 0.625em;
}
</style>
