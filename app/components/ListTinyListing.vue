<script setup lang="ts">
const props = defineProps<{
  listings: t_listing[];
}>();

const {listings} = props;
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
    <TinyListing v-for="listing in listings" :key="listing.id" :listing="listing" />
  </div>
</template>
