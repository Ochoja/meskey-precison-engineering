export default defineNuxtPlugin(async () => {
  const store = useProjectsStore();
  await store.fetchProjects();
});
