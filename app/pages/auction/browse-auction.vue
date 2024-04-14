<script setup lang="ts">

const { data: result_auctions, refresh, pending, error } = await useFetch("/api/fetch-auctions", {
  method: "POST",
});
</script>

<template>
  <div>
  </div>
</template>

<style scoped></style>
