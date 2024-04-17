<script setup lang="ts">
const props = defineProps<{
  variant: 'tiny' | 'full';
  listings: t_listing[];
}>();

const {variant, listings} = props;
</script>

<template>
  <div id="list-listing">
    <div v-for="listing in listings" :key="listing.id" class="listing-item">
      <div v-if="variant === 'full'">
        <FullListing :listing="listing" />
      </div>
      <div v-else>
        <TinyListing :listing="listing" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup></script>

<style scoped>
.list-listing {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(18.75em, 1fr));
  gap: 1.25em;
}
.listing-item img {
  width: 100%;
  height: 12.5em; /* 200px if base font size is 16px */
  object-fit: contain;
  object-position: center;
  background-color: #fff;
  border-radius: 2%; /* Using a percentage for responsiveness */
}
</style>
