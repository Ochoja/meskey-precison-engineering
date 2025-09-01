<script setup lang="ts">
import blackLogo from '@/assets/images/blacklogo.png';
import whiteLogo from '@/assets/images/whitelogo.png';
import mainLogo from '@/assets/images/mainlogo.png';

const props = defineProps({
  default: String,
  dark: String,
  light: String,
});
</script>

<template>
  <nav class="layout-pad pt-4 flex justify-between items-center">
    <div>
      <img
        :src="props.dark ? whiteLogo : mainLogo"
        alt="Meskey Precision Engineering Logo"
        class="w-[15rem]" />
    </div>
    <div :class="props.dark ? 'text-white ' + 'flex gap-6' : 'flex gap-6'">
      <NuxtLink to="/">Home</NuxtLink>
      <NuxtLink to="/">About</NuxtLink>
      <NuxtLink to="/">Projects</NuxtLink>
      <div class="flex items-center gap-1 cursor-pointer">
        <span>Services</span> <Icon name="iconamoon:arrow-down-2-light"></Icon>
      </div>
      <div class="flex items-center gap-1 cursor-pointer">
        <span>Our Companies</span>
        <Icon name="iconamoon:arrow-down-2-light"></Icon>
      </div>
    </div>
    <div>
      <button class="bg-primary font-medium text-white py-3 px-6 rounded-lg">
        Contact Us
      </button>
    </div>
  </nav>
</template>
