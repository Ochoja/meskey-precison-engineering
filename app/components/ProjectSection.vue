<script setup>
import { useProjectsStore } from '~/stores/projects';
import { useRouter, useRoute } from 'vue-router';
import { useSupabaseClient } from '#imports';
import { computed } from 'vue';

const route = useRoute();
const router = useRouter();
const client = useSupabaseClient();
const projectsStore = useProjectsStore();

// Prefetch all projects immediately when app loads
if (!projectsStore.projects.length) {
  const { data } = await client.from('projects').select('*');
  if (data) projectsStore.projects.push(...data);
}

// Detect if on a service page
const isServicePage = computed(() => route.path.startsWith('/services'));

// Map service id → name
const serviceMap = {
  1: 'Measuring',
  2: 'Analysis',
  3: 'Metering',
  4: 'Automation',
  5: 'Monitoring',
};

// Compute projects to display
const displayedProjects = computed(() => {
  if (!projectsStore.projects.length) return [];

  if (isServicePage.value) {
    const serviceId = String(route.params.id);
    const serviceName = serviceMap[serviceId];
    return projectsStore.projects
      .filter((p) => p.category === serviceName)
      .slice(0, 3);
  }

  // Home page: first 3 projects
  return projectsStore.projects.slice(0, 3);
});

// Navigate to project page
function goToProject(id) {
  router.push(`/projects/${id}`);
}
</script>

<template>
  <!-- Only render section if there are projects to show -->
  <section
    v-if="displayedProjects.length"
    class="text-center my-16 flex flex-col gap-6">
    <!-- Section Header -->
    <h2 class="text-2xl font-medium">
      {{ isServicePage ? 'Our Completed Projects' : 'Our Projects' }}
    </h2>

    <!-- Projects Grid -->
    <div
      class="layout-pad grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="(project, index) in displayedProjects"
        :key="index"
        class="flex flex-col gap-1 cursor-pointer"
        @click="goToProject(project.id)">
        <div class="w-full h-[300px] overflow-hidden rounded-2xl">
          <NuxtImg
            :src="
              project.main_image || 'https://placehold.co/600x400?text=No+Image'
            "
            class="w-full h-full object-cover rounded-2xl" />
        </div>
        <p>{{ project.name }}</p>
      </div>
    </div>

    <!-- CTA Button -->
    <div v-if="!isServicePage">
      <NuxtLink
        to="/projects"
        class="bg-primary px-6 py-3 text-white font-medium rounded-lg cursor-pointer hover:bg-primary/90 transition">
        View More
      </NuxtLink>
    </div>
  </section>
</template>
