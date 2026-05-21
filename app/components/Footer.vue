<script setup lang="ts">
import logo from '@/assets/images/whitelogo.png';
</script>

<template>
  <footer class="bg-primary-70 text-white layout-pad pt-8 pb-2">
    <div class="flex justify-between flex-wrap gap-8">
      <div
        class="flex flex-col gap-6 max-w-[80%] md:max-w-[30%] lg:max-w-[20%]">
        <img :src="logo" alt="Meskey Logo" />
        <div>
          <h6 class="font-">Location</h6>
          <p class="text-sm md:text-base">
            Sotrade Sri Via Portuense 2482 00054 Fiumicino (RM)
          </p>
        </div>
        <!-- <div>
          <h6>FCT Abuja Office</h6>
          <p class="text-sm md:text-base">
            Central Business District, FCT Abuja
          </p>
        </div>
        <div>
          <h6>Northern Region</h6>
          <p class="text-sm md:text-base">
            No 4 School Road, Off Makama Road, Opposite Kaduna Refinery
            Complex, Kaduna
          </p>
        </div> -->
      </div>
      <div>
        <h6>Quick Links</h6>
        <div class="child-container text-sm md:text-base">
          <NuxtLink to="/">Home</NuxtLink>
          <NuxtLink to="/about">About</NuxtLink>
          <NuxtLink>Privacy Policy</NuxtLink>
          <NuxtLink to="/projects">Projects</NuxtLink>
        </div>
      </div>
      <div>
        <h6>Services</h6>
        <div class="child-container text-sm md:text-base">
          <NuxtLink to="/services/4">Automation</NuxtLink>
          <NuxtLink to="/services/1">Measuring</NuxtLink>
          <NuxtLink to="/services/2">Analysis</NuxtLink>
          <NuxtLink to="/services/3">Meteting</NuxtLink>
          <NuxtLink to="/services/5">Monitoring</NuxtLink>
        </div>
      </div>
      <div>
        <h6>Contact Us</h6>
        <div class="child-container text-sm md:text-base">
          <a href="mailto:info@meskeyprecisioneng.org">
            info@meskeyprecisioneng.org
          </a>
          <!-- <a>+234 (0) 802 872 0639</a> -->
          <!-- <a href="tel:+2348032827341">+234 (0) 803 282 7341</a> -->
          <!-- <a href="tel:+2348170061600">+234 (0) 817 006 1600</a> -->
          <!-- <a href="tel:+2347071562566">+234 (0) 707 156 2566</a> -->
          <a href="+390669489242">+39 06 69489242</a>
          <a href="+393384609">39 338 4609</a>
        </div>
      </div>
    </div>
    <div class="text-xs text-center mt-16">
      2025 Meskey Precision Engineering
    </div>
  </footer>
</template>

<style scoped>
img {
  width: 15rem;
}

a,
p {
  font-weight: 300;
}

a:hover {
  text-decoration: underline;
  cursor: pointer;
}

h6 {
  font-weight: 400;
  font-size: 1.2rem;
}

.child-container {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 6px;
}
</style>
