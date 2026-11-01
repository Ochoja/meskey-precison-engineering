<script setup lang="ts">
import type { AdminProfile } from '~/composables/useAdminProfile';

definePageMeta({
  layout: 'dashboard',
  middleware: [
    async () => {
      if (import.meta.server) return;
      const { load } = useAdminProfile();
      const profile = await load();
      if (profile?.role !== 'super_admin') return navigateTo('/dashboard');
    },
  ],
});

useHead({ title: 'Admins | Meskey Admin' });

const user = useSupabaseUser();
const admins = ref<AdminProfile[]>([]);
const loading = ref(true);
const errorMsg = ref('');

async function fetchAdmins() {
  loading.value = true;
  errorMsg.value = '';
  try {
    admins.value = await $fetch<AdminProfile[]>('/api/admins');
  } catch (err) {
    errorMsg.value = apiError(err);
  } finally {
    loading.value = false;
  }
}
onMounted(fetchAdmins);

function apiError(err: unknown) {
  const e = err as { data?: { statusMessage?: string; message?: string }; message?: string };
  return e.data?.statusMessage ?? e.data?.message ?? e.message ?? 'Something went wrong';
}

function generatePassword() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789@#$%';
  const bytes = crypto.getRandomValues(new Uint32Array(14));
  return Array.from(bytes, (b) => chars[b % chars.length]).join('');
}

// ---- Create admin ----
const showCreate = ref(false);
const creating = ref(false);
const createError = ref('');
const showPassword = ref(false);
const form = reactive({ full_name: '', email: '', password: '', role: 'admin' });

function openCreate() {
  Object.assign(form, { full_name: '', email: '', password: generatePassword(), role: 'admin' });
  createError.value = '';
  showPassword.value = true;
  showCreate.value = true;
}

async function createAdmin() {
  creating.value = true;
  createError.value = '';
  try {
    const created = await $fetch<AdminProfile>('/api/admins', {
      method: 'POST',
      body: { ...form },
    });
    admins.value.push(created);
    showCreate.value = false;
    notice.value = `Admin ${created.email} created. Share the password with them securely.`;
  } catch (err) {
    createError.value = apiError(err);
  } finally {
    creating.value = false;
  }
}

// ---- Reset password ----
const resetTarget = ref<AdminProfile | null>(null);
const newPassword = ref('');
const resetting = ref(false);
const resetError = ref('');

function openReset(a: AdminProfile) {
  resetTarget.value = a;
  newPassword.value = generatePassword();
  resetError.value = '';
}

async function resetPassword() {
  if (!resetTarget.value) return;
  resetting.value = true;
  resetError.value = '';
  try {
    await $fetch(`/api/admins/${resetTarget.value.id}`, {
      method: 'PATCH',
      body: { password: newPassword.value },
    });
    notice.value = `Password updated for ${resetTarget.value.email}.`;
    resetTarget.value = null;
  } catch (err) {
    resetError.value = apiError(err);
  } finally {
    resetting.value = false;
  }
}

// ---- Role change & delete ----
const busyId = ref<string | null>(null);
const deleteTarget = ref<AdminProfile | null>(null);
const notice = ref('');

async function toggleRole(a: AdminProfile) {
  busyId.value = a.id;
  errorMsg.value = '';
  try {
    const updated = await $fetch<AdminProfile>(`/api/admins/${a.id}`, {
      method: 'PATCH',
      body: { role: a.role === 'super_admin' ? 'admin' : 'super_admin' },
    });
    admins.value = admins.value.map((x) => (x.id === a.id ? updated : x));
  } catch (err) {
    errorMsg.value = apiError(err);
  } finally {
    busyId.value = null;
  }
}

async function deleteAdmin() {
  const target = deleteTarget.value;
  if (!target) return;
  busyId.value = target.id;
  errorMsg.value = '';
  try {
    await $fetch(`/api/admins/${target.id}`, { method: 'DELETE' });
    admins.value = admins.value.filter((x) => x.id !== target.id);
    notice.value = `${target.email} was removed.`;
  } catch (err) {
    errorMsg.value = apiError(err);
  } finally {
    busyId.value = null;
    deleteTarget.value = null;
  }
}

