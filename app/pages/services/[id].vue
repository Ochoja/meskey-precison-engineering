<script setup lang="ts">
import services from '@/assets/data/services.json';
import ProjectSection from '~/components/ProjectSection.vue';

const route = useRoute();
const serviceId = Number(route.params.id);
const data = services.find((item) => item.id === serviceId);
</script>

<template>
  <main class="layout-pad mt-12 mb-24">
    <h1 class="text-4xl md:text-5xl font-medium mb-2">{{ data?.title }}</h1>
    <h3 class="text-xl md:text-2xl mb-8">{{ data?.subtitle }}</h3>

    <!-- plain text, but line breaks are respected -->
    <p class="whitespace-pre-line font-light text-base md:text-lg">
      {{ data?.description }}
    </p>
  </main>

  <ProjectSection />
</template>
