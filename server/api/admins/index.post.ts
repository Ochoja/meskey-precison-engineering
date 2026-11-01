export default defineEventHandler(async (event) => {
  const { admin } = await requireSuperAdmin(event);
  const body = await readBody<{
    email?: string;
    password?: string;
    full_name?: string;
    role?: string;
  }>(event);

  const email = body?.email?.trim().toLowerCase();
  const password = body?.password ?? '';
  const fullName = body?.full_name?.trim() || null;
  const role = body?.role === 'super_admin' ? 'super_admin' : 'admin';

  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    throw createError({ statusCode: 400, statusMessage: 'A valid email is required' });
  }
  if (password.length < 8) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Password must be at least 8 characters',
    });
  }

  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName },
  });

  if (error || !data.user) {
    throw createError({
      statusCode: 400,
      statusMessage: error?.message ?? 'Could not create user',
    });
  }

  // The auth trigger creates the profile; upsert keeps this safe either way
  const { data: profile, error: profileError } = await admin
    .from('profiles')
    .upsert({ id: data.user.id, email, full_name: fullName, role })
    .select()
    .single();

  if (profileError) {
    throw createError({ statusCode: 500, statusMessage: profileError.message });
  }

  return profile;
});
