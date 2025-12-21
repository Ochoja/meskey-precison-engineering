<template>
  <main class="layout-pad mt-8 mb-20">
    <h1 class="text-4xl font-medium">Meskey Energy</h1>
    <p class="font-light text-sm mt-1">Reliable Energy. Smarter Solutions.</p>

    <section class="mt-6 font-light leading-relaxed">
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
      <h2 class="text-2xl mb-4 font-medium">Our Services</h2>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="(service, i) in services"
          :key="i"
          class="bg-white border border-grey-20 rounded-2xl p-6 hover:shadow-lg transition-shadow">
          <Icon :name="service.icon" class="text-primary text-4xl mb-4" />

          <h3 class="font-medium text-lg mb-2">
            {{ service.title }}
          </h3>

          <p class="font-light text-sm leading-relaxed text-grey-90">
            {{ service.description }}
          </p>
        </div>
      </div>
    </section>

    <p class="mt-8 font-light">
      At Meskey Energy, we don’t just install power systems—we build
      future-ready energy ecosystems that combine reliability, innovation, and
      sustainability.
    </p>

    <!-- Gallery Section -->
    <section class="mt-12">
      <div class="flex justify-between items-center">
        <h2 class="font-medium text-3xl">Gallery</h2>

        <!-- Custom navigation buttons -->
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
              v-for="(image, i) in images"
              :key="i"
              class="flex flex-col items-start">
              <img
                :src="image"
                alt="Meskey Energy project image"
                class="w-full h-[400px] object-cover rounded-xl mb-3 shadow-md" />
            </SwiperSlide>
          </Swiper>
        </div>
      </ClientOnly>
    </section>
  </main>
</template>

<script setup>
import { ref, nextTick } from 'vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

useHead({
  title: 'Meskey Energy',
});

const services = [
  {
    title: 'Electrical Installations & Rural Electrification',
    description:
      'End-to-end projects connecting communities and enterprises to reliable power.',
    icon: 'solar:bolt-bold',
  },
  {
    title: 'Transformer & Streetlight Installation',
    description:
      'Robust deployment and planning for safer, better-lit towns and urban areas.',
    icon: 'mdi:transmission-tower',
  },
  {
    title: 'Power Plant Maintenance',
    description:
      'Scheduled and predictive services to maximise uptime and performance.',
    icon: 'mdi:factory',
  },
  {
    title: 'Metering, Cable Scheduling & Tap Charger',
    description:
      'Precision planning and monitoring to improve efficiency and billing accuracy.',
    icon: 'mdi:gauge',
  },
  {
    title: 'UPS, Inverters & Battery Banks',
    description: 'Resilient backup systems for mission-critical operations.',
    icon: 'mdi:battery-charging-high',
  },
  {
    title: 'Power Control Panels & Control Rooms',
    description:
      'Centralized control, safety interlocks, and operational visibility.',
    icon: 'mdi:monitor-dashboard',
  },
  {
    title: 'Data Centers',
    description:
      'Reliable infrastructure for high-performance computing and storage.',
    icon: 'mdi:server',
  },
];

// gallery images
const images = [
  'https://ik.imagekit.io/Ochoja01/meskey/WhatsApp%20Image%202025-09-18%20at%207.21.59%20PM.jpeg?updatedAt=1758220615029',
  'https://ik.imagekit.io/Ochoja01/meskey/WhatsApp%20Image%202025-09-18%20at%207.21.57%20PM%20(1).jpeg?updatedAt=1758220614902',
  'https://ik.imagekit.io/Ochoja01/meskey/WhatsApp%20Image%202025-09-18%20at%207.21.58%20PM.jpeg?updatedAt=1758220614658',
  'https://ik.imagekit.io/Ochoja01/meskey/WhatsApp%20Image%202025-09-18%20at%207.21.57%20PM.jpeg?updatedAt=1758220614656',
  'https://ik.imagekit.io/Ochoja01/meskey/WhatsApp%20Image%202025-09-18%20at%207.22.02%20PM.jpeg?updatedAt=1758220614645',
  'https://ik.imagekit.io/Ochoja01/meskey/WhatsApp%20Image%202025-12-18%20at%206.14.07%20PM.jpeg',
  'https://ik.imagekit.io/Ochoja01/meskey/WhatsApp%20Image%202025-12-18%20at%206.14.05%20PM.jpeg',
  'https://ik.imagekit.io/Ochoja01/meskey/WhatsApp%20Image%202025-12-18%20at%206.14.05%20PM%20(1).jpeg',
];

const prevEl = ref(null);
const nextEl = ref(null);

// attach swiper navigation on mount
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
