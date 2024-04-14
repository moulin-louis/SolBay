<script setup lang="ts">
const links: MenuI = [
  {
    label: "Home",
    url: "/",
  },
  {
    label: "Browse Listings",
    url: "/auction/browse-auction",
  },
  {
    label: "Create Listing",
    url: "/auction/create-listing",
  },
  {
    label: "Profile",
    url: "/profile",
  },
];
</script>

<template>
  <TabMenu :model="links" />
</template>

<style scoped></style>
