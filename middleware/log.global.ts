import type {RouteLocationNormalized} from 'vue-router';

export default defineNuxtRouteMiddleware(
  (to: RouteLocationNormalized, from: RouteLocationNormalized) => {
    console.log('to = ', to);
    console.log('from = ', from);
  },
);
