<script setup>
import { useProjectsStore } from '~/stores/projects';

const route = useRoute();
const client = useSupabaseClient();
const projectsStore = useProjectsStore();

// Normalize id to always be string
const projectId = computed(() => {
  const id = route.params.id;
  if (Array.isArray(id)) return id[0];
  return id ?? '';
});

// Async load project (SSR + CSR safe)
const { data: project } = await useAsyncData(
  `project-${projectId.value}`,
  async () => {
    if (!projectId.value) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid project id',
      });
    }

    const cached = projectsStore.projects.find(
      (p) => String(p.id) === projectId.value
    );
    if (cached) return cached;

    // Otherwise fetch from Supabase
    const { data, error } = await client
      .from('projects')
      .select('*')
      .eq('id', projectId.value)
      .single();

    if (error || !data) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Project not found',
      });
    }

    projectsStore.projects.push(data);
    return data;
  }
);

// Images array
const images = computed(() => {
  if (!project.value) return [];
  const extras = Array.isArray(project.value.other_images)
    ? project.value.other_images.filter(Boolean)
    : [];
  return [project.value.main_image, ...extras].filter(Boolean);
});
</script>

<template>
  <main v-if="project" class="layout-pad mt-12 mb-20">
    <!-- Project info -->
    <h1 class="text-4xl font-medium mb-2">{{ project.name }}</h1>

    <div class="flex flex-wrap font-medium text-primary gap-4">
      <div v-if="project.category">{{ project.category }}</div>
      <div v-if="project.client">{{ project.client }}</div>
      <div v-if="project.delivery_date">{{ project.delivery_date }}</div>
    </div>

    <p class="font-light text-lg mt-4">{{ project.description }}</p>

    <!-- Project images -->
    <h2 class="mt-12 font-medium text-3xl mb-4">Project Images</h2>

    <div class="grid gap-4 md:grid-cols-2">
      <NuxtImg
        v-for="(img, i) in images"
        :key="i"
        :src="img || 'https://placehold.co/600x400?text=No+Image'"
        class="h-[400px] object-cover rounded-xl border border-primary-10" />
    </div>
  </main>

  <section v-else>
    <p>Loading project...</p>
  </section>
</template>
