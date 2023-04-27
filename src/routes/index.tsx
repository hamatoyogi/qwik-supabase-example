import { component$, useSignal, useVisibleTask$ } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';

import { Auth } from '~/components/auth';
import { Home } from '~/components/home';
import type { User } from '@supabase/supabase-js';
import { supabase } from '~/lib/db';

export default component$(() => {
  const userSignal = useSignal<User | null>();
  useVisibleTask$(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      userSignal.value = session?.user ?? null;
    });

    const {
      data: { subscription: authListener },
    } = supabase.auth.onAuthStateChange((_, session) => {
      const currentUser = session?.user;
      userSignal.value = currentUser ?? null;
    });

    return () => {
      authListener?.unsubscribe();
    };
  });
  return (
    <div class="w-full h-full">
      {userSignal.value ? (
        <Home user={userSignal.value} />
      ) : (
        <div class="min-w-full min-h-screen flex items-center justify-center">
          <Auth />
        </div>
      )}
    </div>
  );
});

export const head: DocumentHead = {
  title: 'Qwik Supabase Todo example',
  meta: [
    {
      name: 'description',
      content: 'Qwik Supabase Todo example',
    },
  ],
};