const copied = ref(false);
async function copy(text: string) {
  await navigator.clipboard.writeText(text);
  copied.value = true;
  setTimeout(() => (copied.value = false), 1500);
}
</script>

<template>
  <main>
    <div class="flex flex-wrap justify-between items-end gap-4 mb-6">
      <div>
        <h4 class="text-2xl font-medium">Admins</h4>
        <p class="text-grey-40 text-sm">
          Create and manage who can access the Meskey admin dashboard.
        </p>
      </div>
      <button class="admin-btn bg-primary text-white hover:bg-primary-70" @click="openCreate">
        <Icon name="mdi:account-plus-outline" /> New Admin
      </button>
    </div>

    <p
      v-if="notice"
      class="mb-4 text-sm bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-2 flex justify-between items-center">
      {{ notice }}
      <button aria-label="Dismiss" @click="notice = ''"><Icon name="mdi:close" /></button>
    </p>
    <p v-if="errorMsg" class="text-red-600 text-sm mb-3">{{ errorMsg }}</p>

    <div class="border border-gray-300 rounded-lg overflow-x-auto bg-white">
      <table class="w-full min-w-[680px] text-sm">
        <thead class="bg-gray-200 text-left">
          <tr>
            <th class="p-3 font-semibold">Name</th>
            <th class="p-3 font-semibold">Email</th>
            <th class="p-3 font-semibold">Role</th>
            <th class="p-3 font-semibold">Added</th>
            <th class="p-3 font-semibold text-center w-36">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading">
            <td colspan="5" class="p-8 text-center text-grey-40">
              <Icon name="eos-icons:loading" class="text-2xl" />
            </td>
          </tr>
          <tr v-for="a in admins" v-else :key="a.id" class="border-t border-gray-200">
            <td class="p-3">
              {{ a.full_name || '—' }}
              <span v-if="a.id === user?.id" class="text-xs text-grey-40">(you)</span>
            </td>
            <td class="p-3">{{ a.email }}</td>
            <td class="p-3">
              <span
                :class="[
                  'px-2.5 py-0.5 rounded-full text-xs',
                  a.role === 'super_admin' ? 'bg-primary-10 text-primary-80' : 'bg-grey-10 text-grey',
                ]">
                {{ a.role === 'super_admin' ? 'Super Admin' : 'Admin' }}
              </span>
            </td>
            <td class="p-3">{{ formatDate(a.created_at) }}</td>
            <td class="p-3">
              <div v-if="a.id !== user?.id" class="flex justify-center gap-3 text-lg">
                <Icon v-if="busyId === a.id" name="eos-icons:loading" />
                <template v-else>
                  <button
                    :title="a.role === 'super_admin' ? 'Make regular admin' : 'Make super admin'"
                    class="text-grey-40 hover:text-primary"
                    @click="toggleRole(a)">
                    <Icon
                      :name="a.role === 'super_admin' ? 'mdi:shield-off-outline' : 'mdi:shield-crown-outline'" />
                  </button>
                  <button title="Reset password" class="text-grey-40 hover:text-primary" @click="openReset(a)">
                    <Icon name="mdi:key-variant" />
                  </button>
                  <button title="Remove admin" class="text-red-600" @click="deleteTarget = a">
                    <Icon name="fluent:delete-12-filled" />
                  </button>
                </template>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Create admin -->
    <div v-if="showCreate" class="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4">
      <form
        class="bg-[#fafafa] border border-primary-20 p-6 rounded-2xl w-full max-w-md shadow-lg flex flex-col gap-4"
        @submit.prevent="createAdmin">
        <h4 class="text-xl font-medium text-center">New Admin</h4>
        <div>
          <label class="admin-label">Full Name</label>
          <input v-model="form.full_name" class="admin-input" >
        </div>
        <div>
          <label class="admin-label">Email Address</label>
          <input v-model="form.email" type="email" required class="admin-input" placeholder="example@example.com" >
        </div>
        <div>
          <label class="admin-label">Password</label>
          <div class="flex gap-2">
            <input
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              required
              minlength="8"
              class="admin-input" >
            <button type="button" title="Show/hide" class="px-2 text-grey-40" @click="showPassword = !showPassword">
              <Icon :name="showPassword ? 'mdi:eye-off-outline' : 'mdi:eye-outline'" />
            </button>
            <button type="button" title="Copy" class="px-2 text-grey-40" @click="copy(form.password)">
              <Icon :name="copied ? 'mdi:check' : 'mdi:content-copy'" />
            </button>
            <button type="button" title="Generate" class="px-2 text-grey-40" @click="form.password = generatePassword()">
              <Icon name="mdi:refresh" />
            </button>
          </div>
        </div>
        <div>
          <label class="admin-label">Role</label>
          <select v-model="form.role" class="admin-input">
            <option value="admin">Admin — manage projects &amp; documents</option>
            <option value="super_admin">Super Admin — also manages admins</option>
          </select>
        </div>
        <p v-if="createError" class="text-red-600 text-sm">{{ createError }}</p>
        <div class="flex justify-center gap-4 mt-2">
          <button
            type="button"
            :disabled="creating"
            class="px-6 py-1 border rounded-full bg-white border-grey-30 disabled:opacity-50"
            @click="showCreate = false">
            Cancel
          </button>
          <button
            type="submit"
            :disabled="creating"
            class="px-6 py-1 rounded-full bg-primary text-white flex items-center gap-2 disabled:opacity-50">
            <Icon v-if="creating" name="line-md:loading-twotone-loop" />
            Create
          </button>
        </div>
      </form>
    </div>

    <!-- Reset password -->
    <div v-if="resetTarget" class="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4">
      <form
        class="bg-[#fafafa] border border-primary-20 p-6 rounded-2xl w-full max-w-md shadow-lg flex flex-col gap-4"
        @submit.prevent="resetPassword">
        <h4 class="text-xl font-medium text-center">Reset Password</h4>
        <p class="text-sm text-grey-50 text-center">{{ resetTarget.email }}</p>
        <div class="flex gap-2">
          <input v-model="newPassword" required minlength="8" class="admin-input" >
          <button type="button" title="Copy" class="px-2 text-grey-40" @click="copy(newPassword)">
            <Icon :name="copied ? 'mdi:check' : 'mdi:content-copy'" />
          </button>
          <button type="button" title="Generate" class="px-2 text-grey-40" @click="newPassword = generatePassword()">
            <Icon name="mdi:refresh" />
          </button>
        </div>
        <p v-if="resetError" class="text-red-600 text-sm">{{ resetError }}</p>
        <div class="flex justify-center gap-4">
          <button
            type="button"
            :disabled="resetting"
            class="px-6 py-1 border rounded-full bg-white border-grey-30 disabled:opacity-50"
            @click="resetTarget = null">
            Cancel
          </button>
          <button
            type="submit"
            :disabled="resetting"
            class="px-6 py-1 rounded-full bg-primary text-white flex items-center gap-2 disabled:opacity-50">
            <Icon v-if="resetting" name="line-md:loading-twotone-loop" />
            Update
          </button>
        </div>
      </form>
    </div>

    <!-- Delete confirmation -->
    <div v-if="deleteTarget" class="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4">
      <div class="bg-[#fafafa] p-6 rounded-xl w-full max-w-md shadow-lg text-center">
        <Icon name="fluent:delete-12-filled" class="text-4xl text-red-600 mb-2" />
        <h4 class="text-lg font-medium mb-2">Remove Admin</h4>
        <p class="text-sm text-grey-50">
          <strong>{{ deleteTarget.email }}</strong> will lose access immediately.
        </p>
        <div class="flex justify-center gap-4 mt-6">
          <button class="px-6 py-1 border rounded-full bg-white border-grey-30" @click="deleteTarget = null">
            Cancel
          </button>
          <button class="px-6 py-1 rounded-full bg-red-500 text-white" @click="deleteAdmin">
            Remove
          </button>
        </div>
      </div>
    </div>
  </main>
</template>
