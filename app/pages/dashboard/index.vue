<script setup>
import logo from '../../assets/images/mainlogo.png';
import { ref, onMounted, computed } from 'vue';

definePageMeta({
  layout: 'auth',
});

const user = useSupabaseUser();
const email = computed(() => user.value?.email || null);

const supabase = useSupabaseClient();
const projects = ref([]);
const selectedProjects = ref([]); // store selected project IDs
const allSelected = computed(() => {
  return (
    projects.value.length > 0 &&
    selectedProjects.value.length === projects.value.length
  );
});

// fetch rows
onMounted(async () => {
  const { data, error } = await supabase.from('projects').select('*');
  if (error) {
    console.error(error);
  } else {
    projects.value = data;
    console.log(projects.value);
  }
});

// toggle select all
const toggleSelectAll = (event) => {
  if (event.target.checked) {
    selectedProjects.value = projects.value.map((p) => p.id);
  } else {
    selectedProjects.value = [];
  }
};

// toggle single
const toggleSelect = (id) => {
  if (selectedProjects.value.includes(id)) {
    selectedProjects.value = selectedProjects.value.filter((i) => i !== id);
  } else {
    selectedProjects.value.push(id);
  }
};

// delete selected
const deleteSelected = async () => {
  if (selectedProjects.value.length === 0) return;
  if (!confirm(`Delete ${selectedProjects.value.length} project(s)?`)) return;

  const { error } = await supabase
    .from('projects')
    .delete()
    .in('id', selectedProjects.value);

  if (error) {
    console.error(error);
  } else {
    projects.value = projects.value.filter(
      (p) => !selectedProjects.value.includes(p.id)
    );
    selectedProjects.value = [];
  }
};
</script>

<template>
  <main class="mx-[2%]">
    <!-- Top Bar -->
    <div class="flex justify-between items-center mb-8 mt-4">
      <img :src="logo" alt="Logo" width="200" height="200" />
      <div class="flex gap-2 items-center">
        <Icon name="mingcute:user-4-line" />
        <span>{{ email }}</span>
        <Icon name="raphael:arrowdown" />
      </div>
    </div>

    <!-- Projects Heading -->
    <div class="flex flex-col gap-4 mb-4">
      <h4 class="text-2xl font-medium">Projects</h4>
      <div class="flex justify-between">
        <button
          class="text-white flex items-center gap-2 rounded-3xl px-4 py-2 cursor-pointer bg-primary">
          <Icon name="ic:round-plus" /> <span>Add Project</span>
        </button>

        <!-- Delete Selected (only show if something is selected) -->
        <button
          v-if="selectedProjects.length > 0"
          @click="deleteSelected"
          class="text-white flex items-center gap-2 rounded-3xl px-4 py-2 cursor-pointer bg-red-600">
          <Icon name="fluent:delete-12-filled" /> <span>Delete Selected</span>
        </button>
      </div>
    </div>

    <!-- Table -->
    <div class="border border-gray-300 rounded-lg overflow-hidden">
      <!-- Header -->
      <div
        class="grid grid-cols-[40px_1fr_2fr_1fr_1fr_1fr_1fr_0.8fr_80px] bg-gray-200 font-semibold text-sm">
        <div class="p-2 flex justify-center">
          <input
            type="checkbox"
            :checked="allSelected"
            @change="toggleSelectAll" />
        </div>
        <div class="p-2">Name</div>
        <div class="p-2">Description</div>
        <div class="p-2">Category</div>
        <div class="p-2">Client</div>
        <div class="p-2">Delivery Date</div>
        <div class="p-2">Main Image</div>
        <div class="p-2">Other Images</div>
        <div class="p-2 text-center">Action</div>
      </div>

      <!-- Rows -->
      <div
        v-for="(project, index) in projects"
        :key="index"
        class="grid grid-cols-[40px_1fr_2fr_1fr_1fr_1fr_1fr_0.8fr_80px] text-sm border-t border-gray-200 bg-white">
        <div class="p-2 flex justify-center">
          <input
            type="checkbox"
            :checked="selectedProjects.includes(project.id)"
            @change="toggleSelect(project.id)" />
        </div>
        <div class="p-2 truncate">{{ project.name }}</div>
        <div class="p-2 truncate">{{ project.description }}</div>
        <div class="p-2 truncate">{{ project.category }}</div>
        <div class="p-2 truncate">{{ project.client }}</div>
        <div class="p-2 truncate">{{ project.delivery_date }}</div>
        <div class="p-2">
          <a
            :href="project.main_image"
            target="_blank"
            class="text-blue-600 underline truncate block">
            Image Link
          </a>
        </div>
        <div class="p-2 truncate">
          {{
            Array.isArray(project.other_images)
              ? project.other_images.length
              : 0
          }}
        </div>
        <div class="p-2 flex justify-center gap-2 text-lg">
          <Icon name="basil:edit-solid" class="text-gray-400 cursor-pointer" />
          <Icon
            name="fluent:delete-12-filled"
            class="text-red-600 cursor-pointer" />
        </div>
      </div>
    </div>
  </main>
</template>
