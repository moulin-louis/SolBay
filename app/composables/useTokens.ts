export const useTokens = async () => {
  const tokens_answer = await $fetch('https://token.jup.ag/strict');
  return ref(tokens_answer);
};
