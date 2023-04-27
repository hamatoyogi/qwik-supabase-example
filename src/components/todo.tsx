import type { PropFunction } from '@builder.io/qwik';
import { component$, $, useSignal, useComputed$ } from '@builder.io/qwik';
import { supabase } from '~/lib/db';
import type { TodoType } from '~/lib/schema';

export const Todo = component$(
  (props: { onDelete$: PropFunction<() => void>; todo: TodoType }) => {
    const isCompleted = useComputed$(() => Boolean(props.todo.is_complete));
    const todoSignal = useSignal(props.todo);
    const toggle = $(async (todo: TodoType) => {
      try {
        const { data, error } = await supabase
          .from('todos')
          .update({ is_complete: !isCompleted.value })
          .eq('id', todo.id)
          .select('is_complete')
          .single();
        if (error) {
          throw error;
        }
        todoSignal.value = {
          ...todoSignal.value,
          is_complete: data.is_complete,
        };
      } catch (error) {
        console.log('error', error);
      }
    });
    return (
      <li class="w-full block cursor-pointer hover:bg-gray-200 focus:outline-none focus:bg-gray-200 transition duration-150 ease-in-out">
        <div class="flex items-center px-4 py-4 sm:px-6">
          <div class="min-w-0 flex-1 flex items-center">
            <div class="text-sm leading-5 font-medium truncate">
              {props.todo.task}
            </div>
          </div>
          <div>
            <input
              class="cursor-pointer"
              type="checkbox"
              onChange$={$(() => {
                toggle(props.todo);
              })}
              checked={isCompleted.value}
            />
          </div>
          <button
            onClick$={props.onDelete$}
            class="ml-2 border-2 hover:border-black rounded"
          >
            <svg
              class="w-4 h-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="gray"
            >
              <path
                fill-rule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
        </div>
      </li>
    );
  }
);
