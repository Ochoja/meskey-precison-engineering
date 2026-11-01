<script setup lang="ts">
import logo from '../assets/images/whitelogo.png';

const supabase = useSupabaseClient();
const user = useSupabaseUser();
const route = useRoute();
const { profile, isSuperAdmin, load } = useAdminProfile();

const sidebarOpen = ref(false);
const showDropdown = ref(false);

onMounted(() => load());
watch(user, () => load());
watch(
  () => route.fullPath,
  () => {
    sidebarOpen.value = false;
    showDropdown.value = false;
  }
);

const links = computed(() => [
  { to: '/dashboard', label: 'Projects', icon: 'mdi:briefcase-outline', exact: true },
  { to: '/dashboard/documents/invoice', label: 'Invoices', icon: DOC_META.invoice.icon },
  { to: '/dashboard/documents/quotation', label: 'Quotations', icon: DOC_META.quotation.icon },
  { to: '/dashboard/documents/payslip', label: 'Payslips', icon: DOC_META.payslip.icon },
  ...(isSuperAdmin.value
    ? [{ to: '/dashboard/admins', label: 'Admins', icon: 'mdi:shield-account-outline' }]
    : []),
]);

const isActive = (link: { to: string; exact?: boolean }) =>
  link.exact ? route.path === link.to : route.path.startsWith(link.to);

const logout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) console.error(error);
  else window.location.href = '/login';
};
</script>

<template>
  <div class="min-h-screen lg:flex">
    <!-- Mobile top bar -->
    <div
      class="lg:hidden print:hidden flex items-center justify-between bg-grey-110 text-white px-4 py-3 sticky top-0 z-30">
      <img :src="logo" alt="Meskey Logo" class="w-36" >
      <button
        class="text-2xl"
        aria-label="Toggle menu"
        @click="sidebarOpen = !sidebarOpen">
        <Icon :name="sidebarOpen ? 'mdi:close' : 'mdi:menu'" />
      </button>
    </div>

    <!-- Sidebar -->
    <aside
      :class="[
        'print:hidden bg-grey-110 text-white w-64 shrink-0 flex flex-col z-20',
        'fixed lg:sticky top-[52px] lg:top-0 h-[calc(100vh-52px)] lg:h-screen transition-transform',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
      ]">
      <div class="hidden lg:block px-6 pt-8 pb-6">
        <img :src="logo" alt="Meskey Logo" class="w-44" >
      </div>
      <p class="px-6 text-xs uppercase tracking-widest text-grey-30 mt-4 lg:mt-0 mb-2">
        Admin
      </p>
      <nav class="flex flex-col gap-1 px-3">
        <NuxtLink
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          :class="[
            'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors',
            isActive(link)
              ? 'bg-primary text-white'
              : 'text-grey-20 hover:bg-grey-90 hover:text-white',
          ]">
          <Icon :name="link.icon" class="text-xl" />
          <span>{{ link.label }}</span>
        </NuxtLink>
      </nav>

      <div class="mt-auto border-t border-grey-90 p-4 relative">
        <button
          class="w-full flex items-center gap-3 text-left"
          @click="showDropdown = !showDropdown">
          <span
            class="size-9 rounded-full bg-primary/20 text-primary-40 flex items-center justify-center">
            <Icon name="mingcute:user-4-line" />
          </span>
          <span class="flex-1 min-w-0">
            <span class="block text-sm truncate">
              {{ profile?.full_name || user?.email }}
            </span>
            <span class="block text-xs text-primary-40">
              {{ isSuperAdmin ? 'Super Admin' : 'Admin' }}
            </span>
          </span>
          <Icon name="mdi:chevron-up" :class="showDropdown ? '' : 'rotate-180'" />
        </button>
        <div
          v-if="showDropdown"
          class="absolute bottom-full left-4 right-4 mb-2 bg-white text-grey-110 rounded-xl shadow-lg overflow-hidden">
          <p class="px-4 pt-3 pb-2 text-xs text-grey-40 truncate">
            {{ user?.email }}
          </p>
          <button
            class="w-full text-left px-4 py-2.5 hover:bg-primary-10 flex items-center gap-2"
            @click="logout">
            <Icon name="mdi:logout" /> Logout
          </button>
        </div>
      </div>
    </aside>

    <div
      v-if="sidebarOpen"
      class="lg:hidden print:hidden fixed inset-0 bg-black/40 z-10"
      @click="sidebarOpen = false" />

    <div class="flex-1 min-w-0 px-4 md:px-8 py-6 print:p-0">
      <slot />
    </div>
  </div>
</template>
