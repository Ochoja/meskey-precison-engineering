<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue';

useSeoMeta({
  title: 'About Meskey',
  description:
    'Meskey Precision Engineering Limited (MPEL) is a multidisciplinary engineering company delivering mission-critical solutions in oil & gas, industrial automation, instrumentation, and pipeline infrastructure. We specialize in hazardous environments where reliability and accuracy are paramount, combining decades of experience with global standards to ensure safe and efficient results.',
});

// Refs for sections / animated blocks
const heroSection = ref<HTMLElement | null>(null);
const statsRef = ref<HTMLElement | null>(null);
const storySection = ref<HTMLElement | null>(null);
const workflowSection = ref<HTMLElement | null>(null);

// Nuxt gsap + ScrollTrigger
const { $gsap, $ScrollTrigger } = useNuxtApp();

// Timelines
let heroTimeline: gsap.core.Timeline | null = null;
let storyTimeline: gsap.core.Timeline | null = null;
let workflowTimeline: gsap.core.Timeline | null = null;
let statsTimeline: gsap.core.Timeline | null = null;

const onResize = () => {
  $ScrollTrigger.refresh();
};

async function initAnimations() {
  await nextTick();

  // Hero block entrance
  if (heroSection.value) {
    heroTimeline?.kill();
    const heroEls = heroSection.value.querySelectorAll('button, h1, p, img');

    $gsap.set(heroEls, { autoAlpha: 0, y: 40 });

    heroTimeline = $gsap.timeline({
      defaults: { duration: 0.8, ease: 'power3.out' },
    });

    heroTimeline.to(heroEls, {
      autoAlpha: 1,
      y: 0,
      stagger: 0.12,
    });
  }

  // Stats counter (once on scroll into view)
  if (statsRef.value) {
    statsTimeline?.kill();
    const counters = Array.from(
      statsRef.value.querySelectorAll<HTMLElement>('[data-count-to]'),
    );

    counters.forEach((el) => {
      el.textContent = '0';
    });

    statsTimeline = $gsap.timeline({
      scrollTrigger: {
        id: 'about-stats',
        trigger: statsRef.value,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    });

    counters.forEach((el) => {
      const target = Number(el.dataset.countTo || '0');
      const suffix = el.dataset.suffix || '';
      const counterObj = { val: 0 };

      statsTimeline!.to(
        counterObj,
        {
          val: target,
          duration: 1.4,
          ease: 'power2.out',
          onUpdate: () => {
            el.textContent = `${Math.floor(counterObj.val)}${suffix}`;
          },
        },
        '<0.1',
      );
    });
  }

  // Story / Mission / Vision cards stagger
  if (storySection.value) {
    storyTimeline?.kill();
    const cards = storySection.value.querySelectorAll('.about-card');

    $gsap.set(cards, { autoAlpha: 0, y: 40 });

    storyTimeline = $gsap.timeline({
      scrollTrigger: {
        id: 'about-story',
        trigger: storySection.value,
        start: 'top 80%',
        toggleActions: 'play none none reverse',
      },
      defaults: { duration: 0.7, ease: 'power3.out' },
    });

    storyTimeline.to(cards, {
      autoAlpha: 1,
      y: 0,
      stagger: 0.15,
    });
  }

  // Workflow steps reveal down the timeline
  if (workflowSection.value) {
    workflowTimeline?.kill();
    const steps = workflowSection.value.querySelectorAll('.workflow-step');

    $gsap.set(steps, { autoAlpha: 0, x: -30 });

    workflowTimeline = $gsap.timeline({
      scrollTrigger: {
        id: 'about-workflow',
        trigger: workflowSection.value,
        start: 'top 80%',
        toggleActions: 'play none none reverse',
      },
      defaults: { duration: 0.6, ease: 'power2.out' },
    });

    workflowTimeline.to(steps, {
      autoAlpha: 1,
      x: 0,
      stagger: 0.12,
    });
  }
}

function cleanupAnimations() {
  heroTimeline?.kill();
  heroTimeline = null;
  storyTimeline?.kill();
  storyTimeline = null;
  workflowTimeline?.kill();
  workflowTimeline = null;
  statsTimeline?.kill();
  statsTimeline = null;

  $ScrollTrigger.getById('about-stats')?.kill();
  $ScrollTrigger.getById('about-story')?.kill();
  $ScrollTrigger.getById('about-workflow')?.kill();
}

onMounted(() => {
  initAnimations();
  window.addEventListener('resize', onResize);
});

onBeforeUnmount(() => {
  cleanupAnimations();
  window.removeEventListener('resize', onResize);
});
</script>

<template>
  <header
    ref="heroSection"
    class="layout-pad mt-16 md:mt-20 grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] items-center lg:gap-20">
    <div>
      <button
        class="mb-3 text-grey bg-primary-10 px-6 py-2 rounded-full border border-grey-20">
        About Us
      </button>
      <h1 class="text-2xl md:text-3xl mb-2">
        Engineering Excellence That Drives Performance
      </h1>
      <p class="font-light text-sm lg:text-base">
        Meskey Precision Engineering Limited (MPEL) is a multidisciplinary
        engineering company delivering mission-critical solutions in oil & gas,
        industrial automation, instrumentation, and pipeline infrastructure. We
        specialize in hazardous environments where reliability and accuracy are
        paramount, combining decades of experience with global standards to
        ensure safe and efficient results.
        <br />
        <br />
        Our expertise spans industries such as oil and gas, FMCG, cement,
        marine, data centers, power plants, logistics, telecom, mining, water,
        hospitality, real estate, and rural electrification. From automation and
        fuel systems to pipeline integrity and SCADA integration, we provide
        solutions that optimize performance, reduce risk, and guarantee
        compliance. <br /><br />
        Founded to bridge the gap between innovation and reliability, MPEL has
        become a trusted partner for both brownfield and Greenfield projects,
        consistently delivering precision and excellence at every stage.
      </p>
    </div>
    <div>
      <NuxtImg
        src="https://ik.imagekit.io/Ochoja01/meskey/photo_2025-11-12_07-18-55.jpg?updatedAt=1762930103619"
        alt="About Image"
        class="w-full rounded-2xl hidden md:block md:mt-8" />
      <div ref="statsRef" class="flex justify-between text-center mt-6 stats">
        <div>
          <h5 data-count-to="100" data-suffix="+">0</h5>
          <p class="text-sm md:text-base">Skilled Engineers</p>
        </div>
        <div>
          <h5 data-count-to="50" data-suffix="+">0</h5>
          <p class="text-sm md:text-base">Successful Projects Delivered</p>
        </div>
        <div>
          <h5 data-count-to="10" data-suffix="+ years">0</h5>
          <p class="text-sm md:text-base">Combined Industry Experience</p>
        </div>
      </div>
    </div>
  </header>

  <section ref="storySection" class="mt-24 mb-20 layout-pad relative">
    <div
      class="mx-auto mb-10 max-w-3xl text-center flex flex-col gap-2 items-center">
      <p
        class="inline-flex items-center rounded-full border border-primary-20 text-grey bg-primary-10 px-6 py-2 text-xs md:text-sm">
        Our Identity
      </p>
      <h1 class="text-3xl md:text-4xl">Our Story, Mission &amp; Vision</h1>
      <p class="font-light text-sm md:text-base text-grey-80">
        The principles that guide how we engineer, lead, and deliver for our
        partners across industries.
      </p>
    </div>

    <!-- First row: Mission + Vision -->
    <div class="flex flex-col md:flex-row gap-4 mb-4">
      <div
        class="about-card flex-1 bg-gradient-to-br from-primary-5 to-primary-30 rounded-2xl p-6 border border-primary-20/70">
        <h3 class="text-2xl md:text-3xl font-medium text-primary mb-2">
          Our Mission
        </h3>
        <p class="font-light text-grey text-sm md:text-base">
          To become a leading force in precision engineering across Africa and
          beyond — known for innovation, dependability, and delivering optimized
          solutions in even the most challenging environments.
        </p>
      </div>

      <div
        class="about-card flex-1 bg-gradient-to-br from-primary-5 to-primary-30 rounded-2xl p-6 border border-primary-20/70">
        <h3 class="text-2xl md:text-3xl font-medium text-primary mb-2">
          Our Vision
        </h3>
        <p class="font-light text-grey text-sm md:text-base">
          To deliver reliable, high-performance engineering solutions that
          enhance safety, efficiency, and sustainability across the oil, gas,
          and industrial sectors, while maintaining the highest standards of
          quality, integrity, and technical excellence.
        </p>
      </div>
    </div>

    <!-- Second row: Story -->
    <div
      class="about-card bg-gradient-to-br from-primary-5 to-primary-30 rounded-2xl p-6 border border-primary-20/70 mt-4">
      <h3 class="text-2xl md:text-3xl font-medium text-primary mb-2">
        Our Story
      </h3>
      <p class="font-light text-grey text-sm md:text-base">
        Meskey Precision Engineering Limited was established to meet the growing
        demand for technically sound, locally relevant engineering solutions in
        Nigeria’s energy and industrial sectors. From modest beginnings, we have
        evolved into a full-service firm capable of executing large-scale
        projects with precision, accountability, and a commitment to
        international best practices. <br /><br />
        Our team of highly skilled engineers and specialists has successfully
        delivered numerous projects across diverse industries, earning a
        reputation for reliability and innovation. Whether onshore or offshore,
        in data centers or industrial plants, we engineer systems that perform —
        and build trust that lasts.
      </p>
    </div>
  </section>

  <section ref="workflowSection" class="layout-pad mb-28 relative">
    <div class="mb-8 flex flex-col gap-2">
      <p
        class="inline-flex items-center rounded-full border border-primary-20 text-grey bg-primary-10 px-6 py-2 text-xs md:text-sm w-fit">
        How We Deliver
      </p>
      <h1 class="text-3xl md:text-4xl">Our Workflow</h1>
      <p class="font-light text-sm md:text-base text-grey-80 max-w-2xl">
        A structured, standards-driven approach that takes projects from idea to
        safe, efficient operation — with clarity at every step.
      </p>
    </div>

    <!-- Vertical timeline line -->
    <div
      class="pointer-events-none absolute left-[1.1rem] top-28 bottom-4 hidden md:block border-l border-dashed border-primary-20"></div>

    <div class="sect workflow-step">
      <h2>Engineering Design and Project Management</h2>
      <p class="text-sm md:text-base">
        Meskey Group has in-house resources, capabilities and tools to offer a
        full suite engineering project services from front-end design and
        detailed engineering, to planning, execution, commissioning and
        closeout.
        <br />Our project management services group has developed a tailored and
        integrated set of project management processes and systems that are
        aligned with our engineering design services. Project management
        professionals combine detailed technical knowledge of management
        disciplines that include scope, schedule, budget, quality, QHSE and risk
        management. <br />
        Engineering calculations and drawings are supported by in- house and
        third party developed advanced engineering software, and we perform our
        design according to up-to-date industry codes, standards and
        best-practice guidelines. <br />
        Our areas of expertise include:
      </p>
    </div>

    <div class="sect workflow-step">
      <h2>Feasibility Studies</h2>
      <p class="text-sm md:text-base">
        Feasibility Studies provide a solid foundation for any process led
        engineering project. Feasibility studies facilitate informed decisions;
        often-saving companies’ and investors’ time, cost and effort throughout
        the life of a project. <br />
        Meskey Group's extensive in-house knowledge and expertise can be applied
        to your project, setting the precedent for achieving optimum value.
      </p>
    </div>

    <div class="sect workflow-step">
      <h2>Conceptual Design</h2>
      <p class="text-sm md:text-base">
        Our Conceptual Design Studies shape a project’s success, strategy and
        development plans for the future. The early phase of project planning is
        quite complex with various decisions being driven by variables such as;
        health & safety, security, environmental impact, logistics, technology,
        complexity, infrastructure availability and economic evaluations, all of
        which can have a direct impact on capital cost.
      </p>
    </div>

    <div class="sect workflow-step">
      <h2>Front End Engineering Design</h2>
      <p class="text-sm md:text-base">
        Front End Engineering Design package sets the precedence for achieving
        optimum value for any process led engineering project while keeping
        effective controls on cost and Multi-disciplinary teams work in a
        flexible manner to provide a high-quality bespoke engineering solution
        to each customer’s unique development. Our success is underpinned by
        working closely with customers to align their needs with our robust and
        proven FEED execution processes.We provide informed decision support,
        cost estimate refinement, detail project scheduling and quantitative
        risk profiling – all of which align stakeholder’s
      </p>
    </div>

    <div class="sect workflow-step">
      <h2>Detailed Design</h2>
      <p class="text-sm md:text-base">
        During Detailed Design the scope is developed to produce the definitive
        information required for construction and installation. Every detailed
        design project requires a unique engineering solution to ensure the
        project is executed effectively, minimizing technical, cost and schedule
        risks. In detailed design we convert the FEED results, tailored to the
        client’s execution strategy, to deliver an engineering design, which can
        be safely and efficiently constructed, installed and commissioned. We
        work closely with equipment suppliers, fabricators and installation
        contractors in this phase, and manage the technical and contractual
        interfaces. Our engineering, procurement and quality assurance teams
        work with supply chain of subcontractors and equipment suppliers, to
        ensure the whole project is delivered to our client in line with their
        defined stakeholders requirements and expectations. At Meskey Group we
        provide a comprehensive detail design service using well established
        procedures supported by a fully validated suite of design tools.
      </p>
    </div>

    <h2 class="mb-[0.3em]">Project Management Services</h2>
    <ul class="list-disc list-inside space-y-2 text-sm md:text-base">
      <li>Clearly identify project scope requirement</li>
      <li>Present viable options and execution strategy</li>
      <li>Prepare material list and cost estimates</li>
      <li>
        Develop a detailed level 3 schedule, identifying project critical path
        and establishing monitoring management plans
      </li>
      <li>Develop detailed project scope of work</li>
      <li>Prepare project budgets or offer fixed cost turnkey price</li>
      <li>
        Develop and executed a detailed risk management register complete with
        risk response plans.
      </li>
      <li>Execute project within customer scope, schedule and cost.</li>
      <li>
        Provide periodic management report throughout project planning execution
        and close out
      </li>
      <li>Manage project variations using management of change processes</li>
      <li>
        Develop and manage Quality, Health, Safety and Environment management
        plan aimed at ensuring an incident free project.
      </li>
    </ul>
  </section>
</template>

<style scoped>
h5 {
  font-weight: 500;
  font-size: 1.2rem;
}

@media screen and (min-width: 650px) {
  h5 {
    font-size: 1.3rem;
  }
}

.stats p {
  font-weight: 300;
  font-size: 14px;
}

h2 {
  font-size: 1.3rem;
  font-weight: 500;
  color: #ff6600;
}

p {
  font-weight: 300;
}

.sect {
  margin-bottom: 2rem;
}

.sect h2 {
  margin-bottom: 0.3em;
}

li {
  font-weight: 300;
}
</style>
