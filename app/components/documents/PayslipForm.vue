<script setup lang="ts">
const data = defineModel<PayslipData>({ required: true });

const totals = computed(() => payslipTotals(data.value));

const addLine = (side: 'earnings' | 'deductions') =>
  data.value[side].push({ label: '', amount: 0 });
const removeLine = (side: 'earnings' | 'deductions', i: number) =>
  data.value[side].splice(i, 1);
</script>

<template>
  <div class="flex flex-col gap-5">
    <div class="admin-card grid grid-cols-2 gap-4">
      <div>
        <label class="admin-label">Status</label>
        <select v-model="data.status" class="admin-input capitalize">
          <option v-for="s in DOC_META.payslip.statuses" :key="s" :value="s">
            {{ s }}
          </option>
        </select>
      </div>
      <div>
        <label class="admin-label">Currency</label>
        <select v-model="data.currency" class="admin-input">
          <option v-for="c in CURRENCIES" :key="c.code" :value="c.code">
            {{ c.code }} ({{ c.symbol }})
          </option>
        </select>
      </div>
      <div>
        <label class="admin-label">Period Start</label>
        <input v-model="data.period_start" type="date" class="admin-input" >
      </div>
      <div>
        <label class="admin-label">Period End</label>
        <input v-model="data.period_end" type="date" class="admin-input" >
      </div>
      <div>
        <label class="admin-label">Pay Date</label>
        <input v-model="data.pay_date" type="date" class="admin-input" >
      </div>
    </div>

    <div class="admin-card grid grid-cols-2 gap-4">
      <h5 class="col-span-2 font-medium">Employee</h5>
      <div>
        <label class="admin-label">Full Name</label>
        <input v-model="data.employee.name" class="admin-input" >
      </div>
      <div>
        <label class="admin-label">Employee ID</label>
        <input v-model="data.employee.employee_id" class="admin-input" >
      </div>
      <div>
        <label class="admin-label">Position</label>
        <input v-model="data.employee.position" class="admin-input" >
      </div>
      <div>
        <label class="admin-label">Department</label>
        <input v-model="data.employee.department" class="admin-input" >
      </div>
      <div class="col-span-2">
        <label class="admin-label">Email</label>
        <input v-model="data.employee.email" type="email" class="admin-input" >
      </div>
      <div>
        <label class="admin-label">Bank Name</label>
        <input v-model="data.employee.bank_name" class="admin-input" >
      </div>
      <div>
        <label class="admin-label">Account Number</label>
        <input v-model="data.employee.account_number" class="admin-input" >
      </div>
    </div>

    <div
      v-for="side in (['earnings', 'deductions'] as const)"
      :key="side"
      class="admin-card flex flex-col gap-3">
      <h5 class="font-medium capitalize">{{ side }}</h5>
      <div
        v-for="(line, i) in data[side]"
        :key="i"
        class="grid grid-cols-[1fr_140px_32px] gap-2">
        <input v-model="line.label" placeholder="Description" class="admin-input" >
        <input
          v-model.number="line.amount"
          type="number"
          min="0"
          step="any"
          class="admin-input" >
        <button
          type="button"
          class="h-10 text-red-600"
          aria-label="Remove line"
          @click="removeLine(side, i)">
          <Icon name="fluent:delete-12-filled" />
        </button>
      </div>
      <button
        type="button"
        class="admin-btn self-start border border-primary text-primary hover:bg-primary-10"
        @click="addLine(side)">
        <Icon name="ic:round-plus" />
        Add {{ side === 'earnings' ? 'Earning' : 'Deduction' }}
      </button>
    </div>

    <div class="admin-card flex justify-between text-sm">
      <span>Gross: {{ formatMoney(totals.gross, data.currency) }}</span>
      <span>Deductions: {{ formatMoney(totals.deductions, data.currency) }}</span>
      <span class="font-semibold text-primary">
        Net: {{ formatMoney(totals.net, data.currency) }}
      </span>
    </div>

    <div class="admin-card flex flex-col gap-4">
      <div>
        <label class="admin-label">Notes</label>
        <textarea v-model="data.notes" rows="2" class="admin-input" />
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="admin-label">Signatory Name</label>
          <input v-model="data.signatory.name" class="admin-input" >
        </div>
        <div>
          <label class="admin-label">Signatory Title</label>
          <input v-model="data.signatory.title" class="admin-input" >
        </div>
      </div>
    </div>
  </div>
</template>
