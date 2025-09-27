<script setup>
const props = defineProps({
  status: { type: String, required: true }, // "error" | "success"
  action: { type: String, required: true }, // "add" | "edit" | "delete"
});

const states = [
  { name: 'error', icon: 'material-symbols:error-rounded', color: '#ff0000' },
  { name: 'success', icon: 'ep:success-filled', color: '#00ff00' },
];

// reactive state lookup
const currentState = computed(() =>
  states.find((state) => state.name === props.status)
);

// Action string based on status
const actionString = computed(() => {
  if (props.status === 'error') {
    // Ongoing action (present continuous)
    if (props.action === 'delete') return 'Deleting';
    if (props.action === 'edit') return 'Editing';
    return 'Adding';
  } else {
    // Success case (past tense)
    if (props.action === 'delete') return 'deleted';
    if (props.action === 'edit') return 'edited';
    return 'added';
  }
});
</script>

<template>
  <div
    class="fixed top-0 left-0 h-full w-full flex justify-center items-center bg-black/20">
    <div
      class="bg-[#fafafa] py-6 rounded-xl w-[40%] max-h-[90vh] shadow-lg flex flex-col items-center gap-4">
      <Icon
        :name="currentState?.icon"
        class="text-6xl"
        :style="{ color: currentState?.color }" />

      <h4
        v-if="currentState?.name === 'error'"
        class="text-red-600 font-medium">
        Error {{ actionString }} Project(s)
      </h4>

      <h4 v-else class="text-green-600 font-medium">
        Project(s) {{ actionString }} Successfully
      </h4>

      <div>
        <button
          @click="$emit('close')"
          class="px-6 py-1 border rounded-full bg-white border-grey-30">
          Close
        </button>
      </div>
    </div>
  </div>
</template>
