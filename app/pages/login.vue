<script setup lang="ts">
import logo from '../assets/images/mainlogo.png';

definePageMeta({
  layout: 'auth',
});

// Supabase client & state
const supabase = useSupabaseClient();
const email = ref('');
const password = ref('');
const errorMsg = ref('');

// Login handler
async function signIn() {
  const { error } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value,
  });

  if (error) {
    errorMsg.value = error.message;
  } else {
    return navigateTo('/dashboard');
  }
}
</script>

<template>
  <main class="layout-pad flex flex-col items-center">
    <img :src="logo" alt="Main Logo" height="200" width="200" class="mb-20" />

    <form
      @submit.prevent="signIn"
      class="w-full md:max-w-[60%] lg:max-w-[50%] bg-[#fafafa] border border-primary-20 px-8 py-6 rounded-2xl shadow-[2px_2px_50px_20px_rgba(0,0,0,0.04)] mx-auto">
      <h4 class="text-2xl mb-6 text-center">Login</h4>
      <div>
        <label for="email">Email Address</label>
        <input
          v-model="email"
          type="email"
          id="email"
          placeholder="example@example.com" />

        <label for="password">Password</label>
        <input
          v-model="password"
          type="password"
          id="password"
          placeholder="Input your Password" />
      </div>

      <p v-if="errorMsg" class="text-red-500 text-sm mb-3">{{ errorMsg }}</p>

      <button
        class="bg-primary text-white w-full font-medium text-lg py-3 rounded-xl">
        Login
      </button>
    </form>
  </main>
</template>

<style scoped>
label {
  display: block;
  margin-bottom: 4px;
  font-size: 0.9rem;
}

input {
  margin-bottom: 1rem;
  background: #fff;
  padding: 12px 8px;
  border: 1px solid #bec0c0;
  border-radius: 10px;
  width: 100%;
  font-size: 0.8rem;
}
</style>
