<script setup>
import aboutimg from '../assets/images/aboutimg.png';
</script>

<template>
  <div>
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
          engineering company delivering mission-critical solutions in oil &
          gas, industrial automation, instrumentation, and pipeline
          infrastructure. We specialize in hazardous environments where
          reliability and accuracy are paramount, combining decades of
          experience with global standards to ensure safe and efficient results.
          <br />
          <br />
          Our expertise spans industries such as oil and gas, FMCG, cement,
          marine, data centers, power plants, logistics, telecom, mining, water,
          hospitality, real estate, and rural electrification. From automation
          and fuel systems to pipeline integrity and SCADA integration, we
          provide solutions that optimize performance, reduce risk, and
          guarantee compliance. <br /><br />
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
  </div>
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
