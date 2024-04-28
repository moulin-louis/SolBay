<script lang="ts" setup>
const props = defineProps<{
  listing: t_listing;
}>();
const listing: t_listing = props.listing;
</script>

<template>
  <UCard>
    <template #header>
      <div>
        <NuxtImg :src="getImgLink(listing as unknown as t_listing)" class="rounded-2xl" />
      </div>
    </template>
    <div class="card-content">
      <div class="card-title">Name: {{ listing.name }}</div>
      <UDivider type="dashed" size="sm" />
      <div class="card-description">
        {{ listing.description }}
      </div>
    </div>
    <template #footer>
      <div class="card-footer">
        <div>
          <div class="listing-price">
            Price: ${{ listing.price }} $ {{ listing.token ? listing.token.symbol : '$SOL' }}
          </div>
        </div>
      </div>
      <slot />
    </template>
  </UCard>
</template>

<style scoped></style>
