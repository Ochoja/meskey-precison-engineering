<script setup lang="ts">
import blackLogo from '@/assets/images/blacklogo.png';
import whiteLogo from '@/assets/images/whitelogo.png';
import mainLogo from '@/assets/images/mainlogo.png';

const router = useRouter();
const route = useRoute();

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
};

const togglecompanyDropdown = () => {
  if (companyDropdown.value == true) {
    companyDropdown.value = false;
  } else {
    serviceDropdown.value = false;
    companyDropdown.value = true;
  }
};

watch(route, () => {
  serviceDropdown.value = false;
  companyDropdown.value = false;
  mobileMenuOpen.value = false;
});

const mobileMenuOpen = ref(false);

const toggleMobileMenu = () => {
  serviceDropdown.value = false;
  companyDropdown.value = false;
  mobileMenuOpen.value = !mobileMenuOpen.value;
};
</script>

<template>
  <!-- Desktop Navigation -->
  <nav class="hidden layout-pad pt-4 lg:flex justify-between items-center">
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
          <NuxtLink to="/services/3">Metering</NuxtLink>
          <NuxtLink to="/services/5">Monitoring</NuxtLink>
          <NuxtLink to="/services/4">Automation</NuxtLink>
          <NuxtLink to="/services/1">Measuring</NuxtLink>
          <NuxtLink to="/services/2">Analysis</NuxtLink>
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

  <!-- Mobile and tablet Navigation -->
  <nav class="flex justify-between items-center lg:hidden pt-4 layout-pad">
    <div>
      <img
        :src="props.dark ? whiteLogo : mainLogo"
        alt="Meskey Precision Engineering Logo"
        class="w-[15rem]" />
    </div>
    <div>
      <Icon
        name="line-md:close-to-menu-transition"
        @click="toggleMobileMenu"
        :class="
          props.dark
            ? 'text-white ' + 'text-3xl cursor-pointer'
            : 'text-3xl cursor-pointer'
        " />
    </div>
  </nav>

  <div
    v-if="mobileMenuOpen"
    class="flex flex-col justify-between fixed inset-0 bg-white/65 backdrop-blur-md z-50 layout-pad py-4">
    <div class="flex justify-between items-center">
      <img :src="mainLogo" alt="Logo" class="w-[15rem]" />
      <div>
        <Icon
          name="line-md:menu-to-close-transition"
          @click="toggleMobileMenu"
          class="text-2xl cursor-pointer" />
      </div>
    </div>

    <div class="flex flex-col gap-4 items-center text-lg">
      <NuxtLink to="/">Home</NuxtLink>
      <NuxtLink to="/about">About</NuxtLink>
      <NuxtLink to="/">Projects</NuxtLink>
      <div class="relative">
        <div class="flex items-center gap-1 cursor-pointer">
          <span>Services</span>
          <Icon name="iconamoon:arrow-down-2-light"></Icon>
        </div>
      </div>

      <button
        @click="router.push('/contact')"
        class="bg-primary px-6 py-3 text-white font-medium rounded-lg cursor-pointer">
        Contact Us
      </button>
    </div>

    <div class="flex justify-between mx-4 text-grey-80">
      <div class="flex gap-2 items-center">
        <a href="mailto:support@meskyprecisioneng.com">Email</a>
        <Icon name="fluent:link-20-regular" />
      </div>
      <div class="flex gap-2 items-center">
        <a href="tel:+2348032827341">Phone</a>
        <Icon name="fluent:link-20-regular" />
      </div>
    </div>
  </div>
</template>

<style scoped>
a {
  cursor: pointer;
}

a:hover {
  font-weight: 500;
}
</style>
