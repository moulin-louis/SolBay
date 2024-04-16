<script setup lang="ts">
const links = [
  [
    {
      label: 'Home',
      to: '/',
    },
    {
      label: 'Browse Listings',
      to: '/listing/browse-listing',
    },
    {
      label: 'Create Listing',
      to: '/listing/create-listing',
    },
  ],
  [
    {
      label: 'Profile',
      to: '/profile',
    },
  ],
];
</script>

<template>
  <UHorizontalNavigation
    :links="links"
    class="border-b border-gray-200 dark:border-gray-800"
  />
</template>

<style scoped></style>
