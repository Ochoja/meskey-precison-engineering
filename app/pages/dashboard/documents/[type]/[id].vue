<script setup lang="ts">
import DocumentPreview from '~/components/documents/DocumentPreview.vue';
import SalesForm from '~/components/documents/SalesForm.vue';
import PayslipForm from '~/components/documents/PayslipForm.vue';

definePageMeta({
  layout: 'dashboard',
  validate: (route) =>
    ['invoice', 'quotation', 'payslip'].includes(route.params.type as string),
});

const route = useRoute();
const router = useRouter();
const supabase = useSupabaseClient();

const type = computed(() => route.params.type as DocType);
const meta = computed(() => DOC_META[type.value]);
const isNew = computed(() => route.params.id === 'new');

const docId = ref<string | null>(null);
const number = ref<string | null>(null);
const data = ref<DocData>(defaultData(type.value));
const salesData = computed({
  get: () => data.value as SalesDocData,
  set: (v) => (data.value = v),
});
const payslipData = computed({
  get: () => data.value as PayslipData,
  set: (v) => (data.value = v),
});
const loading = ref(true);
const saving = ref(false);
const dirty = ref(false);
const errorMsg = ref('');
const savedMsg = ref('');
const view = ref<'edit' | 'preview'>('edit');

useHead(() => ({
  title: number.value ?? `New ${meta.value.title} | Meskey Admin`,
}));

// Merge stored data over defaults so older/partial records still render
function hydrate(stored: Partial<DocData>) {
  const base = defaultData(type.value) as unknown as Record<string, unknown>;
  const merged: Record<string, unknown> = { ...base };
  for (const [key, value] of Object.entries(stored)) {
    const b = base[key];
    merged[key] =
      b && typeof b === 'object' && !Array.isArray(b) && value && typeof value === 'object'
        ? { ...b, ...value }
        : value;
  }
  return merged as unknown as DocData;
}

async function load() {
  loading.value = true;
  errorMsg.value = '';

  if (isNew.value) {
    docId.value = null;
    number.value = null;
    data.value = defaultData(type.value);

    // "Duplicate" — start from another document's contents
    const from = route.query.from as string | undefined;
    if (from) {
      const { data: src, error } = await supabase
        .from('documents')
        .select('data')
        .eq('id', from)
        .maybeSingle();
      if (error) errorMsg.value = error.message;
      else if (src) {
        const fresh = defaultData(type.value) as unknown as Record<string, unknown>;
        const copy = hydrate(structuredClone((src as { data: DocData }).data)) as unknown as Record<
          string,
          unknown
        >;
        // keep content, reset status and dates
        for (const key of ['status', 'issue_date', 'due_date', 'pay_date', 'period_start', 'period_end']) {
          if (key in fresh) copy[key] = fresh[key];
        }
        data.value = copy as unknown as DocData;
      }
    }
  } else {
    const { data: row, error } = await supabase
      .from('documents')
      .select('*')
      .eq('id', route.params.id as string)
      .eq('type', type.value)
      .maybeSingle();

    if (error || !row) {
      errorMsg.value = error?.message ?? `${meta.value.title} not found.`;
    } else {
      const r = row as { id: string; number: string; data: DocData };
      docId.value = r.id;
      number.value = r.number;
      data.value = hydrate(r.data);
    }
  }

  loading.value = false;
  await nextTick();
  dirty.value = false;
}

onMounted(load);
watch(() => route.fullPath, (to, from) => {
  // Skip the reload right after the first save swaps /new for /:id
  if (docId.value && to.endsWith(`/${docId.value}`) && from.includes('/new')) return;
  load();
});
watch(data, () => (dirty.value = true), { deep: true });

async function save() {
  saving.value = true;
  errorMsg.value = '';
  savedMsg.value = '';

  try {
    if (!docId.value) {
      const { data: next, error: numError } = await supabase.rpc(
        'next_document_number',
        { doc_type: type.value }
      );
      if (numError) throw numError;

      const { data: row, error } = await supabase
        .from('documents')
        .insert({ type: type.value, number: next as string, data: data.value })
        .select('id, number')
        .single();
      if (error) throw error;

      const r = row as { id: string; number: string };
      docId.value = r.id;
      number.value = r.number;
      await router.replace(`/dashboard/documents/${type.value}/${r.id}`);
    } else {
      const { error } = await supabase
        .from('documents')
        .update({ data: data.value })
        .eq('id', docId.value);
      if (error) throw error;
    }
    dirty.value = false;
    savedMsg.value = 'Saved';
    setTimeout(() => (savedMsg.value = ''), 2500);
  } catch (err) {
    console.error(err);
    errorMsg.value = (err as { message?: string }).message ?? 'Could not save.';
  } finally {
    saving.value = false;
  }
}

