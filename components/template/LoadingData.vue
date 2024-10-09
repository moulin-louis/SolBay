<script lang="ts" setup>
const props = defineProps({
  url: {
    type: String,
    required: true,
  },
  body: {
    type: Object,
    required: true,
  },
  onResponse: {
    type: Function,
    required: true,
  },
  disableButton: {
    type: Boolean,
    default: false,
  },
});

const {pending, error, refresh} = useFetch(props.url, {
  method: 'POST',
  body: props.body,
  onResponse: props.onResponse,
});
</script>

<template>
  <div>
    <UButton v-if="!props.disableButton" @click="refresh">Refresh</UButton>
    <div v-if="pending">Loading...</div>
    <div v-else-if="error">Error fetching data: {{ error.message }}</div>
    <div v-else>
      <slot />
    </div>
  </div>
</template>
