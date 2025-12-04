import { supabase } from '../supabaseClient';
import { TodoModel } from '../model/TodoModel';

export const TodoService = {
    /**
     * Fetches all todos from the remote source.
     */
    getAllTodos: async () => {
        const { data, error } = await supabase
            .from('todos')
            .select('*')
            .order('created_at', { ascending: true });

        if (error) throw error;

        // Map Supabase data to TodoModel
        return data.map(item => {
            const todo = new TodoModel(item.text, item.due_date); // Assuming due_date column or similar
            todo.id = item.id;
            todo.completed = item.completed;
            return todo;
        });
    },

    /**
     * Adds a new todo to the remote source.
     */
    addTodo: async (todo, userId) => {
        const { data, error } = await supabase
            .from('todos')
            .insert([{
                text: todo.text,
                completed: todo.completed,
                due_date: todo.dueDate, // Map model property to DB column
                user_id: userId,
            }])
            .select();

        if (error) throw error;

        const item = data[0];
        const newTodo = new TodoModel(item.text, item.due_date);
        newTodo.id = item.id;
        newTodo.completed = item.completed;
        return newTodo;
    },

    /**
     * Updates a todo in the remote source.
     */
    updateTodo: async (todo) => {
        const { error } = await supabase
            .from('todos')
            .update({
                text: todo.text,
                completed: todo.completed,
                due_date: todo.dueDate
            })
            .eq('id', todo.id);

        if (error) throw error;
    },

    /**
     * Deletes a todo from the remote source.
     */
    deleteTodo: async (id) => {
        const { error } = await supabase
            .from('todos')
            .delete()
            .eq('id', id);

        if (error) throw error;
    }
};
