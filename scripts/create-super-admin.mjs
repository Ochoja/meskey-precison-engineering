// Creates (or promotes) the super admin account.
//
// Usage:
//   SUPER_ADMIN_EMAIL=... SUPER_ADMIN_PASSWORD=... npm run create-super-admin
//
// Requires SUPABASE_URL and SUPABASE_SERVICE_KEY (from .env or the shell).
import { createClient } from '@supabase/supabase-js';

const {
  SUPABASE_URL,
  SUPABASE_SERVICE_KEY,
  SUPABASE_SECRET_KEY,
  SUPER_ADMIN_EMAIL,
  SUPER_ADMIN_PASSWORD,
} = process.env;

const serviceKey = SUPABASE_SECRET_KEY || SUPABASE_SERVICE_KEY;

if (!SUPABASE_URL || !serviceKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_KEY.');
  process.exit(1);
}
if (!SUPER_ADMIN_EMAIL || !SUPER_ADMIN_PASSWORD) {
  console.error('Missing SUPER_ADMIN_EMAIL or SUPER_ADMIN_PASSWORD.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function findUserByEmail(email) {
  const target = email.toLowerCase();
  for (let page = 1; ; page++) {
    const { data, error } = await supabase.auth.admin.listUsers({
      page,
      perPage: 200,
    });
    if (error) throw error;
    const match = data.users.find((u) => u.email?.toLowerCase() === target);
    if (match) return match;
    if (data.users.length < 200) return null;
  }
}

let user = await findUserByEmail(SUPER_ADMIN_EMAIL);

if (user) {
  const { error } = await supabase.auth.admin.updateUserById(user.id, {
    password: SUPER_ADMIN_PASSWORD,
    email_confirm: true,
  });
  if (error) throw error;
  console.log(`Existing user found, password updated: ${user.email}`);
} else {
  const { data, error } = await supabase.auth.admin.createUser({
    email: SUPER_ADMIN_EMAIL,
    password: SUPER_ADMIN_PASSWORD,
    email_confirm: true,
    user_metadata: { full_name: 'Super Admin' },
  });
  if (error) throw error;
  user = data.user;
  console.log(`Created user: ${user.email}`);
}

const { error: profileError } = await supabase.from('profiles').upsert({
  id: user.id,
  email: user.email,
  full_name: 'Super Admin',
  role: 'super_admin',
});
if (profileError) throw profileError;

console.log('Super admin is ready.');
