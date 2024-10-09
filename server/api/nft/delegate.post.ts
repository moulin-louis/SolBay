import {type H3Event} from 'h3';

export default defineEventHandler(async (event: H3Event) => {
  setResponseStatus(event, 500);
  return 'Hello Nitro';
});
