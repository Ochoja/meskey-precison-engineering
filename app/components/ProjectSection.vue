<script setup>
import { useProjectsStore } from '~/stores/projects';
import { useRouter, useRoute } from 'vue-router';
import { useSupabaseClient } from '#imports';

const route = useRoute();
const router = useRouter();
const client = useSupabaseClient();
const projectsStore = useProjectsStore();

// Detect if on service page
const isServicePage = computed(() => route.path.startsWith('/services'));

// Map service id → name
const serviceMap = {
  1: 'Measuring',
  2: 'Analysis',
  3: 'Metering',
  4: 'Automation',
  5: 'Monitoring',
};

// Async load projects
const { data: projects } = await useAsyncData('projects', async () => {
  // If store already has projects, return them
  if (projectsStore.projects.length) return projectsStore.projects;

  // Otherwise fetch all projects
  const { data, error } = await client.from('projects').select('*');
  if (error || !data) return [];

  // Save to store
  projectsStore.projects.push(...data);
  return data;
});

// Compute projects to display
const displayedProjects = computed(() => {
  if (!projects.value) return [];

  if (isServicePage.value) {
    const serviceId = String(route.params.id);
    const serviceName = serviceMap[serviceId];
    return projects.value.filter((p) => p.category === serviceName).slice(0, 3);
  }

  // Home page: first 3 projects
  return projects.value.slice(0, 3);
});

// Navigate to project page
function goToProject(id) {
  router.push(`/projects/${id}`);
}
</script>

<template>
  <section class="text-center my-16 flex flex-col gap-6">
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
        <div class="min-h-[50vh]">
          <NuxtImg
            :src="
              project.main_image || 'https://placehold.co/600x400?text=No+Image'
            "
            class="rounded-2xl w-full h-full object-cover" />
        </div>
        <p>{{ project.name }}</p>
      </div>
    </div>

    <!-- CTA Button -->
    <div v-if="displayedProjects.length">
      <button
        @click="router.push('/projects')"
        class="bg-primary px-6 py-3 text-white font-medium rounded-lg cursor-pointer hover:bg-primary/90 transition">
        View More
      </button>
    </div>
  </section>
</template>
