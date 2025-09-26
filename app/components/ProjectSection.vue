<script setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const headerString = ref('Our Projects');

if (route.fullPath.includes('services')) {
  headerString.value = 'Our Completed Projects';
}

const projects = [
  {
    title: 'Project One',
    image:
      'https://ik.imagekit.io/Ochoja01/meskey/herobg.png?updatedAt=1758227487910',
  },
  {
    title: 'Project Two',
    image:
      'https://ik.imagekit.io/Ochoja01/meskey/herobg.png?updatedAt=1758227487910',
  },
  {
    title: 'Project Three',
    image:
      'https://ik.imagekit.io/Ochoja01/meskey/herobg.png?updatedAt=1758227487910',
  },
];
</script>

<template>
  <section class="text-center my-16 flex flex-col gap-8">
    <!-- Section Header -->
    <h2 class="text-2xl font-semibold">{{ headerString }}</h2>

    <!-- Projects Grid -->
    <div
      class="layout-pad grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="(project, index) in projects"
        :key="index"
        class="flex flex-col gap-4">
        <div class="min-h-[50vh]">
          <NuxtImg
            :src="project.image"
            class="rounded-2xl w-full h-full object-cover" />
        </div>
        <p class="text-lg font-medium">{{ project.title }}</p>
      </div>
    </div>

    <!-- CTA Button -->
    <div>
      <button
        @click="router.push('/projects')"
        class="bg-primary px-6 py-3 text-white font-medium rounded-lg cursor-pointer hover:bg-primary/90 transition">
        View More
      </button>
    </div>
  </section>
</template>
