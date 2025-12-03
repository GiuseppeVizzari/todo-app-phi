/**
 * TodoService.js
 *
 * SERVICE / REPOSITORY LAYER
 *
 * In a robust MVVM architecture, specifically when dealing with remote data sources
 * (like Supabase, Firebase, REST APIs), we introduce a "Service" or "Repository" layer.
 *
 * Responsibilities:
 * 1. Handle the actual communication with the backend (API calls).
 * 2. Abstract the data source details from the ViewModel.
 * 3. Handle data transformation if the API format differs from the Model.
 *
 * The ViewModel calls methods on this Service, and the Service returns Promises or Observables.
 */

// Example: import { supabase } from '../supabaseClient';

export const TodoService = {
    /**
     * Fetches all todos from the remote source.
     */
    getAllTodos: async () => {
        // const { data, error } = await supabase.from('todos').select('*');
        // if (error) throw error;
        // return data.map(item => new TodoModel(item.text, item.dueDate));
        return []; // Mock return
    },

    /**
     * Adds a new todo to the remote source.
     */
    addTodo: async (todo) => {
        // const { data, error } = await supabase.from('todos').insert([todo]);
        // return data;
    },

    /**
     * Updates a todo in the remote source.
     */
    updateTodo: async (todo) => {
        // await supabase.from('todos').update(todo).eq('id', todo.id);
    },

    /**
     * Deletes a todo from the remote source.
     */
    deleteTodo: async (id) => {
        // await supabase.from('todos').delete().eq('id', id);
    }
};
