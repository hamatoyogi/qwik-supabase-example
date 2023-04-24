import { component$, useSignal, useVisibleTask$ } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';
import { supabase } from '~/lib/db';
import { Auth } from '~/components/auth';
import type { User } from '@supabase/supabase-js';

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
    <div class="w-full h-full bg-gray-200">
      {userSignal.value && <div>home</div>}
      {!userSignal.value && (
        <div class="min-w-full min-h-screen flex items-center justify-center">
          <Auth />
        </div>
      )}
    </div>
  );
});

export const head: DocumentHead = {
  title: 'Welcome to Qwik',
  meta: [
    {
      name: 'description',
      content: 'Qwik site description',
    },
  ],
};
