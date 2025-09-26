export default defineNuxtRouteMiddleware((to) => {
  const user = useSupabaseUser();

  // Protect dashboard
  if (!user.value && to.path.startsWith('/dashboard')) {
    return navigateTo('/login');
  }

  // Prevent logged-in users from accessing /login
  if (user.value && to.path === '/login') {
    return navigateTo('/dashboard');
  }
});
