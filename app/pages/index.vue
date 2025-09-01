<script setup lang="ts">
definePageMeta({
  layout: 'home',
});
</script>

<template>
  <header class="bg-grey-110">
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
</template>
