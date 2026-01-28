<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, nextTick } from 'vue';
import { Vue3Marquee } from 'vue3-marquee';
import LinkLogo from '../assets/icons/link.svg';

definePageMeta({
  layout: 'home',
});

useSeoMeta({
  title: 'Meskey Precision Engineering',
  description:
    'Meskey Precision Engineering Limited provides reliable, high-impact engineering solutions for oil & gas and industrial sectors, tackling complex projects with safety, efficiency, and precision.',
  ogTitle: 'Meskey Precision Engineering',
  ogDescription:
    'Meskey Precision Engineering Limited provides reliable, high-impact engineering solutions for oil & gas and industrial sectors.',
  ogType: 'website',
  ogUrl: 'https://www.meskeyprecisioneng.org',
  ogImage: 'https://www.meskeyprecisioneng.org/logo.png',
});

const services = ref<HTMLElement | null>(null);
const servicesSection = ref<HTMLElement | null>(null);

const heroContent = ref<HTMLElement | null>(null);
const aboutSection = ref<HTMLElement | null>(null);
const whySection = ref<HTMLElement | null>(null);
const servicesHintDock = ref<HTMLElement | null>(null);
const servicesHintTop = ref<HTMLElement | null>(null);

const { $gsap, $ScrollTrigger } = useNuxtApp();

const marqueelist = [
  'Measuring',
  'Automation',
  'Monitoring',
  'Control Systems',
  'Fuel Management Systems',
  'Calibration Services',
  'SCADA Integration',
  'Pipeline Integrity Checks',
];

const servicelist = [
  {
    service: 'Automation',
    description:
      'We design and fabricate control panels tailored to industrial needs, integrate SCADA systems for centralized monitoring, implement full-scale industrial automation and building control, and deploy remote terminal monitoring systems for seamless real-time oversight.',
    image:
      'https://ik.imagekit.io/Ochoja01/meskey/automation.png?updatedAt=1758225571774',
    to: '/services/4',
  },
  {
    service: 'Metering',
    description:
      'Our metering solutions include precise flow measurement and custody transfer systems, advanced automatic tank gauging (ATG) for inventory accuracy, comprehensive fuel monitoring and transfer setups, as well as fuel purification systems to ensure product quality and compliance.',
    image:
      'https://ik.imagekit.io/Ochoja01/meskey/metering.png?updatedAt=1758225571585',
    to: '/services/3',
  },
  {
    service: 'Monitoring',
    description:
      'We conduct thorough pipeline integrity checks, pressure and leakage verifications using industry-standard methods, install real-time monitoring systems for critical infrastructure, and provide fire hydrant and industrial safety control systems for risk mitigation.',
    image:
      'https://ik.imagekit.io/Ochoja01/meskey/monitoring.png?updatedAt=1758225571773',
    to: '/services/5',
  },
  {
    service: 'Analysis',
    description:
      'Our analytical services cover precise instrument calibration for accuracy and compliance, non-destructive testing methods including dye penetrant inspections, high-sensitivity leak detection using laser and acoustic technologies, and advanced Computational Pipeline Monitoring (CPM) for early fault identification and operational efficiency.',
    image:
      'https://ik.imagekit.io/Ochoja01/meskey/analysis.png?updatedAt=1758225571879',
    to: '/services/2',
  },
  {
    service: 'Measuring',
    description:
      'At Meskey Precision Engineering Limited, we understand that reliable measurement is the foundation of safe and efficient industrial operations. Every decision, from process optimization to asset management, depends on accurate and timely data. Our measuring solutions are designed to provide clients with complete confidence in the numbers that drive their operations.',
    image:
      'https://ik.imagekit.io/Ochoja01/meskey/measuring.png?updatedAt=1758225570795',
    to: '/services/1',
  },
];

let scrollTween: gsap.core.Tween | null = null;
let scrollTrigger: ScrollTrigger | null = null;
let hintLoopTimeline: gsap.core.Timeline | null = null;

