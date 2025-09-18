<script setup>
const route = useRoute();
const router = useRouter();
const headerString = ref('Our Projects');

if (route.fullPath.includes('services')) {
  headerString.value = 'Our Completed Projects';
}
</script>

<template>
  <section class="text-center my-16 flex flex-col gap-8">
    <h2 class="text-2xl">{{ headerString }}</h2>

    <div
      class="layout-pad grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      <div
        class="bg-[url(https://ik.imagekit.io/Ochoja01/meskey/herobg.png?updatedAt=1758227487910)] min-h-[40vh] rounded-2xl bg-cover bg-center"></div>
      <div
        class="bg-[url(https://ik.imagekit.io/Ochoja01/meskey/herobg.png?updatedAt=1758227487910)] min-h-[40vh] rounded-2xl bg-cover bg-center"></div>
      <div
        class="bg-[url(https://ik.imagekit.io/Ochoja01/meskey/herobg.png?updatedAt=1758227487910)] min-h-[40vh] rounded-2xl bg-cover bg-center"></div>
    </div>

    <div>
      <button
        @click="router.push('/projects')"
        class="bg-primary px-6 py-3 text-white font-medium rounded-lg cursor-pointer">
        View More
      </button>
    </div>
  </section>
</template>
