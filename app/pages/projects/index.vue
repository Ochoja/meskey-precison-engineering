<script setup>
const dummyData = [
  {
    project_name: 'Dangote Cement',
    date_delivered: '26-05-2025',
    description:
      'Lorem ipsum viverra massa imperdiet risus eu dictum elit risus ipsum vel accumsan pellentesque risus vitae sed cras dignissimnibh sed tempus purus hac vitae in porta arcu sagittis sagittis leo ut molestie tincidunt dui amet lorem et a faucibus.',
  },
  {
    project_name: 'Dangote Cement',
    date_delivered: '26-05-2025',
    description:
      'Lorem ipsum viverra massa imperdiet risus eu dictum elit risus ipsum vel accumsan pellentesque risus vitae sed cras dignissimnibh sed tempus purus hac vitae in porta arcu sagittis sagittis leo ut molestie tincidunt dui amet lorem et a faucibus.',
  },
  {
    project_name: 'Dangote Cement',
    date_delivered: '26-05-2025',
    description:
      'Lorem ipsum viverra massa imperdiet risus eu dictum elit risus ipsum vel accumsan pellentesque risus vitae sed cras dignissimnibh sed tempus purus hac vitae in porta arcu sagittis sagittis leo ut molestie tincidunt dui amet lorem et a faucibus.',
  },
];
</script>

<template>
  <main class="layout-pad mt-12">
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

    <section class="my-16">
      <div
        v-for="(project, index) in dummyData"
        :key="index"
        class="flex flex-col md:flex-row justify-between gap-6 md:gap-16 pb-8 mb-8 border-b border-b-grey-20 last:border-b-0">
        <NuxtImg
          src="https://ik.imagekit.io/Ochoja01/meskey/aboutimg.png?updatedAt=1758225850884"
          class="min-w-[40%] rounded-2xl" />

        <div class="flex flex-col gap-4">
          <h2 class="mb-1 font-medium text-2xl">{{ project.project_name }}</h2>
          <p class="font-light">
            {{ project.description }}
          </p>

          <div>
            <div class="font-semibold">Delivered:</div>
            <div class="font-light text-sm">{{ project.date_delivered }}</div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>
