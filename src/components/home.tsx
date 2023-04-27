import { supabase } from '~/lib/db';
import { TodoList } from '~/components/todo-list';

import { component$ } from '@builder.io/qwik';
import type { User } from '@supabase/supabase-js';

export const Home = component$((props: { user: User }) => {
  return (
    <div
      class="w-full h-full flex flex-col justify-center items-center p-4"
      style="min-width: 250px; max-width: 600px; margin: auto;"
    >
      <TodoList user={props.user} />
      <button
        class="btn-black w-full mt-12"
        onClick$={async () => {
          const { error } = await supabase.auth.signOut();
          if (error) console.log('Error logging out:', error.message);
        }}
      >
        Logout
      </button>
    </div>
  );
});
