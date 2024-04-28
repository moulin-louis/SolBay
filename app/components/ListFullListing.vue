<script setup lang="ts">
const props = defineProps<{
  listings: t_listing[];
}>();

const {listings} = props;
</script>

<template>
  <div class="listing-list">
    <div v-for="listing in listings" :key="listing.id" class="listing-item">
      <FullListing :listing="listing" />
    </div>
  </div>
</template>

<script lang="ts" setup></script>

<style scoped></style>