async function printDoc() {
  if (dirty.value || !docId.value) await save();
  if (errorMsg.value) return;
  // Browser print dialog → "Save as PDF" gives a PDF named after the document number
  window.print();
}

const sheetWrap = ref<HTMLElement | null>(null);
const exporting = ref(false);

async function downloadPdf() {
  if (dirty.value || !docId.value) await save();
  if (errorMsg.value) return;
  exporting.value = true; // renders the sheet visible and unscaled
  try {
    await nextTick();
    const sheet = sheetWrap.value?.firstElementChild as HTMLElement | null;
    if (!sheet) throw new Error('Preview not ready');
    const party = documentParty(type.value, data.value).replace(/[^\w\- ]+/g, '').trim();
    await downloadElementAsPdf(sheet, [number.value, party].filter(Boolean).join(' - '));
  } catch (err) {
    console.error(err);
    errorMsg.value = 'Could not generate the PDF. Try Print / PDF instead.';
  } finally {
    exporting.value = false;
  }
}

// Scale the A4 sheet down to fit narrow screens (never up)
const previewBox = ref<HTMLElement | null>(null);
const zoom = ref(1);
const A4_PX = 794;
useResizeObserver(previewBox, (entries) => {
  const width = entries[0]?.contentRect.width ?? A4_PX;
  zoom.value = Math.min(1, width / A4_PX);
});
</script>

<template>
  <main>
    <!-- Toolbar -->
    <div class="print:hidden flex flex-wrap items-center justify-between gap-4 mb-6">
      <div class="flex items-center gap-3">
        <NuxtLink
          :to="`/dashboard/documents/${type}`"
          class="size-9 rounded-full border border-grey-20 flex items-center justify-center hover:border-primary hover:text-primary">
          <Icon name="mdi:arrow-left" />
        </NuxtLink>
        <div>
          <h4 class="text-2xl font-medium">
            {{ number ?? `New ${meta.title}` }}
          </h4>
          <p class="text-xs text-grey-40">
            <span v-if="saving">Saving…</span>
            <span v-else-if="savedMsg" class="text-green-600">{{ savedMsg }}</span>
            <span v-else-if="dirty">Unsaved changes</span>
            <span v-else-if="!docId">A number is assigned when you first save</span>
            <span v-else>All changes saved</span>
          </p>
        </div>
      </div>
      <div class="flex flex-wrap gap-2">
        <button
          :disabled="saving || loading"
          class="admin-btn border border-primary text-primary bg-white hover:bg-primary-10"
          @click="save">
          <Icon :name="saving ? 'eos-icons:loading' : 'mdi:content-save-outline'" />
          Save
        </button>
        <button
          :disabled="saving || loading"
          class="admin-btn bg-primary text-white hover:bg-primary-70"
          @click="printDoc">
          <Icon name="mdi:printer-outline" /> Print
        </button>
        <button
          :disabled="saving || loading || exporting"
          class="admin-btn bg-grey-110 text-white hover:bg-grey-80"
          @click="downloadPdf">
          <Icon :name="exporting ? 'eos-icons:loading' : 'mdi:file-pdf-box'" />
          Download PDF
        </button>
      </div>
    </div>

    <p v-if="errorMsg" class="print:hidden text-red-600 text-sm mb-4">{{ errorMsg }}</p>

    <div v-if="loading" class="print:hidden py-20 text-center text-grey-40">
      <Icon name="eos-icons:loading" class="text-3xl" />
    </div>

    <template v-else>
      <!-- Mobile view switch -->
      <div class="print:hidden xl:hidden flex bg-white border border-grey-10 rounded-full p-1 mb-4 w-max">
        <button
          v-for="v in (['edit', 'preview'] as const)"
          :key="v"
          :class="[
            'px-5 py-1.5 rounded-full text-sm capitalize',
            view === v ? 'bg-primary text-white' : 'text-grey-50',
          ]"
          @click="view = v">
          {{ v }}
        </button>
      </div>

      <div class="grid xl:grid-cols-[minmax(380px,1fr)_minmax(0,794px)] gap-6 items-start">
        <div :class="['print:hidden', view === 'preview' ? 'hidden xl:block' : '']">
          <PayslipForm v-if="type === 'payslip'" v-model="payslipData" />
          <SalesForm v-else v-model="salesData" :type="type" />
        </div>

        <div
          ref="previewBox"
          :class="[
            'xl:sticky xl:top-6 print:block print:static',
            view === 'edit' && !exporting ? 'hidden xl:block' : '',
          ]">
          <div
            ref="sheetWrap"
            class="preview-zoom"
            :style="{ '--zoom': exporting ? 1 : zoom }">
            <DocumentPreview :type="type" :number="number" :data="data" />
          </div>
        </div>
      </div>
    </template>
  </main>
</template>

<style scoped>
.preview-zoom {
  zoom: var(--zoom);
}

@media print {
  .preview-zoom {
    zoom: 1;
  }
}
</style>
