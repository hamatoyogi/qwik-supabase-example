import { component$, $, useSignal, useVisibleTask$ } from '@builder.io/qwik';
import type { User } from '@supabase/supabase-js';
import { Todo } from './todo';
import { supabase } from '~/lib/db';
import type { TodoType } from '~/lib/schema';

export const TodoList = component$((props: { user: User }) => {
  const todosSignal = useSignal<TodoType[]>([]);
  const newTaskTextSignal = useSignal('');
  const errorTextSignal = useSignal('');

  const fetchTodos = $(async () => {
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .order('id', { ascending: true });
    if (error) {
      console.log('error', error);
    } else {
      todosSignal.value = [...data];
    }
  });

  const addTodo = $(async (taskText: string) => {
    const task = taskText.trim();
    if (task.length) {
      const { data: todo, error } = await supabase
        .from('todos')
        .insert({ task, user_id: props.user.id })
        .select()
        .single();

      if (error) {
        errorTextSignal.value = error.message;
      } else {
        todosSignal.value = [...todosSignal.value, todo];
        newTaskTextSignal.value = '';
      }
    }
  });

  const deleteTodo = $(async (id: number) => {
    try {
      await supabase.from('todos').delete().eq('id', id);
      todosSignal.value = todosSignal.value.filter((x) => x.id != id);
    } catch (error) {
      console.log('error', error);
    }
  });

  useVisibleTask$(() => {
    fetchTodos();
  });

  console.log(props.user);
  return (
    <div class="w-full">
      <h1 class="mb-12 text-pink-800">Todo List.</h1>
      <form
        preventdefault:submit
        onSubmit$={() => addTodo(newTaskTextSignal.value)}
        class="flex gap-2 my-2"
      >
        <input
          class="rounded w-full p-2 placeholder:text-white"
          type="text"
          placeholder="make coffee"
          bind:value={newTaskTextSignal}
        />
        <button type="submit" class="btn-black">
          {' '}
          Add{' '}
        </button>
      </form>
      {errorTextSignal.value ? (
        <div class="rounded-md bg-red-100 p-4 my-3">
          <div class="text-sm leading-5 text-red-700">
            {errorTextSignal.value}
          </div>
        </div>
      ) : (
        <div class="bg-white shadow overflow-hidden rounded-md">
          <ul>
            {todosSignal.value.map((todo) => {
              return (
                <Todo
                  key={todo?.id}
                  todo={todo}
                  onDelete$={() => deleteTodo(todo.id)}
                />
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
});
