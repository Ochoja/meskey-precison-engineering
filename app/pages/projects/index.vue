<script setup lang="ts">
const projectsStore = useProjectsStore();

// Ensure projects are fetched (in case plugin didn’t run yet, e.g. SSR edge case)
await projectsStore.fetchProjects();

const projects = computed(() => projectsStore.projects);
</script>

<template>
  <main class="layout-pad mt-12">
    <!-- Header -->
    <header
      class="flex flex-col lg:flex-row justify-between gap-4 pb-12 border-b border-b-primary-10">
      <h1 class="font-medium text-6xl min-w-[40vw] xl:min-w-[30vw] flex-1">
        Our Portfolio.
      </h1>
      <p class="font-light lg:max-w-[50vw] xl:max-w-[45vw]">
        Our portfolio reflects the breadth and depth of our expertise, featuring
        successful projects across oil & gas, industrial, and automation
        sectors. Each project demonstrates our commitment to precision, safety,
        and delivering solutions that exceed client expectations.
      </p>
    </header>

    <!-- Projects List -->
    <section class="my-16">
      <div
        v-for="(project, index) in projects"
        :key="project.id || index"
        class="flex flex-col md:flex-row gap-6 md:gap-16 pb-8 mb-8 border-b border-b-grey-20 last:border-b-0">
        <!-- Main image -->
        <NuxtImg
          :src="
            project.main_image || 'https://placehold.co/600x400?text=No+Image'
          "
          class="min-w-[40%] max-h-[350px] object-cover rounded-2xl border border-primary-10" />

        <!-- Project details -->
        <div class="flex flex-col gap-4">
          <h2 class="mb-1 font-medium text-2xl">{{ project.name }}</h2>
          <p class="font-light">{{ project.description }}</p>

          <!-- Only render if values exist -->
          <div
            class="flex gap-6"
            v-if="project.client || project.delivery_date">
            <div v-if="project.client">
              <div class="font-semibold">Client:</div>
              <div class="font-light text-sm">{{ project.client }}</div>
            </div>
            <div v-if="project.delivery_date">
              <div class="font-semibold">Delivered:</div>
              <div class="font-light text-sm">{{ project.delivery_date }}</div>
            </div>
          </div>

          <!-- CTA -->
          <div>
            <NuxtLink
              :to="`/projects/${project.id}`"
              class="bg-primary-50 text-white px-6 py-[6px] rounded-lg cursor-pointer">
              Learn More
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>
