import {Buffer} from 'node:buffer';
export default defineNuxtPlugin((nuxtApp) => {
  globalThis.Buffer = globalThis.Buffer || Buffer;
});
