<script setup lang="ts">
const links = [
  [{
    label: 'Home',
    to: '/',
  },
    {
      label: 'Browse Listings',
      to: '/auction/browse-auction',
    },
    {
      label: 'Create Listing',
      to: '/auction/create-auction',
    }],
  [{
    label: 'Profile',
    to: '/profile',
  },
  ]
];
</script>

<template>
  <UHorizontalNavigation :links="links" class="border-b border-gray-200 dark:border-gray-800"/>
</template>

<style scoped>

</style>