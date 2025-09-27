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
          <h6>Lagos Office</h6>
          <p>Zone C, Block 8 shop 23 ASPAMDA Plaza Trade fair complex Lagos.</p>
        </div>
        <div>
          <h6>FCT Abuja Office</h6>
          <p>
            Dawaki Abuja Behind Sunset Energy Fueling Station Murtala Mohammed
            Way (Kubwa Express)
          </p>
        </div>
        <div>
          <h6>Northern Region</h6>
          <p>
            No 4 School Road, Off Makama Plaza, Opposite Kaduna Refinery
            Complex, Kaduna
          </p>
        </div>
      </div>
      <div>
        <h6>Quick Links</h6>
        <div class="child-container">
          <NuxtLink to="/">Home</NuxtLink>
          <NuxtLink to="/about">About</NuxtLink>
          <NuxtLink>Privacy Policy</NuxtLink>
          <NuxtLink to="/projects">Projects</NuxtLink>
        </div>
      </div>
      <div>
        <h6>Services</h6>
        <div class="child-container">
          <NuxtLink to="/services/4">Automation</NuxtLink>
          <NuxtLink to="/services/1">Measuring</NuxtLink>
          <NuxtLink to="/services/2">Analysis</NuxtLink>
          <NuxtLink to="/services/3">Meteting</NuxtLink>
          <NuxtLink to="/services/5">Monitoring</NuxtLink>
        </div>
      </div>
      <div>
        <h6>Contact Us</h6>
        <div class="child-container">
          <a href="mailto:info@meskeyprecisioneng.org">
            info@meskeyprecisioneng.org
          </a>
          <!-- <a>+234 (0) 802 872 0639</a> -->
          <a href="tel:+2348032827341">+234 (0) 803 282 7341</a>
          <a href="tel:+2347030399465">+234 (0) 703 039 9465</a>
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
  font-weight: 500;
  font-size: 1.2rem;
}

.child-container {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 8px;
}
</style>