const onResize = () => {
  $ScrollTrigger.refresh();
};

async function initScroll() {
  await nextTick();
  if (!services.value) return;

  scrollTrigger?.kill();
  scrollTween?.kill();
  hintLoopTimeline?.kill();

  const getScrollAmount = () =>
    -(services.value!.scrollWidth - window.innerWidth);

  scrollTween = $gsap.to(services.value, {
    x: getScrollAmount,
    ease: 'none',
  });

  scrollTrigger = $ScrollTrigger.create({
    trigger: servicesSection.value!,
    start: 'top 5%',
    end: () => `+=${getScrollAmount() * -1}`,
    pin: true,
    scrub: 1,
    animation: scrollTween,
    invalidateOnRefresh: true,
    onEnter: () =>
      servicesHintDock.value &&
      $gsap.to(servicesHintDock.value, { autoAlpha: 1 }),
    onLeave: () =>
      servicesHintDock.value &&
      $gsap.to(servicesHintDock.value, { autoAlpha: 0 }),
    onEnterBack: () =>
      servicesHintDock.value &&
      $gsap.to(servicesHintDock.value, { autoAlpha: 1 }),
    onLeaveBack: () =>
      servicesHintDock.value &&
      $gsap.to(servicesHintDock.value, { autoAlpha: 0 }),
  });

  const movers: Element[] = [];
  [servicesHintTop.value, servicesHintDock.value].forEach((el) => {
    el?.querySelectorAll('[data-scroll-cue="mover"]').forEach((m) =>
      movers.push(m),
    );
  });

  if (movers.length) {
    hintLoopTimeline = $gsap
      .timeline({ repeat: -1 })
      .to(movers, { y: 8, duration: 0.8 })
      .to(movers, { y: 0, duration: 0.8 });
  }

  $ScrollTrigger.refresh();
}

async function initAnimations() {
  await nextTick();

  if (heroContent.value) {
    const els = heroContent.value.querySelectorAll('h1, p, a');
    $gsap.set(els, { autoAlpha: 0, y: 40 });
    $gsap.to(els, {
      autoAlpha: 1,
      y: 0,
      stagger: 0.15,
      duration: 0.8,
    });
  }

  [aboutSection.value, whySection.value].forEach((section) => {
    if (!section) return;
    const els = section.querySelectorAll('*');
    $gsap.set(els, { autoAlpha: 0, y: 40 });
    $gsap.to(els, {
      autoAlpha: 1,
      y: 0,
      stagger: 0.1,
      scrollTrigger: {
        trigger: section,
        start: 'top 80%',
      },
    });
  });
}

onMounted(() => {
  initScroll();
  initAnimations();
  window.addEventListener('resize', onResize);
});

onBeforeUnmount(() => {
  scrollTrigger?.kill();
  scrollTween?.kill();
  hintLoopTimeline?.kill();
  window.removeEventListener('resize', onResize);
});
</script>

