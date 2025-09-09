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

  <section class="layout-pad mt-16 mb-32">
    <button
      class="mb-3 text-grey bg-primary-10 px-6 py-2 rounded-full border border-grey-20">
      Why Choose Us
    </button>
    <h1 class="text-3xl mb-6">
      Why Meskey Precision is the
      <span class="font-semibold text-primary-50">Right Choice</span>
    </h1>

    <div class="grid grid-cols-1 lg:grid-cols-[2.5fr_1fr] gap-4">
      <div>
        <div class="flex gap-4 mb-4">
          <div class="bg-white p-3 border border-primary-20 rounded-2xl h-full">
            <Icon name="stash:globe" class="text-4xl text-primary" />
            <h6 class="font-medium text-xl">
              Standards-Driven, Globally Informed
            </h6>
            <p class="font-light">
              Combining local expertise with global standards such as ISO and
              API, we ensure every project meets the highest benchmarks in
              safety, quality, and regulatory compliance.
            </p>
          </div>
          <div class="bg-white p-3 border border-primary-20 rounded-2xl h-full">
            <Icon name="f7:graph-circle" class="text-4xl text-primary" />
            <h6 class="font-medium text-xl">Precision Meets Performance</h6>
            <p class="font-light">
              Our systems are built with uncompromising attention to detail,
              designed and calibrated to deliver accurate results, long-term
              durability, and maximum operational efficiency.
            </p>
          </div>
        </div>
        <div class="bg-white p-3 border border-primary-20 rounded-2xl">
          <Icon
            name="fluent:weather-haze-24-regular"
            class="text-4xl text-primary" />
          <h6 class="font-medium text-xl">Engineered for Harsh Environments</h6>
          <p class="font-light">
            We specialize in delivering reliable, mission-critical solutions
            that perform under extreme conditions — from offshore platforms to
            hazardous industrial zones — ensuring consistent uptime and safety
            where it matters most.
          </p>
        </div>
      </div>
      <div
        class="bg-primary p-3 text-white rounded-2xl flex flex-col justify-between">
        <div>
          <Icon name="mingcute:apple-intelligence-line" class="text-4xl" />
          <h6 class="font-medium text-xl">Intelligence in Every Operation</h6>
          <p class="font-light">
            We deploy intelligent automation and monitoring systems that provide
            real-time insights and remote control capabilities, empowering
            operators with faster, data-driven decision-making.
          </p>
        </div>
        <div>
          <button
            class="text-grey-110 font-medium bg-white rounded-lg px-4 py-2">
            Contact Us
          </button>
        </div>
      </div>
    </div>
  </section>
</template>
