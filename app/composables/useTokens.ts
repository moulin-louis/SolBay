export const useUseTokens = async () => {
  const tokens_answer = await $fetch('https://token.jup.ag/all');
  console.log('tokens_answer', tokens_answer);
  return ref(tokens_answer);
};
