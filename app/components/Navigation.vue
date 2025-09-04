<script setup lang="ts">
import blackLogo from '@/assets/images/blacklogo.png';
import whiteLogo from '@/assets/images/whitelogo.png';
import mainLogo from '@/assets/images/mainlogo.png';

const router = useRouter();

const props = defineProps({
  default: String,
  dark: String,
  light: String,
});

const serviceDropdown = ref(false);
const companyDropdown = ref(false);

const toggleserviceDropdown = () => {
  if (serviceDropdown.value == true) {
    serviceDropdown.value = false;
  } else {
    companyDropdown.value = false;
    serviceDropdown.value = true;
  }
  console.log('clicked');
};

const togglecompanyDropdown = () => {
  if (companyDropdown.value == true) {
    companyDropdown.value = false;
  } else {
    serviceDropdown.value = false;
    companyDropdown.value = true;
  }
};
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
      <NuxtLink to="/about">About</NuxtLink>
      <NuxtLink to="/">Projects</NuxtLink>
      <div class="relative">
        <div
          @click="toggleserviceDropdown"
          class="flex items-center gap-1 cursor-pointer">
          <span>Services</span>
          <Icon name="iconamoon:arrow-down-2-light"></Icon>
        </div>

        <div
          v-if="serviceDropdown"
          class="absolute flex flex-col gap-2 px-4 py-2 bg-white text-grey-110 top-8 rounded-lg border border-primary-30">
          <NuxtLink>Metering</NuxtLink>
          <NuxtLink>Monitoring</NuxtLink>
          <NuxtLink>Automation</NuxtLink>
          <NuxtLink>Measuring</NuxtLink>
          <NuxtLink>Analysis</NuxtLink>
        </div>
      </div>
      <div class="relative">
        <div
          @click="togglecompanyDropdown"
          class="flex items-center gap-1 cursor-pointer">
          <span>Our Companies</span>
          <Icon name="iconamoon:arrow-down-2-light"></Icon>
        </div>
        <div
          v-if="companyDropdown"
          class="w-[120%] absolute px-4 py-2 bg-white text-grey-110 top-8 rounded-lg border border-primary-30">
          <NuxtLink>Meskey Energy</NuxtLink>
        </div>
      </div>
    </div>
    <div>
      <button
        @click="router.push('/contact')"
        class="bg-primary font-medium text-white py-3 px-6 rounded-lg cursor-pointer">
        Contact Us
      </button>
    </div>
  </nav>
</template>

<style scoped>
a {
  cursor: pointer;
}

a:hover {
  font-weight: 500;
}
</style>
