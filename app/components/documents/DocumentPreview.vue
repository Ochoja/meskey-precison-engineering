<script setup lang="ts">
import logo from '../../assets/images/mainlogo.png';

const props = defineProps<{
  type: DocType;
  number: string | null;
  data: DocData;
}>();

const meta = computed(() => DOC_META[props.type]);
const sales = computed(() => props.data as SalesDocData);
const payslip = computed(() => props.data as PayslipData);
const st = computed(() => salesTotals(sales.value));
const pt = computed(() => payslipTotals(payslip.value));
const money = (n: number) => formatMoney(n, props.data.currency);

const grandTotal = computed(() =>
  props.type === 'payslip' ? pt.value.net : st.value.total
);

const payPeriod = computed(() => {
  const start = parseDate(payslip.value.period_start);
  if (Number.isNaN(start.getTime())) return '—';
  return start.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
});

const hasBank = computed(() => {
  const b = sales.value.bank;
  return b && (b.bank_name || b.account_number);
});

// Pad payslip tables so earnings and deductions rows line up side by side
const payRows = computed(() =>
  Math.max(payslip.value.earnings.length, payslip.value.deductions.length)
);
</script>

<template>
  <div
    class="doc-sheet relative bg-white text-grey-110 w-[210mm] min-h-[297mm] print:min-h-[296mm] flex flex-col overflow-hidden text-[12px] leading-relaxed shadow-[2px_2px_50px_20px_rgba(0,0,0,0.06)] print:shadow-none">
    <!-- Watermark -->
    <img
      src="/logo.png"
      alt=""
      class="absolute w-[120mm] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.04] pointer-events-none select-none" >

    <!-- Brand stripe -->
    <div class="flex h-2">
      <div class="flex-[3] bg-primary" />
      <div class="flex-1 bg-[#ff0000]" />
    </div>

    <!-- Header -->
    <header class="px-[14mm] pt-[10mm] flex justify-between items-start gap-6">
      <div class="max-w-[95mm]">
        <img :src="logo" alt="Meskey Precision Engineering" class="w-[62mm]" >
        <div class="mt-3 text-[10px] text-grey-50 leading-snug space-y-0.5">
          <p>{{ COMPANY.offices[0]!.address }}</p>
          <p>{{ COMPANY.email }} &nbsp;·&nbsp; {{ COMPANY.phones.join(', ') }}</p>
          <p>{{ COMPANY.website }}</p>
        </div>
      </div>
      <div class="text-right">
        <h1
          class="font-[Poppins] text-[30px] font-semibold tracking-[0.12em] uppercase text-primary leading-none">
          {{ meta.title }}
        </h1>
        <p class="mt-2 font-medium text-[13px]">
          {{ number || 'DRAFT — not yet saved' }}
        </p>
        <dl class="mt-3 grid grid-cols-[auto_auto] gap-x-4 gap-y-0.5 text-[11px] justify-end">
          <template v-if="type === 'payslip'">
            <dt class="text-grey-40">Pay Period</dt>
            <dd class="font-medium">{{ payPeriod }}</dd>
            <dt class="text-grey-40">Pay Date</dt>
            <dd class="font-medium">{{ formatDate(payslip.pay_date) }}</dd>
          </template>
          <template v-else>
            <dt class="text-grey-40">Date Issued</dt>
            <dd class="font-medium">{{ formatDate(sales.issue_date) }}</dd>
            <dt class="text-grey-40">
              {{ type === 'invoice' ? 'Due Date' : 'Valid Until' }}
            </dt>
            <dd class="font-medium">{{ formatDate(sales.due_date) }}</dd>
            <template v-if="sales.reference">
              <dt class="text-grey-40">Reference</dt>
              <dd class="font-medium">{{ sales.reference }}</dd>
            </template>
          </template>
        </dl>
      </div>
    </header>

    <div class="mx-[14mm] mt-6 border-t border-grey-10" />

    <!-- ===================== Invoice / Quotation ===================== -->
    <section v-if="type !== 'payslip'" class="px-[14mm] pt-6 flex-1 flex flex-col">
      <div class="grid grid-cols-2 gap-8">
        <div>
          <p class="text-[10px] uppercase tracking-widest text-primary font-semibold mb-1">
            {{ type === 'invoice' ? 'Bill To' : 'Prepared For' }}
          </p>
          <p class="font-semibold text-[14px] font-[Poppins]">
            {{ sales.client.company || sales.client.name || 'Client name' }}
          </p>
          <p v-if="sales.client.company && sales.client.name">
            Attn: {{ sales.client.name }}
          </p>
          <p class="whitespace-pre-line text-grey-50">{{ sales.client.address }}</p>
          <p class="text-grey-50">
            {{ [sales.client.email, sales.client.phone].filter(Boolean).join(' · ') }}
          </p>
        </div>
        <div class="flex justify-end items-start">
          <div class="bg-primary-10/60 rounded-xl px-5 py-3 text-right">
            <p class="text-[10px] uppercase tracking-widest text-primary-80">
              {{ type === 'invoice' ? 'Amount Due' : 'Quoted Total' }}
            </p>
            <p class="font-[Poppins] text-[20px] font-semibold text-primary-90">
              {{ money(grandTotal) }}
            </p>
          </div>
        </div>
      </div>

      <!-- Items -->
      <table class="w-full mt-6 border-collapse">
        <thead>
          <tr class="bg-grey-110 text-white text-[11px] uppercase tracking-wider">
            <th class="text-left py-2 px-3 w-8 rounded-l-lg">#</th>
            <th class="text-left py-2 px-3">Description</th>
            <th class="text-right py-2 px-3 w-16">Qty</th>
            <th class="text-right py-2 px-3 w-32">Unit Price</th>
            <th class="text-right py-2 px-3 w-32 rounded-r-lg">Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, i) in sales.items"
            :key="i"
            class="border-b border-grey-10 align-top break-inside-avoid">
            <td class="py-2 px-3 text-grey-40">{{ i + 1 }}</td>
            <td class="py-2 px-3 whitespace-pre-line">{{ item.description || '—' }}</td>
            <td class="py-2 px-3 text-right">{{ item.quantity }}</td>
            <td class="py-2 px-3 text-right">{{ money(item.unit_price) }}</td>
            <td class="py-2 px-3 text-right font-medium">
              {{ money(Number(item.quantity) * Number(item.unit_price)) }}
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Totals -->
      <div class="flex justify-end mt-4 break-inside-avoid">
        <div class="w-[80mm]">
          <div class="flex justify-between py-1">
            <span class="text-grey-50">Subtotal</span>
            <span>{{ money(st.subtotal) }}</span>
          </div>
          <div v-if="st.discount" class="flex justify-between py-1">
            <span class="text-grey-50">Discount</span>
            <span>− {{ money(st.discount) }}</span>
          </div>
          <div v-if="Number(sales.tax_rate)" class="flex justify-between py-1">
            <span class="text-grey-50">VAT ({{ sales.tax_rate }}%)</span>
            <span>{{ money(st.tax) }}</span>
          </div>
          <div
            class="flex justify-between items-center mt-2 bg-primary text-white rounded-lg px-3 py-2">
            <span class="font-medium">Total</span>
            <span class="font-[Poppins] font-semibold text-[15px]">{{ money(st.total) }}</span>
          </div>
        </div>
      </div>
      <p class="mt-3 text-[11px] italic text-grey-50 text-right">
        {{ amountInWords(st.total, sales.currency) }}
      </p>

      <!-- Notes, terms, bank -->
      <div class="grid grid-cols-2 gap-8 mt-6 break-inside-avoid">
        <div class="space-y-4">
          <div v-if="sales.notes">
            <p class="text-[10px] uppercase tracking-widest text-primary font-semibold mb-1">Notes</p>
            <p class="whitespace-pre-line text-grey-50">{{ sales.notes }}</p>
          </div>
          <div v-if="sales.terms">
            <p class="text-[10px] uppercase tracking-widest text-primary font-semibold mb-1">
              Terms &amp; Conditions
            </p>
            <p class="whitespace-pre-line text-grey-50">{{ sales.terms }}</p>
          </div>
        </div>
        <div v-if="type === 'invoice' && hasBank" class="border border-primary-20 rounded-xl p-4 self-start">
          <p class="text-[10px] uppercase tracking-widest text-primary font-semibold mb-2">
            Payment Details
          </p>
          <dl class="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
            <dt class="text-grey-40">Bank</dt>
            <dd class="font-medium">{{ sales.bank.bank_name }}</dd>
            <dt class="text-grey-40">Account Name</dt>
            <dd class="font-medium">{{ sales.bank.account_name }}</dd>
            <dt class="text-grey-40">Account No.</dt>
            <dd class="font-medium tracking-wider">{{ sales.bank.account_number }}</dd>
          </dl>
        </div>
      </div>

      <!-- Signature -->
      <div class="mt-auto pt-12 pb-8 flex justify-end break-inside-avoid">
        <div class="w-[65mm] text-center">
          <div class="border-t border-grey-110 pt-1">
            <p class="font-medium">{{ sales.signatory.name || 'Authorised Signatory' }}</p>
            <p class="text-grey-50 text-[11px]">
              {{ sales.signatory.title || 'For ' + COMPANY.name }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- ===================== Payslip ===================== -->
    <section v-else class="px-[14mm] pt-6 flex-1 flex flex-col">
      <div class="grid grid-cols-2 gap-x-8 gap-y-1 bg-primary-10/50 rounded-xl px-5 py-4">
        <div>
          <p class="text-[10px] uppercase tracking-widest text-primary font-semibold mb-1">Employee</p>
          <p class="font-semibold text-[14px] font-[Poppins]">
            {{ payslip.employee.name || 'Employee name' }}
          </p>
          <p class="text-grey-50">
            {{ [payslip.employee.position, payslip.employee.department].filter(Boolean).join(' · ') }}
          </p>
          <p class="text-grey-50">{{ payslip.employee.email }}</p>
        </div>
        <dl class="grid grid-cols-[auto_1fr] gap-x-4 gap-y-0.5 self-center">
          <dt class="text-grey-40">Employee ID</dt>
          <dd class="font-medium">{{ payslip.employee.employee_id || '—' }}</dd>
          <dt class="text-grey-40">Period</dt>
          <dd class="font-medium">
            {{ formatDate(payslip.period_start) }} – {{ formatDate(payslip.period_end) }}
          </dd>
          <dt class="text-grey-40">Bank</dt>
          <dd class="font-medium">{{ payslip.employee.bank_name || '—' }}</dd>
          <dt class="text-grey-40">Account No.</dt>
          <dd class="font-medium tracking-wider">{{ payslip.employee.account_number || '—' }}</dd>
        </dl>
      </div>

      <div class="grid grid-cols-2 gap-6 mt-6">
        <table
          v-for="side in (['earnings', 'deductions'] as const)"
          :key="side"
          class="w-full border-collapse self-start">
          <thead>
            <tr
              :class="[
                'text-white text-[11px] uppercase tracking-wider',
                side === 'earnings' ? 'bg-grey-110' : 'bg-primary-70',
              ]">
              <th class="text-left py-2 px-3 rounded-l-lg">
                {{ side === 'earnings' ? 'Earnings' : 'Deductions' }}
              </th>
              <th class="text-right py-2 px-3 rounded-r-lg">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="i in payRows" :key="i" class="border-b border-grey-10 h-8">
              <td class="px-3">{{ payslip[side][i - 1]?.label }}</td>
              <td class="px-3 text-right">
                {{ payslip[side][i - 1] ? money(payslip[side][i - 1]!.amount) : '' }}
              </td>
            </tr>
            <tr class="font-semibold">
              <td class="px-3 py-2">
                {{ side === 'earnings' ? 'Gross Pay' : 'Total Deductions' }}
              </td>
              <td class="px-3 py-2 text-right">
                {{ money(side === 'earnings' ? pt.gross : pt.deductions) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pay summary: gross − deductions = net -->
      <div class="mt-6 grid grid-cols-[1fr_1fr_1.3fr] gap-3 break-inside-avoid">
        <div class="border border-grey-10 rounded-xl px-4 py-3">
          <p class="text-[10px] uppercase tracking-widest text-grey-40">Gross Pay</p>
          <p class="font-[Poppins] text-[16px] font-semibold">{{ money(pt.gross) }}</p>
        </div>
        <div class="border border-grey-10 rounded-xl px-4 py-3">
          <p class="text-[10px] uppercase tracking-widest text-grey-40">Total Deductions</p>
          <p class="font-[Poppins] text-[16px] font-semibold text-primary-80">
            − {{ money(pt.deductions) }}
          </p>
        </div>
        <div class="bg-primary text-white rounded-xl px-4 py-3">
          <p class="text-[10px] uppercase tracking-widest opacity-80">Net Pay</p>
          <p class="font-[Poppins] text-[20px] font-semibold leading-tight">{{ money(pt.net) }}</p>
        </div>
      </div>
      <p class="mt-2 text-[11px] italic text-grey-50 text-right">
        Net pay in words: {{ amountInWords(pt.net, payslip.currency) }}
      </p>

      <div v-if="payslip.notes" class="mt-6">
        <p class="text-[10px] uppercase tracking-widest text-primary font-semibold mb-1">Notes</p>
        <p class="whitespace-pre-line text-grey-50">{{ payslip.notes }}</p>
      </div>

      <div class="mt-auto pt-12 pb-8 flex justify-between items-end break-inside-avoid">
        <p class="text-[10px] text-grey-40 max-w-[90mm]">
          This is a confidential document intended solely for the named employee.
        </p>
        <div class="w-[65mm] text-center">
          <div class="border-t border-grey-110 pt-1">
            <p class="font-medium">{{ payslip.signatory.name || 'Authorised Signatory' }}</p>
            <p class="text-grey-50 text-[11px]">{{ payslip.signatory.title || COMPANY.name }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer band -->
    <footer class="bg-primary-70 text-white px-[14mm] py-3 text-[9px] leading-snug">
      <div class="grid grid-cols-3 gap-4">
        <div v-for="office in COMPANY.offices" :key="office.label">
          <p class="font-semibold uppercase tracking-wider text-[8px] opacity-80">
            {{ office.label }}
          </p>
          <p>{{ office.address }}</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.doc-sheet {
  font-family: Geist, sans-serif;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}
</style>
