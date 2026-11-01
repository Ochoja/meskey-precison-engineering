<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
  validate: (route) =>
    ['invoice', 'quotation', 'payslip'].includes(route.params.type as string),
});

interface DocRow {
  id: string;
  type: DocType;
  number: string;
  data: DocData;
  created_at: string;
}

const route = useRoute();
const supabase = useSupabaseClient();

const type = computed(() => route.params.type as DocType);
const meta = computed(() => DOC_META[type.value]);

useHead(() => ({ title: `${meta.value.plural} | Meskey Admin` }));

const docs = ref<DocRow[]>([]);
const loading = ref(true);
const errorMsg = ref('');
const search = ref('');
const statusFilter = ref('');
const dateFrom = ref('');
const dateTo = ref('');
const toDelete = ref<DocRow | null>(null);
const deleting = ref(false);

async function fetchDocs() {
  loading.value = true;
  errorMsg.value = '';
  const { data, error } = await supabase
    .from('documents')
    .select('id, type, number, data, created_at')
    .eq('type', type.value)
    .order('created_at', { ascending: false });
  loading.value = false;
  if (error) {
    errorMsg.value = error.message;
    return;
  }
  docs.value = (data ?? []) as DocRow[];
}

onMounted(fetchDocs);
watch(type, () => {
  search.value = '';
  statusFilter.value = '';
  dateFrom.value = '';
  dateTo.value = '';
  fetchDocs();
});

const filtered = computed(() => {
  const q = search.value.trim().toLowerCase();
  return docs.value.filter((d) => {
    if (statusFilter.value && d.data.status !== statusFilter.value) return false;
    // ISO dates (YYYY-MM-DD) compare correctly as strings
    const date = documentDate(d.type, d.data) ?? '';
    if (dateFrom.value && date < dateFrom.value) return false;
    if (dateTo.value && date > dateTo.value) return false;
    if (!q) return true;
    return (
      d.number.toLowerCase().includes(q) ||
      documentParty(d.type, d.data).toLowerCase().includes(q)
    );
  });
});

const isPayslip = computed(() => type.value === 'payslip');
const colCount = computed(() => (isPayslip.value ? 7 : 6));

function exportCsv() {
  const t = type.value;
  const header = isPayslip.value
    ? ['Number', 'Employee', 'Employee ID', 'Period Start', 'Period End', 'Pay Date',
        'Currency', 'Gross Pay', 'Total Deductions', 'Net Pay', 'Status']
    : ['Number', 'Client', 'Issue Date', t === 'invoice' ? 'Due Date' : 'Valid Until',
        'Currency', 'Subtotal', 'Discount', 'VAT', 'Total', 'Status'];

  const rows = filtered.value.map((d) => {
    if (isPayslip.value) {
      const p = d.data as PayslipData;
      const tot = payslipTotals(p);
      return [d.number, p.employee?.name ?? '', p.employee?.employee_id ?? '',
        p.period_start, p.period_end, p.pay_date, p.currency,
        tot.gross.toFixed(2), tot.deductions.toFixed(2), tot.net.toFixed(2), p.status];
    }
    const s = d.data as SalesDocData;
    const tot = salesTotals(s);
    return [d.number, documentParty(t, s), s.issue_date, s.due_date, s.currency,
      tot.subtotal.toFixed(2), tot.discount.toFixed(2), tot.tax.toFixed(2), tot.total.toFixed(2), s.status];
  });

  const range = [dateFrom.value, dateTo.value].filter(Boolean).join('_to_');
  downloadCsv(`${meta.value.plural}${range ? '-' + range : ''}.csv`, [header, ...rows]);
}

const statusClass: Record<string, string> = {
  draft: 'bg-grey-10 text-grey',
  sent: 'bg-blue-100 text-blue-700',
  issued: 'bg-blue-100 text-blue-700',
  paid: 'bg-green-100 text-green-700',
  accepted: 'bg-green-100 text-green-700',
  overdue: 'bg-red-100 text-red-700',
  rejected: 'bg-red-100 text-red-700',
};

async function confirmDelete() {
  if (!toDelete.value) return;
  deleting.value = true;
  const { error } = await supabase
    .from('documents')
    .delete()
    .eq('id', toDelete.value.id);
  deleting.value = false;
  if (error) {
    errorMsg.value = error.message;
  } else {
    docs.value = docs.value.filter((d) => d.id !== toDelete.value!.id);
  }
  toDelete.value = null;
}
</script>

