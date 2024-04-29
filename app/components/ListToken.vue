<script lang="ts" setup>
import {useListToken} from '~/composables/ListToken';

const props = defineProps<{
  isOpen: boolean;
  selectedToken: t_token | null;
  upadteSelectedToken: (token: t_token | null) => void;
}>();

const tokens = await useListToken();
tokens.value.unshift({
  name: 'Solana (Recommended)',
  symbol: 'SOL',
  address: 'SOL',
} as t_token); //adding native sol token
const searchTerm = ref('');
const filteredTokens = computed(() => {
  return tokens.value.filter(
    (token) =>
      token.name.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      token.symbol.toLowerCase().includes(searchTerm.value.toLowerCase()),
  );
});

const {list, containerProps, wrapperProps} = useVirtualList(filteredTokens, {
  itemHeight: 22,
});

const isOpen = computed(() => props.isOpen);
</script>

<template>
  <UModal v-model="isOpen">
    <div class="flex flex-col h-full">
      <div class="flex items-center mb-2 px-2">
        <UInput
          v-model="searchTerm"
          size="sm"
          variant="outline"
          placeholder="Search Tokens"
          class="flex-grow mr-2 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:ring-1"
        />
        <UButton
          icon="i-heroicons-solid-search"
          size="sm"
          variant="outline"
          color="gray"
          class="rounded-md px-2 py-1 hover:bg-gray-100 focus:outline-none focus:ring-indigo-500 focus:ring-1"
        />
      </div>
      <div v-bind="containerProps" class="overflow-auto flex-grow">
        <div v-bind="wrapperProps" class="flex flex-col space-y-1">
          <div v-for="item in list" :key="item.data.name" @click="upadteSelectedToken(item.data)">
            <span
              :class="{
                'text-indigo-500 font-medium px-2 py-1 rounded-md hover:bg-gray-100 cursor-pointer': true,
                'bg-gray-200': selectedToken === item.data,
              }"
            >
              {{ item.data.name }} : $ {{ item.data.symbol }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </UModal>
</template>

<style scoped></style>
