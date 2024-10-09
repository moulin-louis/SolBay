<script setup lang="ts">
const listings = useState<t_listingFilter[]>('listings');

const page = ref(1);
const perPage = ref(3);
const paginatedListings = computed(() => {
  const start = (page.value - 1) * perPage.value;
  const end = Math.min(start + perPage.value, listings.value.length);
  return listings.value.slice(start, end);
});
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
    <div v-for="listing in paginatedListings" :key="listing.id">
      <div v-if="listing.filtered === false">
        <ListingTiny :listing="listing" />
      </div>
    </div>
  </div>
  <UPagination
    v-model="page"
    :page-count="Math.ceil(listings.length / perPage)"
    :total="listings.length"
  />
</template>
