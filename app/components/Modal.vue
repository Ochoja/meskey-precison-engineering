<script setup>
const props = defineProps({
  action: { type: String, required: true }, // "add" | "edit" | "delete"
  project: { type: Object, default: null },
});

const emit = defineEmits(['close', 'result']);
const supabase = useSupabaseClient();
const loading = ref(false);

const form = reactive({
  name: '',
  description: '',
  category: '',
  client: '',
  delivery_date: '',
  main_image: '',
  other_images: ['', '', '', ''], // always 4 slots
});

const titleMap = {
  add: 'Add Project',
  edit: 'Edit Project',
  delete: 'Delete Project',
};

// preload when editing
watch(
  () => props.project,
  (newVal) => {
    if (props.action === 'edit' && newVal) {
      Object.assign(form, newVal);

      // always normalize to 4 slots
      form.other_images = [
        ...(newVal.other_images || []),
        '',
        '',
        '',
        '',
      ].slice(0, 4);
    } else if (props.action === 'add') {
      // reset form for add mode
      Object.assign(form, {
        name: '',
        description: '',
        category: '',
        client: '',
        delivery_date: '',
        main_image: '',
        other_images: ['', '', '', ''],
      });
    }
  },
  { immediate: true }
);

const handleConfirm = async () => {
  loading.value = true;
  try {
    let resultProject = null;

    // Sanitize other_images before saving
    const cleanImages = form.other_images.filter((img) => img.trim() !== '');
    const payload = {
      ...form,
      other_images: cleanImages.length > 0 ? cleanImages : null,
    };

    if (props.action === 'delete') {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', props.project.id);
      if (error) throw error;
      resultProject = props.project;
    } else if (props.action === 'edit') {
      const { data, error } = await supabase
        .from('projects')
        .update(payload)
        .eq('id', props.project.id)
        .select()
        .single();
      if (error) throw error;
      resultProject = data;
    } else if (props.action === 'add') {
      const { data, error } = await supabase
        .from('projects')
        .insert([payload])
        .select()
        .single();
      if (error) throw error;
      resultProject = data;
    }

    emit('result', {
      status: 'success',
      action: props.action,
      project: resultProject,
    });
  } catch (err) {
    console.error(err);
    emit('result', {
      status: 'error',
      action: props.action,
      project: props.project,
    });
  } finally {
    loading.value = false;
    emit('close');
  }
};
</script>

<template>
  <div class="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
    <div
      class="bg-[#fafafa] py-6 pl-6 rounded-xl w-[50%] max-h-[90vh] shadow-lg">
      <!-- Header -->
      <h2 class="text-xl font-semibold mb-4 text-center">
        {{ titleMap[props.action] }}
      </h2>

      <!-- Delete Confirmation -->
      <div
        v-if="props.action === 'delete'"
        class="flex flex-col items-center text-center gap-6">
        <p>
          Are you sure you want to delete
          <strong>{{ props.project?.name }}</strong
          >?
        </p>

        <div class="flex justify-center gap-4 mt-6">
          <button
            @click="$emit('close')"
            :disabled="loading"
            class="px-6 py-1 border rounded-full bg-white border-grey-30 disabled:opacity-50">
            Cancel
          </button>
          <button
            @click="handleConfirm"
            :disabled="loading"
            class="px-6 py-1 rounded-full bg-red-500 text-white flex items-center gap-2 disabled:opacity-50">
            <span v-if="loading">
              Loading
              <Icon
                name="line-md:loading-twotone-loop"
                width="20"
                height="20" />
            </span>
            <span v-else>Delete</span>
          </button>
        </div>
      </div>

      <!-- Add/Edit Form -->
      <form
        v-else
        @submit.prevent="handleConfirm"
        class="flex flex-col gap-3 max-h-[80vh] overflow-y-auto pr-8">
        <input v-model="form.name" type="text" placeholder="Name" required />
        <textarea
          v-model="form.description"
          placeholder="Description"
          required
          rows="5"
          class="min-h-[120px]" />

        <select v-model="form.category" name="category">
          <option value="">Select Category</option>
          <option value="Automation">Automation</option>
          <option value="Procurement">Procurement</option>
          <option value="Metering">Metering</option>
          <option value="Measuring">Measuring</option>
          <option value="Monitoring">Monitoring</option>
          <option value="Analysis">Analysis</option>
          <option value="Analysis">Analysis</option>
        </select>

        <input
          v-model="form.client"
          type="text"
          placeholder="Client (Optional)" />
        <input v-model="form.delivery_date" type="date" />
        <input
          v-model="form.main_image"
          type="url"
          placeholder="Main Image URL"
          required />

        <!-- Other Images -->
        <div>
          <label class="mb-2 block font-medium"
            >Other Images (max 4) (Optional)</label
          >
          <div class="flex flex-col gap-2">
            <input
              v-for="(img, i) in form.other_images"
              :key="i"
              v-model="form.other_images[i]"
              type="url"
              :placeholder="`Other Image URL ${i + 1}`" />
          </div>
        </div>

        <!-- Footer -->
        <div class="flex justify-end gap-2 mt-6 mb-6">
          <button
            @click="$emit('close')"
            :disabled="loading"
            class="px-6 py-1 border rounded-full bg-white border-grey-30 disabled:opacity-50">
            Cancel
          </button>
          <button
            type="submit"
            :disabled="loading"
            class="px-6 py-1 rounded-full bg-primary text-white flex items-center gap-2 disabled:opacity-50">
            <span v-if="loading">
              Loading
              <Icon
                name="line-md:loading-twotone-loop"
                width="20"
                height="20" />
            </span>
            <span v-else>Save</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
input,
textarea,
select {
  margin-bottom: 4px;
  background: #fff;
  padding: 12px 8px;
  border: 1px solid #bec0c0;
  border-radius: 10px;
  width: 100%;
  font-size: 0.8rem;
}
</style>
