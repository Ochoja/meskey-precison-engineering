<script setup lang="ts">
import { useProjectsStore } from '~/stores/projects';

const route = useRoute();
const projectsStore = useProjectsStore();

// Ensure projects are loaded (so direct visits to /projects/123 still work)
await projectsStore.fetchProjects();

// Computed project based on ID
const project = computed(() => {
  return projectsStore.projects.find(
    (p) => String(p.id) === String(route.params.id)
  );
});

// If project not found in store, fetch directly from Supabase
if (!project.value) {
  const client = useSupabaseClient();
  const { data, error } = await client
    .from('projects')
    .select('*')
    .eq('id', route.params.id)
    .single();

  if (error || !data) {
    throw createError({ statusCode: 404, statusMessage: 'Project not found' });
  }

  projectsStore.projects.push(data); // cache in store for later
}
</script>

<template>
  <main class="layout-pad mt-12">
    <div v-if="project" class="flex flex-col gap-6">
      <h1 class="text-4xl font-medium">{{ project.name }}</h1>
      <p class="font-light">{{ project.description }}</p>

      <div class="flex gap-6" v-if="project.client || project.delivery_date">
        <div v-if="project.client">
          <div class="font-semibold">Client:</div>
          <div class="font-light text-sm">{{ project.client }}</div>
        </div>

        <div v-if="project.delivery_date">
          <div class="font-semibold">Delivered:</div>
          <div class="font-light text-sm">{{ project.delivery_date }}</div>
        </div>
      </div>

      <NuxtImg
        :src="
          project.main_image || 'https://placehold.co/600x400?text=No+Image'
        "
        class="rounded-2xl border border-primary-10 max-w-3xl" />
    </div>
  </main>
</template>
