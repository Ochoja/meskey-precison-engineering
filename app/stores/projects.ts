import { defineStore } from 'pinia';

export const useProjectsStore = defineStore('projects', {
  state: () => ({
    projects: [] as any[],
    loaded: false,
  }),
  actions: {
    async fetchProjects() {
      if (this.loaded) return;
      const { data, error } = await useFetch('/api/projects');

      if (error.value) {
        console.error('Error fetching projects:', error.value);
        return;
      }

      this.projects = data.value || [];
      this.loaded = true;
    },

    getById(id: string) {
      return this.projects.find((p) => p.id === id);
    },
  },
});
