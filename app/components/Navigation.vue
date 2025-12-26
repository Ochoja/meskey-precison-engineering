<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useScrollLock, useMediaQuery } from '@vueuse/core';

import blackLogo from '@/assets/images/blacklogo.png';
import whiteLogo from '@/assets/images/whitelogo.png';
import mainLogo from '@/assets/images/mainlogo.png';

const router = useRouter();
const route = useRoute();

const props = defineProps({
  dark: String,
});

/* ------------------ NAV DATA ------------------ */

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
  { name: 'Meskey Engineering Service', path: '/companies/engservice' },
  { name: 'Meskey Holding', path: '/companies/meskeyholding' },
  { name: 'Meskey Technologies', path: '/companies/meskeytechnologies' },
  { name: 'Meskey Limited', path: '/companies/meskeylimited' },
  { name: 'Meskey Service', path: '/companies/meskeyservice' },
];

/* ------------------ STATE ------------------ */

const mobileMenuOpen = ref(false);
const openDropdown = ref<null | 'services' | 'companies'>(null);

/* ------------------ SCROLL LOCK ------------------ */

// SSR-safe body reference
const body = typeof document !== 'undefined' ? document.body : null;

const isLocked = useScrollLock(body);

watch(mobileMenuOpen, (open) => {
  isLocked.value = open;
});

/* ------------------ CLOSE ON DESKTOP ------------------ */

// Tailwind lg breakpoint
const isDesktop = useMediaQuery('(min-width: 1024px)');

watch(isDesktop, (desktop) => {
  if (desktop) {
    mobileMenuOpen.value = false;
    openDropdown.value = null;
  }
});

/* ------------------ CLOSE ON ROUTE CHANGE ------------------ */

watch(
  () => route.fullPath,
  () => {
    mobileMenuOpen.value = false;
    openDropdown.value = null;
  }
);

/* ------------------ METHODS ------------------ */

const toggleDropdown = (menu: 'services' | 'companies') => {
  openDropdown.value = openDropdown.value === menu ? null : menu;
};

const toggleMobileMenu = () => {
  openDropdown.value = null;
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

    <div :class="props.dark ? 'text-white flex gap-6' : 'flex gap-6'">
      <NuxtLink to="/">Home</NuxtLink>
      <NuxtLink to="/about">About</NuxtLink>
      <NuxtLink to="/projects">Projects</NuxtLink>

      <!-- Services Dropdown -->
      <div class="relative">
        <button
          @click="toggleDropdown('services')"
          class="flex items-center gap-1"
          aria-haspopup="true"
          :aria-expanded="openDropdown === 'services'">
          <span>Services</span>
          <Icon name="iconamoon:arrow-down-2-light" />
        </button>

        <div
          v-if="openDropdown === 'services'"
          class="absolute top-8 flex flex-col gap-2 px-4 py-2 bg-white text-grey-110 rounded-lg border border-primary-30">
          <NuxtLink v-for="s in services" :key="s.path" :to="s.path">
            {{ s.name }}
          </NuxtLink>
        </div>
      </div>

      <!-- Companies Dropdown -->
      <div class="relative">
        <button
          @click="toggleDropdown('companies')"
          class="flex items-center gap-1"
          aria-haspopup="true"
          :aria-expanded="openDropdown === 'companies'">
          <span>Our Companies</span>
          <Icon name="iconamoon:arrow-down-2-light" />
        </button>

        <div
          v-if="openDropdown === 'companies'"
          class="absolute top-8 w-[140%] flex flex-col gap-2 px-4 py-2 bg-white text-grey-110 rounded-lg border border-primary-30">
          <NuxtLink v-for="c in companies" :key="c.path" :to="c.path">
            {{ c.name }}
          </NuxtLink>
        </div>
      </div>
    </div>

    <NuxtLink
      to="/contact"
      class="bg-primary font-medium text-white py-3 px-6 rounded-lg">
      Contact Us
    </NuxtLink>
  </nav>

  <!-- Mobile Header -->
  <nav class="flex justify-between items-center lg:hidden pt-4 layout-pad">
    <img
      :src="props.dark ? whiteLogo : mainLogo"
      alt="Meskey Precision Engineering Logo"
      class="w-[15rem]" />

    <Icon
      name="line-md:close-to-menu-transition"
      @click="toggleMobileMenu"
      :class="props.dark ? 'text-white text-3xl' : 'text-3xl'" />
  </nav>

  <!-- Mobile Menu -->
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

      <!-- Services -->
      <div class="flex flex-col">
        <div
          @click="toggleDropdown('services')"
          class="flex items-center gap-1 cursor-pointer">
          <span>Services</span>
          <Icon name="iconamoon:arrow-down-2-light" />
        </div>

        <div
          v-show="openDropdown === 'services'"
          class="flex flex-col mt-1 ml-4">
          <NuxtLink v-for="s in services" :key="s.path" :to="s.path">
            {{ s.name }}
          </NuxtLink>
        </div>
      </div>

      <!-- Companies -->
      <div class="flex flex-col">
        <div
          @click="toggleDropdown('companies')"
          class="flex items-center gap-1 cursor-pointer">
          <span>Our Company</span>
          <Icon name="iconamoon:arrow-down-2-light" />
        </div>

        <div
          v-show="openDropdown === 'companies'"
          class="flex flex-col mt-1 ml-4">
          <NuxtLink v-for="c in companies" :key="c.path" :to="c.path">
            {{ c.name }}
          </NuxtLink>
        </div>
      </div>

      <NuxtLink
        to="/contact"
        class="bg-primary px-6 py-3 text-white font-medium rounded-lg">
        Contact Us
      </NuxtLink>
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
