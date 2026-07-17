import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [isPro, setIsPro] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    
    const fetchUserAndProfile = async (currentUser: User | null) => {
      setUser(currentUser);
      if (currentUser) {
        const { data } = await supabase
          .from('profiles')
          .select('is_pro')
          .eq('id', currentUser.id)
          .single();
        setIsPro(!!data?.is_pro);
      } else {
        setIsPro(false);
      }
      setLoading(false);
    };

    // Get initial session
    supabase.auth.getUser().then(({ data: { user } }) => {
      fetchUserAndProfile(user);
    });

    // Listen for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      fetchUserAndProfile(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return { user, isPro, loading };
}
