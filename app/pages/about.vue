<script setup>
import aboutimg from '../assets/images/aboutimg.png';
</script>

<template>
  <header
    class="layout-pad mt-12 grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] items-end lg:gap-20">
    <div>
      <button
        class="mb-3 text-grey bg-primary-10 px-6 py-2 rounded-full border border-grey-20">
        About Us
      </button>
      <h1 class="text-3xl mb-2">
        Engineering Excellence That Drives Performance
      </h1>
      <p class="font-light">
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
      <img
        :src="aboutimg"
        alt="About Image"
        class="w-full rounded-2xl hidden md:block md:mt-8" />
      <div class="flex justify-between text-center mt-6 stats">
        <div>
          <h5>100+</h5>
          <p>Skilled Engineers</p>
        </div>
        <div>
          <h5>50+</h5>
          <p>Successful Projects Delivered</p>
        </div>
        <div>
          <h5>10+ years</h5>
          <p>Combined Industry Experience</p>
        </div>
      </div>
    </div>
  </header>

  <section class="mt-24 mb-28 layout-pad">
    <h2 class="text-center mb-6 text-4xl">Our Story, Mission and Vision</h2>

    <!-- First row: Mission + Vision -->
    <div class="flex flex-col md:flex-row gap-4 mb-4">
      <div class="flex-1 bg-primary-10 rounded-2xl p-6 border border-grey-20">
        <h3 class="text-3xl font-medium text-primary mb-2">Our Mission</h3>
        <p class="font-light text-grey">
          To become a leading force in precision engineering across Africa and
          beyond — known for innovation, dependability, and delivering optimized
          solutions in even the most challenging environments.
        </p>
      </div>

      <div class="flex-1 bg-primary-10 rounded-2xl p-6 border border-grey-20">
        <h3 class="text-3xl font-medium text-primary mb-2">Our Vision</h3>
        <p class="font-light text-grey">
          To deliver reliable, high-performance engineering solutions that
          enhance safety, efficiency, and sustainability across the oil, gas,
          and industrial sectors, while maintaining the highest standards of
          quality, integrity, and technical excellence.
        </p>
      </div>
    </div>

    <!-- Second row: Story -->
    <div class="bg-primary-10 rounded-2xl p-6 border border-grey-20">
      <h3 class="text-3xl font-medium text-primary mb-2">Our Story</h3>
      <p class="font-light text-grey">
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
</template>

<style scoped>
h5 {
  font-weight: 500;
  font-size: 1.3rem;
}

.stats p {
  font-weight: 300;
  font-size: 14px;
}
</style>
