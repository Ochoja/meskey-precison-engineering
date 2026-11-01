<script setup lang="ts">
// Editor for invoices and quotations
const props = defineProps<{ type: 'invoice' | 'quotation' }>();
const data = defineModel<SalesDocData>({ required: true });

const totals = computed(() => salesTotals(data.value));

const addItem = () =>
  data.value.items.push({ description: '', quantity: 1, unit_price: 0 });
const removeItem = (i: number) => data.value.items.splice(i, 1);
</script>

<template>
  <div class="flex flex-col gap-5">
    <div class="admin-card grid grid-cols-2 gap-4">
      <div>
        <label class="admin-label">Status</label>
        <select v-model="data.status" class="admin-input capitalize">
          <option v-for="s in DOC_META[props.type].statuses" :key="s" :value="s">
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
        <label class="admin-label">Issue Date</label>
        <input v-model="data.issue_date" type="date" class="admin-input" >
      </div>
      <div>
        <label class="admin-label">
          {{ props.type === 'invoice' ? 'Due Date' : 'Valid Until' }}
        </label>
        <input v-model="data.due_date" type="date" class="admin-input" >
      </div>
      <div class="col-span-2">
        <label class="admin-label">Reference / PO Number (optional)</label>
        <input v-model="data.reference" class="admin-input" >
      </div>
    </div>

    <div class="admin-card grid grid-cols-2 gap-4">
      <h5 class="col-span-2 font-medium">
        {{ props.type === 'invoice' ? 'Bill To' : 'Prepared For' }}
      </h5>
      <div>
        <label class="admin-label">Contact Name</label>
        <input v-model="data.client.name" class="admin-input" >
      </div>
      <div>
        <label class="admin-label">Company</label>
        <input v-model="data.client.company" class="admin-input" >
      </div>
      <div>
        <label class="admin-label">Email</label>
        <input v-model="data.client.email" type="email" class="admin-input" >
      </div>
      <div>
        <label class="admin-label">Phone</label>
        <input v-model="data.client.phone" class="admin-input" >
      </div>
      <div class="col-span-2">
        <label class="admin-label">Address</label>
        <textarea v-model="data.client.address" rows="2" class="admin-input" />
      </div>
    </div>

    <div class="admin-card flex flex-col gap-3">
      <h5 class="font-medium">Items</h5>
      <div
        v-for="(item, i) in data.items"
        :key="i"
        class="grid grid-cols-[1fr_70px_110px_32px] gap-2 items-start">
        <textarea
          v-model="item.description"
          rows="1"
          placeholder="Description"
          class="admin-input resize-y" />
        <input
          v-model.number="item.quantity"
          type="number"
          min="0"
          step="any"
          placeholder="Qty"
          class="admin-input" >
        <input
          v-model.number="item.unit_price"
          type="number"
          min="0"
          step="any"
          placeholder="Unit price"
          class="admin-input" >
        <button
          type="button"
          class="h-10 text-red-600 disabled:opacity-30"
          :disabled="data.items.length === 1"
          aria-label="Remove item"
          @click="removeItem(i)">
          <Icon name="fluent:delete-12-filled" />
        </button>
      </div>
      <button
        type="button"
        class="admin-btn self-start border border-primary text-primary hover:bg-primary-10"
        @click="addItem">
        <Icon name="ic:round-plus" /> Add Item
      </button>

      <div class="grid grid-cols-2 gap-4 mt-2">
        <div>
          <label class="admin-label">Discount (amount)</label>
          <input v-model.number="data.discount" type="number" min="0" step="any" class="admin-input" >
        </div>
        <div>
          <label class="admin-label">VAT / Tax rate (%)</label>
          <input v-model.number="data.tax_rate" type="number" min="0" step="any" class="admin-input" >
        </div>
      </div>
      <p class="text-right text-sm">
        Total:
        <span class="font-semibold text-primary">
          {{ formatMoney(totals.total, data.currency) }}
        </span>
      </p>
    </div>

    <div class="admin-card flex flex-col gap-4">
      <div>
        <label class="admin-label">Notes</label>
        <textarea v-model="data.notes" rows="2" class="admin-input" />
      </div>
      <div>
        <label class="admin-label">Terms &amp; Conditions</label>
        <textarea v-model="data.terms" rows="3" class="admin-input" />
      </div>
    </div>

    <div v-if="props.type === 'invoice'" class="admin-card grid grid-cols-2 gap-4">
      <h5 class="col-span-2 font-medium">Payment Details</h5>
      <div>
        <label class="admin-label">Bank Name</label>
        <input v-model="data.bank.bank_name" class="admin-input" >
      </div>
      <div>
        <label class="admin-label">Account Number</label>
        <input v-model="data.bank.account_number" class="admin-input" >
      </div>
      <div class="col-span-2">
        <label class="admin-label">Account Name</label>
        <input v-model="data.bank.account_name" class="admin-input" >
      </div>
    </div>

    <div class="admin-card grid grid-cols-2 gap-4">
      <h5 class="col-span-2 font-medium">Signatory</h5>
      <div>
        <label class="admin-label">Name</label>
        <input v-model="data.signatory.name" class="admin-input" >
      </div>
      <div>
        <label class="admin-label">Title</label>
        <input v-model="data.signatory.title" class="admin-input" >
      </div>
    </div>
  </div>
</template>
