<script setup>
const props = defineProps<{
  token: t_token;
} > ();
const tokens = await useTokens();
const token = ref < t_token > (props.token);
</script>
<template>
  <USelectMenu
    v-model="token"
    :options="tokens"
    by="name"
    value-attribute="name"
    size="md"
    variant="outline"
    placeholder="Select a token"
  />
</template>
