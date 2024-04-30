<script lang="ts" setup>
const options = ['0', '1', '2', '3', '4', '5'];

const selected = ref<string>(options[0]);
const listings = useState<t_listingFilter[]>('listings');
watch(selected, () => {
  console.log('rating selected:', selected.value);
  throw new Error('Rating filter not implemented yet.');
  listings.value.forEach((listing) => {
    listing.filtered = listing.user.rating !== selected.value;
  });
});
</script>

<template>
  <div>
    <USelect v-model="selected" :options="options" />
  </div>
</template>

<style></style>
