<script lang="ts" setup>
const isOpenFilter = useState<boolean>('isOpenFilter', () => false);
const filterAvailable = [
  {label: 'Sort', icon: 'i-heroicons-solid-sort-ascending', defaultOpen: true, slot: 'sort-filter'},
  {
    label: 'Price',
    icon: 'i-heroicons-solid-currency-dollar',
    defaultOpen: false,
    slot: 'price-filter',
  },
  {label: 'Category', icon: 'i-heroicons-solid-tag', defaultOpen: false, slot: 'category-filter'},
  {
    label: 'Location',
    icon: 'i-heroicons-solid-location-marker',
    defaultOpen: false,
    slot: 'location-filter',
  },
  {label: 'Rating', icon: 'i-heroicons-solid-star', defaultOpen: false, slot: 'rating-filter'},
  {
    label: 'Verified Only Listing',
    icon: 'i-heroicons-solid-shield-check',
    defaultOpen: false,
    slot: 'verified-filter',
  },
  {
    label: 'Date Posted',
    icon: 'i-heroicons-solid-calendar',
    defaultOpen: false,
    slot: 'date-filter',
  },
];
</script>

<template>
  <div>
    <USlideover v-model="isOpenFilter">
      <UAccordion :items="filterAvailable">
        <template #sort-filter>
          <FilterSort />
        </template>
        <template #price-filter>
          <FilterPrice />
        </template>
        <template #category-filter>
          <FilterCategory />
        </template>
        <template #location-filter>
          <FilterLocation />
        </template>
        <template #rating-filter>
          <FilterRating />
        </template>
        <template #verified-filter>
          <FilterVerified />
        </template>
        <template #date-filter>
          <FilterDate />
        </template>
      </UAccordion>
    </USlideover>
  </div>
</template>

<style></style>
