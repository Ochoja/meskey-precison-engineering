<script setup>
import { ref, computed, nextTick } from 'vue';
import { useProjectsStore } from '~/stores/projects';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

const route = useRoute();
const client = useSupabaseClient();
const projectsStore = useProjectsStore();

// --- route param ---
const projectId = computed(() => {
  const id = route.params.id;
  return Array.isArray(id) ? id[0] : id || '';
});

// --- data fetch ---
const { data: project, pending } = await useAsyncData(
  `project-${projectId.value}`,
  async () => {
    if (!projectId.value) return null;

    // 1️⃣ Try store first
    const cached = projectsStore.projects.find(
      (p) => String(p.id) === projectId.value
    );
    if (cached) return cached;

    // 2️⃣ Try API route
    const { data: apiProjects } = await useFetch('/api/projects');
    if (apiProjects.value?.length) {
      projectsStore.projects = apiProjects.value;
      const found = apiProjects.value.find(
        (p) => String(p.id) === projectId.value
      );
      if (found) return found;
    }

    // 3️⃣ Try Supabase fallback
    const { data, error } = await client
      .from('projects')
      .select('*')
      .eq('id', projectId.value)
      .single();

    if (error || !data) return null;
    projectsStore.projects.push(data);
    return data;
  }
);

// --- Handle not found: trigger Nuxt 404 error page ---
if (!pending.value && !project.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Project not found',
    fatal: true,
  });
}

// --- images ---
const images = computed(() => {
  if (!project.value) return [];
  const extras = Array.isArray(project.value.other_images)
    ? project.value.other_images.filter(Boolean)
    : [];
  return [project.value.main_image, ...extras].filter(Boolean);
});

// --- swiper navigation ---
const prevEl = ref(null);
const nextEl = ref(null);

const onSwiperMounted = async (swiper) => {
  await nextTick();
  if (process.client && prevEl.value && nextEl.value) {
    swiper.params.navigation.prevEl = prevEl.value;
    swiper.params.navigation.nextEl = nextEl.value;
    swiper.navigation.init();
    swiper.navigation.update();
  }
};
</script>

<template>
  <!-- loading -->
  <main v-if="pending" class="layout-pad mt-12 mb-20">
    <p>Loading project...</p>
  </main>

  <!-- project -->
  <main v-else class="layout-pad mt-12 mb-20">
    <h1 class="text-4xl font-medium mb-2">{{ project.name }}</h1>

    <div class="flex flex-wrap font-medium text-primary gap-4">
      <div v-if="project.category">{{ project.category }}</div>
      <div v-if="project.client">{{ project.client }}</div>
      <div v-if="project.delivery_date">{{ project.delivery_date }}</div>
    </div>

    <p class="font-light text-lg mt-4">{{ project.description }}</p>

    <section class="mt-12">
      <div class="flex justify-between items-center">
        <h2 class="font-medium text-3xl">Project Images</h2>

        <!-- navigation buttons -->
        <div class="flex gap-4 text-primary text-4xl">
          <div
            ref="prevEl"
            class="cursor-pointer hover:scale-110 transition-transform">
            <Icon name="solar:round-arrow-left-line-duotone" />
          </div>
          <div
            ref="nextEl"
            class="cursor-pointer hover:scale-110 transition-transform">
            <Icon name="solar:round-arrow-right-line-duotone" />
          </div>
        </div>
      </div>

      <ClientOnly>
        <div class="mt-6">
          <Swiper
            :modules="[Navigation, Autoplay]"
            :space-between="30"
            :loop="true"
            :autoplay="{ delay: 4000, disableOnInteraction: false }"
            :breakpoints="{
              0: { slidesPerView: 1.1 },
              640: { slidesPerView: 1.5 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 2.5 },
            }"
            class="overflow-visible"
            @swiper="onSwiperMounted">
            <SwiperSlide
              v-for="(img, i) in images"
              :key="i"
              class="flex flex-col items-start">
              <NuxtImg
                :src="img || 'https://placehold.co/600x400?text=No+Image'"
                alt="Project image"
                class="w-full h-[400px] object-cover rounded-xl mb-3 border border-primary-30" />
            </SwiperSlide>
          </Swiper>
        </div>
      </ClientOnly>
    </section>
  </main>
</template>
