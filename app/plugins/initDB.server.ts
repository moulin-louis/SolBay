export default defineNuxtPlugin(() => {
  const storage = useStorage('db');
  storage.setItem('users', []);
  console.log('users fields init');
  storage.setItem('listings', []);
  console.log('users listings init');
});
