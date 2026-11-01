// Reset an admin's password and/or change their name or role
export default defineEventHandler(async (event) => {
  const { admin, userId } = await requireSuperAdmin(event);
  const id = getRouterParam(event, 'id')!;
  const body = await readBody<{
    password?: string;
    full_name?: string;
    role?: string;
  }>(event);

  if (body?.password !== undefined) {
    if (body.password.length < 8) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Password must be at least 8 characters',
      });
    }
    const { error } = await admin.auth.admin.updateUserById(id, {
      password: body.password,
    });
    if (error) {
      throw createError({ statusCode: 400, statusMessage: error.message });
    }
  }

  const updates: Record<string, string | null> = {};
  if (body?.full_name !== undefined) updates.full_name = body.full_name.trim() || null;
  if (body?.role !== undefined) {
    if (!['admin', 'super_admin'].includes(body.role)) {
      throw createError({ statusCode: 400, statusMessage: 'Invalid role' });
    }
    if (id === userId && body.role !== 'super_admin') {
      throw createError({
        statusCode: 400,
        statusMessage: 'You cannot remove your own super admin role',
      });
    }
    updates.role = body.role;
  }

  if (Object.keys(updates).length === 0) return { ok: true };

  const { data, error } = await admin
    .from('profiles')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message });
  }

  return data;
});