<template>
  <main>
    <div class="flex flex-wrap justify-between items-end gap-4 mb-6">
      <div>
        <h4 class="text-2xl font-medium">{{ meta.plural }}</h4>
        <p class="text-grey-40 text-sm">
          Create, print and manage Meskey {{ meta.plural.toLowerCase() }}.
        </p>
      </div>
      <div class="flex flex-wrap gap-2">
        <button
          :disabled="filtered.length === 0"
          class="admin-btn border border-primary text-primary bg-white hover:bg-primary-10"
          @click="exportCsv">
          <Icon name="mdi:microsoft-excel" /> Export CSV
        </button>
        <NuxtLink
          :to="`/dashboard/documents/${type}/new`"
          class="admin-btn bg-primary text-white hover:bg-primary-70">
          <Icon name="ic:round-plus" /> New {{ meta.title }}
        </NuxtLink>
      </div>
    </div>

    <div class="flex flex-wrap gap-3 mb-4">
      <div class="relative flex-1 min-w-[220px] max-w-md">
        <Icon
          name="mdi:magnify"
          class="absolute left-3 top-1/2 -translate-y-1/2 text-grey-30" />
        <input
          v-model="search"
          :placeholder="`Search by number or ${type === 'payslip' ? 'employee' : 'client'}`"
          class="admin-input pl-9" >
      </div>
      <select v-model="statusFilter" class="admin-input w-auto capitalize">
        <option value="">All statuses</option>
        <option v-for="s in meta.statuses" :key="s" :value="s">{{ s }}</option>
      </select>
      <div class="flex items-center gap-2">
        <input v-model="dateFrom" type="date" title="From date" class="admin-input w-auto" >
        <span class="text-grey-40 text-sm">to</span>
        <input v-model="dateTo" type="date" title="To date" class="admin-input w-auto" >
        <button
          v-if="dateFrom || dateTo"
          title="Clear dates"
          class="text-grey-40 hover:text-primary"
          @click="dateFrom = dateTo = ''">
          <Icon name="mdi:close-circle" />
        </button>
      </div>
    </div>

    <p v-if="errorMsg" class="text-red-600 text-sm mb-3">{{ errorMsg }}</p>

    <div class="border border-gray-300 rounded-lg overflow-x-auto bg-white">
      <table class="w-full min-w-[820px] text-sm">
        <thead class="bg-gray-200 text-left">
          <tr>
            <th class="p-3 font-semibold">Number</th>
            <th class="p-3 font-semibold">
              {{ type === 'payslip' ? 'Employee' : 'Client' }}
            </th>
            <th class="p-3 font-semibold">
              {{ type === 'payslip' ? 'Pay Date' : 'Issue Date' }}
            </th>
            <th v-if="isPayslip" class="p-3 font-semibold text-right">Gross Pay</th>
            <th class="p-3 font-semibold text-right">
              {{ type === 'payslip' ? 'Net Pay' : 'Total' }}
            </th>
            <th class="p-3 font-semibold">Status</th>
            <th class="p-3 font-semibold text-center w-32">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading">
            <td :colspan="colCount" class="p-8 text-center text-grey-40">
              <Icon name="eos-icons:loading" class="text-2xl" />
            </td>
          </tr>
          <tr v-else-if="filtered.length === 0">
            <td :colspan="colCount" class="p-10 text-center text-grey-40">
              <Icon :name="meta.icon" class="text-4xl text-primary-30 mb-2" />
              <p>
                {{ docs.length ? 'No matches.' : `No ${meta.plural.toLowerCase()} yet.` }}
              </p>
            </td>
          </tr>
          <tr
            v-for="doc in filtered"
            v-else
            :key="doc.id"
            class="border-t border-gray-200 hover:bg-primary-10/30">
            <td class="p-3 font-medium">
              <NuxtLink :to="`/dashboard/documents/${type}/${doc.id}`" class="hover:text-primary">
                {{ doc.number }}
              </NuxtLink>
            </td>
            <td class="p-3 truncate max-w-[220px]">
              {{ documentParty(type, doc.data) || '—' }}
            </td>
            <td class="p-3">{{ formatDate(documentDate(type, doc.data)) }}</td>
            <td v-if="isPayslip" class="p-3 text-right text-grey-50">
              {{ formatMoney(payslipTotals(doc.data as PayslipData).gross, doc.data.currency) }}
            </td>
            <td class="p-3 text-right font-medium">
              {{ formatMoney(documentTotal(type, doc.data), doc.data.currency) }}
            </td>
            <td class="p-3">
              <span
                :class="[
                  'px-2.5 py-0.5 rounded-full text-xs capitalize',
                  statusClass[doc.data.status] ?? 'bg-grey-10',
                ]">
                {{ doc.data.status }}
              </span>
            </td>
            <td class="p-3">
              <div class="flex justify-center gap-3 text-lg">
                <NuxtLink
                  :to="`/dashboard/documents/${type}/${doc.id}`"
                  title="Open"
                  class="text-grey-40 hover:text-primary">
                  <Icon name="basil:edit-solid" />
                </NuxtLink>
                <NuxtLink
                  :to="`/dashboard/documents/${type}/new?from=${doc.id}`"
                  title="Duplicate"
                  class="text-grey-40 hover:text-primary">
                  <Icon name="mdi:content-copy" />
                </NuxtLink>
                <button
                  title="Delete"
                  class="text-red-600 cursor-pointer"
                  @click="toDelete = doc">
                  <Icon name="fluent:delete-12-filled" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Delete confirmation -->
    <div
      v-if="toDelete"
      class="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4">
      <div class="bg-[#fafafa] p-6 rounded-xl w-full max-w-md shadow-lg text-center">
        <Icon name="fluent:delete-12-filled" class="text-4xl text-red-600 mb-2" />
        <h4 class="text-lg font-medium mb-2">Delete {{ meta.title }}</h4>
        <p class="text-sm text-grey-50">
          Are you sure you want to delete <strong>{{ toDelete.number }}</strong>?
          This cannot be undone.
        </p>
        <div class="flex justify-center gap-4 mt-6">
          <button
            :disabled="deleting"
            class="px-6 py-1 border rounded-full bg-white border-grey-30 disabled:opacity-50"
            @click="toDelete = null">
            Cancel
          </button>
          <button
            :disabled="deleting"
            class="px-6 py-1 rounded-full bg-red-500 text-white flex items-center gap-2 disabled:opacity-50"
            @click="confirmDelete">
            <Icon v-if="deleting" name="line-md:loading-twotone-loop" />
            Delete
          </button>
        </div>
      </div>
    </div>
  </main>
</template>
