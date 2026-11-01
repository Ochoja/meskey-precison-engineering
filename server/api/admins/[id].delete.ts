export default defineEventHandler(async (event) => {
  const { admin, userId } = await requireSuperAdmin(event);
  const id = getRouterParam(event, 'id')!;

  if (id === userId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'You cannot delete your own account',
    });
  }

  // Profile row is removed by the on-delete cascade
  const { error } = await admin.auth.admin.deleteUser(id);

  if (error) {
    throw createError({ statusCode: 400, statusMessage: error.message });
  }

  return { ok: true };
});
