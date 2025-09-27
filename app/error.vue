<script setup>
import notfound from '@/assets/images/notfound.svg';

const router = useRouter();
</script>

<template>
  <main
    class="min-h-[100vh] bg-cover bg-center"
    style="
      background-image: url('https://ik.imagekit.io/Ochoja01/meskey/not_found.jpg?updatedAt=1758981032509');
    ">
    <Navigation dark="true" />

    <div class="flex flex-col gap-6 justify-center items-center mt-[10%]">
      <h1 class="text-3xl font-bold text-white drop-shadow-lg">
        Seems you got in the wrong place
      </h1>
      <img :src="notfound" alt="Page Not Found" class="w-1/3" />
      <button
        @click="router.push('/')"
        class="bg-primary font-medium text-white py-3 px-6 rounded-lg cursor-pointer">
        Go to Home
      </button>
    </div>
  </main>
</template>
