export default defineEventHandler(async (event) => {
  console.log(event);
  return 'Hello Nitro';
});
