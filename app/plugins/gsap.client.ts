import { defineNuxtPlugin } from '#app';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default defineNuxtPlugin((nuxtApp) => {
  gsap.registerPlugin(ScrollTrigger);
  nuxtApp.provide('gsap', gsap);
  nuxtApp.provide('ScrollTrigger', ScrollTrigger);
});

// ✅ Add type declaration so `$gsap` and `$ScrollTrigger` are recognized
declare module '#app' {
  interface NuxtApp {
    $gsap: typeof gsap;
    $ScrollTrigger: typeof ScrollTrigger;
  }
}
declare module 'vue' {
  interface ComponentCustomProperties {
    $gsap: typeof gsap;
    $ScrollTrigger: typeof ScrollTrigger;
  }
}
