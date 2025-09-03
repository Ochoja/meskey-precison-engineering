<script setup lang="ts">
import { Vue3Marquee } from 'vue3-marquee';

const marqueelist = [
  'Measuring',
  'Automation',
  'Monitoring',
  'Control Systems',
  'Fuel Systems',
  'SCADA Integration',
  'Pipeline Integrity Checks',
  'Instrumentation',
  'Procurement',
];

definePageMeta({
  layout: 'home',
});
</script>

<template>
  <header class="bg-[url(~/assets/images/herobg.png)]">
    <Navigation dark="true" />
    <div
      class="text-white text-center py-[25vh] w-[85%] lg:w-[70%] mx-auto flex flex-col gap-6">
      <h1 class="font-medium text-4xl md:text-6xl xl:text-7xl">
        Optimization is our <span class="text-primary">Core</span>
      </h1>
      <p class="font-light text-sm md:text-lg">
        At Meskey Precision Engineering Limited, we integrate automation,
        metering, monitoring, and analytical expertise to deliver
        high-performance engineering solutions across oil & gas, industrial, and
        hazardous environments. From control systems and pipeline integrity
        checks to advanced instrumentation, fuel systems, and SCADA integration,
        we engineer efficiency, reliability, and safety into every project —
        whether brownfield or greenfield.
      </p>
      <div>
        <button class="bg-primary font-medium text-white py-3 px-6 rounded-lg">
          Contact Us
        </button>
      </div>
    </div>
  </header>

  <Vue3Marquee class="bg-grey-110 py-6 overflow-hidden">
    <div
      v-for="(item, key) in marqueelist"
      :key="key"
      class="flex items-center gap-8 px-8">
      <img src="../assets/images/logo.png" alt="" height="50" width="50" />
      <h5 class="text-white">
        {{ item }}
      </h5>
    </div>
  </Vue3Marquee>
</template>
