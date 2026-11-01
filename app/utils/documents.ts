export type DocType = 'invoice' | 'quotation' | 'payslip';

export const DOC_TYPES: DocType[] = ['invoice', 'quotation', 'payslip'];

export const COMPANY = {
  name: 'Meskey Precision Engineering',
  email: 'info@meskeyprecisioneng.org',
  website: 'www.meskeyprecisioneng.org',
  phones: ['+39 06 69489242'],
  offices: [
    { label: 'Abuja Office', address: 'Central Business District, FCT Abuja' },
    {
      label: 'Kaduna Office',
      address:
        'No 4 School Road, Off Makama Plaza, Opposite Kaduna Refinery Complex, Kaduna',
    },
    {
      label: 'International Office',
      address: 'Sotrade SRL Via Portuense 2482 00054 Fiumicino (RM) Rome, Italy',
    },
  ],
};

export const DOC_META: Record<
  DocType,
  { title: string; plural: string; icon: string; statuses: string[] }
> = {
  invoice: {
    title: 'Invoice',
    plural: 'Invoices',
    icon: 'mdi:file-document-outline',
    statuses: ['draft', 'sent', 'paid', 'overdue'],
  },
  quotation: {
    title: 'Quotation',
    plural: 'Quotations',
    icon: 'mdi:file-sign',
    statuses: ['draft', 'sent', 'accepted', 'rejected'],
  },
  payslip: {
    title: 'Payslip',
    plural: 'Payslips',
    icon: 'mdi:cash-multiple',
    statuses: ['draft', 'issued'],
  },
};

export const CURRENCIES = [
  { code: 'NGN', symbol: '₦', major: 'Naira', minor: 'Kobo' },
  { code: 'USD', symbol: '$', major: 'Dollars', minor: 'Cents' },
  { code: 'EUR', symbol: '€', major: 'Euros', minor: 'Cents' },
  { code: 'GBP', symbol: '£', major: 'Pounds', minor: 'Pence' },
];

export interface LineItem {
  description: string;
  quantity: number;
  unit_price: number;
}

export interface PayLine {
  label: string;
  amount: number;
}

export interface SalesDocData {
  status: string;
  currency: string;
  issue_date: string;
  due_date: string; // "valid until" for quotations
  reference: string;
  client: {
    name: string;
    company: string;
    address: string;
    email: string;
    phone: string;
  };
  items: LineItem[];
  discount: number;
  tax_rate: number;
  notes: string;
  terms: string;
  bank: { bank_name: string; account_name: string; account_number: string };
  signatory: { name: string; title: string };
}

export interface PayslipData {
  status: string;
  currency: string;
  pay_date: string;
  period_start: string;
  period_end: string;
  employee: {
    name: string;
    employee_id: string;
    position: string;
    department: string;
    email: string;
    bank_name: string;
    account_number: string;
  };
  earnings: PayLine[];
  deductions: PayLine[];
  notes: string;
  signatory: { name: string; title: string };
}

export type DocData = SalesDocData | PayslipData;

// Local-time YYYY-MM-DD (toISOString would shift dates across timezones)
const isoDate = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

// Parse YYYY-MM-DD as a local date rather than UTC midnight
export function parseDate(value: string) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value ?? '');
  return m ? new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3])) : new Date(value);
}

function addDays(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return isoDate(d);
}

export function defaultData(type: DocType): DocData {
  if (type === 'payslip') {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return {
      status: 'draft',
      currency: 'NGN',
      pay_date: isoDate(end),
      period_start: isoDate(start),
      period_end: isoDate(end),
      employee: {
        name: '',
        employee_id: '',
        position: '',
        department: '',
        email: '',
        bank_name: '',
        account_number: '',
      },
      earnings: [
        { label: 'Basic Salary', amount: 0 },
        { label: 'Housing Allowance', amount: 0 },
        { label: 'Transport Allowance', amount: 0 },
      ],
      deductions: [
        { label: 'PAYE Tax', amount: 0 },
        { label: 'Pension (8%)', amount: 0 },
      ],
      notes: '',
      signatory: { name: '', title: 'Human Resources' },
    };
  }

  return {
    status: 'draft',
    currency: 'NGN',
    issue_date: isoDate(new Date()),
    due_date: addDays(type === 'invoice' ? 14 : 30),
    reference: '',
    client: { name: '', company: '', address: '', email: '', phone: '' },
    items: [{ description: '', quantity: 1, unit_price: 0 }],
    discount: 0,
    tax_rate: 7.5,
    notes:
      type === 'invoice'
        ? 'Thank you for your business.'
        : 'We appreciate the opportunity to quote for this work.',
    terms:
      type === 'invoice'
        ? 'Payment is due by the due date stated above.'
        : 'This quotation is valid until the date stated above. Prices are subject to change thereafter.',
    bank: { bank_name: '', account_name: COMPANY.name, account_number: '' },
    signatory: { name: '', title: '' },
  };
}

