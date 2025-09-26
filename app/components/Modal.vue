<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  show: Boolean, // controls visibility
  mode: String, // "add" | "edit" | "delete"
  project: Object, // the project to edit/delete
});

const emit = defineEmits(['close', 'submit']);
</script>

<template>
  <div
    v-if="show"
    class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div class="bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
      <!-- Header -->
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-semibold capitalize">{{ mode }} project</h2>
        <button @click="$emit('close')" class="text-gray-500">✖</button>
      </div>

      <!-- Body -->
      <div>
        <template v-if="mode === 'add' || mode === 'edit'">
          <form @submit.prevent="$emit('submit', project)">
            <div class="mb-4">
              <label class="block mb-1 text-sm font-medium">Name</label>
              <input
                v-model="project.name"
                type="text"
                class="w-full border rounded p-2"
                required />
            </div>
            <div class="mb-4">
              <label class="block mb-1 text-sm font-medium">Description</label>
              <textarea
                v-model="project.description"
                class="w-full border rounded p-2"
                rows="3"
                required />
            </div>
            <!-- You can add more fields for category, client, date, etc. -->
            <button
              type="submit"
              class="bg-primary text-white px-4 py-2 rounded">
              Save
            </button>
          </form>
        </template>

        <template v-else-if="mode === 'delete'">
          <p>
            Are you sure you want to delete <b>{{ project?.name }}</b
            >?
          </p>
          <div class="flex justify-end gap-2 mt-4">
            <button
              @click="$emit('close')"
              class="px-4 py-2 rounded border border-gray-300">
              Cancel
            </button>
            <button
              @click="$emit('submit', project)"
              class="px-4 py-2 rounded bg-red-600 text-white">
              Delete
            </button>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
