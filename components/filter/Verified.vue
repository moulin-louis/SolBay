<script lang="ts" setup>
const isOpen = ref(false);
const listings = useState<t_listingFilter[]>('listings');
watch(isOpen, () => {
  isOpen.value = false;
  throw new Error('Verified listing not implemented yet.');
  listings.value.forEach((listing) => {
    listing.filtered = !listing.verified;
  });
});
</script>

<template>
  <div>
    Verified Only Listing:
    <UToggle v-model="isOpen" />
  </div>
</template>

<style></style>