const num = (v: unknown) => (Number.isFinite(Number(v)) ? Number(v) : 0);

export function salesTotals(data: SalesDocData) {
  const subtotal = data.items.reduce(
    (sum, i) => sum + num(i.quantity) * num(i.unit_price),
    0
  );
  const discount = Math.min(num(data.discount), subtotal);
  const taxable = subtotal - discount;
  const tax = (taxable * num(data.tax_rate)) / 100;
  return { subtotal, discount, tax, total: taxable + tax };
}

export function payslipTotals(data: PayslipData) {
  const gross = data.earnings.reduce((s, l) => s + num(l.amount), 0);
  const deductions = data.deductions.reduce((s, l) => s + num(l.amount), 0);
  return { gross, deductions, net: gross - deductions };
}

export function documentTotal(type: DocType, data: DocData) {
  return type === 'payslip'
    ? payslipTotals(data as PayslipData).net
    : salesTotals(data as SalesDocData).total;
}

export function documentParty(type: DocType, data: DocData) {
  if (type === 'payslip') return (data as PayslipData).employee?.name || '';
  const c = (data as SalesDocData).client;
  return c?.company || c?.name || '';
}

export function documentDate(type: DocType, data: DocData) {
  return type === 'payslip'
    ? (data as PayslipData).pay_date
    : (data as SalesDocData).issue_date;
}

export function formatMoney(amount: number, currency = 'NGN') {
  const symbol = CURRENCIES.find((c) => c.code === currency)?.symbol ?? '';
  return (
    symbol +
    num(amount).toLocaleString('en-NG', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  );
}

export function formatDate(value: string) {
  if (!value) return '—';
  const d = parseDate(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

const ONES = [
  '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
  'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
  'Seventeen', 'Eighteen', 'Nineteen',
];
const TENS = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
const SCALES = ['', 'Thousand', 'Million', 'Billion', 'Trillion'];

function hundredsToWords(n: number) {
  const parts: string[] = [];
  if (n >= 100) {
    parts.push(`${ONES[Math.floor(n / 100)]} Hundred`);
    n %= 100;
    if (n) parts.push('and');
  }
  if (n >= 20) {
    parts.push(TENS[Math.floor(n / 10)] + (n % 10 ? `-${ONES[n % 10]}` : ''));
  } else if (n > 0) {
    parts.push(ONES[n]!);
  }
  return parts.join(' ');
}

function integerToWords(n: number) {
  if (n === 0) return 'Zero';
  const chunks: string[] = [];
  let scale = 0;
  while (n > 0 && scale < SCALES.length) {
    const chunk = n % 1000;
    if (chunk) {
      chunks.unshift(
        hundredsToWords(chunk) + (SCALES[scale] ? ` ${SCALES[scale]}` : '')
      );
    }
    n = Math.floor(n / 1000);
    scale++;
  }
  return chunks.join(', ');
}

export function amountInWords(amount: number, currency = 'NGN') {
  const cur = CURRENCIES.find((c) => c.code === currency) ?? CURRENCIES[0]!;
  const value = Math.abs(num(amount));
  const major = Math.floor(value);
  const minor = Math.round((value - major) * 100);
  let words = `${integerToWords(major)} ${cur.major}`;
  if (minor) words += `, ${integerToWords(minor)} ${cur.minor}`;
  return `${amount < 0 ? 'Minus ' : ''}${words} Only`;
}
