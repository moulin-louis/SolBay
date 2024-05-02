<script lang="ts" setup>
import { ref } from 'vue'
import { definePageMeta, useAuth } from '#imports'

const { signIn, token, status, lastRefreshedAt } = useAuth()

const username = ref('')
const password = ref('')

definePageMeta({
  auth: {
    unauthenticatedOnly: true,
    navigateAuthenticatedTo: '/'
  },
  layout: false,
})
const onSubmit = async () => {
  await signIn({ username: username.value, password: password.value }, {callbackUrl: '/'})
}

</script>

<template>
  <div>
    <h1>Login Page</h1>
    <pre>Status: {{ status }}</pre>
    <pre>Last refreshed at: {{ lastRefreshedAt || 'no refresh happened' }}</pre>
    <pre>JWT token: {{ token || 'no token present, are you logged in?' }}</pre>
    <form @submit.prevent="onSubmit">
      <input v-model="username" type="text" placeholder="Username">
      <input v-model="password" type="password" placeholder="Password">
      <button type="submit">
        Sign in
      </button>
    </form>
  </div>
</template>