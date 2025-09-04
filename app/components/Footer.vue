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
          <h6>Lagos Office</h6>
          <p>Zone C, Block 8 shop 23 ASPAMDA Plaza Trade fair complex Lagos.</p>
        </div>
        <div>
          <h6>Lagos Office</h6>
          <p>Zone C, Block 8 shop 23 ASPAMDA Plaza Trade fair complex Lagos.</p>
        </div>
      </div>
      <div>
        <h6>Quick Links</h6>
        <div class="child-container">
          <NuxtLink>Home</NuxtLink>
          <NuxtLink>About</NuxtLink>
          <NuxtLink>Privacy Policy</NuxtLink>
          <NuxtLink>Projects</NuxtLink>
        </div>
      </div>
      <div>
        <h6>Services</h6>
        <div class="child-container">
          <NuxtLink>Automation</NuxtLink>
          <NuxtLink>Procurement</NuxtLink>
          <NuxtLink>Analysis</NuxtLink>
          <NuxtLink>Meteting</NuxtLink>
          <NuxtLink>Monitoring</NuxtLink>
        </div>
      </div>
      <div>
        <h6>Contact Us</h6>
        <div class="child-container">
          <a href="mailto:info@meskeyprecisioneng.org">
            info@meskeyprecisioneng.org
          </a>
          <!-- <a>+234 (0) 802 872 0639</a> -->
          <a>+234 (0) 803 282 7341</a>
          <a>+234 (0) 703 039 9465</a>
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