<template>
  <header
    class="bg-[url(https://ik.imagekit.io/Ochoja01/meskey/herobg.png?updatedAt=1758227487910)] bg-cover bg-center">
    <Navigation dark="true" />
    <div
      ref="heroContent"
      class="text-white text-center py-[20vh] md:py-[25vh] w-[90%] lg:w-[70%] mx-auto flex flex-col gap-6">
      <h1 class="font-medium text-4xl md:text-6xl xl:text-7xl">
        Optimization is our <span class="text-primary">Core</span>
      </h1>
      <p class="font-light text-sm md:text-lg">
        At Meskey Precision Engineering Limited, we integrate automation,
        metering, monitoring, and analytical expertise to deliver
        high-performance engineering solutions across oil & gas, industrial, and
        hazardous environments. From control systems and pipeline integrity
        checks to advanced instrumentation, fuel systems, and SCADA integration,
        we engineer efficiency, reliability, and safety into every project —
        whether brownfield or greenfield.
      </p>
      <div>
        <NuxtLink
          to="/contact"
          class="bg-primary hover:bg-primary-50 font-medium text-white py-3 px-6 rounded-lg">
          Contact Us
        </NuxtLink>
      </div>
    </div>
  </header>

  <Vue3Marquee :pause-on-hover="true" class="bg-grey-110 py-6 overflow-hidden">
    <div
      v-for="(item, key) in marqueelist"
      :key="key"
      class="flex items-center gap-8 px-8">
      <img src="../assets/images/logo.png" alt="" height="50" width="50" />
      <h5 class="text-white">{{ item }}</h5>
    </div>
  </Vue3Marquee>

  <!-- Services Horizontal Scroll Section -->
  <section ref="servicesSection" class="mt-16 relative pb-16">
    <div
      class="layout-pad flex flex-col gap-2 lg:flex-row justify-between items-center">
      <h2
        class="text-3xl md:text-4xl lg:text-5xl text-center lg:text-left lg:max-w-[55%]">
        Structured Around Five
        <span class="font-medium text-primary-50">Pillars of Excellence</span>
      </h2>
      <div class="font-light text-center lg:text-left lg:max-w-[40%]">
        <p class="text-sm md:text-base">
          We provide reliable, high-performance engineering solutions that
          enhance safety, efficiency, and precision across oil, gas, and
          industrial operations.
        </p>
        <p
          ref="servicesHintTop"
          class="text-primary-30 md:text-right relative top-8 flex gap-1 items-center justify-end font-medium">
          <span data-scroll-cue="mover">Scroll down to reveal</span>
          <Icon
            data-scroll-cue="mover"
            name="mynaui:arrow-down"
            class="text-2xl"></Icon>
        </p>
      </div>
    </div>

    <!-- Docked cue: shows while the services section is pinned -->
    <div
      ref="servicesHintDock"
      class="pointer-events-none fixed left-0 right-0 bottom-4 lg:bottom-12 z-40 flex justify-center opacity-0">
      <div
        class="bg-white backdrop-blur-md border border-primary-20 rounded-full px-4 py-2 text-primary-30 flex gap-2 items-center font-medium shadow-sm">
        <span data-scroll-cue="mover">Scroll down to reveal</span>
        <Icon
          data-scroll-cue="mover"
          name="mynaui:arrow-down"
          class="text-xl"></Icon>
      </div>
    </div>

    <div
      ref="services"
      class="servicesWrapper mb-4 md:mb-12 mt-12 flex flex-nowrap gap-6 px-[5%] xl:px-[8%] w-fit overflow-x-hidden">
      <NuxtLink
        :to="item.to"
        v-for="(item, index) in servicelist"
        :key="index"
        class="min-w-[75vw] sm:min-w-[50vw] md:min-w-[40vw] lg:min-w-[26vw] xl:min-w-[24vw] bg-cover bg-center rounded-3xl text-white p-4 flex flex-col gap-8 justify-between min-h-[58vh] md:min-h-[65vh]"
        :style="{ backgroundImage: `url(${item.image})` }">
        <h5 class="font-medium text-xl">{{ item.service }}</h5>
        <div>
          <p class="font-light text-sm md:text-base mb-2">
            {{ item.description }}
          </p>
          <NuxtImg :src="LinkLogo" alt="link" height="40" width="40" />
        </div>
      </NuxtLink>
    </div>
  </section>

  <!-- About Section -->
  <section
    ref="aboutSection"
    class="layout-pad grid items-center md:grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-12">
    <div>
      <button
        class="mb-3 text-grey bg-primary-10 px-6 py-2 rounded-full border border-grey-20">
        About Us
      </button>
      <h3 class="mb-2 text-2xl md:text-3xl">
        Engineering Precision Where it matters Most
      </h3>
      <p class="font-light text-sm md:text-base">
        Meskey Precision Engineering Limited (MPEL) is a multidisciplinary
        engineering company delivering mission-critical solutions across oil and
        gas, industrial automation, instrumentation, and pipeline integrity
        management. We specialize in executing complex projects in hazardous
        environments, drawing on decades of hands-on technical experience.
        <br /><br />
        Our team combines deep industry knowledge with a commitment to safety,
        precision, and efficiency, enabling us to deliver fully integrated
        solutions from design to deployment. Whether operating onshore or
        offshore, for brownfield upgrades or new Greenfield developments, we
        bring end-to-end execution and engineering excellence to every project.
      </p>
      <NuxtLink
        to="/about"
        class="flex gap-2 mt-2 items-center text-lg text-primary font-medium">
        More About Us <Icon name="lsicon:arrow-right-outline" />
      </NuxtLink>
    </div>
    <div>
      <NuxtImg
        src="https://ik.imagekit.io/Ochoja01/meskey/about2.png?updatedAt=1758225851901"
        alt="facilities images"
        class="md:min-w-[80%] lg:min-w-full" />
    </div>
  </section>

  <!-- Projects -->
  <ProjectSection></ProjectSection>

  <!-- Why Choose Us -->
  <section ref="whySection" class="layout-pad mt-16 mb-32">
    <button
      class="mb-3 text-grey bg-primary-10 px-6 py-2 rounded-full border border-grey-20">
      Why Choose Us
    </button>
    <h1 class="text-2xl md:text-3xl mb-6">
      Why Meskey Precision is the
      <span class="font-semibold text-primary-50">Right Choice</span>
    </h1>
    <div class="grid grid-cols-1 lg:grid-cols-[2.5fr_1fr] gap-4">
      <div>
        <div class="flex flex-col md:flex-row gap-4 mb-4">
          <div class="bg-white p-4 border border-primary-20 rounded-2xl h-full">
            <Icon name="stash:globe" class="text-4xl text-primary mb-2" />
            <h6 class="font-medium text-lg md:text-xl mb-2">
              Standards-Driven, Globally Informed
            </h6>
            <p class="font-light text-sm md:text-base">
              Combining local expertise with global standards such as ISO and
              API, we ensure every project meets the highest benchmarks in
              safety, quality, and regulatory compliance.
            </p>
          </div>
          <div class="bg-white p-4 border border-primary-20 rounded-2xl h-full">
            <Icon name="f7:graph-circle" class="text-4xl text-primary mb-2" />
            <h6 class="font-medium text-lg md:text-xl mb-2">
              Precision Meets Performance
            </h6>
            <p class="font-light text-sm md:text-base">
              Our systems are built with uncompromising attention to detail,
              designed and calibrated to deliver accurate results, long-term
              durability, and maximum operational efficiency.
            </p>
          </div>
        </div>
        <div class="bg-white p-4 border border-primary-20 rounded-2xl">
          <Icon
            name="fluent:weather-haze-24-regular"
            class="text-4xl text-primary mb-2" />
          <h6 class="font-medium text-lg md:text-xl mb-2">
            Engineered for Harsh Environments
          </h6>
          <p class="font-light text-sm md:text-base">
            We specialize in delivering reliable, mission-critical solutions
            that perform under extreme conditions — from offshore platforms to
            hazardous industrial zones — ensuring consistent uptime and safety
            where it matters most.
          </p>
        </div>
      </div>
      <div
        class="bg-primary p-4 text-white rounded-2xl flex flex-col justify-between">
        <div>
          <Icon name="mingcute:apple-intelligence-line" class="text-4xl mb-2" />
          <h6 class="font-medium text-lg md:text-xl mb-2">
            Intelligence in Every Operation
          </h6>
          <p class="font-light mb-6 text-sm md:text-base">
            We deploy intelligent automation and monitoring systems that provide
            real-time insights and remote control capabilities, empowering
            operators with faster, data-driven decision-making.
          </p>
        </div>
        <div>
          <NuxtLink
            to="/contact"
            class="text-grey-110 font-medium bg-white hover:bg-primary-40 hover:border hover:border-white hover:text-white rounded-lg px-4 py-2 cursor-pointer">
            Contact Us
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>
