<script lang="ts" setup>
import {useTokens} from '~/composables/useTokens';
const props = defineProps<{
  isOpen: boolean;
  selectedToken: t_token | null;
  upadteSelectedToken: (token: t_token | null) => void;
}>();

const tokens = await useTokens();
tokens.value.unshift({
  name: 'Solana (Recommended)',
  symbol: 'SOL',
  address: 'SOL',
} as unknown as t_token); //adding native sol token
const {list, containerProps, wrapperProps} = useVirtualList(tokens.value, {
  itemHeight: 22,
});
const isOpen = computed(() => props.isOpen);
</script>

<template>
  <div>Test</div>
  <UModal v-model="isOpen">
    <div v-bind="containerProps" style="height: 300px">
      <div v-bind="wrapperProps">
        <div
          v-for="item in list"
          :key="item.data.name"
          style="height: 22px; cursor: pointer"
          @click="upadteSelectedToken(item.data)"
        >
          <span :class="{'selected-token': selectedToken === item.data}">
            {{ item.data.name }} : $ {{ item.data.symbol }}
          </span>
        </div>
      </div>
    </div>
  </UModal>
</template>

<style></style>
