<script setup lang="ts">
import { ref, watch, onBeforeUnmount } from 'vue';
import { useRoute } from 'vue-router';
import { useMediaQuery, onClickOutside } from '@vueuse/core';

// Assets
import whiteLogo from '@/assets/images/whitelogo.png';
import mainLogo from '@/assets/images/mainlogo.png';

const route = useRoute();
const props = defineProps({ dark: String });

const services = [
  { name: 'Metering', path: '/services/3' },
  { name: 'Monitoring', path: '/services/5' },
  { name: 'Automation', path: '/services/4' },
  { name: 'Measuring', path: '/services/1' },
  { name: 'Analysis', path: '/services/2' },
];

const companies = [
  { name: 'Meskey Group', path: '/companies/meskeygroup' },
  { name: 'Meskey Energy', path: '/companies/meskeyenergy' },
];

// --- State ---
const mobileMenuOpen = ref(false);
const openDropdown = ref<null | 'services' | 'companies'>(null);

// --- Template Refs ---
const servicesRef = ref(null);
const companiesRef = ref(null);

// --- Scroll Lock Logic (robust, works on mobile/iOS) ---
let lockedScrollY = 0;
const lockScroll = () => {
  lockedScrollY = window.scrollY || 0;
  document.documentElement.style.overflow = 'hidden';
  document.body.style.position = 'fixed';
  document.body.style.top = `-${lockedScrollY}px`;
  document.body.style.width = '100%';
};

const unlockScroll = () => {
  document.documentElement.style.overflow = '';
  document.body.style.position = '';
  document.body.style.top = '';
  document.body.style.width = '';
  window.scrollTo(0, lockedScrollY);
};

watch(mobileMenuOpen, (open) => {
  if (open) lockScroll();
  else unlockScroll();
});

// --- Click Outside Logic ---
onClickOutside(servicesRef, () => {
  if (openDropdown.value === 'services') openDropdown.value = null;
});

onClickOutside(companiesRef, () => {
  if (openDropdown.value === 'companies') openDropdown.value = null;
});

// --- Responsive & Navigation Watchers ---
const isDesktop = useMediaQuery('(min-width: 1024px)');

watch(isDesktop, (desktop) => {
  if (desktop) {
    mobileMenuOpen.value = false;
    openDropdown.value = null;
  }
});

watch(
  () => route.fullPath,
  () => {
    mobileMenuOpen.value = false;
    openDropdown.value = null;
  },
);

const toggleDropdown = (menu: 'services' | 'companies') => {
  openDropdown.value = openDropdown.value === menu ? null : menu;
};

const toggleMobileMenu = () => {
  openDropdown.value = null;
  mobileMenuOpen.value = !mobileMenuOpen.value;
};

onBeforeUnmount(() => {
  // Safety: if user navigates away with menu open
  if (mobileMenuOpen.value) unlockScroll();
});
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

    <div :class="props.dark ? 'text-white flex gap-6' : 'flex gap-6'">
      <NuxtLink to="/">Home</NuxtLink>
      <NuxtLink to="/about">About</NuxtLink>
      <NuxtLink to="/projects">Projects</NuxtLink>

      <div class="relative" ref="servicesRef">
        <button
          @click="toggleDropdown('services')"
          class="flex items-center gap-1 cursor-pointer"
          aria-haspopup="true"
          :aria-expanded="openDropdown === 'services'">
          <span>Services</span>
          <Icon name="iconamoon:arrow-down-2-light" />
        </button>

        <div
          v-if="openDropdown === 'services'"
          class="absolute top-8 flex flex-col gap-2 px-4 py-2 bg-white text-grey-110 rounded-lg border border-primary-30 z-10">
          <NuxtLink v-for="s in services" :key="s.path" :to="s.path">
            {{ s.name }}
          </NuxtLink>
        </div>
      </div>

      <div class="relative" ref="companiesRef">
        <button
          @click="toggleDropdown('companies')"
          class="flex items-center gap-1 cursor-pointer"
          aria-haspopup="true"
          :aria-expanded="openDropdown === 'companies'">
          <span>Our Companies</span>
          <Icon name="iconamoon:arrow-down-2-light" />
        </button>

        <div
          v-if="openDropdown === 'companies'"
          class="absolute top-8 w-[140%] flex flex-col gap-2 px-4 py-2 bg-white text-grey-110 rounded-lg border border-primary-30 z-10">
          <NuxtLink v-for="c in companies" :key="c.path" :to="c.path">
            {{ c.name }}
          </NuxtLink>
        </div>
      </div>
    </div>

    <NuxtLink
      to="/contact"
      class="bg-primary hover:bg-primary-50 font-medium text-white py-3 px-6 rounded-lg">
      Contact Us
    </NuxtLink>
  </nav>

  <!-- Mobile Navigation -->
  <nav class="flex justify-between items-center lg:hidden pt-4 layout-pad">
    <img
      :src="props.dark ? whiteLogo : mainLogo"
      alt="Meskey Precision Engineering Logo"
      class="w-[15rem]" />

    <Icon
      name="line-md:close-to-menu-transition"
      @click="toggleMobileMenu"
      :class="
        props.dark
          ? 'text-white text-3xl cursor-pointer'
          : 'text-3xl cursor-pointer'
      " />
  </nav>

  <div
    v-if="mobileMenuOpen"
    class="lg:hidden fixed inset-0 z-50 flex flex-col justify-between bg-white/65 backdrop-blur-md layout-pad py-4">
    <div class="flex justify-between items-center">
      <img :src="mainLogo" alt="Logo" class="w-[15rem]" />

      <Icon
        name="line-md:menu-to-close-transition"
        @click="toggleMobileMenu"
        class="text-2xl cursor-pointer" />
    </div>

    <div class="flex flex-col gap-4 items-center text-lg">
      <NuxtLink to="/">Home</NuxtLink>
      <NuxtLink to="/about">About</NuxtLink>
      <NuxtLink to="/projects">Projects</NuxtLink>

      <div class="flex flex-col items-center">
        <div
          @click="toggleDropdown('services')"
          class="flex items-center gap-1 cursor-pointer">
          <span>Services</span>
          <Icon name="iconamoon:arrow-down-2-light" />
        </div>

        <div
          v-show="openDropdown === 'services'"
          class="flex flex-col mt-1 items-center opacity-80">
          <NuxtLink v-for="s in services" :key="s.path" :to="s.path">
            {{ s.name }}
          </NuxtLink>
        </div>
      </div>

      <div class="flex flex-col items-center">
        <div
          @click="toggleDropdown('companies')"
          class="flex items-center gap-1 cursor-pointer">
          <span>Our Company</span>
          <Icon name="iconamoon:arrow-down-2-light" />
        </div>

        <div
          v-show="openDropdown === 'companies'"
          class="flex flex-col mt-1 items-center opacity-80">
          <NuxtLink v-for="c in companies" :key="c.path" :to="c.path">
            {{ c.name }}
          </NuxtLink>
        </div>
      </div>

      <NuxtLink
        to="/contact"
        class="bg-primary hover:bg-primary-50 px-6 py-3 text-white font-medium rounded-lg">
        Contact Us
      </NuxtLink>
    </div>

    <div class="flex justify-between mx-4 text-grey-80">
      <a
        href="mailto:support@meskyprecisioneng.com"
        class="flex gap-2 items-center">
        <span>Email</span> <Icon name="fluent:link-20-regular" />
      </a>

      <div class="flex gap-2 items-center">
        <a href="tel:+2347030399465">Phone</a>
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
