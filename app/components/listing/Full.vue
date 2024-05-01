<script lang="ts" setup>
const props = defineProps<{
  listing: t_listingFilter;
}>();
const listing: t_listingFilter = props.listing;
</script>

<template>
  <div class="h-screen overflow-hidden">
    <UCard class="bg-gray-100 shadow-md rounded-lg">
      <template #header>
        <div class="flex items-center p-4">
          <NuxtImg :src="listing.imageUri" alt="Listing Image" class="rounded object-cover mr-4" />
        </div>
      </template>
      <div class="p-4">
        <div class="font-bold text-xl mb-2">Name: {{ listing.name }}</div>
        <UDivider type="dashed" size="sm" />
        <div class="text-gray-400 overflow-auto max-h-[300px]">{{ listing.description }}</div>
      </div>
      <template #footer>
        <div class="flex items-center justify-between p-4">
          <div class="text-lg font-bold">
            Price: ${{ listing.price }} $ {{ listing.token ? listing.token.symbol : '$SOL' }}
          </div>
          <slot />
        </div>
      </template>
    </UCard>
  </div>
</template>

<style scoped></style>
