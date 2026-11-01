export default defineEventHandler(async (event) => {
  const { admin } = await requireSuperAdmin(event);

  const { data, error } = await admin
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message });
  }

  return data;
});
