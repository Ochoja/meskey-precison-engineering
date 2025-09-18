<template>
  <main class="layout-pad mt-8 mb-20">
    <h1 class="text-4xl">Meskey Energy</h1>
    <p class="font-light text-sm mt-1">Meskey Energy Caption goes here</p>

    <section class="mt-6 font-light">
      Meskey Energy is driving the future of power and smart infrastructure by
      bringing world-leading expertise in electrification, automation, and
      digitisation. We deliver intelligent solutions for smart industries,
      resilient infrastructure, future-proof data centres, intelligent
      buildings, and intuitive homes. Anchored in deep domain knowledge, we
      provide end-to-end AI-enabled Industrial IoT solutions—seamlessly
      integrating connected products, automation systems, software, and
      services. From digital twins to advanced power management, we empower
      businesses and communities to achieve sustainable, profitable growth.
    </section>

    <section class="mt-6">
      <h2 class="text-2xl mb-2">Our Services:</h2>
      <ul class="font-light">
        <li>
          <span class="font-semibold"
            >Electrical installations & rural electrification</span
          >
          — end-to-end projects to connect communities and enterprises to
          reliable power.
        </li>
        <li>
          <span class="font-semibold"
            >Transformer & streetlight installation</span
          >
          — robust deployment and planning for safer, better-lit towns and urban
          areas.
        </li>
        <li>
          <span class="font-semibold">Power plant maintenance</span> — scheduled
          and predictive services to maximise uptime and performance.
        </li>
        <li>
          <span class="font-semibold"
            >Metering, cable scheduling & tap charger solutions</span
          >
          — precision planning and monitoring to improve efficiency and billing
          accuracy.
        </li>
        <li>
          <span class="font-semibold">UPS, inverters & battery banks</span> —
          resilient backup systems for mission-critical operations.
        </li>
        <li>
          <span class="font-semibold"
            >Power control panels & control rooms</span
          >
          — centralized control, safety interlocks and operational visibility.
        </li>
      </ul>
    </section>

    <p class="mt-8 font-light">
      At Meskey Energy, we don’t just install power systems—we build
      future-ready energy ecosystems that combine reliability, innovation, and
      sustainability.
    </p>

    <section class="mt-10">
      <h2 class="text-2xl mb-4">Gallery</h2>
      <Swiper
        :modules="[Pagination, Navigation, Autoplay]"
        :slides-per-view="1"
        :space-between="20"
        :pagination="{ clickable: true }"
        :navigation="true"
        :autoplay="{ delay: 3000, disableOnInteraction: false }"
        :breakpoints="{
          640: { slidesPerView: 1, spaceBetween: 20 }, // mobile
          1024: { slidesPerView: 3, spaceBetween: 30 }, // desktop
        }"
        class="gallery-swiper">
        <SwiperSlide v-for="(image, index) in images" :key="index">
          <img :src="image" class="w-full h-[40vh] object-cover rounded-lg" />
        </SwiperSlide>
      </Swiper>
    </section>
  </main>
</template>

<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Pagination, Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const images = [
  'https://ik.imagekit.io/Ochoja01/meskey/WhatsApp%20Image%202025-09-18%20at%207.21.59%20PM.jpeg?updatedAt=1758220615029',
  'https://ik.imagekit.io/Ochoja01/meskey/WhatsApp%20Image%202025-09-18%20at%207.21.57%20PM%20(1).jpeg?updatedAt=1758220614902',
  'https://ik.imagekit.io/Ochoja01/meskey/WhatsApp%20Image%202025-09-18%20at%207.21.58%20PM.jpeg?updatedAt=1758220614658',
  'https://ik.imagekit.io/Ochoja01/meskey/WhatsApp%20Image%202025-09-18%20at%207.21.57%20PM.jpeg?updatedAt=1758220614656',
  'https://ik.imagekit.io/Ochoja01/meskey/WhatsApp%20Image%202025-09-18%20at%207.22.02%20PM.jpeg?updatedAt=1758220614645',
];
</script>

<style scoped>
/* Move pagination below the images */
.gallery-swiper .swiper-pagination {
  position: static;
  margin-top: 1rem;
  text-align: center;
}

/* Move arrows outside the image area */
.gallery-swiper .swiper-button-next,
.gallery-swiper .swiper-button-prev {
  top: auto;
  bottom: -40px;
  color: #333; /* make arrow color visible */
}
.gallery-swiper .swiper-button-prev {
  left: 40%;
}
.gallery-swiper .swiper-button-next {
  right: 40%;
}
</style>
