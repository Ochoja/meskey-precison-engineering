import type { H3Event } from 'h3';
import { serverSupabaseServiceRole, serverSupabaseUser } from '#supabase/server';

// Throws unless the request comes from a logged-in super admin.
// Returns the service-role client and the caller's user id.
export async function requireSuperAdmin(event: H3Event) {
  const user = await serverSupabaseUser(event).catch(() => null);

  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Not logged in' });
  }

  const admin = serverSupabaseServiceRole(event);
  const { data: profile, error } = await admin
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle();

  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message });
  }
  if (profile?.role !== 'super_admin') {
    throw createError({ statusCode: 403, statusMessage: 'Super admin only' });
  }

  return { admin, userId: user.id };
}
