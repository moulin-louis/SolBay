<script lang="ts" setup>
const sorting = [
  {value: 'date', label: 'Creation Date'},
  {value: 'date-reversed', label: 'Creation Date (reversed)'},
  {value: 'price-asc', label: 'Price Ascending'},
  {value: 'price-desc', label: 'Price Descending'},
];
const selected = ref(sorting[0].value); //its already sorted by date when output from backend
const listings = useState<t_listingFilter[]>('listings');
watch(selected, () => {
  switch (selected.value) {
    case 'date':
      listings.value.sort((a, b) => {
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      });
      break;
    case 'date-reversed':
      listings.value.sort((a, b) => {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
      break;
    case 'price-asc':
      listings.value.sort((a, b) => {
        return a.price - b.price;
      });
      break;
    case 'price-desc':
      listings.value.sort((a, b) => {
        return b.price - a.price;
      });
      break;
  }
});
</script>

<template>
  <div>
    <URadioGroup v-model="selected" legend="Sorting Method" :options="sorting" />
  </div>
</template>

<style></style>
