export const useListToken = async (): Promise<Ref<t_token[]>> => {
  const tokens_answer: t_token[] = await $fetch('https://token.jup.ag/strict');
  return ref(tokens_answer);
};
