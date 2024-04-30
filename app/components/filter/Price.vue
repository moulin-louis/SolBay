<script lang="ts" setup>
const minPrice = ref<number>(0);
const maxPrice = ref<number>(1000);
const listings = useState<t_listingFilter[]>('listings');

const onChange = () => {
  listings.value.forEach((listing) => {
    console.log(
      'will be filtered ? === ',
      !(listing.price >= minPrice.value && listing.price <= maxPrice.value),
    );
    listing.filtered = !(listing.price >= minPrice.value && listing.price <= maxPrice.value);
  });
  console.log('filterListings:', listings.value);
};
watch([minPrice, maxPrice], onChange);
</script>

<template>
  <UInput v-model="minPrice" type="number" placeholder="Minimun Price" :on-change="onChange" />
  <UInput v-model="maxPrice" type="number" placeholder="Maximum Price" :on-change="onChange" />
</template>

<style></style>
