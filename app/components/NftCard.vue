<script lang="ts" setup>
const props = defineProps<{
  name: string;
  description: string;
  imageUri: string;
}>();
</script>

<template>
  <div>
    <UCard>
      <template #header> Name: {{ props.name }} </template>
      <NuxtImg :src="props.imageUri" />
      <template #footer> Description: {{ props.description }} </template>
    </UCard>
  </div>
</template>

<style></style>
