<script lang="ts" setup>
const category = [
  {id: 1, label: 'Clothes'},
  {id: 2, label: 'Real World Assets'},
  {id: 3, label: 'NFT'},
];
const selected = ref([]);
const listings = useState<t_listingFilter[]>('listings');
const filterCategory = async () => {
  throw new Error('Need to implement category');
  console.log('selected category', selected.value);
  listings.value.forEach((listing) => {
    listing.filtered = !selected.value.includes(listing.category);
  });
};
</script>

<template>
  <div>
    <UCommandPalette
      v-model="selected"
      multiple
      nullable
      :autoselect="false"
      :groups="[{key: 'category', commands: category}]"
      :fuse="{resultLimit: 6, fuseOptions: {threshold: 0.1}}"
      @update:model-value="filterCategory"
    />
  </div>
</template>

<style></style>
