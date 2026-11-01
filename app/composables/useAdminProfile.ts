export interface AdminProfile {
  id: string;
  email: string;
  full_name: string | null;
  role: 'super_admin' | 'admin';
  created_at: string;
}

// Loads the logged-in user's profile (role) once and shares it app-wide
export function useAdminProfile() {
  const supabase = useSupabaseClient();
  const user = useSupabaseUser();
  const profile = useState<AdminProfile | null>('admin-profile', () => null);
  const loadedFor = useState<string | null>('admin-profile-for', () => null);

  async function load(force = false) {
    const id = user.value?.id;
    if (!id) {
      profile.value = null;
      loadedFor.value = null;
      return null;
    }
    if (!force && loadedFor.value === id) return profile.value;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) console.error(error);
    profile.value = (data as AdminProfile | null) ?? null;
    loadedFor.value = id;
    return profile.value;
  }

  const isSuperAdmin = computed(() => profile.value?.role === 'super_admin');

  return { profile, isSuperAdmin, load };
}
