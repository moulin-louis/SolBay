<script setup lang="ts">
const props = defineProps<{
  listings: t_listingFilter[];
}>();

const {listings} = props;
</script>

<template>
  <div class="listing-list">
    <div v-for="listing in listings" :key="listing.id" class="listing-item">
      <div v-if="listing.filtered === false">
        <ListingFull :listing="listing" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup></script>

<style scoped></style>
